import { useState, useRef, useEffect } from 'react'
import './HomePage.css'

const firstName = (n = '') => n.trim().split(' ')[0] || 'Friend'

const BOTTOM_ITEMS = [
  { id: 'Home',     label: 'Home',     icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: 'Discover', label: 'Discover', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  )},
  { id: 'LikedMusic', label: 'Liked Music', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )},
  { id: 'History',  label: 'History',  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )},
  { id: 'Followers', label: 'Followers', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { id: 'Following', label: 'Following', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  )},
  { id: 'Premium',  label: 'Premium',  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )},
  { id: 'Downloads', label: 'Downloads', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )},
  { id: 'Settings', label: 'Settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )},
]

export default function HomePage({ name, onLogout }) {
  const nick                      = firstName(name)
  const [showMenu, setShowMenu]   = useState(false)
  const [dark, setDark]           = useState(true)
  const [activeTab, setActiveTab] = useState('Home')
  const [chatOpen, setChatOpen]   = useState(false)
  const [messages, setMessages]   = useState([
    { id: 1, from: 'system', text: `Hey ${nick}! 👋 What are you listening to?` }
  ])
  const [inputVal, setInputVal]   = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef             = useRef(null)

  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatOpen])

  const sendMessage = () => {
    const text = inputVal.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text }])
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Your browser does not support voice search.'); return }
    if (isListening) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setIsListening(true)
    recognition.start()
    recognition.onresult  = (e) => { setSearchVal(e.results[0][0].transcript); setIsListening(false) }
    recognition.onerror   = ()  => setIsListening(false)
    recognition.onend     = ()  => setIsListening(false)
  }

  return (
    <div
      className={`hp-root ${dark ? 'hp-dark' : 'hp-light'}`}
      onClick={() => setShowMenu(false)}
    >

      {/* ══ NAVBAR ══ */}
      <nav className="hp-nav">
        <div className="hp-nav-left">
          <span className="hp-brand">NETMUSIC</span>
        </div>

        <div className="hp-nav-center">
          <div className="hp-searchbar">
            <svg className="hp-searchbar-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              strokeLinejoin="round" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input className="hp-searchbar-input" type="text"
              placeholder="What do you want to play?" aria-label="Search"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button
              className={`hp-mic-btn ${isListening ? 'hp-mic-btn--active' : ''}`}
              onClick={handleMic}
              aria-label="Voice search"
              title="Voice search"
            >
              {isListening ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" stroke="none"/>
                  <path d="M5 10a7 7 0 0014 0"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8"  y1="23" x2="16" y2="23"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8"  y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="hp-nav-right">
          <button className="hp-create-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
            Create
          </button>

          <button className="hp-bell-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>

          <div className="hp-avatar-wrap" onClick={e => { e.stopPropagation(); setShowMenu(v => !v) }}>
            <button className={`hp-nav-avatar ${showMenu ? 'hp-avatar-active' : ''}`} title={nick}>
              {nick[0].toUpperCase()}
            </button>

            {showMenu && (
              <div className="hp-avatar-menu">
                <button className="hp-avatar-menu-item" onClick={e => { e.stopPropagation(); setDark(v => !v) }}>
                  {dark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1"  x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1"  y1="12" x2="3"  y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
                      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  )}
                  {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <div className="hp-avatar-menu-divider" />
                <button className="hp-avatar-menu-item hp-menu-logout" onClick={onLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTENT ══ */}
      <main className="hp-main">
        {/* Main content */}
      </main>

      {/* ══ CHAT PANEL ══ */}
      <div className={`hp-chat-panel ${chatOpen ? 'hp-chat-panel--open' : ''}`}
        onClick={e => e.stopPropagation()}>

        {/* Chat header */}
        <div className="hp-chat-header">
          <div className="hp-chat-header-left">
            <div className="hp-chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <p className="hp-chat-title">NETMUSIC Chat</p>
              <p className="hp-chat-status">
                <span className="hp-chat-online-dot" /> Online
              </p>
            </div>
          </div>
          <button className="hp-chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="hp-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`hp-chat-msg ${msg.from === 'me' ? 'hp-chat-msg--me' : 'hp-chat-msg--them'}`}>
              <span className="hp-chat-bubble">{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="hp-chat-input-row">
          <input
            className="hp-chat-input"
            type="text"
            placeholder="Type a message..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="hp-chat-send" onClick={sendMessage} aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <nav className="hp-bottom-nav">
        {BOTTOM_ITEMS.map(item => (
          <button
            key={item.id}
            className={`hp-bottom-btn ${activeTab === item.id ? 'hp-bottom-btn--active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="hp-bottom-icon">{item.icon}</span>
            <span className="hp-bottom-label">{item.label}</span>
          </button>
        )).reduce((acc, btn, i) => {
          acc.push(btn)
          // insert Chat after Library (index 2)
          if (i === 2) acc.push(
            <button
              key="Chat"
              className={`hp-bottom-btn ${chatOpen ? 'hp-bottom-btn--active' : ''}`}
              onClick={e => { e.stopPropagation(); setChatOpen(v => !v) }}
            >
              <span className="hp-bottom-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </span>
              <span className="hp-bottom-label">Chat</span>
            </button>
          )
          return acc
        }, [])}
      </nav>

    </div>
  )
}
