import React, { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    // -----------------------------
    // LIVE EVENT TRACKER DATA
    // -----------------------------

    const nodes = [
      {
        x: 0.12,
        y: 0.25,
        label: "SYSTEM",
        status: "ONLINE",
      },
      {
        x: 0.28,
        y: 0.68,
        label: "SERVER",
        status: "READY",
      },
      {
        x: 0.50,
        y: 0.22,
        label: "EVENT",
        status: "UPCOMING",
      },
      {
        x: 0.73,
        y: 0.70,
        label: "LAUNCH",
        status: "PENDING",
      },
      {
        x: 0.89,
        y: 0.32,
        label: "VIBE",
        status: "ACTIVE",
      },
    ];

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.35 + 0.08,
    }));

    const sparks = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: Math.random() * 0.00035 + 0.00012,
      size: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const drawGlow = (x, y, radius, alpha = 0.15) => {
      const gradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

      gradient.addColorStop(0, `rgba(239,68,68,${alpha})`);
      gradient.addColorStop(1, "rgba(239,68,68,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRoute = (a, b, progress) => {
      const x1 = a.x * width;
      const y1 = a.y * height;

      const x2 = b.x * width;
      const y2 = b.y * height;

      // Main route
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = "rgba(239,68,68,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Moving dashed route
      ctx.beginPath();
      ctx.setLineDash([3, 12]);
      ctx.lineDashOffset = -progress * 120;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = "rgba(248,113,113,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.setLineDash([]);

      // Moving tracker point
      const px = x1 + (x2 - x1) * progress;
      const py = y1 + (y2 - y1) * progress;

      drawGlow(px, py, 25, 0.13);

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248,113,113,0.9)";
      ctx.fill();
    };

    const drawNode = (node, index) => {
      const x = node.x * width;
      const y = node.y * height;

      const pulse =
        Math.sin(time * 0.003 + index * 1.4) * 0.5 + 0.5;

      // Outer pulse
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        8 + pulse * 9,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = `rgba(239,68,68,${0.08 + pulse * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glow
      drawGlow(x, y, 38, 0.08 + pulse * 0.04);

      // Core
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248,113,113,0.9)";
      ctx.fill();

      // Small horizontal indicator
      ctx.beginPath();
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 25, y);

      ctx.strokeStyle = "rgba(239,68,68,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Labels
      ctx.font = "9px Arial";
      ctx.letterSpacing = "1px";
      ctx.fillStyle = "rgba(252,165,165,0.35)";
      ctx.fillText(node.label, x + 29, y - 3);

      ctx.font = "7px Arial";
      ctx.fillStyle = "rgba(248,113,113,0.22)";
      ctx.fillText(node.status, x + 29, y + 8);
    };

    const render = () => {
      time += 16;

      ctx.clearRect(0, 0, width, height);

      // --------------------------------
      // BACKGROUND
      // --------------------------------

      const bg = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height)
      );

      bg.addColorStop(0, "rgba(35,8,8,0.35)");
      bg.addColorStop(0.5, "rgba(10,5,5,0.15)");
      bg.addColorStop(1, "rgba(3,3,3,0)");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // --------------------------------
      // ROUTES
      // --------------------------------

      for (let i = 0; i < nodes.length - 1; i++) {
        const progress =
          ((time * 0.00015 + i * 0.18) % 1);

        drawRoute(
          nodes[i],
          nodes[i + 1],
          progress
        );
      }

      // --------------------------------
      // CROSS CONNECTIONS
      // --------------------------------

      const connections = [
        [0, 2],
        [1, 3],
        [2, 4],
      ];

      connections.forEach(([a, b], index) => {
        const n1 = nodes[a];
        const n2 = nodes[b];

        ctx.beginPath();
        ctx.moveTo(n1.x * width, n1.y * height);
        ctx.lineTo(n2.x * width, n2.y * height);

        ctx.setLineDash([2, 18]);
        ctx.lineDashOffset = -(time * 0.01 + index * 40);

        ctx.strokeStyle = "rgba(239,68,68,0.055)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.setLineDash([]);
      });

      // --------------------------------
      // PARTICLES
      // --------------------------------

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          p.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(239,68,68,${p.alpha})`;
        ctx.fill();
      });

      // --------------------------------
      // FLOATING SPARKS
      // --------------------------------

      sparks.forEach((s) => {
        s.y -= s.speed * 8;

        if (s.y < -0.05) {
          s.y = 1.05;
          s.x = Math.random();
        }

        const x = s.x * width;
        const y = s.y * height;

        const flicker =
          0.25 +
          Math.sin(time * 0.003 + s.phase) * 0.2;

        ctx.beginPath();
        ctx.arc(
          x,
          y,
          s.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(248,113,113,${flicker})`;
        ctx.fill();
      });

      // --------------------------------
      // EVENT NODES
      // --------------------------------

      nodes.forEach(drawNode);

      animationFrameId =
        requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="suspended-wrapper">
      {/* Animated background */}
      <canvas
        ref={canvasRef}
        className="canvas-bg"
      />

      <div className="bg-gradient-spot" />
      <div className="grid-overlay" />

      {/* Top live indicator */}
      <div className="live-indicator">
        <span className="live-dot" />
        <span>LIVE EVENT TRACKER</span>
      </div>

      {/* Main Card */}
      <main className="suspended-card">

        {/* Status */}
        <div className="status-container">
          <div className="status-pill">
            <span className="status-dot" />
            vibeten.vercel.app
          </div>
        </div>

        {/* Lock */}
        <div className="lock-wrapper">
          <div className="lock-bg-circle" />

          <svg
            className="lock-svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              ry="2"
            />

            <path d="M7 11V7a5 5 0 0 1 10 0v4" />

            <circle
              cx="12"
              cy="16"
              r="1.5"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="card-title">
          Website Coming Soon
        </h1>

        <p className="card-description">
          Something exciting is being prepared.
          <br />
          Stay tuned for the official launch.
        </p>

        {/* Launch Date */}
        <div className="launch-date">
          <span className="launch-label">
            OFFICIAL LAUNCH
          </span>

          <span className="launch-value">
            01 JANUARY 2027
          </span>
        </div>

        {/* Event status */}
        <div className="event-status">
          <span className="event-status-dot" />
          EVENT SCHEDULED
        </div>

      </main>

      {/* Bottom system text */}
      <div className="system-footer">
        <span>SYS: ONLINE</span>
        <span>NODE: VBT-01</span>
        <span>STATUS: WAITING FOR LAUNCH</span>
      </div>
    </div>
  );
}

export default App;