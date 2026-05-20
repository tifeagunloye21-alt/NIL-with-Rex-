/**
 * useProStatus — reads PRO subscription status from localStorage.
 * Migration path: replace localStorage.getItem with supabase.from('subscriptions').select(...)
 *
 * The demo account (mock-u1) is always PRO for showcase purposes.
 */
export function useProStatus(uid) {
  if (!uid) return { isPro: false, plan: null, since: null };
  // Demo account is always PRO
  if (uid === 'mock-u1') return { isPro: true, plan: 'annual', since: '2026-01-01' };
  try {
    const raw = localStorage.getItem(`fd_pro_${uid}`);
    if (!raw) return { isPro: false, plan: null, since: null };
    const data = JSON.parse(raw);
    return { isPro: Boolean(data?.isPro), plan: data?.plan || null, since: data?.since || null };
  } catch {
    return { isPro: false, plan: null, since: null };
  }
}

export function activateProDemo(uid) {
  if (!uid) return;
  localStorage.setItem(`fd_pro_${uid}`, JSON.stringify({
    isPro: true, plan: 'demo', since: new Date().toISOString().split('T')[0],
  }));
}
