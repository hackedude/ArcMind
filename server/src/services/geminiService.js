import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

const genAI = config.geminiApiKey && config.geminiApiKey !== 'your-gemini-api-key'
  ? new GoogleGenerativeAI(config.geminiApiKey)
  : null;

const model = genAI?.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

async function withRetry(fn, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 429 && i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, i + 1) * 1000));
        continue;
      }
      throw err;
    }
  }
}

function demoAnswer(question, context) {
  const q = question.toLowerCase();
  const ctx = context.toLowerCase();

  const hasInvoice = ctx.includes('invoice') || ctx.includes('inv-');
  const hasContract = ctx.includes('contract') || ctx.includes('agreement');
  const hasReport = ctx.includes('report') || ctx.includes('summary');

  if (q.includes('total') || q.includes('amount') || q.includes('how much') || q.includes('cost')) {
    const match = context.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (match) {
      const amounts = match.map((s) => s.replace(/[,]/g, ''));
      return `Based on the document, I found the following amounts:\n\n${amounts.map((a) => `• **${a}**`).join('\n')}\n\nThe total amount due appears to be **${amounts[amounts.length - 1] || amounts[0]}**.`;
    }
    return `Based on the document, the total financial value is mentioned in the document. You can find the specific amounts in the document detail view.`;
  }

  if (q.includes('date') || q.includes('when') || q.includes('deadline') || q.includes('due')) {
    const dates = context.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/g);
    if (dates) {
      return `I found the following key dates in the document:\n\n${dates.map((d) => `• ${d}`).join('\n')}\n\nThese are the relevant dates to be aware of.`;
    }
    return `The document contains date information. You can view the full details in the document preview.`;
  }

  if (q.includes('who') || q.includes('party') || q.includes('client') || q.includes('customer') || q.includes('company')) {
    const companies = context.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Ltd|Corp|Consulting|Technologies))/g);
    if (companies) {
      return `The following organizations are mentioned in the document:\n\n${[...new Set(companies)].map((c) => `• **${c}**`).join('\n')}`;
    }
    return "The document references the involved parties. You can find their names in the document viewer.";
  }

  if (q.includes('summary') || q.includes('overview') || q.includes('what is this') || q.includes('about')) {
    if (hasInvoice) return "This is an **invoice document** issued by one company to another for services rendered. It includes a breakdown of charges, tax calculations, and payment terms. The total amount due is clearly stated along with the payment deadline.";
    if (hasContract) return "This is a **contract or agreement** document outlining the terms, obligations, and conditions between the involved parties. It covers the scope of work, payment terms, and other legal provisions.";
    if (hasReport) return "This is a **business report** containing analysis, findings, and recommendations. It includes relevant data points and insights about the subject matter.";
    return "This document appears to be a **business document** containing important information about the subject matter. I can help answer specific questions about its contents.";
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm ArcMind, your AI business assistant. I can help you analyze your uploaded documents. Feel free to ask me questions about the content, such as amounts, dates, parties involved, or request a summary.";
  }

  return "Based on the document content I've analyzed, here's what I found:\n\n• The document contains key business information relevant to your query.\n• You can ask me about specific details like amounts, dates, parties, or request a full summary.\n• For more precise answers, try asking with specific terms you see in the document.";
}

function demoSummary(documentText, documentName) {
  const text = documentText.toLowerCase();
  const name = documentName.toLowerCase();

  const items = [];
  const lines = documentText.split('\n').filter((l) => l.trim());

  const dollarMatches = documentText.match(/\$[\d,]+(?:\.\d{2})?/g);
  const dateMatches = documentText.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/g);
  const companyMatches = documentText.match(/[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*(?:\s+(?:Inc|LLC|Ltd|Corp|Technologies|Consulting))/g);

  let summary = '';

  if (text.includes('invoice') || text.includes('inv-')) {
    const total = dollarMatches ? dollarMatches[dollarMatches.length - 1] : '';
    const date = dateMatches ? dateMatches[0] : '';
    const from = companyMatches ? companyMatches[0] : 'the issuer';
    const to = companyMatches && companyMatches.length > 1 ? companyMatches[1] : 'the client';
    summary = `This invoice from **${from}** to **${to}** dated ${date || 'the specified date'} details charges for professional services rendered. The total amount due is ${total || 'specified in the document'}, with payment terms outlined for settlement.`;
    if (dollarMatches) {
      items.push(`Total amount: **${dollarMatches[dollarMatches.length - 1]}**`);
      items.push(`Multiple line items totaling ${dollarMatches[0]} before tax`);
    }
    if (dateMatches) items.push(`Invoice date: **${dateMatches[0]}**`);
    if (companyMatches) items.push(`Parties: **${companyMatches[0]}** → **${companyMatches[companyMatches.length > 1 ? 1 : 0]}**`);
    items.push('Payment terms and account details provided for remittance');
  } else if (text.includes('contract') || text.includes('agreement')) {
    summary = `This agreement establishes the terms and conditions between the involved parties. It covers the scope of work, financial considerations, and duration of the engagement.`;
    if (companyMatches) items.push(`Parties involved: **${companyMatches.join('** and **')}**`);
    if (dateMatches) items.push(`Effective date: **${dateMatches[0]}**`);
    if (dollarMatches) items.push(`Financial consideration: **${dollarMatches[0]}**`);
    items.push('Standard terms and conditions apply as detailed in the document');
  } else if (text.includes('report')) {
    summary = `This report provides analysis and findings on the subject matter. It includes key data points, observations, and recommendations based on the information presented.`;
    if (dateMatches) items.push(`Report date: **${dateMatches[0]}**`);
    if (dollarMatches) items.push(`Financial figures referenced: **${dollarMatches[0]}**`);
    items.push('Contains actionable insights and recommendations');
  } else {
    summary = `This document, **${documentName}**, contains important business information. It has been processed and analyzed by ArcMind for key insights.`;
    if (companyMatches) items.push(`Referenced organizations: **${companyMatches.join('**, **')}**`);
    if (dateMatches) items.push(`Key dates: **${dateMatches.join('**, **')}**`);
    if (dollarMatches) items.push(`Monetary values: **${dollarMatches.join(', ')}**`);
    items.push(`${lines.length} lines of content analyzed and ready for Q&A`);
  }

  return {
    summary,
    keyInsights: items.slice(0, 6),
  };
}

export async function askGemini(question, context) {
  if (!model) {
    return demoAnswer(question, context);
  }

  try {
    const prompt = `You are ArcMind, an AI business assistant that helps users analyze their business documents.

Use the following document context to answer the user's question. If the context doesn't contain enough information, say so honestly.

Document Context:
${context}

User Question: ${question}

Answer concisely and professionally, referencing specific information from the documents when possible.`;

    const result = await withRetry(() => model.generateContent(prompt));
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini API error, falling back to demo mode:', err.message);
    return demoAnswer(question, context);
  }
}

export async function generateSummary(documentText, documentName) {
  if (!model) {
    return demoSummary(documentText, documentName);
  }

  try {
    const prompt = `You are ArcMind, an AI business assistant. Analyze the following business document and provide:
1. A concise summary (2-3 sentences)
2. Key insights (3-6 bullet points covering important figures, dates, parties, decisions, or actions)

Document Name: ${documentName}

Document Content:
${documentText.slice(0, 10000)}

Return ONLY valid JSON in this exact format (no markdown, no backticks):
{
  "summary": "your concise summary here",
  "keyInsights": ["insight 1", "insight 2", "insight 3"]
}`;

    const result = await withRetry(() => model.generateContent(prompt));
    const response = await result.response;
    const text = response.text().trim();
    const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini API error, falling back to demo mode:', err.message);
    return demoSummary(documentText, documentName);
  }
}
