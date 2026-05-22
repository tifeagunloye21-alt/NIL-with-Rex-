/**
 * FrontDoor AI Assistant — Secure Backend Server (OpenAI)
 * Runs on port 3001. Vite proxies /api/* here.
 * The OPENAI_API_KEY is read from .env and NEVER sent to the browser.
 */

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allow any localhost port (covers 5173–5179+ during dev)
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json({ limit: '50kb' }));

const PORT = process.env.API_PORT || 3001;

// ── Validate key ──────────────────────────────────────────────────────────────
const PLACEHOLDER_KEYS = ['your_openai_api_key_here', '', 'sk-proj-REPLACE_ME'];
const apiKey = process.env.OPENAI_API_KEY || '';
const isKeyConfigured = Boolean(apiKey && !PLACEHOLDER_KEYS.includes(apiKey.trim()) && apiKey.startsWith('sk-'));

const openai = isKeyConfigured ? new OpenAI({ apiKey }) : null;

// ── FrontDoor system prompt ───────────────────────────────────────────────────
function buildSystemPrompt(userContext) {
    const {
        userName, userRole,
        totalNIL, activeDeals, pendingDeliverables, overdueDels,
        deals, deliverables,
    } = userContext || {};

    const dealSummary = (deals || []).slice(0, 10).map(d =>
        `- ${d.brand} "${d.dealTitle}" | $${d.dealValue || 0} | Status: ${d.status} | Type: ${d.dealType}`
    ).join('\n');

    const delSummary = (deliverables || []).slice(0, 15).map(d =>
        `- "${d.name}" (${d.brand}) | Type: ${d.type} | Due: ${d.date} | Status: ${d.status}`
    ).join('\n');

    return `You are Doorway, the AI assistant for FrontDoor — a vertical SaaS platform that helps student-athletes and agents organize NIL deals, deliverables, finances, education, and compliance.

CURRENT USER:
- Name: ${userName || 'Athlete'}
- Role: ${userRole || 'athlete'}
- Total NIL Value: $${totalNIL || 0}
- Active Deals: ${activeDeals || 0}
- Pending Deliverables: ${pendingDeliverables || 0}
- Overdue Deliverables: ${overdueDels || 0}

USER'S DEALS:
${dealSummary || 'No deals yet.'}

USER'S DELIVERABLES:
${delSummary || 'No deliverables yet.'}

YOUR ROLE & CAPABILITIES:
You help users navigate FrontDoor, understand their account data, find features, and take simple actions. You are an organizational assistant, NOT an advisor.

You CAN:
1. Help users navigate FrontDoor pages (Where do I report a deal? → /report-deal)
2. Summarize their deal and deliverable status from the data above
3. Surface reminders about overdue or upcoming items
4. Guide users step-by-step through reporting a deal
5. Explain what their data means descriptively (you have X active deals)
6. Help with compliance organization (remind about missing docs — no legal judgments)
7. Direct users to resources and education modules
8. Tell users how to perform actions in the app (step-by-step navigation)
9. Let users search their own data ("show my Nike deal" → summarize from the data above)
10. Help new users onboard and understand FrontDoor

STRICT GUARDRAILS — you must NEVER:
- Give NIL strategy advice or recommend whether to accept a deal
- Recommend specific agents or negotiate terms
- Provide legal, tax, financial, or compliance legal advice
- Make compliance judgments (only help organize)
- Replace agents or educational content

When asked for restricted advice, respond:
"I can help you organize and track this inside FrontDoor, but I can't provide legal, tax, financial, or NIL strategy advice. Please consult your agent, school compliance office, or a qualified professional."

NAVIGATION GUIDE (when users ask where things are):
- Report a deal → /report-deal (athlete) or /agent/report-deal (agent)
- View deals → Dashboard → Deals tab
- Deliverables → /deliverables or Dashboard → Deliverables tab
- Financial Tracker → /tracker
- Education Hub → /education
- Compliance → /compliance
- Profile & Settings → /profile
- Tax Center → /tax-center
- Upload documents → Deal Detail page → Documents section

TONE: Professional, concise, helpful. Use short paragraphs. Feel like a smart assistant, not a chatbot.`;
}

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, userContext } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array required' });
        }

        // Key not configured — return a friendly in-chat message
        if (!isKeyConfigured) {
            console.warn('[Doorway] OPENAI_API_KEY is missing or still a placeholder.');
            return res.json({
                content: "⚠️ Doorway needs your OpenAI API key to respond.\n\nOpen the .env file and set:\nOPENAI_API_KEY=sk-proj-...\n\nGet your key at platform.openai.com/api-keys, then restart with: npm run server:ai",
                action: null,
            });
        }

        const systemPrompt = buildSystemPrompt(userContext);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 1024,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ],
        });

        const rawContent = response.choices[0]?.message?.content || '';

        // Extract optional action tag
        const actionMatch = rawContent.match(/<action>([\s\S]*?)<\/action>/);
        let action = null;
        let content = rawContent.replace(/<action>[\s\S]*?<\/action>/g, '').trim();
        if (actionMatch) {
            try { action = JSON.parse(actionMatch[1]); } catch {}
        }

        res.json({ content, action });

    } catch (err) {
        console.error('[Doorway API error]', {
            status: err.status,
            message: err.message,
            code: err.code,
        });

        let userMessage = 'Doorway hit an unexpected error. Please try again.';
        if (err.status === 401) {
            userMessage = '⚠️ Invalid API key. Check OPENAI_API_KEY in .env and restart the server.';
        } else if (err.status === 429) {
            userMessage = '⚠️ Rate limit reached — please wait a moment and try again.';
        } else if (err.status === 503 || err.status === 529) {
            userMessage = '⚠️ OpenAI is temporarily overloaded. Please try again in a few seconds.';
        }

        res.status(200).json({ content: userMessage, action: null });
    }
});

app.get('/api/health', (_, res) => res.json({
    status: 'ok',
    assistant: 'Doorway',
    model: 'gpt-4o-mini',
    keyConfigured: isKeyConfigured,
}));

app.listen(PORT, () => {
    console.log(`\n✅ FrontDoor AI backend running on http://localhost:${PORT}`);
    if (!isKeyConfigured) {
        console.warn('⚠️  OPENAI_API_KEY is missing or still a placeholder.');
        console.warn('   → Open .env and set: OPENAI_API_KEY=sk-proj-...');
        console.warn('   → Get your key at: https://platform.openai.com/api-keys\n');
    } else {
        console.log('🤖 OpenAI key configured — Doorway is ready (gpt-4o-mini)\n');
    }
});
