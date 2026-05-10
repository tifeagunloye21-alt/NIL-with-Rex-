/**
 * FrontDoor AI Assistant — Secure Backend Server
 * Runs on port 3001. Vite proxies /api/* here.
 * The ANTHROPIC_API_KEY is read from .env and NEVER sent to the browser.
 *
 * Supabase migration note: swap the in-memory context building here with
 * supabase.from('deals').select(...).eq('athleteId', userId) etc.
 */

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'] }));
app.use(express.json({ limit: '50kb' }));

const PORT = process.env.API_PORT || 3001;

// ── Anthropic client ──────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

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
- Speculate beyond the user's actual data

When asked for restricted advice, respond:
"I can help you organize and track this inside FrontDoor, but I can't provide legal, tax, financial, or NIL strategy advice. Please consult your agent, school compliance office, or a qualified professional."

NAVIGATION GUIDE (when users ask where things are):
- Report a deal → /report-deal
- View deals → Dashboard → Deals tab
- Deliverables → /deliverables or Dashboard → Deliverables tab
- Financial Tracker → /tracker
- Education Hub → /education
- Compliance → /compliance
- Profile & Settings → /profile
- Upload documents → Deal Detail page → Documents section
- Deal details → Click "View Details" on any deal in the Deals tab

ACTIONS YOU CAN GUIDE (tell user to do these, or return action JSON):
- mark_deliverable_complete: {action: "mark_complete", deliverableId, name}
- navigate: {action: "navigate", path}
- open_report_deal: {action: "navigate", path: "/report-deal"}
- view_deal: {action: "navigate", path: "/deals/DEAL_ID"}

When you want to trigger an action, include it at the END of your message in this exact format:
<action>{"type":"navigate","path":"/report-deal"}</action>

TONE: Professional, concise, helpful. Use short paragraphs. No bullet-point overload. Feel like a smart assistant, not a chatbot.`;
}

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, userContext } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array required' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            // Return a helpful message if key not set yet
            return res.json({
                content: "⚠️ The AI assistant isn't configured yet. Add your ANTHROPIC_API_KEY to the .env file to enable Doorway.",
                action: null,
            });
        }

        const systemPrompt = buildSystemPrompt(userContext);

        const response = await anthropic.messages.create({
            model: 'claude-opus-4-5',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        });

        const rawContent = response.content[0]?.text || '';

        // Extract action tag if present
        const actionMatch = rawContent.match(/<action>([\s\S]*?)<\/action>/);
        let action = null;
        let content = rawContent.replace(/<action>[\s\S]*?<\/action>/g, '').trim();

        if (actionMatch) {
            try { action = JSON.parse(actionMatch[1]); } catch {}
        }

        res.json({ content, action });
    } catch (err) {
        console.error('[Doorway API error]', err.message);
        res.status(500).json({ error: 'Assistant unavailable. Please try again.' });
    }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok', assistant: 'Doorway' }));

app.listen(PORT, () => {
    console.log(`✅ FrontDoor AI backend running on http://localhost:${PORT}`);
    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  ANTHROPIC_API_KEY not set in .env — AI responses will be limited.');
    }
});
