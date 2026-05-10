import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

export const mockAgents = [
  { id: 'a1', name: 'James Carter', sport: 'Basketball', location: 'Los Angeles, CA', experience: '10 years', bio: 'Specializing in NBA and NIL deals for top college prospects.', photo: 'https://i.pravatar.cc/150?u=a1' },
  { id: 'a2', name: 'Sarah Jenkins', sport: 'Football', location: 'Dallas, TX', experience: '7 years', bio: 'Former athlete turned agent, focusing on long-term branding partnerships.', photo: 'https://i.pravatar.cc/150?u=a2' },
  { id: 'a3', name: 'Michael Chen', sport: 'Baseball', location: 'New York, NY', experience: '12 years', bio: 'Expert in contract negotiation and personal branding for baseball athletes.', photo: 'https://i.pravatar.cc/150?u=a3' },
  { id: 'a4', name: 'Elena Rodriguez', sport: 'Soccer', location: 'Miami, FL', experience: '5 years', bio: 'Connecting rising soccer stars with international and domestic brands.', photo: 'https://i.pravatar.cc/150?u=a4' },
];

// Seeded deals — realistic NIL data matching Figma screenshots
export const mockDeals = [
  {
    id: 'd1', athleteId: 'mock-u1', brand: 'Nike', dealTitle: 'Spring Social Campaign',
    dealType: 'Social Post', compType: 'Cash',
    cashValue: 5000, nonCashValue: 0, nonCashDescription: '', nonCashCategory: '',
    dealValue: 5000, status: 'Active', startDate: '2026-01-15', endDate: '2026-06-30',
    agentName: 'James Carter', agentId: 'a1',
    reportedSource: 'both', disclosureRequired: true, reportedToSchool: true,
    notes: 'Two Instagram posts per month, one TikTok per quarter.',
    deliverableIds: ['del1', 'del2', 'del3'],
  },
  {
    id: 'd2', athleteId: 'mock-u1', brand: 'LocalGym', dealTitle: 'Member Endorsement',
    dealType: 'Appearance', compType: 'Both',
    cashValue: 800, nonCashValue: 400, nonCashDescription: 'Free gym membership + gear', nonCashCategory: 'Gear',
    dealValue: 1200, status: 'Active', startDate: '2026-02-03', endDate: '2026-12-31',
    agentName: '', agentId: '',
    reportedSource: 'athlete', disclosureRequired: true, reportedToSchool: true,
    notes: '',
    deliverableIds: ['del4', 'del5'],
  },
  {
    id: 'd3', athleteId: 'mock-u1', brand: 'Campus Eats', dealTitle: 'Campus Ambassador',
    dealType: 'Affiliate', compType: 'Product',
    cashValue: 0, nonCashValue: 800, nonCashDescription: 'Free meals + catering for team events', nonCashCategory: 'Meals',
    dealValue: 800, status: 'Completed', startDate: '2026-03-12', endDate: '2026-04-30',
    agentName: '', agentId: '',
    reportedSource: 'athlete', disclosureRequired: false, reportedToSchool: false,
    notes: 'Seasonal deal.',
    deliverableIds: ['del6'],
  },
  {
    id: 'd4', athleteId: 'mock-u1', brand: 'Sports Apparel Co', dealTitle: 'Brand Ambassador',
    dealType: 'Social Post', compType: 'Cash',
    cashValue: 3500, nonCashValue: 0, nonCashDescription: '', nonCashCategory: '',
    dealValue: 3500, status: 'Pending', startDate: '2026-04-05', endDate: '2026-10-05',
    agentName: 'Sarah Jenkins', agentId: 'a2',
    reportedSource: 'agent', disclosureRequired: true, reportedToSchool: false,
    notes: 'Pending athlete confirmation.',
    deliverableIds: ['del7'],
  },
];

export const mockDeliverables = [
  { id: 'del1', athleteId: 'mock-u1', dealId: 'd1', brand: 'Nike', type: 'Instagram Post', name: 'Spring Campaign Post', date: 'May 1, 2026', status: 'Completed', notes: '' },
  { id: 'del2', athleteId: 'mock-u1', dealId: 'd1', brand: 'Nike', type: 'Instagram Story', name: 'Product Story Highlight', date: 'May 15, 2026', status: 'In Progress', notes: 'Include promo code' },
  { id: 'del3', athleteId: 'mock-u1', dealId: 'd1', brand: 'Nike', type: 'TikTok', name: 'Unboxing Video', date: 'Jun 1, 2026', status: 'Upcoming', notes: '' },
  { id: 'del4', athleteId: 'mock-u1', dealId: 'd2', brand: 'LocalGym', type: 'Appearance', name: 'Grand Opening Appearance', date: 'May 10, 2026', status: 'Upcoming', notes: '' },
  { id: 'del5', athleteId: 'mock-u1', dealId: 'd2', brand: 'LocalGym', type: 'Instagram Post', name: 'Gym Check-In Post', date: 'Apr 28, 2026', status: 'Overdue', notes: '' },
  { id: 'del6', athleteId: 'mock-u1', dealId: 'd3', brand: 'Campus Eats', type: 'TikTok', name: 'Menu Review Video', date: 'Apr 15, 2026', status: 'Completed', notes: '' },
  { id: 'del7', athleteId: 'mock-u1', dealId: 'd4', brand: 'Sports Apparel Co', type: 'Brand Shoot', name: 'Photoshoot', date: 'Jun 1, 2026', status: 'Upcoming', notes: 'Pending deal confirmation' },
];

export const mockActivityLog = [
  { id: 'act1', eventType: 'deal_reported', relatedDealId: 'd1', userId: 'mock-u1', role: 'athlete', message: 'Deal reported with Nike', timestamp: '2026-01-15T10:00:00Z' },
  { id: 'act2', eventType: 'deal_matched', relatedDealId: 'd1', userId: 'mock-u1', role: 'agent', message: 'Agent report matched — Nike deal confirmed', timestamp: '2026-01-15T14:32:00Z' },
  { id: 'act3', eventType: 'deliverable_done', relatedDealId: 'd1', userId: 'mock-u1', role: 'athlete', message: 'Deliverable completed: Spring Campaign Post', timestamp: '2026-05-01T09:15:00Z' },
  { id: 'act4', eventType: 'deal_reported', relatedDealId: 'd2', userId: 'mock-u1', role: 'athlete', message: 'Deal reported with LocalGym', timestamp: '2026-02-03T11:00:00Z' },
  { id: 'act5', eventType: 'payment_received', relatedDealId: 'd2', userId: 'mock-u1', role: 'athlete', message: 'Payment received: $800 from LocalGym', timestamp: '2026-03-01T08:00:00Z' },
  { id: 'act6', eventType: 'deal_completed', relatedDealId: 'd3', userId: 'mock-u1', role: 'athlete', message: 'Deal completed with Campus Eats', timestamp: '2026-04-30T17:00:00Z' },
  { id: 'act7', eventType: 'deal_reported', relatedDealId: 'd4', userId: 'mock-u1', role: 'agent', message: 'Agent submitted deal report: Sports Apparel Co', timestamp: '2026-04-05T12:00:00Z' },
];

// Raw DealReport submissions (before reconciliation)
export const mockDealReports = [
  { id: 'rpt1', dealId: 'd1', submittedByRole: 'athlete', athleteId: 'mock-u1', agentId: 'a1', brandName: 'Nike', dealTitle: 'Spring Social Campaign', submittedCashValue: 5000, submittedNonCashValue: 0, reportStatus: 'matched', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'rpt2', dealId: 'd1', submittedByRole: 'agent', athleteId: 'mock-u1', agentId: 'a1', brandName: 'Nike', dealTitle: 'Spring Social Campaign', submittedCashValue: 5000, submittedNonCashValue: 0, reportStatus: 'matched', createdAt: '2026-01-15T14:00:00Z' },
  { id: 'rpt3', dealId: 'd2', submittedByRole: 'athlete', athleteId: 'mock-u1', agentId: '', brandName: 'LocalGym', dealTitle: 'Member Endorsement', submittedCashValue: 800, submittedNonCashValue: 400, reportStatus: 'standalone', createdAt: '2026-02-03T11:00:00Z' },
  { id: 'rpt4', dealId: 'd3', submittedByRole: 'athlete', athleteId: 'mock-u1', agentId: '', brandName: 'Campus Eats', dealTitle: 'Campus Ambassador', submittedCashValue: 0, submittedNonCashValue: 800, reportStatus: 'standalone', createdAt: '2026-03-12T09:00:00Z' },
  { id: 'rpt5', dealId: 'd4', submittedByRole: 'agent', athleteId: 'mock-u1', agentId: 'a2', brandName: 'Sports Apparel Co', dealTitle: 'Brand Ambassador', submittedCashValue: 3500, submittedNonCashValue: 0, reportStatus: 'standalone', createdAt: '2026-04-05T12:00:00Z' },
];

// ─── LOCAL STORE (Supabase-ready persistence layer) ─────────────────────────
// Table structure mirrors Supabase schema for zero-friction migration:
//   profiles | user_settings | deals | deliverables | deal_documents | activity_log
//
// Migration path: replace localStorage.getItem/setItem calls below with
// supabase.from('table').select/insert/update, adding userId filters.

const LS = {
  // Load user-scoped data.
  load: (uid, table, fallback = []) => {
    try {
      const raw = localStorage.getItem(`fd_${table}_${uid}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  save: (uid, table, data) => {
    try { localStorage.setItem(`fd_${table}_${uid}`, JSON.stringify(data)); } catch {}
  },
  // Clear all user-scoped tables on logout / account delete
  clear: (uid) => {
    ['deals', 'deliverables', 'deal_reports', 'activity_log'].forEach(t =>
      localStorage.removeItem(`fd_${t}_${uid}`)  // fixed: was `table` instead of `t`
    );
  },
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [agents, setAgents] = useState(mockAgents);
  const [deals, setDeals] = useState(mockDeals);
  const [deliverables, setDeliverables] = useState(mockDeliverables);
  const [dealReports, setDealReports] = useState(mockDealReports);
  const [activityLog, setActivityLog] = useState(mockActivityLog);
  const [conversations, setConversations] = useState([]);

  // ─── PERSIST to localStorage whenever state changes (per logged-in user) ───
  useEffect(() => {
    if (!currentUser?.id || currentUser.id === 'mock-u1') return;
    LS.save(currentUser.id, 'deals', deals.filter(d => d.athleteId === currentUser.id));
  }, [deals, currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || currentUser.id === 'mock-u1') return;
    LS.save(currentUser.id, 'deliverables', deliverables.filter(d => d.athleteId === currentUser.id));
  }, [deliverables, currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || currentUser.id === 'mock-u1') return;
    LS.save(currentUser.id, 'activity_log', activityLog.filter(a => a.userId === currentUser.id));
  }, [activityLog, currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || currentUser.id === 'mock-u1') return;
    LS.save(currentUser.id, 'deal_reports', dealReports.filter(r => r.athleteId === currentUser.id));
  }, [dealReports, currentUser?.id]);

  // ─── AUTH ──────────────────────────────────────────────────────────────────

  const fetchProfile = async (userId) => {
    if (!isSupabaseEnabled) return null;
    const { data } = await supabase.from('profiles').select('name, role').eq('id', userId).single();
    return data;
  };

  useEffect(() => {
    if (!isSupabaseEnabled) { setAuthLoading(false); return; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser({ id: session.user.id, email: session.user.email, name: profile?.name || session.user.email, role: profile?.role || 'athlete' });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (!isSupabaseEnabled) {
      // DEMO account — always maps to mock-u1 to show seeded showcase data
      if (email === 'demo@frontdoor.app') {
        setCurrentUser({ id: 'mock-u1', email, name: 'Demo Athlete', role: 'athlete' });
        return 'athlete';
      }
      // Real offline users — look up stored profile by email
      const stored = JSON.parse(localStorage.getItem('fd_offline_users') || '{}');
      const profile = stored[email];
      if (!profile) throw new Error('No account found for this email. Please sign up first.');
      // Real offline users — load ONLY their own data (no mock data leakage)
      const uid = profile.id;
      const savedDeals = LS.load(uid, 'deals');
      const savedDeliverables = LS.load(uid, 'deliverables');
      const savedActivity = LS.load(uid, 'activity_log', []);
      const savedReports = LS.load(uid, 'deal_reports');
      // Only inject mock data for demo account — real users get a clean slate
      setDeals([...mockDeals, ...savedDeals]);
      setDeliverables([...mockDeliverables, ...savedDeliverables]);
      setActivityLog(savedActivity);
      setDealReports([...mockDealReports, ...savedReports]);
      setCurrentUser({ id: uid, email, name: profile.name, role: profile.role });
      return profile.role;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await fetchProfile(data.user.id);
    setCurrentUser({ id: data.user.id, email: data.user.email, name: profile?.name || data.user.email, role: profile?.role || 'athlete' });
    return profile?.role || 'athlete';
  }, []);

  const signup = useCallback(async ({ name, email, password, role }) => {
    if (!isSupabaseEnabled) {
      // Generate a stable unique ID per email so new users always start empty
      const stored = JSON.parse(localStorage.getItem('fd_offline_users') || '{}');
      if (stored[email]) throw new Error('An account with this email already exists. Please log in.');
      const newId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      stored[email] = { id: newId, name, role };
      localStorage.setItem('fd_offline_users', JSON.stringify(stored));
      // Fresh state — new user starts with empty account
      setDeals(mockDeals); // keep demo deals in memory but filtered out by athleteId
      setDeliverables(mockDeliverables);
      setActivityLog([]);
      setDealReports(mockDealReports);
      setCurrentUser({ id: newId, email, name, role });
      return role;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    await supabase.from('profiles').insert({ id: data.user.id, name, role });
    setCurrentUser({ id: data.user.id, email, name, role });
    return role;
  }, []);


  const logout = useCallback(async () => {
    if (isSupabaseEnabled) await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  // ─── RECONCILIATION ENGINE ─────────────────────────────────────────────────

  /**
   * Checks whether two deal reports are likely describing the same deal.
   * Matching criteria:
   *  1. Same brand name (case-insensitive)
   *  2. Cash values within 20% of each other (or both zero)
   *  3. Start dates within 30 days of each other (if provided)
   */
  const isSameDeal = (existingReport, newReport) => {
    const sameAthleteId = existingReport.athleteId === newReport.athleteId;
    const sameBrand = existingReport.brandName.trim().toLowerCase() === newReport.brandName.trim().toLowerCase();

    const valA = Number(existingReport.submittedCashValue || 0);
    const valB = Number(newReport.submittedCashValue || 0);
    const valuesClose = valA === 0 && valB === 0 ? true
      : Math.abs(valA - valB) / Math.max(valA, valB, 1) < 0.2;

    return sameAthleteId && sameBrand && valuesClose;
  };

  /**
   * submitDealReport — the core intake function.
   * Called when an athlete or agent submits a new deal.
   *
   * Flow:
   *  1. Create a raw DealReport record
   *  2. Search existing reports from the other role that match this deal
   *  3a. If match found → update the existing deal to reportedSource: 'both'
   *  3b. If no match → create a brand new deal and log it
   *  4. Append to activityLog
   */
  const submitDealReport = useCallback((reportData) => {
    const {
      brand, dealTitle, dealType, compType,
      cashValue, nonCashValue, nonCashDescription, nonCashCategory,
      startDate, endDate, deliverables: newDeliverables = [],
      agentName, agentId,
      disclosureRequired, reportedToSchool, notes,
      submittedByRole = 'athlete',
    } = reportData;

    const athleteId = currentUser?.id || 'mock-u1';
    const reportId = `rpt-${Date.now()}`;
    const now = new Date().toISOString();

    // 1. Create the raw report
    const rawReport = {
      id: reportId,
      dealId: null, // will be set below
      submittedByRole,
      athleteId,
      agentId: agentId || '',
      brandName: brand,
      dealTitle,
      submittedCashValue: Number(cashValue || 0),
      submittedNonCashValue: Number(nonCashValue || 0),
      reportStatus: 'standalone',
      createdAt: now,
    };

    // 2. Check for a matching report from the opposite role
    const oppositeRole = submittedByRole === 'athlete' ? 'agent' : 'athlete';
    let matchedReport = null;

    setDealReports(prev => {
      matchedReport = prev.find(r =>
        r.submittedByRole === oppositeRole &&
        r.reportStatus === 'standalone' &&
        isSameDeal(r, rawReport)
      ) || null;
      return [...prev, rawReport];
    });

    // Small timeout to let state settle, then process
    setTimeout(() => {
      setDealReports(prevReports => {
        // Re-find match after state update
        const match = prevReports.find(r =>
          r.id !== reportId &&
          r.submittedByRole === oppositeRole &&
          r.reportStatus === 'standalone' &&
          isSameDeal(r, rawReport)
        );

        if (match) {
          // 3a. MERGE PATH — update both reports + existing deal
          const dealId = match.dealId;
          setDeals(prev => prev.map(d =>
            d.id === dealId
              ? { ...d, reportedSource: 'both', agentName: agentName || d.agentName, agentId: agentId || d.agentId }
              : d
          ));
          setActivityLog(prev => [
            { id: `act-${Date.now()}`, eventType: 'deal_matched', relatedDealId: dealId, userId: athleteId, role: submittedByRole, message: `Deal matched & confirmed — ${brand} (${submittedByRole} + ${oppositeRole})`, timestamp: now },
            ...prev,
          ]);
          return prevReports.map(r =>
            r.id === match.id || r.id === reportId
              ? { ...r, dealId, reportStatus: 'matched' }
              : r
          );
        } else {
          // 3b. STANDALONE PATH — create a brand new deal
          const totalValue = Number(cashValue || 0) + Number(nonCashValue || 0);
          const dealId = `d-${Date.now()}`;

          const newDeal = {
            id: dealId, athleteId, brand, dealTitle, dealType, compType,
            cashValue: Number(cashValue || 0),
            nonCashValue: Number(nonCashValue || 0),
            nonCashDescription, nonCashCategory,
            dealValue: totalValue,
            status: 'Pending',
            startDate, endDate,
            agentName: agentName || '',
            agentId: agentId || '',
            reportedSource: submittedByRole === 'athlete' ? 'athlete' : 'agent',
            disclosureRequired, reportedToSchool, notes,
            deliverableIds: [],
          };

          // Create deliverable records
          const newDelivs = newDeliverables.map((del, i) => ({
            id: `del-${Date.now()}-${i}`,
            athleteId,
            dealId,
            brand,
            type: del.type,
            name: del.description || `${del.type} Activity`,
            date: del.date || 'TBD',
            status: 'Upcoming',
            notes: del.description || '',
          }));

          setDeals(prev => [...prev, { ...newDeal, deliverableIds: newDelivs.map(d => d.id) }]);
          setDeliverables(prev => [...prev, ...newDelivs]);
          setActivityLog(prev => [
            { id: `act-${Date.now()}`, eventType: 'deal_reported', relatedDealId: dealId, userId: athleteId, role: submittedByRole, message: `Deal reported with ${brand} (${submittedByRole} only)`, timestamp: now },
            ...prev,
          ]);

          return prevReports.map(r =>
            r.id === reportId ? { ...r, dealId, reportStatus: 'standalone' } : r
          );
        }
      });
    }, 50);
  }, [currentUser]);

  // ─── DELIVERABLES ──────────────────────────────────────────────────────────

  const markDeliverableComplete = useCallback((deliverableId) => {
    setDeliverables(prev =>
      prev.map(d => d.id === deliverableId ? { ...d, status: 'Completed', completionDate: new Date().toISOString() } : d)
    );
    setActivityLog(prev => [
      { id: `act-${Date.now()}`, eventType: 'deliverable_done', relatedDealId: '', userId: currentUser?.id || '', role: 'athlete', message: `Deliverable marked complete`, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, [currentUser]);

  const updateDeliverable = useCallback((deliverableId, updates) => {
    setDeliverables(prev => prev.map(d => d.id === deliverableId ? { ...d, ...updates } : d));
  }, []);

  const addDeliverable = useCallback((dealId, deliverableData) => {
    const deal = deals.find(d => d.id === dealId);
    const newDel = {
      id: `del-${Date.now()}`,
      athleteId: currentUser?.id || '',
      dealId,
      brand: deal?.brand || '',
      type: deliverableData.type || 'Social Post',
      name: deliverableData.name || 'New Deliverable',
      date: deliverableData.date || 'TBD',
      status: 'Upcoming',
      notes: deliverableData.notes || '',
    };
    setDeliverables(prev => [...prev, newDel]);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, deliverableIds: [...(d.deliverableIds || []), newDel.id] } : d));
    return newDel;
  }, [currentUser, deals]);

  const deleteDeliverable = useCallback((deliverableId) => {
    setDeliverables(prev => prev.filter(d => d.id !== deliverableId));
    setDeals(prev => prev.map(d => ({ ...d, deliverableIds: (d.deliverableIds || []).filter(id => id !== deliverableId) })));
  }, []);

  // ─── DEAL ACTIONS ───────────────────────────────────────────────────────────

  const updateDealStatus = useCallback((dealId, status) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status } : d));
    setActivityLog(prev => [
      { id: `act-${Date.now()}`, eventType: 'status_updated', relatedDealId: dealId, userId: currentUser?.id || '', role: 'athlete', message: `Deal status updated to ${status}`, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, [currentUser]);

  const archiveDeal = useCallback((dealId) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: 'Archived' } : d));
    setActivityLog(prev => [
      { id: `act-${Date.now()}`, eventType: 'deal_archived', relatedDealId: dealId, userId: currentUser?.id || '', role: 'athlete', message: `Deal archived`, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, [currentUser]);

  // ─── DOCUMENTS (localStorage, base64) ──────────────────────────────────────

  const attachDocument = useCallback((dealId, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const doc = {
          id: `doc-${Date.now()}`,
          dealId,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
          uploadedAt: new Date().toISOString(),
        };
        setDeals(prev => prev.map(d => d.id === dealId
          ? { ...d, documents: [...(d.documents || []), doc] }
          : d
        ));
        setActivityLog(prev => [
          { id: `act-${Date.now()}`, eventType: 'document_uploaded', relatedDealId: dealId, userId: currentUser?.id || '', role: 'athlete', message: `Document uploaded: ${file.name}`, timestamp: new Date().toISOString() },
          ...prev,
        ]);
        resolve(doc);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, [currentUser]);

  const deleteDocument = useCallback((dealId, docId) => {
    setDeals(prev => prev.map(d => d.id === dealId
      ? { ...d, documents: (d.documents || []).filter(doc => doc.id !== docId) }
      : d
    ));
  }, []);

  // Legacy addDeal — kept for backwards compatibility
  const addDeal = useCallback((dealData) => {
    submitDealReport({ ...dealData, submittedByRole: 'athlete' });
  }, [submitDealReport]);

  // ─── ACTIVITY LOG ───────────────────────────────────────────────────────────
  // Centralized activity logger — call from any page action.
  // Mirrors the activity_log Supabase table: eventType, message, relatedDealId, userId, role, timestamp.
  const logActivity = useCallback((eventType, message, relatedDealId = '') => {
    setActivityLog(prev => [
      {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        eventType,
        relatedDealId,
        userId: currentUser?.id || '',
        role: currentUser?.role || 'athlete',
        message,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [currentUser]);

  // ─── MESSAGING ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback((agentId, text) => {
    if (currentUser?.role !== 'athlete') return;
    setConversations(prev => {
      const existing = prev.find(c => c.athleteId === currentUser.id && c.agentId === agentId);
      if (existing) return prev.map(c => c.id === existing.id ? { ...c, messages: [...c.messages, { senderId: currentUser.id, text, timestamp: Date.now() }] } : c);
      return [...prev, { id: `c${Date.now()}`, athleteId: currentUser.id, agentId, messages: [{ senderId: currentUser.id, text, timestamp: Date.now() }] }];
    });
  }, [currentUser]);

  const replyMessage = useCallback((conversationId, text) => {
    if (currentUser?.role !== 'agent') return;
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, { senderId: currentUser.id, text, timestamp: Date.now() }] } : c));
  }, [currentUser]);

  // ─── PER-USER FILTERED DATA ───────────────────────────────────────────────
  // Each athlete only sees records tagged with their own id.
  // The seeded mock data is ONLY shown to the demo account (mock-u1).
  // Real authenticated users start with an empty account.
  const uid = currentUser?.id || null;
  const isMockUser = !uid || uid === 'mock-u1';
  const myDeals = isMockUser
    ? deals.filter(d => d.athleteId === 'mock-u1')
    : deals.filter(d => d.athleteId === uid);
  const myDeliverables = isMockUser
    ? deliverables.filter(d => d.athleteId === 'mock-u1')
    : deliverables.filter(d => d.athleteId === uid);
  const myActivity = isMockUser
    ? activityLog.filter(a => a.userId === 'mock-u1')
    : activityLog.filter(a => a.userId === uid);

  return (
    <AppContext.Provider value={{
      currentUser, authLoading,
      login, signup, logout,
      agents, setAgents,
      // raw arrays (for admin/agent use)
      deals, deliverables, dealReports, activityLog,
      // per-user filtered arrays (use these in athlete pages)
      myDeals, myDeliverables, myActivity,
      submitDealReport, addDeal,
      markDeliverableComplete, updateDeliverable, addDeliverable, deleteDeliverable,
      updateDealStatus, archiveDeal,
      attachDocument, deleteDocument,
      logActivity,
      conversations, sendMessage, replyMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
