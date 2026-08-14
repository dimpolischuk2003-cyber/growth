// Example Vercel/Node serverless endpoint. Do not deploy without setting environment variables.
import crypto from "node:crypto";

const allowedBudgets = new Set(["lt10","10-20","20-50","50plus"]);
const allowedSales = new Set(["yes","partial","no"]);
const allowedCRM = new Set(["yes","partial","no"]);

function clean(value, max=500) {
  return String(value ?? "").trim().slice(0,max);
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false };
  const body = new URLSearchParams({secret,response:token});
  if (ip) body.set("remoteip",ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body});
  return r.json();
}

export default async function handler(req,res) {
  if (req.method !== "POST") return res.status(405).json({error:"method_not_allowed"});
  const body = req.body || {};
  if (body.website_confirm) return res.status(204).end(); // honeypot

  const submissionId = clean(body.submission_id,100);
  if (!submissionId) return res.status(400).json({error:"missing_submission_id"});

  // Production: store submissionId in KV/DB with TTL and reject duplicates.
  // This sample only validates the field; in-memory dedupe is not reliable on serverless.

  const required = ["company","website","niche","markets","budget","stable_sales","crm_data","name","contact","consent"];
  for (const field of required) {
    if (!clean(body[field])) return res.status(400).json({error:"missing_field",field});
  }
  if (!allowedBudgets.has(body.budget) || !allowedSales.has(body.stable_sales) || !allowedCRM.has(body.crm_data)) {
    return res.status(400).json({error:"invalid_qualification"});
  }

  const turnstile = await verifyTurnstile(clean(body.turnstile_token,2048),req.headers["x-forwarded-for"]?.split(",")[0]?.trim());
  if (!turnstile.success) return res.status(403).json({error:"bot_check_failed"});

  const crmUrl = process.env.CRM_WEBHOOK_URL;
  if (!crmUrl) return res.status(503).json({error:"crm_not_configured"});

  const payload = {
    submission_id: submissionId,
    company: clean(body.company,200),
    website: clean(body.website,300),
    niche: clean(body.niche,100),
    markets: clean(body.markets,200),
    budget: body.budget,
    stable_sales: body.stable_sales,
    channels: clean(body.channels,200),
    crm_data: body.crm_data,
    problem: clean(body.problem,1500),
    name: clean(body.name,150),
    contact: clean(body.contact,250),
    segment: clean(body.segment,50),
    readiness_result: clean(body.readiness_result,50),
    readiness_answers: clean(body.readiness_answers,2500),
    cases_viewed: clean(body.cases_viewed,300),
    utm_source: clean(body.utm_source,150),
    utm_medium: clean(body.utm_medium,150),
    utm_campaign: clean(body.utm_campaign,200),
    utm_content: clean(body.utm_content,200),
    utm_term: clean(body.utm_term,200),
    referrer: clean(body.referrer,500),
    landing: clean(body.landing,500),
    lead_intent: clean(body.lead_intent,50)
  };

  const crm = await fetch(crmUrl,{
    method:"POST",
    headers:{"content-type":"application/json","x-idempotency-key":submissionId},
    body:JSON.stringify(payload)
  });
  if (!crm.ok) {
    console.error("crm_delivery_failed",{status:crm.status,submission_id_hash:crypto.createHash("sha256").update(submissionId).digest("hex").slice(0,12)});
    return res.status(502).json({error:"delivery_failed"});
  }

  return res.status(200).json({
    ok:true,
    lead_id_hash:crypto.createHash("sha256").update(submissionId).digest("hex").slice(0,16)
  });
}
