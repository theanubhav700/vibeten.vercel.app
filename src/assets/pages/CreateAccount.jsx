import { useState } from 'react'
import './CreateAccount.css'

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0112 20C6 20 2 12 2 12a18.8 18.8 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c6 0 10 8 10 8a18.8 18.8 0 01-2.49 3.65M6.53 6.53L17.47 17.47" />
  </svg>
)

export default function CreateAccount({ onBack, onCreated }) {
  const [form, setForm]               = useState({ name: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]           = useState({})
  const [submitted, setSubmitted]     = useState(false)

  // Modal states — same as LandingPage
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showAbout, setShowAbout]           = useState(false)
  const [showTerms, setShowTerms]           = useState(false)

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name     = 'First name is required'
    if (!form.lastName.trim())           e.lastName = 'Last name is required'
    if (!form.email.includes('@'))       e.email    = 'Enter a valid email address'
    if (form.password.length < 6)        e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm)  e.confirm  = 'Passwords do not match'
    return e
  }

  const saveAccount = () => {
    const accounts = JSON.parse(localStorage.getItem('nm_accounts') || '[]')
    const fullName = `${form.name.trim()} ${form.lastName.trim()}`
    const existing = accounts.findIndex(a => a.email.toLowerCase() === form.email.toLowerCase())
    const entry = { name: fullName, email: form.email.toLowerCase(), password: form.password }
    if (existing >= 0) accounts[existing] = entry
    else accounts.push(entry)
    localStorage.setItem('nm_accounts', JSON.stringify(accounts))
    localStorage.setItem('nm_current_user', JSON.stringify({ name: entry.name, email: entry.email }))
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    saveAccount()
    setSubmitted(true)
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="ca-root">
        <div className="ca-success-full">
          <div className="ca-success-orb ca-success-orb-1" />
          <div className="ca-success-orb ca-success-orb-2" />
          <div className="ca-success-orb ca-success-orb-3" />
          {['♪','♫','♩','♬','♭','♮','♯'].map((note, i) => (
            <span key={i} className={`ca-note ca-note-${i + 1}`}>{note}</span>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className={`ca-particle ca-particle-${i + 1}`} />
          ))}
          <div className="ca-ripple-wrap">
            <div className="ca-ripple ca-ripple-1" />
            <div className="ca-ripple ca-ripple-2" />
            <div className="ca-ripple ca-ripple-3" />
          </div>
          <div className="ca-success-card">
            <div className="ca-success-icon-wrap">
              <div className="ca-success-icon-ring" />
              <div className="ca-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" className="ca-check-svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M7 12.5l3.5 3.5 6.5-7" className="ca-check-path" />
                </svg>
              </div>
            </div>
            <div className="ca-equaliser">
              {[1,2,3,4,5,6,7].map(n => (
                <div key={n} className={`ca-eq-bar ca-eq-bar-${n}`} />
              ))}
            </div>
            <h2 className="ca-success-title">
              <span className="ca-title-word ca-tw-1">You're</span>{' '}
              <span className="ca-title-word ca-tw-2">all</span>{' '}
              <span className="ca-title-word ca-tw-3">set!</span>{' '}
              <span className="ca-title-emoji">🎶</span>
            </h2>
            <p className="ca-success-sub">
              Welcome to <span className="ca-red ca-brand-flash">NETMUSIC</span>,{' '}
              <strong className="ca-username">{form.name}</strong>.
              <br />Your music journey starts now.
            </p>
            <div className="ca-waveform">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className={`ca-wave-bar ca-wb-${(i % 7) + 1}`} />
              ))}
            </div>
            <button className="ca-btn-primary ca-btn-listen" onClick={onCreated}>
              <span className="ca-btn-text">Start Listening</span>
              <span className="ca-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              <span className="ca-btn-shine" />
            </button>
            <p className="ca-success-hint">Free forever · No credit card needed</p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Main layout ── */
  return (
    <div className="ca-page">

      {/* ── How It Works Modal ── */}
      {showHowItWorks && (
        <div className="ca-modal-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="ca-modal" onClick={e => e.stopPropagation()}>
            <button className="ca-modal-close" onClick={() => setShowHowItWorks(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="ca-modal-title">How It Works</h2>
            <p className="ca-modal-sub">Get started with NETMUSIC in 3 simple steps</p>
            <div className="ca-modal-steps">
              <div className="ca-modal-step">
                <div className="ca-modal-step-num">01</div>
                <div className="ca-modal-step-icon">📝</div>
                <h3 className="ca-modal-step-title">Create an Account</h3>
                <p className="ca-modal-step-desc">Sign up for free — no credit card needed. Just your name, email and a password.</p>
              </div>
              <div className="ca-modal-step">
                <div className="ca-modal-step-num">02</div>
                <div className="ca-modal-step-icon">🔑</div>
                <h3 className="ca-modal-step-title">Sign In</h3>
                <p className="ca-modal-step-desc">Log in with your credentials and access your personalised music dashboard instantly.</p>
              </div>
              <div className="ca-modal-step">
                <div className="ca-modal-step-num">03</div>
                <div className="ca-modal-step-icon">🎵</div>
                <h3 className="ca-modal-step-title">Start Listening</h3>
                <p className="ca-modal-step-desc">Stream millions of songs, podcasts and playlists — ad-free, anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── About Modal ── */}
      {showAbout && (
        <div className="ca-modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="ca-modal" onClick={e => e.stopPropagation()}>
            <button className="ca-modal-close" onClick={() => setShowAbout(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="ca-modal-title">About NETMUSIC</h2>
            <p className="ca-modal-sub">Your all-in-one music streaming platform</p>
            <div className="ca-about-body">
              <div className="ca-about-logo-row">
                <img src="/favicon.png" alt="NETMUSIC" className="ca-about-logo-img" />
                <span className="ca-about-brand">NETMUSIC</span>
              </div>
              <p className="ca-about-desc">
                NETMUSIC is a modern music streaming platform built for music lovers everywhere.
                We believe great music should be accessible to everyone — free from ads, free from limits.
              </p>
              <div className="ca-about-stats">
                <div className="ca-about-stat"><span className="ca-about-stat-val">10M+</span><span className="ca-about-stat-label">Songs</span></div>
                <div className="ca-about-stat"><span className="ca-about-stat-val">50K+</span><span className="ca-about-stat-label">Artists</span></div>
                <div className="ca-about-stat"><span className="ca-about-stat-val">100+</span><span className="ca-about-stat-label">Countries</span></div>
                <div className="ca-about-stat"><span className="ca-about-stat-val">Free</span><span className="ca-about-stat-label">Forever</span></div>
              </div>
              <p className="ca-about-footer">Made with ❤️ by the <span className="ca-about-red">NETMUSIC</span> team.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Terms Modal ── */}
      {showTerms && (
        <div className="ca-modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="ca-modal ca-modal--scroll" onClick={e => e.stopPropagation()}>
            <button className="ca-modal-close" onClick={() => setShowTerms(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="ca-modal-title">Terms &amp; Conditions</h2>
            <p className="ca-modal-sub">Last updated: September 2026</p>
            <div className="ca-terms-body">
              {[
                ['1. Acceptance of Terms', 'By accessing or using NETMUSIC, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.'],
                ['2. Account Registration', 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activity under your account.'],
                ['3. Acceptable Use', 'You agree not to misuse the platform, attempt to gain unauthorised access, distribute malware, or use the service for any unlawful purpose.'],
                ['4. Intellectual Property', 'All content on NETMUSIC including music, artwork, and logos are protected by copyright. Unauthorised reproduction or distribution is strictly prohibited.'],
                ['5. Privacy', 'We respect your privacy. Your personal data is stored locally and is never shared with third parties without your explicit consent.'],
                ['6. Termination', 'We reserve the right to suspend or terminate accounts that violate these terms without prior notice.'],
              ].map(([heading, text]) => (
                <div className="ca-terms-section" key={heading}>
                  <h3 className="ca-terms-heading">{heading}</h3>
                  <p className="ca-terms-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar — identical to LandingPage ── */}
      <nav className="ca-navbar">
        <div className="ca-navbar-logo">
          <span className="ca-navbar-brand">NETMUSIC</span>
        </div>
        <div className="ca-navbar-right">
          <button className="ca-nav-btn" onClick={onBack}>
            <svg className="ca-nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
            Account Request
          </button>
          <button className="ca-nav-btn">GET PREMIUM</button>
          <button className="ca-nav-btn" onClick={() => setShowHowItWorks(true)}>
            <svg className="ca-nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
            How It Works
          </button>
          <button className="ca-nav-btn" onClick={() => setShowTerms(true)}>
            <svg className="ca-nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Terms
          </button>
          <button className="ca-nav-btn" onClick={() => setShowAbout(true)}>
            <svg className="ca-nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8h.01" /><path d="M11 12h1v4h1" />
            </svg>
            About
          </button>
        </div>
      </nav>

      {/* ── Two-panel card — identical structure to LandingPage hero-card ── */}
      <main className="ca-main">
        <section className="ca-card-wrap">
          <div className="ca-card">

            {/* LEFT — logo panel */}
            <div className="ca-card-left">
              <div className="ca-card-brand-wrap">
                <img src="/favicon.png" alt="NETMUSIC logo" className="ca-card-logo-img" />
                <span className="ca-card-brand-name">NETMUSIC</span>
              </div>
              <p className="ca-card-footer-text">Made with ❤️ <span className="ca-card-footer-brand">NETMUSIC</span></p>
            </div>

            {/* DIVIDER */}
            <div className="ca-card-divider" />

            {/* RIGHT — form panel */}
            <div className="ca-card-right">
              <div className="ca-form-panel">

                <div className="ca-form-header">
                  <h2 className="ca-form-title">Create Account</h2>
                  <p className="ca-form-sub">Join millions of music lovers today.</p>
                </div>

                <form className="ca-form" onSubmit={handleSubmit} noValidate>

                  {/* Name row */}
                  <div className="ca-row-two">
                    {/* First Name */}
                    <div className={`ca-field ${errors.name ? 'ca-field--error' : ''}`}>
                      <label className="ca-label" htmlFor="ca-fname">First name</label>
                      <div className="ca-input-wrap">
                        <span className="ca-input-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </span>
                        <input id="ca-fname" type="text" className="ca-input"
                          placeholder="John" value={form.name}
                          onChange={update('name')} autoComplete="given-name" />
                      </div>
                      {errors.name && <span className="ca-error">{errors.name}</span>}
                    </div>

                    {/* Last Name */}
                    <div className={`ca-field ${errors.lastName ? 'ca-field--error' : ''}`}>
                      <label className="ca-label" htmlFor="ca-lname">Last name</label>
                      <div className="ca-input-wrap">
                        <span className="ca-input-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </span>
                        <input id="ca-lname" type="text" className="ca-input"
                          placeholder="Doe" value={form.lastName}
                          onChange={update('lastName')} autoComplete="family-name" />
                      </div>
                      {errors.lastName && <span className="ca-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`ca-field ${errors.email ? 'ca-field--error' : ''}`}>
                    <label className="ca-label" htmlFor="ca-email">Email Address</label>
                    <div className="ca-input-wrap">
                      <span className="ca-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M2 7l10 7 10-7" />
                        </svg>
                      </span>
                      <input id="ca-email" type="email" className="ca-input"
                        placeholder="abc@gmail.com" value={form.email}
                        onChange={update('email')} autoComplete="email" />
                    </div>
                    {errors.email && <span className="ca-error">{errors.email}</span>}
                  </div>

                  {/* Password row */}
                  <div className="ca-row-two">
                    {/* Password */}
                    <div className={`ca-field ${errors.password ? 'ca-field--error' : ''}`}>
                      <label className="ca-label" htmlFor="ca-pass">Password</label>
                      <div className="ca-input-wrap">
                        <span className="ca-input-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" />
                            <path d="M8 11V7a4 4 0 018 0v4" />
                            <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
                          </svg>
                        </span>
                        <input id="ca-pass" type={showPass ? 'text' : 'password'} className="ca-input"
                          placeholder="Min. 6 chars" value={form.password}
                          onChange={update('password')} autoComplete="new-password" />
                        <button type="button" className="ca-eye-btn"
                          onClick={() => setShowPass(v => !v)}
                          aria-label={showPass ? 'Hide password' : 'Show password'}>
                          {showPass ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {errors.password && <span className="ca-error">{errors.password}</span>}
                    </div>

                    {/* Confirm */}
                    <div className={`ca-field ${errors.confirm ? 'ca-field--error' : ''}`}>
                      <label className="ca-label" htmlFor="ca-confirm">Confirm Password</label>
                      <div className="ca-input-wrap">
                        <span className="ca-input-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" />
                            <path d="M8 11V7a4 4 0 018 0v4" />
                            <path d="M9.5 16l2 2 3-3" />
                          </svg>
                        </span>
                        <input id="ca-confirm" type={showConfirm ? 'text' : 'password'} className="ca-input"
                          placeholder="Repeat password" value={form.confirm}
                          onChange={update('confirm')} autoComplete="new-password" />
                        <button type="button" className="ca-eye-btn"
                          onClick={() => setShowConfirm(v => !v)}
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                          {showConfirm ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {errors.confirm && <span className="ca-error">{errors.confirm}</span>}
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="ca-terms-note">
                    By creating an account you agree to our{' '}
                    <span className="ca-link" onClick={() => setShowTerms(true)}>Terms of Service</span> and{' '}
                    <span className="ca-link" onClick={() => setShowTerms(true)}>Privacy Policy</span>.
                  </p>

                  <button type="submit" className="ca-btn-submit">
                    Create Account
                  </button>
                </form>

                <p className="ca-signin-row">
                  Already have an account?{' '}
                  <button className="ca-signin-link" onClick={onBack}>Sign In</button>
                </p>

              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="ca-footer">
        <div className="ca-footer-line" />
        Made with ❤️ <span className="ca-footer-brand">NETMUSIC</span>
      </footer>

    </div>
  )
}
