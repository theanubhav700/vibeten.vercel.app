import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Disable all browser zoom ──

// 1. Ctrl + scroll wheel zoom
window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault()
}, { passive: false })

// 2. Ctrl + Plus / Minus / 0  (keyboard zoom)
window.addEventListener('keydown', (e) => {
  if (
    e.ctrlKey && (
      e.key === '+' ||
      e.key === '-' ||
      e.key === '=' ||
      e.key === '0' ||
      e.code === 'NumpadAdd' ||
      e.code === 'NumpadSubtract' ||
      e.code === 'Numpad0'
    )
  ) {
    e.preventDefault()
  }
})

// 3. Pinch-to-zoom on trackpad / touch (gesturechange for Safari)
window.addEventListener('gesturestart',  (e) => e.preventDefault(), { passive: false })
window.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false })
window.addEventListener('gestureend',    (e) => e.preventDefault(), { passive: false })

// ── Protect source code ──

// 4. Disable right-click context menu
document.addEventListener('contextmenu', (e) => e.preventDefault())

// 5. Disable text selection
document.addEventListener('selectstart', (e) => e.preventDefault())

// 6. Disable drag
document.addEventListener('dragstart', (e) => e.preventDefault())

// 7. Block DevTools keyboard shortcuts & copy/paste/save
window.addEventListener('keydown', (e) => {
  // F12
  if (e.key === 'F12') { e.preventDefault(); return }

  if (e.ctrlKey || e.metaKey) {
    const key = e.key.toLowerCase()
    // Ctrl+U (view source), Ctrl+S (save), Ctrl+A (select all)
    // Ctrl+C (copy), Ctrl+X (cut), Ctrl+P (print)
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (devtools)
    // Ctrl+Shift+K (Firefox console)
    if (['u', 's', 'a', 'c', 'x', 'p'].includes(key)) {
      e.preventDefault()
      return
    }
    if (e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
      e.preventDefault()
      return
    }
  }
})

// 8. Detect DevTools open via window size difference and warn
;(function devToolsDetect() {
  const threshold = 160
  const check = () => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#e50914;font-size:22px;font-family:Arial,sans-serif;font-weight:700;letter-spacing:0.05em;">⛔ Access Denied</div>'
    }
  }
  setInterval(check, 1000)
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
