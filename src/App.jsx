import { useState } from "react";

// API key loaded from environment variable (never hardcode keys!)
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are Signal — an elite AI audience intelligence engine.
When given a social media profile link or handle, you analyze and return a structured JSON report about their audience. You MUST respond ONLY with valid JSON, no markdown, no preamble.
Return this exact structure:
{
  "audienceTwin": { "name": "string", "age": 25, "occupation": "string", "location": "string", "quote": "string", "emoji": "string" },
  "audienceDNA": { "ageRange": "string", "lifestyle": "string", "mindset": "string", "incomeLevel": "string", "topInterests": ["string","string","string","string"] },
  "psychographics": { "emotionalTriggers": ["string","string","string"], "deepestFear": "string", "coreAmbition": "string", "buyingBehavior": "string", "socialIdentity": "string" },
  "contentIntelligence": { "whatWorks": "string", "bestHooks": ["string","string","string"], "bestTone": "string", "worstMistake": "string" },
  "growthStrategy": { "topRecommendations": ["string","string","string"], "bestPostingTime": "string", "untappedOpportunity": "string" },
  "roast": "string",
  "whyTheyFollow": "string",
  "whyTheyDontBuy": "string",
  "secretWant": "string",
  "monetizationInsight": "string"
}
Be specific, insightful, psychologically sharp. Make the twin feel REAL.`;

const platforms = [
  { id: "instagram", label: "Instagram", icon: "📸", placeholder: "instagram.com/username" },
  { id: "telegram", label: "Telegram", icon: "✈️", placeholder: "t.me/channel" },
  { id: "youtube", label: "YouTube", icon: "▶️", placeholder: "youtube.com/@channel" },
  { id: "tiktok", label: "TikTok", icon: "🎵", placeholder: "tiktok.com/@username" },
  { id: "website", label: "Website", icon: "🌐", placeholder: "yoursite.com" },
];

// Rate limiting: max 5 requests per minute per session
const requestLog = [];
function isRateLimited() {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  const recent = requestLog.filter(t => t > oneMinuteAgo);
  if (recent.length >= 5) return true;
  requestLog.push(now);
  return false;
}

// Input validation
function validateInput(handle, niche) {
  if (!handle || handle.trim().length < 2) return "Введи корректный аккаунт";
  if (handle.trim().length > 200) return "Слишком длинный ввод";
  if (niche && niche.length > 200) return "Описание ниши слишком длинное";
  const forbidden = /<script|javascript:|on\w+=/i;
  if (forbidden.test(handle) || forbidden.test(niche)) return "Некорректный ввод";
  return null;
}

function Tag({ text }) {
  return (
    <span style={{
      background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)",
      borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#00ff9d",
      fontFamily: "'Space Mono', monospace", display: "inline-block", margin: "3px"
    }}>{text}</span>
  );
}

function Card({ title, children, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent || "rgba(255,255,255,0.08)"}`,
      borderRadius: 16, padding: "24px", marginBottom: 16
    }}>
      <h3 style={{
        margin: "0 0 16px", fontSize: 11, letterSpacing: 3,
        textTransform: "uppercase", color: accent || "rgba(255,255,255,0.4)",
        fontFamily: "'Space Mono', monospace"
      }}>{title}</h3>
      {children}
    </div>
  );
}

function LoadingPulse() {
  const steps = ["Scanning audience signals...", "Building psychographic profile...", "Identifying emotional triggers...", "Generating Audience Twin...", "Crafting roast..."];
  const [step, setStep] = useState(0);
  useState(() => {
    const interval = setInterval(() => setStep(s => (s + 1) % steps.length), 1400);
    return () => clearInterval(interval);
  });
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #00ff9d", borderTopColor: "transparent", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
      <p style={{ color: "#00ff9d", fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: 2 }}>{steps[step]}</p>
    </div>
  );
}

function Report({ data }) {
  const d = data;
  return (
    <div style={{ animation: "fadeUp 0.6s ease forwards" }}>
      {/* Audience Twin */}
      <div style={{ background: "linear-gradient(135deg, rgba(0,255,157,0.08), rgba(0,100,255,0.08))", border: "1px solid rgba(0,255,157,0.2)", borderRadius: 20, padding: "32px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{d.audienceTwin.emoji}</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#00ff9d", fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>AUDIENCE TWIN</div>
        <h2 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: "#fff" }}>{d.audienceTwin.name}</h2>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{d.audienceTwin.age} лет · {d.audienceTwin.occupation} · {d.audienceTwin.location}</p>
        <blockquote style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)", fontSize: 15, margin: 0, borderLeft: "3px solid #00ff9d", paddingLeft: 16, textAlign: "left", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>"{d.audienceTwin.quote}"</blockquote>
      </div>

      {/* Roast */}
      <div style={{ background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,60,60,0.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#ff6060", fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>ROAST MODE</div>
          <p style={{ margin: 0, color: "#fff", fontSize: 15, lineHeight: 1.6 }}>{d.roast}</p>
        </div>
      </div>

      {/* DNA */}
      <Card title="Audience DNA" accent="rgba(0,200,255,0.5)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[["Возраст", d.audienceDNA.ageRange], ["Доход", d.audienceDNA.incomeLevel], ["Lifestyle", d.audienceDNA.lifestyle], ["Mindset", d.audienceDNA.mindset]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>{k.toUpperCase()}</div>
              <div style={{ color: "#fff", fontSize: 13 }}>{v}</div>
            </div>
          ))}
        </div>
        <div>{d.audienceDNA.topInterests.map(i => <Tag key={i} text={i} />)}</div>
      </Card>

      {/* Psychographics */}
      <Card title="Psychographic Engine" accent="rgba(180,0,255,0.5)">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>EMOTIONAL TRIGGERS</div>
          <div>{d.psychographics.emotionalTriggers.map(t => <Tag key={t} text={t} />)}</div>
        </div>
        {[["Глубинный страх", d.psychographics.deepestFear], ["Главная амбиция", d.psychographics.coreAmbition], ["Buying behavior", d.psychographics.buyingBehavior], ["Social identity", d.psychographics.socialIdentity]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>{k.toUpperCase()}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.5 }}>{v}</div>
          </div>
        ))}
      </Card>

      {/* Why cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {[["💙 Почему подписываются", d.whyTheyFollow, "rgba(0,150,255,0.3)"], ["🚫 Почему не покупают", d.whyTheyDontBuy, "rgba(255,100,0,0.3)"], ["🤫 Что хотят на самом деле", d.secretWant, "rgba(255,200,0,0.3)"], ["💰 Монетизация", d.monetizationInsight, "rgba(0,255,157,0.3)"]].map(([title, text, color]) => (
          <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${color}`, borderRadius: 14, padding: "18px" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{title}</div>
            <p style={{ margin: 0, color: "#fff", fontSize: 13, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Content Intelligence */}
      <Card title="Content Intelligence">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 6 }}>ЛУЧШИЕ HOOKS</div>
          {d.contentIntelligence.bestHooks.map((h, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px", marginBottom: 6, color: "rgba(255,255,255,0.8)", fontSize: 13, borderLeft: "3px solid #00ff9d" }}>"{h}"</div>
          ))}
        </div>
        {[["Что работает", d.contentIntelligence.whatWorks], ["Лучший тон", d.contentIntelligence.bestTone], ["Главная ошибка", d.contentIntelligence.worstMistake]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>{k.toUpperCase()}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{v}</div>
          </div>
        ))}
      </Card>

      {/* Growth */}
      <Card title="Growth Strategy" accent="rgba(0,255,157,0.4)">
        {d.growthStrategy.topRecommendations.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,255,157,0.15)", border: "1px solid rgba(0,255,157,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#00ff9d", flexShrink: 0, fontFamily: "'Space Mono', monospace" }}>{i + 1}</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>{r}</p>
          </div>
        ))}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>НЕРАСКРЫТЫЙ ПОТЕНЦИАЛ</div>
          <p style={{ margin: 0, color: "#00ff9d", fontSize: 13 }}>{d.growthStrategy.untappedOpportunity}</p>
        </div>
      </Card>
    </div>
  );
}

export default function Signal() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    // Input validation
    const validationError = validateInput(handle, niche);
    if (validationError) { setError(validationError); return; }

    // Rate limiting
    if (isRateLimited()) { setError("Слишком много запросов. Подожди минуту."); return; }

    if (!API_KEY) { setError("API ключ не найден. Проверь файл .env"); return; }

    setLoading(true); setError(""); setReport(null);

    const selectedPlatform = platforms.find(p => p.id === platform);
    // Sanitize input before sending
    const safeHandle = handle.trim().slice(0, 200);
    const safeNiche = niche.trim().slice(0, 200);
    const prompt = `Analyze this ${selectedPlatform.label} account: ${safeHandle}${safeNiche ? `. Niche: ${safeNiche}` : ""}. Build a complete audience intelligence report.`;

    try {
      const res = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }]
  })
});

      // Handle rate limit from API
      if (res.status === 429) { setError("Лимит API. Попробуй через минуту."); setLoading(false); return; }
      if (!res.ok) { setError("Ошибка API. Проверь ключ и баланс."); setLoading(false); return; }

      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setReport(parsed);
    } catch (e) {
      setError("Не удалось получить анализ. Проверь ввод и попробуй снова.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080b10", color: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(0,255,157,0.15); } 50% { box-shadow: 0 0 40px rgba(0,255,157,0.3); } }
        input:focus { outline: none; } * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "40px 24px 32px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.15)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", display: "inline-block" }} />
          <span style={{ fontSize: 11, letterSpacing: 3, color: "#00ff9d", fontFamily: "'Space Mono', monospace" }}>AI AUDIENCE INTELLIGENCE</span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 700, letterSpacing: -1, background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.4))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Signal</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 16 }}>AI that understands your audience better than you do.</p>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 560, margin: "40px auto 0", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {platforms.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)} style={{ background: platform === p.id ? "rgba(0,255,157,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${platform === p.id ? "rgba(0,255,157,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "8px 14px", color: platform === p.id ? "#00ff9d" : "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
        <input value={handle} onChange={e => setHandle(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()} placeholder={platforms.find(p => p.id === platform)?.placeholder} maxLength={200} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 20px", color: "#fff", fontSize: 15, marginBottom: 12, display: "block" }} />
        <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Опиши нишу (необязательно): fitness, AI, crypto..." maxLength={200} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 20px", color: "#fff", fontSize: 14, marginBottom: 16, display: "block" }} />
        <button onClick={analyze} disabled={loading || !handle.trim()} style={{ width: "100%", padding: "18px", background: loading || !handle.trim() ? "rgba(0,255,157,0.1)" : "rgba(0,255,157,0.9)", border: "none", borderRadius: 14, color: loading || !handle.trim() ? "rgba(0,255,157,0.4)" : "#000", fontSize: 15, fontWeight: 700, cursor: loading || !handle.trim() ? "default" : "pointer", animation: !loading && handle.trim() ? "glow 2s ease infinite" : "none", transition: "all 0.2s" }}>
          {loading ? "Analyzing..." : "Analyze Audience →"}
        </button>
        {error && <p style={{ color: "#ff6060", textAlign: "center", fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>

      {/* Results */}
      <div style={{ maxWidth: 560, margin: "32px auto 0", padding: "0 20px" }}>
        {loading && <LoadingPulse />}
        {report && <Report data={report} />}
      </div>
    </div>
  );
}
