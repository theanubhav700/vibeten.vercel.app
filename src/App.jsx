import { useState } from "react";
import LandingPage    from "./assets/pages/LandingPage";
import CreateAccount  from "./assets/pages/CreateAccount";
import TermsPage      from "./assets/pages/TermsPage";
import HomePage       from "./assets/pages/HomePage";

/*
  Page flow:
  landing  ──(create account)──►  create  ──(submitted)──►  terms  ──(accept)──►  home
  landing  ──(sign in)──────────────────────────────────────────────────────────►  home
  home     ──(logout)────────────────────────────────────────────────────────────► landing
*/

export default function App() {
  const [page, setPage]         = useState("landing"); // landing | create | terms | home
  const [userName, setUserName] = useState("");

  // Called by LandingPage after a successful sign-in
  const handleSignIn = (name) => {
    setUserName(name);
    setPage("home");
  };

  // Called by CreateAccount after the form is submitted successfully
  const handleAccountCreated = () => {
    setPage("terms");
  };

  // Called by TermsPage after the user accepts
  const handleTermsAccepted = () => {
    // CreateAccount already saved nm_current_user, read the name back
    try {
      const saved = JSON.parse(localStorage.getItem("nm_current_user") || "{}");
      setUserName(saved.name || "");
    } catch {
      setUserName("");
    }
    setPage("home");
  };

  // Called by HomePage on logout
  const handleLogout = () => {
    localStorage.removeItem("nm_current_user");
    setUserName("");
    setPage("landing");
  };

  switch (page) {
    case "create":
      return (
        <CreateAccount
          onBack={() => setPage("landing")}
          onCreated={handleAccountCreated}
        />
      );

    case "terms":
      return <TermsPage onAccept={handleTermsAccepted} />;

    case "home":
      return <HomePage name={userName} onLogout={handleLogout} />;

    case "landing":
    default:
      return (
        <LandingPage
          onCreateAccount={() => setPage("create")}
          onSignIn={handleSignIn}
        />
      );
  }
}
