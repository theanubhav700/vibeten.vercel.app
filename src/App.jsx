import { useState, useEffect } from "react";
import LandingPage    from "./assets/pages/LandingPage";
import CreateAccount  from "./assets/pages/CreateAccount";
import TermsPage      from "./assets/pages/TermsPage";
import HomePage       from "./assets/pages/HomePage";

/*
  Page flow:
  terms  ──(accept)──►  landing  ──(sign in)──────────────────►  home
                                 ──(create account)──►  create  ──►  home
  home   ──(logout)──►  landing
*/

// Restore persisted session from localStorage
function getInitialState() {
  try {
    const termsAccepted = localStorage.getItem("nm_terms_accepted") === "true";
    const currentUser   = JSON.parse(localStorage.getItem("nm_current_user") || "null");

    if (currentUser?.name) {
      return { page: "home", userName: currentUser.name };
    }
    if (termsAccepted) {
      return { page: "landing", userName: "" };
    }
  } catch {
    // ignore parse errors — fall through to default
  }
  return { page: "terms", userName: "" };
}

// ── Mobile blocker overlay ──
function MobileBlocker() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(135deg, #000 0%, #020d1f 60%, #071e3d 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', textAlign: 'center',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>📱</div>
      <h1 style={{
        color: '#e50914', fontSize: 22, fontWeight: 900,
        letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 14px',
      }}>
        NETMUSIC
      </h1>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14, padding: '28px 24px', maxWidth: 320,
      }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🚧</div>
        <p style={{
          color: '#fff', fontSize: 17, fontWeight: 700,
          margin: '0 0 10px', lineHeight: 1.4,
        }}>
          This website is not responsive for mobile
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 13,
          margin: '0 0 20px', lineHeight: 1.6,
        }}>
          We're working on a mobile-friendly version. Please visit us on a desktop or laptop for the best experience.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(229,9,20,0.12)',
          border: '1px solid rgba(229,9,20,0.4)',
          borderRadius: 8, padding: '10px 18px',
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          <span style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>
            Wait for some time…
          </span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 28 }}>
        Made with ❤️ &nbsp;NETMUSIC
      </p>
    </div>
  )
}

export default function App() {
  const initial                 = getInitialState();
  const [page, setPage]         = useState(initial.page);
  const [userName, setUserName] = useState(initial.userName);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show mobile blocker for small screens
  if (isMobile) return <MobileBlocker />;


  // Called by TermsPage when user accepts — go to landing
  const handleTermsAccepted = () => {
    localStorage.setItem("nm_terms_accepted", "true");
    setPage("landing");
  };

  // Called by LandingPage after a successful sign-in
  const handleSignIn = (name) => {
    setUserName(name);
    setPage("home");
  };

  // Called by CreateAccount after the form is submitted successfully — go straight to home
  const handleAccountCreated = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("nm_current_user") || "{}");
      setUserName(saved.name || "");
    } catch {
      setUserName("");
    }
    setPage("home");
  };

  // Called by HomePage on logout — back to landing (terms already accepted)
  const handleLogout = () => {
    localStorage.removeItem("nm_current_user");
    setUserName("");
    setPage("landing");
  };

  switch (page) {
    case "terms":
      return <TermsPage onAccept={handleTermsAccepted} />;

    case "landing":
      return (
        <LandingPage
          onCreateAccount={() => setPage("create")}
          onSignIn={handleSignIn}
        />
      );

    case "create":
      return (
        <CreateAccount
          onBack={() => setPage("landing")}
          onCreated={handleAccountCreated}
        />
      );

    case "home":
      return <HomePage name={userName} onLogout={handleLogout} />;

    default:
      return <TermsPage onAccept={handleTermsAccepted} />;
  }
}
