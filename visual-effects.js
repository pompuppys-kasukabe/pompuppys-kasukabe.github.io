/* 既存の :root 変数等は維持しつつ、以下を追加・上書きしてください */

:root {
  /* リッチなグラデーション追加 */
  --gradient-gold: linear-gradient(135deg, #FFD700 0%, #FDB931 100%);
  --gradient-dark: linear-gradient(to right, #1a1a3e, #2d2a5e);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: 1px solid rgba(255, 255, 255, 0.3);
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Noto Sans JP', sans-serif;
}

/* 全体の質感向上 */
body {
  overflow-x: hidden; /* 横スクロール防止 */
}

/* 背景キャンバス（Three.js用） */
#bgCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

/* --- Typography & Utilities --- */
.text-gradient {
  background: linear-gradient(90deg, var(--pink), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Hero Section (Immersive) --- */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0; /* 余白リセット */
}

.hero__container {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero__kicker {
  font-family: var(--font-heading);
  letter-spacing: 0.3em;
  font-size: 1rem;
  color: var(--navy);
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1;
  font-weight: 900;
  color: var(--navy);
  margin-bottom: 1.5rem;
}

.hero__lead {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--muted);
  margin-bottom: 2.5rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-lg {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

/* Scroll Down Indicator */
.scroll-down {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--navy);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.6;
}
.scroll-down::after {
  content: '';
  width: 1px;
  height: 40px;
  background: var(--navy);
  animation: scrollLine 2s infinite;
}
@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* --- News Ticker --- */
.news-ticker {
  background: var(--navy);
  color: #fff;
  padding: 0.8rem 0;
  overflow: hidden;
  position: relative;
  z-index: 10;
}
.news-ticker .container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.news-ticker__label {
  font-weight: 900;
  color: var(--gold);
  white-space: nowrap;
  padding-right: 1rem;
  border-right: 1px solid rgba(255,255,255,0.2);
}
.news-ticker__content a {
  text-decoration: none;
  color: #fff;
  transition: opacity 0.3s;
}
.news-ticker__content a:hover { opacity: 0.8; }

/* --- Split Layout (About) --- */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
@media (max-width: 900px) {
  .split-layout { grid-template-columns: 1fr; gap: 2rem; }
}

.parallax-img-wrap {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: visible;
}
.parallax-img {
  border-radius: var(--radius-lg);
  box-shadow: 20px 20px 60px rgba(0,0,0,0.1);
  transition: transform 0.5s ease;
}
.parallax-img-wrap:hover .parallax-img {
  transform: scale(1.02);
}

.floating-card {
  position: absolute;
  bottom: -30px;
  right: -30px;
  background: #fff;
  padding: 1.5rem 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  text-align: center;
  animation: floatCard 4s ease-in-out infinite;
}
.floating-card .number {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--gold);
  line-height: 1;
}
.floating-card .label {
  font-size: 0.8rem;
  color: var(--navy);
  font-weight: 700;
}
@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.stats-row {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
  border-top: 1px solid var(--line);
  padding-top: 2rem;
}
.stat-item { display: flex; flex-direction: column; }
.stat-num { font-size: 2rem; font-weight: 900; color: var(--navy); font-family: var(--font-heading); }
.stat-label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; }

/* --- Special Project Section --- */
.special-project-section {
  position: relative;
  background: var(--navy);
  color: #fff;
  padding: 120px 0;
  overflow: hidden;
}
.sp-bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(233, 30, 140, 0.2), transparent 50%);
}
.sp-container {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}
@media (max-width: 900px) {
  .sp-container { flex-direction: column-reverse; }
}

.sp-tag {
  display: inline-block;
  background: var(--gold);
  color: var(--navy);
  padding: 4px 12px;
  font-weight: 800;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.sp-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  font-family: var(--font-heading);
}
.sp-desc {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.mini-progress-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.mini-progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.highlight-text { color: var(--gold); font-size: 1.2rem; }
.mini-bar {
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
}
.mini-bar-fill {
  height: 100%;
  background: var(--gold);
  width: 0%;
  transition: width 1.5s ease;
}
.mini-progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.tilt-card {
  transform: rotate(3deg);
  border-radius: var(--radius-lg);
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  max-width: 100%;
  border: 4px solid rgba(255,255,255,0.1);
}

/* --- Mascot Floating --- */
.mascot-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.mascot-char {
  width: 100px;
  height: 100px; /* 画像のアスペクト比に合わせて調整 */
  cursor: pointer;
  transition: transform 0.3s;
}
.mascot-char:hover {
  transform: scale(1.1) rotate(-5deg);
}
.mascot-char img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
}
.mascot-bubble {
  background: #fff;
  color: var(--navy);
  padding: 10px 16px;
  border-radius: 20px;
  border-bottom-right-radius: 0;
  box-shadow: var(--shadow-md);
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 10px;
  margin-right: 10px;
  position: relative;
  animation: popIn 0.5s ease;
}
.bubble-close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: var(--muted);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
}
@keyframes popIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Animation Utility Classes --- */
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-up.active {
  opacity: 1;
  transform: translateY(0);
}
.delay-1 { transition-delay: 0.2s; }
.delay-2 { transition-delay: 0.4s; }
.delay-3 { transition-delay: 0.6s; }
