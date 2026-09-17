import { useState, useEffect } from 'react'
import './LandingPage.css'

const T = {
  English: {
    brand:          'NETMUSIC',
    accountRequest: 'GET PREMIUM',
    heroTitle:      <>Unlimited music,<br />podcasts, and more</>,
    heroSub:        'Listen anywhere, anytime.',
    heroCta:        'Ready to listen? Sign in or create a free account.',
    emailPlaceholder:    'Email address',
    emailLabel:          'Email address',
    passwordPlaceholder: 'Password',
    passwordLabel:       'Password',
    signIn:         'Sign In',
    newHere:        'New here?',
    createAccount:  'Create a free account',
    showPassword:   'Show password',
    hidePassword:   'Hide password',
  },
}

const REASONS = [
  {
    title: 'Ad-Free Music',
    desc:  'Enjoy unlimited songs without a single interruption. Pure music, zero ads.',
    icon:  '🎵',
  },
  {
    title: 'Listen Offline',
    desc:  'Download your favourite tracks and playlists. Play without internet.',
    icon:  '📥',
  },
  {
    title: 'Hi-Fi Audio Quality',
    desc:  'Experience studio-grade sound with lossless & high-bitrate streaming.',
    icon:  '🎧',
  },
  {
    title: 'Cross-Device Sync',
    desc:  'Seamlessly switch between phone, tablet, laptop and smart speakers.',
    icon:  '📱',
  },
]

const TRENDING = [
  { rank: '01', label: 'Blinding Lights',  color: '#1a0a2e' },
  { rank: '02', label: 'Levitating',       color: '#0a1a2e' },
  { rank: '03', label: 'Stay',             color: '#1a1a0a' },
  { rank: '04', label: 'Heat Waves',       color: '#0a1a1a' },
  { rank: '05', label: 'As It Was',        color: '#1a0a0a' },
  { rank: '06', label: 'Flowers',          color: '#0a0a1a' },
  { rank: '07', label: 'Cruel Summer',     color: '#1a150a' },
  { rank: '08', label: 'Anti-Hero',        color: '#150a1a' },
]

export default function LandingPage({ onCreateAccount, onSignIn }) {
  const [loading, setLoading]     = useState(true)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [signInError, setSignInError] = useState('')
  const [requestCount, setRequestCount] = useState(0)

  // Count pending account requests from localStorage
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('nm_accounts') || '[]')
    setRequestCount(accounts.length)
  }, [])

  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showAbout, setShowAbout]           = useState(false)
  const [showTerms, setShowTerms]           = useState(false)

  // drag-scroll state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX]         = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const txt = T.English

  // ── Sign In handler ──
  const handleSignIn = () => {
    setSignInError('')
    if (!email.trim()) { setSignInError('Please enter your email.'); return }
    if (!password)     { setSignInError('Please enter your password.'); return }

    const accounts = JSON.parse(localStorage.getItem('nm_accounts') || '[]')
    const match = accounts.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    )
    if (!match) {
      setSignInError('Incorrect email or password. Please try again.')
      return
    }
    // save current user and proceed to greeting
    localStorage.setItem('nm_current_user', JSON.stringify({ name: match.name, email: match.email }))
    onSignIn(match.name)
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const onMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - e.currentTarget.offsetLeft)
    setScrollLeft(e.currentTarget.scrollLeft)
  }
  const onMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x    = e.pageX - e.currentTarget.offsetLeft
    const walk = (x - startX) * 1.4
    e.currentTarget.scrollLeft = scrollLeft - walk
  }
  const stopDrag = () => setIsDragging(false)

  return (
    <div className="landing-root">
      {/* ── How It Works Modal ── */}
      {showHowItWorks && (
        <div className="hiw-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="hiw-modal" onClick={e => e.stopPropagation()}>
            <button className="hiw-close" onClick={() => setShowHowItWorks(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="hiw-title">How It Works</h2>
            <p className="hiw-sub">Get started with NETMUSIC in 3 simple steps</p>
            <div className="hiw-steps">
              <div className="hiw-step">
                <div className="hiw-step-num">01</div>
                <div className="hiw-step-icon">📝</div>
                <h3 className="hiw-step-title">Create an Account</h3>
                <p className="hiw-step-desc">Sign up for free — no credit card needed. Just your name, email and a password.</p>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">02</div>
                <div className="hiw-step-icon">🔑</div>
                <h3 className="hiw-step-title">Sign In</h3>
                <p className="hiw-step-desc">Log in with your credentials and access your personalised music dashboard instantly.</p>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">03</div>
                <div className="hiw-step-icon">🎵</div>
                <h3 className="hiw-step-title">Start Listening</h3>
                <p className="hiw-step-desc">Stream millions of songs, podcasts and playlists — ad-free, anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── About Modal ── */}
      {showAbout && (
        <div className="hiw-overlay" onClick={() => setShowAbout(false)}>
          <div className="hiw-modal" onClick={e => e.stopPropagation()}>
            <button className="hiw-close" onClick={() => setShowAbout(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="hiw-title">About NETMUSIC</h2>
            <p className="hiw-sub">Your all-in-one music streaming platform</p>
            <div className="about-body">
              <div className="about-logo-row">
                <img src="/favicon.png" alt="NETMUSIC" className="about-logo-img" />
                <span className="about-brand">NETMUSIC</span>
              </div>
              <p className="about-desc">
                NETMUSIC is a modern music streaming platform built for music lovers everywhere.
                We believe great music should be accessible to everyone — free from ads, free from limits.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <span className="about-stat-val">10M+</span>
                  <span className="about-stat-label">Songs</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-val">50K+</span>
                  <span className="about-stat-label">Artists</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-val">100+</span>
                  <span className="about-stat-label">Countries</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-val">Free</span>
                  <span className="about-stat-label">Forever</span>
                </div>
              </div>
              <p className="about-footer">Made with ❤️ by the <span className="about-red">NETMUSIC</span> team.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Terms & Conditions Modal ── */}
      {showTerms && (
        <div className="hiw-overlay" onClick={() => setShowTerms(false)}>
          <div className="hiw-modal terms-modal" onClick={e => e.stopPropagation()}>
            <button className="hiw-close" onClick={() => setShowTerms(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="hiw-title">Terms &amp; Conditions</h2>
            <p className="hiw-sub">Last updated: September 2026</p>
            <div className="terms-body">
              <div className="terms-section">
                <h3 className="terms-heading">1. Acceptance of Terms</h3>
                <p className="terms-text">By accessing or using NETMUSIC, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.</p>
              </div>
              <div className="terms-section">
                <h3 className="terms-heading">2. Account Registration</h3>
                <p className="terms-text">You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</p>
              </div>
              <div className="terms-section">
                <h3 className="terms-heading">3. Acceptable Use</h3>
                <p className="terms-text">You agree not to misuse the platform, attempt to gain unauthorised access, distribute malware, or use the service for any unlawful purpose.</p>
              </div>
              <div className="terms-section">
                <h3 className="terms-heading">4. Intellectual Property</h3>
                <p className="terms-text">All content on NETMUSIC including music, artwork, and logos are protected by copyright. Unauthorised reproduction or distribution is strictly prohibited.</p>
              </div>
              <div className="terms-section">
                <h3 className="terms-heading">5. Privacy</h3>
                <p className="terms-text">We respect your privacy. Your personal data is stored locally and is never shared with third parties without your explicit consent.</p>
              </div>
              <div className="terms-section">
                <h3 className="terms-heading">6. Termination</h3>
                <p className="terms-text">We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="brand-logo">{txt.brand}</span>
        </div>
        <div className="landing-nav-right">
          <button className="nav-btn" onClick={onCreateAccount}>
            <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
            Account Request
          </button>
          <button className="nav-btn">{txt.accountRequest}</button>
          <button className="nav-btn" onClick={() => setShowHowItWorks(true)}>
            <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            How It Works
          </button>
          <button className="nav-btn" onClick={() => setShowTerms(true)}>
            <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Terms
          </button>
          <button className="nav-btn" onClick={() => setShowAbout(true)}>
            <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8h.01" />
              <path d="M11 12h1v4h1" />
            </svg>
            About
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="landing-main">
        {loading ? (
          <div className="spinner-wrapper" aria-label="Loading" role="status">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* ── Hero Card (Spotify-style) ── */}
            <section className="hero-card-wrap">
              <div className="hero-card">

                {/* LEFT — text + form */}
                <div className="hero-card-left">
                  <h1 className="hero-title">{txt.heroTitle}</h1>
                  <p className="hero-sub">{txt.heroSub}</p>
                  <p className="hero-cta-text">{txt.heroCta}</p>

                  {/* Email input */}
                  <div className="hero-input-group">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 7l10 7 10-7" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder={txt.emailPlaceholder}
                      className="hero-icon-input"
                      aria-label={txt.emailLabel}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password input */}
                  <div className="hero-input-group">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                        <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder={txt.passwordPlaceholder}
                      className="hero-icon-input"
                      aria-label={txt.passwordLabel}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="input-eye-btn"
                      onClick={() => setShowPass(v => !v)}
                      aria-label={showPass ? txt.hidePassword : txt.showPassword}
                    >
                      {showPass ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0112 20C6 20 2 12 2 12a18.8 18.8 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c6 0 10 8 10 8a18.8 18.8 0 01-2.49 3.65M6.53 6.53L17.47 17.47" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <button className="hero-get-started-btn hero-signin-btn" onClick={handleSignIn}>
                    {txt.signIn} &nbsp;›
                  </button>

                  {signInError && (
                    <p className="signin-error">{signInError}</p>
                  )}

                  <p className="hero-create-link">
                    {txt.newHere}{' '}
                    <button className="create-account-link" onClick={onCreateAccount}>
                      {txt.createAccount}
                    </button>
                  </p>
                </div>

                {/* DIVIDER */}
                <div className="hero-card-divider" />

                {/* RIGHT — brand logo area */}
                <div className="hero-card-right">
                  <div className="hero-card-brand-wrap">
                    <img
                      src="/favicon.png"
                      alt="NETMUSIC logo"
                      className="hero-card-logo-img"
                    />
                    <span className="hero-card-brand-name">NETMUSIC</span>
                  </div>
                  <p className="hero-card-footer-text">Made with ❤️ <span className="hero-card-footer-brand">NETMUSIC</span></p>
                </div>

              </div>
            </section>

          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-line" />
        Made with ❤️ <span className="landing-footer-brand">NETMUSIC</span>
      </footer>

    </div>
  )
}
