import { getApp, getApps, initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
const appId = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID;
const config = { apiKey: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY, projectId: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID, appId, messagingSenderId: appId?.split(":")[1] ?? "" };
const vapidKey = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY;
export const pushConfigured = () => Boolean(config.apiKey && config.projectId && appId && config.messagingSenderId && vapidKey);
const messaging = () => getMessaging(getApps().length ? getApp() : initializeApp(config));
function identity() {
  let id = localStorage.getItem("hydrashield_push_id"), secret = localStorage.getItem("hydrashield_push_secret");
  if (!id || !secret) {
    id = crypto.randomUUID(); secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("hydrashield_push_id", id); localStorage.setItem("hydrashield_push_secret", secret);
  }
  return { installationId: id, secret };
}
async function save(body: Record<string, unknown>) {
  const { error } = await supabase.functions.invoke("register-push", { body: { ...identity(), ...body } });
  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) { try { message = (await error.context.json()).error ?? message; } catch { /* retain message */ } }
    throw new Error(message);
  }
}
export async function enablePush(region: string): Promise<"registered" | "not-configured" | "unsupported" | "open-in-new-tab" | "denied"> {
  if (!pushConfigured()) return "not-configured";
  if (!("Notification" in window) || !(await isSupported())) return "unsupported";
  if (window.top !== window.self) return "open-in-new-tab";
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return "denied";
  const worker = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${new URLSearchParams(config).toString()}`);
  // Await activation of this registration, not an unrelated worker.
  if (!worker.active) await new Promise<void>((resolve, reject) => {
    const candidate = worker.installing ?? worker.waiting;
    if (!candidate) { reject(new Error("Push service could not start")); return; }
    candidate.addEventListener("statechange", () => { if (candidate.state === "activated") resolve(); if (candidate.state === "redundant") reject(new Error("Push service failed")); });
  });
  const token = await getToken(messaging(), { vapidKey, serviceWorkerRegistration: worker });
  if (!token) return "denied";
  await save({ action: "register", token, region });
  localStorage.setItem("hydrashield_push_enabled", "true"); localStorage.setItem("hydrashield_region", region);
  window.dispatchEvent(new Event("hydrashield-region-change"));
  return "registered";
}
export async function disablePush() {
  await save({ action: "disable" });
  if (pushConfigured() && await isSupported()) await deleteToken(messaging());
  localStorage.removeItem("hydrashield_push_enabled");
}
export async function receiveForegroundPush(callback: (title: string, body: string) => void) {
  if (!pushConfigured() || !(await isSupported())) return () => {};
  return onMessage(messaging(), payload => callback(payload.notification?.title ?? "HydraShield alert", payload.notification?.body ?? ""));
}
