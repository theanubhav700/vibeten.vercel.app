import { useState } from "react";
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

export default function App() {
  const [page, setPage]         = useState("terms"); // starts at terms
  const [userName, setUserName] = useState("");

  // Called by TermsPage when user accepts — go to landing
  const handleTermsAccepted = () => {
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
