import { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// Chinese Gender Prediction Chart
// Rows = mother's lunar age at conception (18-45)
// Cols = conception month (1-12, Jan-Dec)
// G = Girl, B = Boy
// ═══════════════════════════════════════════════════════
const CHART = {
  18: "GBGBBBBBBBBB",
  19: "BGBGGBBBBBBG",
  20: "GBGBBBBBBGBB",
  21: "BGGGGGGGGGGG",
  22: "GBBGBGGBGGGG",
  23: "BBBGBBGGBBBG",
  24: "BGGBBGBGBBGB",
  25: "GBGBGBGBBBBB",
  26: "BBBBBGBGGBGG",
  27: "GGBBGBGGBGBB",
  28: "BBBGGBGBGGBG",
  29: "GBGGBGGBGBBB",
  30: "BBGBGBBBBBBB",
  31: "BBBBGGBGBGGG",
  32: "BGGBGBBGBBGB",
  33: "GBBGGBGBGBBG",
  34: "BBGGBGBBGBGG",
  35: "BGBGBGBGBBGB",
  36: "BGBBBBBBGGGG",
  37: "GGBGGGBGBBBB",
  38: "BBGGBGGBGGBG",
  39: "GGBGGGBGBBGB",
  40: "BBBGBGBGBGGB",
  41: "GGBGBBGGBGBG",
  42: "BGGBBBBBGBGB",
  43: "GBGGBBBBGBBB",
  44: "BBGGGBGBGBGG",
  45: "GBGBGGBGBGBB",
};

function lookupGender(lunarAge, conceptionMonth) {
  const row = CHART[lunarAge];
  if (!row) return null;
  const idx = conceptionMonth - 1;
  if (idx < 0 || idx > 11) return null;
  return row[idx] === "G" ? "Girl" : "Boy";
}

// ═══════════════════════════════════════════════════════
// Zodiac
// ═══════════════════════════════════════════════════════
const SIGNS = [
  { name: "Capricorn", symbol: "♑", start: [1, 1], end: [1, 19], element: "Earth" },
  { name: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18], element: "Air" },
  { name: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20], element: "Water" },
  { name: "Aries", symbol: "♈", start: [3, 21], end: [4, 19], element: "Fire" },
  { name: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20], element: "Earth" },
  { name: "Gemini", symbol: "♊", start: [5, 21], end: [6, 20], element: "Air" },
  { name: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22], element: "Water" },
  { name: "Leo", symbol: "♌", start: [7, 23], end: [8, 22], element: "Fire" },
  { name: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22], element: "Earth" },
  { name: "Libra", symbol: "♎", start: [9, 23], end: [10, 22], element: "Air" },
  { name: "Scorpio", symbol: "♏", start: [10, 23], end: [11, 21], element: "Water" },
  { name: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21], element: "Fire" },
  { name: "Capricorn", symbol: "♑", start: [12, 22], end: [12, 31], element: "Earth" },
];

const UNIQUE_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire" },
  { name: "Taurus", symbol: "♉", element: "Earth" },
  { name: "Gemini", symbol: "♊", element: "Air" },
  { name: "Cancer", symbol: "♋", element: "Water" },
  { name: "Leo", symbol: "♌", element: "Fire" },
  { name: "Virgo", symbol: "♍", element: "Earth" },
  { name: "Libra", symbol: "♎", element: "Air" },
  { name: "Scorpio", symbol: "♏", element: "Water" },
  { name: "Sagittarius", symbol: "♐", element: "Fire" },
  { name: "Capricorn", symbol: "♑", element: "Earth" },
  { name: "Aquarius", symbol: "♒", element: "Air" },
  { name: "Pisces", symbol: "♓", element: "Water" },
];

function getSunSign(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (const s of SIGNS) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm === em) {
      if (m === sm && d >= sd && d <= ed) return s;
    } else {
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return s;
    }
  }
  return SIGNS[0];
}

function getLunarAge(birthday, conceptionDate) {
  const bYear = birthday.getFullYear();
  const cYear = conceptionDate.getFullYear();
  const bMonth = birthday.getMonth();
  const cMonth = conceptionDate.getMonth();
  const bDay = birthday.getDate();
  const cDay = conceptionDate.getDate();
  let westernAge = cYear - bYear;
  if (cMonth < bMonth || (cMonth === bMonth && cDay < bDay)) westernAge--;
  return westernAge + 1;
}

const ELEMENT_COLORS = { Fire: "#e85d3a", Earth: "#b8860b", Air: "#6b9ec4", Water: "#3a7ca5" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmtDate(d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtShort(d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

// ═══════════════════════════════════════════════════════
// Ad slot component (placeholder until AdSense approved)
// ═══════════════════════════════════════════════════════
function AdSlot({ style }) {
  // Once AdSense is approved, replace the inner div with:
  // <ins className="adsbygoogle"
  //   style={{ display: "block" }}
  //   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //   data-ad-slot="XXXXXXXXXX"
  //   data-ad-format="auto"
  //   data-full-width-responsive="true" />
  // and call (adsbygoogle = window.adsbygoogle || []).push({}) in useEffect
  return (
    <div style={{
      padding: "12px", textAlign: "center", fontSize: "10px",
      letterSpacing: "2px", textTransform: "uppercase",
      opacity: 0.15, border: "1px dashed rgba(255,255,255,0.1)",
      borderRadius: "8px", ...style,
    }}>
      ad slot
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Main App
// ═══════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("predict");
  const [birthday, setBirthday] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [desiredGender, setDesiredGender] = useState("Boy");
  const [selectedSigns, setSelectedSigns] = useState(new Set());
  const [planResults, setPlanResults] = useState(null);
  const [showPlanResults, setShowPlanResults] = useState(false);

  // Past mode state
  const [pastMomBday, setPastMomBday] = useState("");
  const [pastBabyBday, setPastBabyBday] = useState("");
  const [pastWeeks, setPastWeeks] = useState(40);
  const [pastActualGender, setPastActualGender] = useState("");
  const [showPastResult, setShowPastResult] = useState(false);

  const pastResult = useMemo(() => {
    if (!pastMomBday || !pastBabyBday) return null;
    const momBday = new Date(pastMomBday + "T00:00:00");
    const babyBday = new Date(pastBabyBday + "T00:00:00");
    if (isNaN(momBday) || isNaN(babyBday) || babyBday <= momBday) return null;
    // Back-calculate conception: baby birthday minus (weeks * 7) days
    const conceptionDate = addDays(babyBday, -(pastWeeks * 7));
    const lunarAge = getLunarAge(momBday, conceptionDate);
    if (lunarAge < 18 || lunarAge > 45) return { outOfRange: true, lunarAge };
    const month = conceptionDate.getMonth() + 1;
    const gender = lookupGender(lunarAge, month);
    const sign = getSunSign(babyBday);
    return { lunarAge, month, gender, conceptionDate, babyBday, sign, outOfRange: false };
  }, [pastMomBday, pastBabyBday, pastWeeks]);

  // ── Predict result ──
  const result = useMemo(() => {
    if (!birthday || !conceptionDate) return null;
    const bday = new Date(birthday + "T00:00:00");
    const cday = new Date(conceptionDate + "T00:00:00");
    if (isNaN(bday) || isNaN(cday) || cday <= bday) return null;
    const lunarAge = getLunarAge(bday, cday);
    if (lunarAge < 18 || lunarAge > 45) return { outOfRange: true, lunarAge };
    const conceptionMonth = cday.getMonth() + 1;
    const gender = lookupGender(lunarAge, conceptionMonth);
    const dueDate = addDays(cday, 266);
    const earlyDate = addDays(cday, 252);
    const lateDate = addDays(cday, 280);
    const sign = getSunSign(dueDate);
    const earlySign = getSunSign(earlyDate);
    const lateSign = getSunSign(lateDate);
    return {
      lunarAge, conceptionMonth, conceptionMonthName: MONTHS[conceptionMonth - 1],
      gender, dueDate, sign, earlySign, lateSign,
      cuspWarning: earlySign.name !== lateSign.name, outOfRange: false,
    };
  }, [birthday, conceptionDate]);

  // ── Plan windows ──
  const computeWindows = useCallback(() => {
    if (!birthday || selectedSigns.size === 0) return;
    const bday = new Date(birthday + "T00:00:00");
    if (isNaN(bday)) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const endScan = addDays(today, 365 * 3);
    const matches = [];
    let current = new Date(today);
    while (current <= endScan) {
      const lunarAge = getLunarAge(bday, current);
      if (lunarAge >= 18 && lunarAge <= 45) {
        const month = current.getMonth() + 1;
        const gender = lookupGender(lunarAge, month);
        const dueDate = addDays(current, 266);
        const sign = getSunSign(dueDate);
        if (gender === desiredGender && selectedSigns.has(sign.name)) {
          matches.push({ date: new Date(current), lunarAge, month, gender, dueDate, sign: { ...sign } });
        }
      }
      current = addDays(current, 1);
    }
    const windows = [];
    for (const m of matches) {
      const last = windows[windows.length - 1];
      if (last && last.sign.name === m.sign.name && (m.date - last.endDate) / 86400000 <= 1) {
        last.endDate = m.date; last.endDue = m.dueDate;
      } else {
        windows.push({
          startDate: m.date, endDate: m.date, startDue: m.dueDate, endDue: m.dueDate,
          sign: m.sign, gender: m.gender, lunarAge: m.lunarAge,
        });
      }
    }
    setPlanResults(windows);
    setShowPlanResults(true);
  }, [birthday, desiredGender, selectedSigns]);

  const toggleSign = (name) => {
    setSelectedSigns((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
    setShowPlanResults(false);
  };

  const handleReset = () => { setShowResult(false); setShowPlanResults(false); setPlanResults(null); setShowPastResult(false); };
  const switchMode = (m) => { setMode(m); setShowResult(false); setShowPlanResults(false); setPlanResults(null); setShowPastResult(false); };

  const AGES = [];
  for (let i = 18; i <= 45; i++) AGES.push(i);

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {Array.from({ length: 55 }).map((_, i) => (
          <div key={i} style={{
            ...styles.star,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2.5}px`, height: `${1 + Math.random() * 2.5}px`,
            animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerGroup}>
          <div style={styles.headerSymbol}>☽</div>
          <h1 style={styles.title}>Baby Oracle</h1>
          <p style={styles.subtitle}>chinese gender chart · sun sign divination</p>
          <p style={styles.disclaimer}>for entertainment only · accuracy not guaranteed by the cosmos</p>
          <p style={styles.lunarNote}>This chart uses <strong>lunar age</strong> (your western age + 1), the traditional Chinese method of counting age.</p>
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          {[
            { key: "predict", label: "✦ Predict" },
            { key: "plan", label: "☾ Plan" },
            { key: "chart", label: "◷ Check Past" },
          ].map((m) => (
            <button key={m.key} onClick={() => switchMode(m.key)}
              style={{ ...styles.modeBtn, ...(mode === m.key ? styles.modeBtnActive : {}) }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* ═══════════ PREDICT ═══════════ */}
        {mode === "predict" && !showResult && (
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mother's Birthday</label>
              <input type="date" value={birthday}
                onChange={(e) => { setBirthday(e.target.value); setShowResult(false); }}
                style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Estimated Conception Date</label>
              <input type="date" value={conceptionDate}
                onChange={(e) => { setConceptionDate(e.target.value); setShowResult(false); }}
                style={styles.input} />
              <span style={styles.hint}>~2 weeks after first day of last period</span>
            </div>
            {result && result.outOfRange && (
              <div style={styles.errorBox}>Lunar age {result.lunarAge} is outside the chart range (18–45).</div>
            )}
            {result && !result.outOfRange && (
              <div style={styles.preview}>
                Lunar age: <strong>{result.lunarAge}</strong> <span style={{ opacity: 0.4, fontSize: "11px" }}>(western {result.lunarAge - 1})</span>
                <span style={{ margin: "0 10px", opacity: 0.3 }}>·</span>
                Month: <strong>{result.conceptionMonthName}</strong>
              </div>
            )}
            <button onClick={() => result && !result.outOfRange && setShowResult(true)}
              disabled={!result || result.outOfRange}
              style={{ ...styles.button, opacity: !result || result.outOfRange ? 0.35 : 1,
                cursor: !result || result.outOfRange ? "not-allowed" : "pointer" }}>
              ✦ Consult the Oracle ✦
            </button>
            <AdSlot />
          </div>
        )}

        {mode === "predict" && showResult && result && (
          <div style={styles.resultContainer}>
            <div style={{ ...styles.card, borderColor: result.gender === "Girl" ? "#d4728c" : "#5b8abf" }}>
              <div style={{ ...styles.bigSymbol, color: result.gender === "Girl" ? "#e88da6" : "#7ab0e0" }}>
                {result.gender === "Girl" ? "♀" : "♂"}
              </div>
              <div style={styles.cardLabel}>Gender Prediction</div>
              <div style={{ ...styles.cardValue, color: result.gender === "Girl" ? "#e88da6" : "#7ab0e0" }}>
                {result.gender}
              </div>
              <div style={styles.cardDetail}>lunar age {result.lunarAge} (western {result.lunarAge - 1}) × {result.conceptionMonthName} conception</div>
            </div>
            <div style={{ ...styles.card, borderColor: ELEMENT_COLORS[result.sign.element] }}>
              <div style={{ ...styles.bigSymbol, color: ELEMENT_COLORS[result.sign.element] }}>{result.sign.symbol}</div>
              <div style={styles.cardLabel}>Sun Sign</div>
              <div style={{ ...styles.cardValue, color: ELEMENT_COLORS[result.sign.element] }}>{result.sign.name}</div>
              <div style={styles.cardDetail}>{result.sign.element} sign · due {fmtDate(result.dueDate)}</div>
              {result.cuspWarning && (
                <div style={styles.cuspNote}>
                  ⚠ Could also be <strong>{result.earlySign.name !== result.sign.name ? result.earlySign.name : result.lateSign.name}</strong> depending on delivery timing
                </div>
              )}
            </div>
            <AdSlot />
            <button onClick={handleReset} style={styles.resetButton}>↻ Start Over</button>
          </div>
        )}

        {/* ═══════════ PLAN ═══════════ */}
        {mode === "plan" && !showPlanResults && (
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mother's Birthday</label>
              <input type="date" value={birthday}
                onChange={(e) => { setBirthday(e.target.value); setShowPlanResults(false); }}
                style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Desired Gender</label>
              <div style={styles.genderRow}>
                {["Boy", "Girl"].map((g) => (
                  <button key={g} onClick={() => { setDesiredGender(g); setShowPlanResults(false); }}
                    style={{
                      ...styles.genderBtn,
                      borderColor: desiredGender === g ? (g === "Girl" ? "#d4728c" : "#5b8abf") : "rgba(255,255,255,0.08)",
                      background: desiredGender === g ? (g === "Girl" ? "rgba(212,114,140,0.12)" : "rgba(91,138,191,0.12)") : "rgba(255,255,255,0.02)",
                      color: desiredGender === g ? (g === "Girl" ? "#e88da6" : "#7ab0e0") : "rgba(212,201,168,0.5)",
                    }}>
                    <span style={{ fontSize: "20px" }}>{g === "Girl" ? "♀" : "♂"}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{g}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Acceptable Sun Signs</label>
              <div style={styles.signGrid}>
                {UNIQUE_SIGNS.map((s) => {
                  const sel = selectedSigns.has(s.name);
                  const clr = ELEMENT_COLORS[s.element];
                  return (
                    <button key={s.name} onClick={() => toggleSign(s.name)}
                      style={{
                        ...styles.signChip,
                        borderColor: sel ? clr : "rgba(255,255,255,0.08)",
                        background: sel ? `${clr}18` : "rgba(255,255,255,0.02)",
                        color: sel ? clr : "rgba(212,201,168,0.45)",
                      }}>
                      <span style={{ fontSize: "16px" }}>{s.symbol}</span>
                      <span style={{ fontSize: "10px", letterSpacing: "0.5px" }}>{s.name}</span>
                    </button>
                  );
                })}
              </div>
              {selectedSigns.size === 0 && <span style={styles.hint}>select one or more signs</span>}
            </div>
            <button onClick={computeWindows}
              disabled={!birthday || selectedSigns.size === 0}
              style={{ ...styles.button, opacity: !birthday || selectedSigns.size === 0 ? 0.35 : 1,
                cursor: !birthday || selectedSigns.size === 0 ? "not-allowed" : "pointer" }}>
              ☾ Find Conception Windows ☾
            </button>
            <AdSlot />
          </div>
        )}

        {mode === "plan" && showPlanResults && planResults && (
          <div style={styles.resultContainer}>
            <div style={styles.planHeader}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4 }}>
                Conception windows · next 3 years
              </div>
              <div style={{ fontSize: "14px", marginTop: "4px", opacity: 0.7 }}>
                {desiredGender === "Girl" ? "♀" : "♂"} {desiredGender} ·{" "}
                {[...selectedSigns].map((n) => UNIQUE_SIGNS.find((s) => s.name === n)?.symbol).join(" ")}
              </div>
            </div>
            {planResults.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>∅</div>
                <div>No matching windows found in the next 3 years.</div>
                <div style={{ fontSize: "12px", opacity: 0.5, marginTop: "6px" }}>Try adding more signs or switching gender.</div>
              </div>
            ) : (
              <div style={styles.windowList}>
                {planResults.slice(0, 40).map((w, i) => {
                  const days = Math.round((w.endDate - w.startDate) / 86400000) + 1;
                  const clr = ELEMENT_COLORS[w.sign.element];
                  return (
                    <div key={i} style={{ ...styles.windowCard, borderColor: clr }}>
                      <div style={styles.windowTop}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "22px", color: clr }}>{w.sign.symbol}</span>
                          <div>
                            <div style={{ fontSize: "15px", fontWeight: 500, color: "#e8dcc4" }}>{w.sign.name}</div>
                            <div style={{ fontSize: "10px", opacity: 0.4, textTransform: "uppercase", letterSpacing: "1px" }}>{w.sign.element}</div>
                          </div>
                        </div>
                        <div style={{
                          fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                          background: w.gender === "Girl" ? "rgba(212,114,140,0.15)" : "rgba(91,138,191,0.15)",
                          color: w.gender === "Girl" ? "#e88da6" : "#7ab0e0",
                        }}>{w.gender === "Girl" ? "♀" : "♂"} {w.gender}</div>
                      </div>
                      <div style={styles.windowDates}>
                        <div>
                          <div style={styles.windowLabel}>Conceive</div>
                          <div style={{ fontSize: "14px" }}>
                            {fmtShort(w.startDate)}{days > 1 ? ` – ${fmtShort(w.endDate)}` : ""}
                          </div>
                          <div style={{ fontSize: "11px", opacity: 0.35, marginTop: "1px" }}>
                            {days} day{days !== 1 ? "s" : ""} · lunar age {w.lunarAge} (western {w.lunarAge - 1})
                          </div>
                        </div>
                        <div style={{ fontSize: "16px", opacity: 0.2, alignSelf: "center" }}>→</div>
                        <div style={{ textAlign: "right" }}>
                          <div style={styles.windowLabel}>Due ~</div>
                          <div style={{ fontSize: "14px" }}>
                            {fmtShort(w.startDue)}{days > 1 ? ` – ${fmtShort(w.endDue)}` : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {planResults.length > 40 && (
                  <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.3, padding: "8px" }}>
                    +{planResults.length - 40} more windows
                  </div>
                )}
              </div>
            )}
            <AdSlot style={{ marginTop: "4px" }} />
            <button onClick={handleReset} style={styles.resetButton}>↻ Change Criteria</button>
          </div>
        )}

        {/* ═══════════ CHECK PAST ═══════════ */}
        {mode === "chart" && !showPastResult && (
          <div style={styles.form}>
            <p style={styles.chartIntro}>
              Already have a baby? Check if the chart got it right. We'll back-calculate the conception date from their birthday.
            </p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mother's Birthday</label>
              <input type="date" value={pastMomBday}
                onChange={(e) => { setPastMomBday(e.target.value); setShowPastResult(false); }}
                style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Baby's Birthday</label>
              <input type="date" value={pastBabyBday}
                onChange={(e) => { setPastBabyBday(e.target.value); setShowPastResult(false); }}
                style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>How Far Along at Birth</label>
              <div style={styles.weeksRow}>
                <input type="range" min="34" max="43" value={pastWeeks}
                  onChange={(e) => { setPastWeeks(Number(e.target.value)); setShowPastResult(false); }}
                  style={styles.rangeInput} />
                <div style={styles.weeksBadge}>{pastWeeks}w</div>
              </div>
              <span style={styles.hint}>most babies are born between 38–42 weeks</span>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Actual Gender</label>
              <div style={styles.genderRow}>
                {["Boy", "Girl"].map((g) => (
                  <button key={g} onClick={() => { setPastActualGender(g); setShowPastResult(false); }}
                    style={{
                      ...styles.genderBtn,
                      borderColor: pastActualGender === g ? (g === "Girl" ? "#d4728c" : "#5b8abf") : "rgba(255,255,255,0.08)",
                      background: pastActualGender === g ? (g === "Girl" ? "rgba(212,114,140,0.12)" : "rgba(91,138,191,0.12)") : "rgba(255,255,255,0.02)",
                      color: pastActualGender === g ? (g === "Girl" ? "#e88da6" : "#7ab0e0") : "rgba(212,201,168,0.5)",
                    }}>
                    <span style={{ fontSize: "20px" }}>{g === "Girl" ? "♀" : "♂"}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{g}</span>
                  </button>
                ))}
              </div>
            </div>

            {pastResult && pastResult.outOfRange && (
              <div style={styles.errorBox}>Lunar age {pastResult.lunarAge} is outside the chart range (18–45).</div>
            )}

            <button
              onClick={() => pastResult && !pastResult.outOfRange && pastActualGender && setShowPastResult(true)}
              disabled={!pastResult || pastResult.outOfRange || !pastActualGender}
              style={{ ...styles.button,
                opacity: !pastResult || pastResult.outOfRange || !pastActualGender ? 0.35 : 1,
                cursor: !pastResult || pastResult.outOfRange || !pastActualGender ? "not-allowed" : "pointer",
              }}>
              ◷ Check the Chart ◷
            </button>
            <AdSlot />
          </div>
        )}

        {mode === "chart" && showPastResult && pastResult && !pastResult.outOfRange && (
          <div style={styles.resultContainer}>
            {/* Verdict card */}
            {(() => {
              const correct = pastResult.gender === pastActualGender;
              return (
                <div style={{
                  ...styles.card,
                  borderColor: correct ? "#5cb85c" : "rgba(232,93,58,0.5)",
                  background: correct ? "rgba(92,184,92,0.06)" : "rgba(232,93,58,0.06)",
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "8px", lineHeight: 1 }}>
                    {correct ? "✓" : "✗"}
                  </div>
                  <div style={styles.cardLabel}>The Chart Predicted</div>
                  <div style={{
                    ...styles.cardValue,
                    color: pastResult.gender === "Girl" ? "#e88da6" : "#7ab0e0",
                  }}>
                    {pastResult.gender}
                  </div>
                  <div style={{
                    fontSize: "16px", marginTop: "4px",
                    color: correct ? "#7dce7d" : "#e89a7a",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500, letterSpacing: "1px",
                  }}>
                    {correct ? "It was right!" : `Actually: ${pastActualGender}`}
                  </div>
                  <div style={{ ...styles.cardDetail, marginTop: "10px" }}>
                    lunar age {pastResult.lunarAge} (western {pastResult.lunarAge - 1}) × {SHORT_MONTHS[pastResult.month - 1]} conception
                    <br />estimated conception: {fmtDate(pastResult.conceptionDate)}
                  </div>
                </div>
              );
            })()}

            {/* Sun sign card */}
            <div style={{ ...styles.card, borderColor: ELEMENT_COLORS[pastResult.sign.element] }}>
              <div style={{ ...styles.bigSymbol, color: ELEMENT_COLORS[pastResult.sign.element] }}>
                {pastResult.sign.symbol}
              </div>
              <div style={styles.cardLabel}>Sun Sign</div>
              <div style={{ ...styles.cardValue, color: ELEMENT_COLORS[pastResult.sign.element] }}>
                {pastResult.sign.name}
              </div>
              <div style={styles.cardDetail}>{pastResult.sign.element} sign</div>
            </div>

            {/* Mini chart with highlight */}
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, textAlign: "center" }}>Chart Reference</label>
              <div style={styles.chartScroll}>
                <table style={styles.chartTable}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.chartTh, ...styles.chartCorner }}>Age</th>
                      {SHORT_MONTHS.map((m, i) => (
                        <th key={m} style={{
                          ...styles.chartTh,
                          ...(pastResult.month === i + 1 ? styles.chartThHighlight : {}),
                        }}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {AGES.map((age) => {
                      const row = CHART[age];
                      return (
                        <tr key={age}>
                          <td style={{
                            ...styles.chartAge,
                            ...(pastResult.lunarAge === age ? styles.chartAgeHighlight : {}),
                          }}>{age}</td>
                          {Array.from({ length: 12 }).map((_, mi) => {
                            const isGirl = row[mi] === "G";
                            const isHighlighted = pastResult.lunarAge === age && pastResult.month === mi + 1;
                            return (
                              <td key={mi} style={{
                                ...styles.chartCell,
                                background: isHighlighted
                                  ? (isGirl ? "rgba(232,141,166,0.35)" : "rgba(122,176,224,0.35)")
                                  : (isGirl ? "rgba(212,114,140,0.08)" : "rgba(91,138,191,0.08)"),
                                ...(isHighlighted ? styles.chartCellHighlight : {}),
                              }}>
                                <span style={{
                                  color: isGirl ? "#e88da6" : "#7ab0e0",
                                  fontSize: isHighlighted ? "16px" : "13px",
                                  fontWeight: isHighlighted ? 600 : 400,
                                }}>
                                  {isGirl ? "♀" : "♂"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={styles.chartLegend}>
                <span><span style={{ color: "#e88da6" }}>♀</span> Girl</span>
                <span><span style={{ color: "#7ab0e0" }}>♂</span> Boy</span>
                <span style={{ opacity: 0.35, fontSize: "10px" }}>Age = Lunar age (western + 1)</span>
              </div>
            </div>

            <AdSlot style={{ marginTop: "4px" }} />
            <button onClick={handleReset} style={styles.resetButton}>↻ Check Another Baby</button>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <p>Based on the Chinese Gender Calendar, a traditional birth chart said to be over 700 years old.</p>
          <p>Gender prediction is for fun only and has no scientific basis. Sun sign is calculated from baby's actual birthday (past) or estimated due date (predict/plan).</p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.8; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input[type="date"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(0.3) hue-rotate(10deg); cursor: pointer;
        }
        *, *::before, *::after { box-sizing: border-box; }
        table { border-collapse: collapse; }
        input[type="range"] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.1); outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #c9a84c; cursor: pointer; border: 2px solid #0d0f1a;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #c9a84c; cursor: pointer; border: 2px solid #0d0f1a;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════
const styles = {
  container: {
    position: "relative", minHeight: "100vh",
    background: "linear-gradient(170deg, #0d0f1a 0%, #141828 40%, #1a1530 70%, #0d0f1a 100%)",
    fontFamily: "'DM Sans', sans-serif", color: "#d4c9a8", overflow: "hidden",
  },
  stars: { position: "absolute", inset: 0, pointerEvents: "none" },
  star: {
    position: "absolute", background: "radial-gradient(circle, #fffbe6 0%, transparent 70%)",
    borderRadius: "50%", animation: "twinkle ease-in-out infinite",
  },
  content: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "36px 16px 64px" },
  headerGroup: { textAlign: "center", marginBottom: "24px" },
  headerSymbol: { fontSize: "30px", color: "#c9a84c", marginBottom: "4px", opacity: 0.8 },
  title: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 300,
    letterSpacing: "3px", margin: "0 0 4px", color: "#e8dcc4",
  },
  subtitle: { fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 5px", opacity: 0.5, fontWeight: 300 },
  disclaimer: { fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0, opacity: 0.25, fontStyle: "italic" },
  lunarNote: { fontSize: "11px", margin: "8px 0 0", opacity: 0.35, lineHeight: 1.5, fontStyle: "italic", maxWidth: "360px", marginLeft: "auto", marginRight: "auto" },

  modeToggle: {
    display: "flex", gap: "2px", marginBottom: "24px",
    background: "rgba(255,255,255,0.04)", borderRadius: "10px",
    padding: "3px", border: "1px solid rgba(255,255,255,0.06)",
  },
  modeBtn: {
    flex: 1, padding: "10px 12px", background: "transparent", border: "none", borderRadius: "8px",
    color: "rgba(212,201,168,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
    letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s",
  },
  modeBtnActive: { background: "rgba(201,168,76,0.12)", color: "#c9a84c" },

  form: { display: "flex", flexDirection: "column", gap: "20px", animation: "fadeSlideUp 0.6s ease-out" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.6, fontWeight: 500 },
  input: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px",
    padding: "13px 16px", fontSize: "15px", color: "#e8dcc4", fontFamily: "'DM Sans', sans-serif", outline: "none",
  },
  hint: { fontSize: "11px", opacity: 0.35, fontStyle: "italic" },
  weeksRow: { display: "flex", alignItems: "center", gap: "14px" },
  rangeInput: { flex: 1 },
  weeksBadge: {
    minWidth: "44px", textAlign: "center", padding: "6px 10px",
    background: "rgba(201,168,76,0.12)", borderRadius: "6px",
    fontSize: "14px", fontWeight: 500, color: "#c9a84c", letterSpacing: "1px",
  },
  preview: { textAlign: "center", fontSize: "13px", opacity: 0.6, padding: "4px 0" },
  button: {
    background: "linear-gradient(135deg, #c9a84c 0%, #a07c2e 100%)", border: "none", borderRadius: "10px",
    padding: "15px 24px", fontSize: "13px", fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "#0d0f1a", marginTop: "4px", cursor: "pointer",
  },
  errorBox: {
    background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.25)",
    borderRadius: "8px", padding: "12px 16px", fontSize: "13px", textAlign: "center", color: "#e89a7a",
  },
  genderRow: { display: "flex", gap: "10px" },
  genderBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
    padding: "14px 12px", border: "1px solid", borderRadius: "10px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
  },
  signGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" },
  signChip: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    padding: "10px 4px", border: "1px solid", borderRadius: "8px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
  },
  resultContainer: { display: "flex", flexDirection: "column", gap: "14px", animation: "fadeSlideUp 0.7s ease-out" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: "14px", padding: "24px 20px", textAlign: "center" },
  bigSymbol: { fontSize: "42px", marginBottom: "6px", lineHeight: 1 },
  cardLabel: { fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", opacity: 0.4, marginBottom: "3px" },
  cardValue: { fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, letterSpacing: "2px", marginBottom: "4px" },
  cardDetail: { fontSize: "12px", opacity: 0.45, lineHeight: 1.5 },
  cuspNote: { marginTop: "8px", fontSize: "11px", opacity: 0.5, fontStyle: "italic", lineHeight: 1.4 },
  resetButton: {
    background: "none", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px",
    padding: "12px", color: "#c9a84c", fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
    letterSpacing: "1px", cursor: "pointer", opacity: 0.6,
  },
  planHeader: { textAlign: "center", padding: "8px 0 4px" },
  emptyState: {
    textAlign: "center", padding: "32px 16px", background: "rgba(255,255,255,0.02)",
    borderRadius: "12px", fontSize: "14px", opacity: 0.6,
  },
  windowList: { display: "flex", flexDirection: "column", gap: "10px" },
  windowCard: { background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: "12px", padding: "14px 16px" },
  windowTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  windowDates: {
    display: "flex", justifyContent: "space-between", gap: "12px",
    padding: "10px 12px", background: "rgba(0,0,0,0.15)", borderRadius: "8px",
  },
  windowLabel: { fontSize: "10px", opacity: 0.35, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "2px" },

  // Chart mode
  chartIntro: { fontSize: "13px", opacity: 0.5, lineHeight: 1.5, textAlign: "center", margin: 0 },
  chartCallout: {
    textAlign: "center", padding: "10px 16px",
    background: "rgba(255,255,255,0.04)", borderRadius: "10px",
    fontSize: "14px",
  },
  chartScroll: {
    overflowX: "auto", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    WebkitOverflowScrolling: "touch",
  },
  chartTable: { width: "100%", minWidth: "480px", borderCollapse: "collapse" },
  chartTh: {
    padding: "8px 4px", fontSize: "10px", fontWeight: 500,
    letterSpacing: "1px", textTransform: "uppercase",
    color: "rgba(212,201,168,0.5)", textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  chartThHighlight: {
    color: "#c9a84c", background: "rgba(201,168,76,0.08)",
  },
  chartCorner: { width: "36px", position: "sticky", left: 0, zIndex: 2, background: "#141828" },
  chartAge: {
    padding: "6px 8px", fontSize: "12px", fontWeight: 500,
    textAlign: "center", color: "rgba(212,201,168,0.5)",
    position: "sticky", left: 0, zIndex: 1, background: "#141828",
    borderRight: "1px solid rgba(255,255,255,0.04)",
  },
  chartAgeHighlight: { color: "#c9a84c", background: "rgba(201,168,76,0.06)" },
  chartCell: {
    padding: "6px 4px", textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.02)",
    borderRight: "1px solid rgba(255,255,255,0.02)",
    transition: "background 0.2s",
  },
  chartCellHighlight: {
    outline: "2px solid rgba(201,168,76,0.5)",
    outlineOffset: "-2px",
    borderRadius: "3px",
  },
  chartLegend: {
    display: "flex", gap: "16px", justifyContent: "center", alignItems: "center",
    fontSize: "12px", opacity: 0.6, padding: "4px 0",
  },

  footer: {
    marginTop: "40px", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.04)",
    textAlign: "center", fontSize: "10px", opacity: 0.25, lineHeight: 1.6,
  },
};
