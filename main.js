/* main.js */
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

// "2025-12-28" -> "2025.12.28"（空なら空）
function formatDateLabel(dateStr){
  if(!dateStr) return "";
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return `${m[1]}.${m[2]}.${m[3]}`;
}

function renderNews(){
  const wrap = document.getElementById("newsGrid");
  if(!wrap) return;

  const items = window.PUPPYS_CONFIG?.news || [];
  if(!items.length){
    wrap.innerHTML = `<div class="muted">現在お知らせはありません。</div>`;
    return;
  }

  wrap.innerHTML = items.map(n=>{
    const dateLabel = formatDateLabel(n.date);
    const link = n.url ? `<a class="newsLink" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">詳細を見る</a>` : "";
    return `
      <article class="newsItem">
        <div class="newsTop">
          <span class="badge">${escapeHtml(n.tag || "NEWS")}</span>
          ${dateLabel ? `<span class="newsDate">${escapeHtml(dateLabel)}</span>` : `<span></span>`}
        </div>
        <h3 class="newsTitle">${escapeHtml(n.title || "")}</h3>
        ${n.body ? `<p class="newsBody">${escapeHtml(n.body)}</p>` : ``}
        ${link}
      </article>
    `;
  }).join("");
}

function renderCopy(){
  const c = window.PUPPYS_CONFIG?.copy;
  if(!c) return;

  // HERO
  const h1 = document.getElementById("heroHeadline");
  const sub = document.getElementById("heroSub");
  if(h1) h1.textContent = c.hero?.headline || "";
  if(sub){
    const lead = escapeHtml(c.hero?.lead || "");
    const s = escapeHtml(c.hero?.sub || "");
    sub.innerHTML = `${lead}<br/>${s}`;
  }

  // FACTS chips
  const chips = document.getElementById("factsChips");
  if(chips){
    const facts = c.facts || [];
    chips.innerHTML = facts.map(f => `
      <span class="chip"><strong>${escapeHtml(f.label)}</strong> ${escapeHtml(f.value)}</span>
    `).join("");
  }

  // ABOUT
  const at = document.getElementById("aboutTitle");
  const ab = document.getElementById("aboutBody");
  const an = document.getElementById("aboutNote");
  if(at) at.textContent = c.about?.title || "";
  if(ab){
    const lines = c.about?.body || [];
    ab.innerHTML = lines.map(t => `${escapeHtml(t)}<br/>`).join("");
  }
  if(an){
    const note = c.about?.note || "";
    an.style.display = note ? "block" : "none";
    an.textContent = note;
  }

  // STORY
  const st = document.getElementById("storyTitle");
  if(st) st.textContent = c.story?.title || "STORY";

  const sb = document.getElementById("storyBody");
  if(sb){
    const lines = c.story?.body || [];
    sb.innerHTML = lines.map(t => `${escapeHtml(t)}<br/>`).join("");
  }

  const ip = document.getElementById("interviewPoints");
  if(ip){
    const pts = c.story?.interviewPoints || [];
    ip.innerHTML = pts.map(t => `<li>${escapeHtml(t)}</li>`).join("");
  }

  // TIMELINE
  const tl = document.getElementById("timelineList");
  if(tl){
    const rows = c.timeline || [];
    tl.innerHTML = rows.map(r => `<li><strong>${escapeHtml(r.year)}</strong>：${escapeHtml(r.text)}</li>`).join("");
  }
}

function wireMediaKit(){
  const url = window.PUPPYS_CONFIG?.mediaKitUrl;
  const btn = document.getElementById("mediaKitBtn");
  if(!btn) return;
  if(!url){
    btn.style.display = "none";
    return;
  }
  btn.href = url;
}

function wirePressMail(){
  const email = window.PUPPYS_CONFIG?.pressEmail;
  const name = window.PUPPYS_CONFIG?.pressContactName || "";
  const btn = document.getElementById("pressMailBtn");
  if(!btn || !email) return;
  const subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  const body = encodeURIComponent(`取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n（署名）\n${name}`);
  btn.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function wireWebShare(){
  const btn = document.getElementById("shareBtn");
  if(!btn) return;

  const title = document.title;
  const text = "POM PUPPYS bright 公式サイト";
  const url = location.href;

  btn.style.display = "inline-flex";

  btn.addEventListener("click", async ()=>{
    try{
      if(navigator.share){
        await navigator.share({ title, text, url });
      }else{
        await navigator.clipboard.writeText(url);
        const prev = btn.textContent;
        btn.textContent = "URLをコピーしました";
        setTimeout(()=>btn.textContent = prev || "共有", 1400);
      }
    }catch(e){
      // user cancel -> ignore
    }
  });
}

function initSite(){
  renderNews();
  renderCopy();
  wireMediaKit();
  wirePressMail();
  wireWebShare();
}

document.addEventListener("DOMContentLoaded", initSite);
