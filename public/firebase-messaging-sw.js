self.addEventListener('notificationclick', event => {
  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => new URL(client.url).origin === self.location.origin);
    if (existing) { await existing.navigate('/alerts'); return existing.focus(); }
    return clients.openWindow('/alerts');
  })());
});
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
firebase.initializeApp(Object.fromEntries(new URL(self.location).searchParams));
firebase.messaging();
