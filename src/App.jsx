import { useState } from "react";

const platforms = [
  { id: "instagram", label: "Instagram", icon: "📸", placeholder: "instagram.com/username" },
  { id: "telegram", label: "Telegram", icon: "✈️", placeholder: "t.me/channel" },
  { id: "youtube", label: "YouTube", icon: "▶️", placeholder: "youtube.com/@channel" },
  { id: "tiktok", label: "TikTok", icon: "🎵", placeholder: "tiktok.com/@username" },
  { id: "website", label: "Website", icon: "🌐", placeholder: "yoursite.com" },
];

const requestLog = [];
function isRateLimited() {
  const now = Date.now();
  const recent = requestLog.filter(t => t > now - 60000);
  if (recent.length >= 5) return true;
  requestLog.push(now);
  return false;
}

function Tag({ text }) {
  return (
    <span style={{
      background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)",
      borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#00ff9d",
      fontFamily: "monospace", display: "inline-block", margin: "3px"
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
        fontFamily: "monospace"
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Report({ data }) {
  const d = data;
  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, rgba(0,255,157,0.08), rgba(0,100,255,0.08))",
        border: "1px solid rgba(0,255,157,0.2)", borderRadius: 20,
        padding: "32px", marginBottom: 20, textAlign: "center"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{d.audienceTwin.emoji}</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#00ff9d", fontFamily: "monospace", marginBottom: 8 }}>AUDIENCE TWIN</div>
        <h2 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: "#fff" }}>{d.audienceTwin.name}</h2>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          {d.audienceTwin.age} лет · {d.audienceTwin.occupation} · {d.audienceTwin.location}
        </p>
        <blockquote style={{
          fontStyle: "italic", color: "rgba(255,255,255,0.7)", fontSize: 15, margin: 0,
          borderLeft: "3px solid #00ff9d", paddingLeft: 16, textAlign: "left",
          maxWidth: 400, marginLeft: "auto", marginRight: "auto"
        }}>"{d.audienceTwin.quote}"</blockquote>
      </div>

      <div style={{
        background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,60,60,0.25)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 20,
        display: "flex", gap: 16, alignItems: "flex-start"
      }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#ff6060", fontFamily: "monospace", marginBottom: 6 }}>ROAST MODE</div>
          <p style={{ margin: 0, color: "#fff", fontSize: 15, lineHeight: 1.6 }}>{d.roast}</p>
        </div>
      </div>

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

      <Card title="Growth Strategy" accent="rgba(0,255,157,0.4)">
        {d.growthStrategy.topRecommendations.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,255,157,0.15)", border: "1px solid rgba(0,255,157,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#00ff9d", flexShrink: 0 }}>{i + 1}</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>{r}</p>
          </div>
        ))}
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
    if (!handle.trim()) { setError("Введи аккаунт"); return; }
    if (isRateLimited()) { setError("Слишком много запросов. Подожди минуту."); return; }
    setLoading(true); setError(""); setReport(null);

    const selectedPlatform = platforms.find(p => p.id === platform);
    const userMessage = "Analyze this " + selectedPlatform.label + " account: " + handle.trim() + (niche ? ". Niche: " + niche.trim() : "") + ". Return ONLY valid JSON: {\"audienceTwin\":{\"name\":\"string\",\"age\":25,\"occupation\":\"string\",\"location\":\"string\",\"quote\":\"string\",\"emoji\":\"string\"},\"audienceDNA\":{\"ageRange\":\"string\",\"lifestyle\":\"string\",\"mindset\":\"string\",\"incomeLevel\":\"string\",\"topInterests\":[\"string\",\"string\",\"string\"]},\"psychographics\":{\"emotionalTriggers\":[\"string\",\"string\"],\"deepestFear\":\"string\",\"coreAmbition\":\"string\",\"buyingBehavior\":\"string\",\"socialIdentity\":\"string\"},\"contentIntelligence\":{\"whatWorks\":\"string\",\"bestHooks\":[\"string\",\"string\"],\"bestTone\":\"string\",\"worstMistake\":\"string\"},\"growthStrategy\":{\"topRecommendations\":[\"string\",\"string\",\"string\"],\"bestPostingTime\":\"string\",\"untappedOpportunity\":\"string\"},\"roast\":\"string\",\"whyTheyFollow\":\"string\",\"whyTheyDontBuy\":\"string\",\"secretWant\":\"string\",\"monetizationInsight\":\"string\"}";

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }]
        })
      });

      if (!res.ok) { setError("Ошибка сервера: " + res.status); setLoading(false); return; }

      const data = await res.json();
      if (data.error) { setError("Ошибка API: " + JSON.stringify(data.error)); setLoading(false); return; }
      
      const text = data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setReport(parsed);
    } catch (e) {
      setError("Ошибка: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080b10", color: "#fff", fontFamily: "sans-serif", padding: "0 0 80px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
      <div style={{ padding: "40px 24px 32px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 48, fontWeight: 700, color: "#fff" }}>Signal</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 16 }}>AI that understands your audience better than you do.</p>
      </div>

      <div style={{ maxWidth: 560, margin: "40px auto 0", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {platforms.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)} style={{
              background: platform === p.id ? "rgba(0,255,157,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${platform === p.id ? "rgba(0,255,157,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10, padding: "8px 14px",
              color: platform === p.id ? "#00ff9d" : "rgba(255,255,255,0.5)",
              fontSize: 13, cursor: "pointer"
            }}>{p.icon} {p.label}</button>
          ))}
        </div>
        <input value={handle} onChange={e => setHandle(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
          placeholder={platforms.find(p => p.id === platform)?.placeholder}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 20px", color: "#fff", fontSize: 15, marginBottom: 12, display: "block" }} />
        <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Ниша (необязательно): fitness, AI..."
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 20px", color: "#fff", fontSize: 14, marginBottom: 16, display: "block" }} />
        <button onClick={analyze} disabled={loading || !handle.trim()} style={{
          width: "100%", padding: "18px", background: "rgba(0,255,157,0.9)", border: "none",
          borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer"
        }}>{loading ? "Analyzing..." : "Analyze Audience →"}</button>
        {error && <p style={{ color: "#ff6060", textAlign: "center", fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>

      <div style={{ maxWidth: 560, margin: "32px auto 0", padding: "0 20px" }}>
        {loading && <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #00ff9d", borderTopColor: "transparent", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
          <p style={{ color: "#00ff9d" }}>Analyzing audience...</p>
        </div>}
        {report && <Report data={report} />}
      </div>
    </div>
  );
}
