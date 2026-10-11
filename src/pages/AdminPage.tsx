import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Shield, LogOut, Loader2, Send, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

type Subscriber = { id: string; name: string; email: string | null; phone_number: string | null; region: string; created_at: string };

function LoginScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else toast.success("Account created. Check your email to confirm, then sign in.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen glass-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm p-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-6 font-heading text-xl font-bold">
          <Shield className="h-6 w-6" /> HydraShield Admin
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 text-xs text-primary-foreground/70 hover:underline w-full">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [chInApp, setChInApp] = useState(true);
  const [chEmail, setChEmail] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ inAppSent: boolean; email: { success: number; failed: number; total: number; note?: string } | null } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setPage(0); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("alert_subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (debounced) {
        const s = debounced.replace(/[%,()]/g, "");
        q = q.or(`name.ilike.%${s}%,email.ilike.%${s}%,region.ilike.%${s}%`);
      }
      const { data, count: c, error } = await q.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (error) toast.error(error.message);
      setRows((data as Subscriber[]) ?? []);
      setCount(c ?? 0);
      setLoading(false);
    })();
  }, [page, debounced]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  async function send() {
    setConfirmOpen(false);
    setSending(true);
    setResult(null);
    const { data, error } = await supabase.functions.invoke("send-broadcast", { body: { title, message, inApp: chInApp, email: chEmail } });
    setSending(false);
    if (error) {
      let msg = error.message;
      if (error instanceof FunctionsHttpError) {
        try { msg = (await error.context.json()).error ?? msg; } catch { /* ignore */ }
      }
      toast.error(typeof msg === "string" ? msg : "Broadcast failed");
      return;
    }
    setResult(data);
    if (data.inAppSent) toast.success("In-app notification sent");
    if (data.email?.note) toast.warning(data.email.note);
    setTitle("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold"><Shield className="h-6 w-6" /> HydraShield Admin</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-primary-foreground/70">{user.email}</span>
            <Button size="sm" variant="ghost" className="hover:bg-primary-foreground/10" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Subscribers ({count})</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name, email or region..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Region</TableHead><TableHead>Joined</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No subscribers found</TableCell></TableRow>
                  ) : rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.email ?? r.phone_number ?? "—"}</TableCell>
                      <TableCell>{r.region}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-muted-foreground">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-danger" /> Broadcast Alert</CardTitle>
            <CardDescription>Notify all {count} subscribers and app users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title, e.g. Flood Warning: Guwahati" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
              rows={6}
              maxLength={1600}
              placeholder="e.g. Heavy rainfall expected in Guwahati in next 24 hrs. Move to higher ground. Helpline 1070."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="text-xs text-muted-foreground text-right">{message.length}/1600</div>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2"><Checkbox checked={chInApp} onCheckedChange={(v) => setChInApp(!!v)} /> In-app</label>
              <label className="flex items-center gap-2"><Checkbox checked={chEmail} onCheckedChange={(v) => setChEmail(!!v)} /> Email</label>
            </div>
            <Button className="w-full bg-danger text-danger-foreground hover:bg-danger/90" disabled={!title.trim() || !message.trim() || (!chInApp && !chEmail) || sending} onClick={() => setConfirmOpen(true)}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send to All
            </Button>
            {result && (
              <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                {result.inAppSent && <div>In-app: <strong className="text-success">sent</strong></div>}
                {result.email && (result.email.note
                  ? <div className="text-muted-foreground">Email: {result.email.note}</div>
                  : <div>Email sent: <strong className="text-success">{result.email.success}</strong> · Failed: <strong className="text-danger">{result.email.failed}</strong></div>)}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this alert to everyone?</AlertDialogTitle>
            <AlertDialogDescription>This will notify all subscribers and app users. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={send}>Send now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(null); return; }
    setTimeout(async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
    }, 0);
  }, [user]);

  const content = useMemo(() => {
    if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (!user) return <LoginScreen />;
    if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (!isAdmin) return (
      <div className="min-h-screen glass-bg flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-sm text-center text-primary-foreground">
          <Shield className="h-10 w-10 mx-auto mb-3 text-danger" />
          <h1 className="font-heading text-xl font-bold mb-2">Access denied</h1>
          <p className="text-sm text-primary-foreground/70 mb-4">Your account ({user.email}) doesn't have admin access.</p>
          <Button variant="outline" className="bg-transparent" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    );
    return <Dashboard user={user} />;
  }, [ready, user, isAdmin]);

  return content;
}
