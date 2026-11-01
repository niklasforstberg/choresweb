import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import "../styles/landing.css";

const PINK = { "--chip": "#e6007a", "--chip-on": "#ffffff" } as React.CSSProperties;
const BLUE = { "--chip": "#0a6cf0", "--chip-on": "#ffffff" } as React.CSSProperties;

// The fridge with its sheet, printed as three separate plates. On load they slide in from
// off-register and stop a hair apart, the way a riso print never quite lines up.
function FridgePrint() {
  const sheet = "rotate(-4 180 230)";
  return (
    <svg className="fridge" viewBox="0 0 360 450" role="img" aria-hidden="true">
      <defs>
        <pattern id="dots-sun" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.6" style={{ fill: "var(--sun)" }} />
        </pattern>
        <pattern id="dots-pink" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" style={{ fill: "var(--pink)" }} />
        </pattern>
        <pattern id="dots-blue" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" style={{ fill: "var(--blue)" }} />
        </pattern>
      </defs>

      <g className="plate plate-sun">
        <circle cx="300" cy="64" r="62" fill="url(#dots-sun)" />
        <rect x="44" y="24" width="272" height="404" rx="30" style={{ fill: "var(--sun)" }} />
      </g>

      {/* The sheet is bare paper: nothing printed there but what the other plates put on it. */}
      <rect x="96" y="108" width="168" height="232" rx="3" transform={sheet} style={{ fill: "var(--paper)" }} />

      <g className="plate plate-blue">
        <circle cx="70" cy="404" r="58" fill="url(#dots-blue)" />
        <rect x="44" y="24" width="272" height="404" rx="30" fill="none" style={{ stroke: "var(--blue)" }} strokeWidth="6" />
        <line x1="44" y1="92" x2="316" y2="92" style={{ stroke: "var(--blue)" }} strokeWidth="6" />
        <rect x="62" y="40" width="9" height="36" rx="4.5" style={{ fill: "var(--blue)" }} />
        <rect x="62" y="112" width="9" height="96" rx="4.5" style={{ fill: "var(--blue)" }} />
        <g transform={sheet} style={{ stroke: "var(--blue)" }} strokeWidth="2">
          {[150, 190, 230, 270, 310].map(y => <line key={y} x1="108" y1={y} x2="252" y2={y} />)}
          <line x1="150" y1="134" x2="150" y2="328" />
          <rect x="112" y="138" width="30" height="6" rx="3" style={{ fill: "var(--blue)" }} stroke="none" />
          <circle cx="216" cy="210" r="11" style={{ fill: "var(--blue)" }} stroke="none" />
          <circle cx="186" cy="290" r="11" fill="none" strokeDasharray="4 3" strokeWidth="2.5" />
          {[170, 210, 250, 290].map(y => <rect key={y} x="114" y={y - 3} width="26" height="6" rx="3" style={{ fill: "var(--blue)" }} stroke="none" />)}
        </g>
      </g>

      <g className="plate plate-pink">
        <circle cx="180" cy="112" r="15" style={{ fill: "var(--pink)" }} />
        <g transform={sheet}>
          <circle cx="174" cy="170" r="11" style={{ fill: "var(--pink)" }} />
          <circle cx="234" cy="170" r="11" style={{ fill: "var(--pink)" }} />
          <circle cx="192" cy="250" r="11" style={{ fill: "var(--pink)" }} />
          <circle cx="226" cy="290" r="11" fill="none" style={{ stroke: "var(--pink)" }} strokeDasharray="4 3" strokeWidth="2.5" />
        </g>
        <rect x="236" y="356" width="64" height="48" rx="8" fill="url(#dots-pink)" />
      </g>
    </svg>
  );
}

// The three inks and what they make overprinted: where every member's colour comes from.
function Overprint() {
  return (
    <svg className="overprint" viewBox="0 0 300 280" role="img" aria-hidden="true">
      <circle className="ink" cx="150" cy="96" r="78" style={{ fill: "var(--pink)" }} />
      <circle className="ink" cx="104" cy="178" r="78" style={{ fill: "var(--blue)" }} />
      <circle className="ink" cx="196" cy="178" r="78" style={{ fill: "var(--sun)" }} />
    </svg>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const weekdays = t("landing.weekdays").split(" ");

  return (
    <div className="landing">
      <header className="landing-header">
        <span className="wordmark landing-wordmark" data-text={t("common.appName")}>{t("common.appName")}</span>
        <Link className="btn-ghost" to="/login">{t("auth.login")}</Link>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>{t("landing.title")}</h1>
          <p className="hero-lead">{t("landing.lead")}</p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/register">{t("auth.register")}</Link>
            <Link className="btn-ghost" to="/login">{t("auth.login")}</Link>
          </div>
        </div>
        <FridgePrint />
      </section>

      <section className="features" aria-label={t("landing.featuresLabel")}>
        <article className="feature feature-day">
          <div className="feature-visual halftone-sun">
            <div className="demo-strip">
              {weekdays.map((d, i) => (
                <span key={d} className={`day-tab${i === 3 ? " today" : ""}${i === 4 ? " selected" : ""}`}>
                  <span className="weekday">{d}</span><span>{12 + i}</span>
                </span>
              ))}
            </div>
            <div className="demo-row">
              <span className="chore-title">{t("landing.choreKitchen")}</span>
              <span className="cell">
                <span className="chip done" style={PINK}><span className="chip-main">H<Check size={12} /></span></span>
                <span className="chip" style={BLUE}><span className="chip-main">O</span></span>
              </span>
            </div>
          </div>
          <h2>{t("landing.dayTitle")}</h2>
          <p>{t("landing.dayText")}</p>
        </article>

        <article className="feature feature-quota">
          <div className="feature-visual halftone-pink">
            <div className="demo-quota">
              <span className="chore-title">{t("landing.choreCook")} <span className="muted">×3</span></span>
              <span className="quota quota-big" style={PINK}>
                <span className="on" /><span className="on" /><span />
              </span>
            </div>
          </div>
          <h2>{t("landing.quotaTitle")}</h2>
          <p>{t("landing.quotaText")}</p>
        </article>

        <article className="feature feature-forgot">
          <div className="feature-visual halftone-blue">
            <span className="chip done chip-big" style={BLUE}>
              <span className="chip-main">O<Check size={18} /><span className="chip-by">{t("week.by", { label: "H" })}</span></span>
            </span>
          </div>
          <h2>{t("landing.forgotTitle")}</h2>
          <p>{t("landing.forgotText")}</p>
        </article>

        <article className="feature feature-summary">
          <div className="feature-visual halftone-purple">
            <div className="demo-bars">
              {[
                { name: t("landing.choreKitchen"), h: 3, o: 3 },
                { name: t("landing.choreCook"), h: 2, o: 1 },
                { name: t("landing.choreTrash"), h: 1, o: 3 },
              ].map(r => (
                <div key={r.name} className="bar-row">
                  <span>{r.name}</span>
                  <span className="bar">
                    <span style={{ flexGrow: r.h, background: "var(--pink)" }}>{r.h}</span>
                    <span style={{ flexGrow: r.o, background: "var(--blue)" }}>{r.o}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <h2>{t("landing.summaryTitle")}</h2>
          <p>{t("landing.summaryText")}</p>
        </article>
      </section>

      <section className="colours">
        <Overprint />
        <div>
          <h2>{t("landing.coloursTitle")}</h2>
          <p>{t("landing.coloursText")}</p>
        </div>
      </section>

      <section className="invite">
        <h2>{t("landing.inviteTitle")}</h2>
        <p>{t("landing.inviteText")}</p>
        <p className="invite-demo" aria-label={t("landing.inviteExample")}>
          {"KX7PW4MN".split("").map((c, i) => <span key={i}>{c}</span>)}
        </p>
      </section>

      <section className="closing">
        <h2>{t("landing.closingTitle")}</h2>
        <Link className="btn-primary" to="/register">{t("auth.register")}</Link>
      </section>
    </div>
  );
}
