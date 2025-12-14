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

async function copyText(text){
  try{
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(e){}
  // fallback
  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }catch(e){
    return false;
  }
}

function wireCopyButtons(){
  document.querySelectorAll("[data-copy-target]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-copy-target");
      const el = document.getElementById(id);
      if(!el) return;
      const text = el.textContent || "";
      const ok = await copyText(text.trim());
      const prev = btn.textContent;
      btn.textContent = ok ? "コピーしました" : "コピー失敗";
      setTimeout(()=>btn.textContent = prev, 1300);
    });
  });
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
  const lead = document.getElementById("heroLead");
  const sub = document.getElementById("heroSub");
  if(h1) h1.textContent = c.hero?.headline || "";
  if(lead) lead.textContent = c.hero?.lead || "";
  if(sub) sub.textContent = c.hero?.sub || "";

  // FACTS chips
  const chips = document.getElementById("factsChips");
  if(chips){
    const facts = c.facts || [];
    chips.innerHTML = facts.map(f => `
      <span class="chip"><strong>${escapeHtml(f.label)}</strong> ${escapeHtml(f.value)}</span>
    `).join("");
  }

  // SUMMIT note
  const sn = document.getElementById("summitNote");
  if(sn){
    const note = c.summitNote || "";
    sn.textContent = note;
    sn.style.display = note ? "block" : "none";
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

function wireMediaLink(){
  const a = document.getElementById("mediaPageLink");
  if(!a) return;
  const url = window.PUPPYS_CONFIG?.pages?.media || "./media.html";
  a.href = url;
}

function renderMediaTexts(){
  const m = window.PUPPYS_CONFIG?.mediaTexts;
  if(!m) return;

  const credit = document.getElementById("mediaCredit");
  const t100 = document.getElementById("text100");
  const t200 = document.getElementById("text200");
  const t400 = document.getElementById("text400");

  if(credit) credit.textContent = m.credit || "";
  if(t100) t100.textContent = m.short100 || "";
  if(t200) t200.textContent = m.mid200 || "";
  if(t400) t400.textContent = m.long400 || "";
}



function renderPhotos(){
  const heroWrap = document.getElementById("heroPhotoWrap");
  const heroImg = document.getElementById("heroPhoto");
  const grid = document.getElementById("photoGrid");
  const mWrap = document.getElementById("mascotWrap");
  const mImg = document.getElementById("mascotImg");
  const mf = document.getElementById("mascotFloat");
  const mfImg = document.getElementById("mascotFloatImg");

  const imgs = window.PUPPYS_CONFIG?.siteImages;
  const section = document.getElementById("photosSection");

  // No config -> hide section & hero image
  if(!imgs){
    if(section) section.style.display = "none";
    if(heroWrap) heroWrap.style.display = "none";
    if(mWrap) mWrap.style.display = "none";
    return;
  }

  // HERO
  if(heroWrap && heroImg){
    const src = imgs.heroPhoto || "";
    if(src){
      heroImg.src = src;
      heroImg.alt = imgs.heroPhotoAlt || "POM PUPPYS bright";
      heroWrap.style.display = "block";
    }else{
      heroWrap.style.display = "none";
    }
  }

  // Mascot
  if(mWrap) mWrap.style.display = "none"; // inline mascot is not used
  if(mImg) mImg.src = "";
  if(mf && mfImg){
    const m = imgs.mascot || {};
    if(m.enabled && m.src){
      mfImg.src = m.src;
      mfImg.alt = m.alt || "Mascot";
      mf.style.display = "block";
      mf.setAttribute("aria-hidden","false");
    }else{
      mf.style.display = "none";
      mf.setAttribute("aria-hidden","true");
    }
  }

  // Gallery
  if(!grid || !section) return;
  const list = Array.isArray(imgs.gallery) ? imgs.gallery : [];
  if(list.length === 0){
    section.style.display = "none";
    return;
  }
  section.style.display = "";

  grid.innerHTML = list.map(item=>{
    const title = escapeHtml(item.title || "Photo");
    const src = item.src || "";
    const alt = escapeHtml(item.alt || item.title || "Photo");
    if(src){
      return `
        <figure class="photoCard">
          <img class="photoImg" src="${escapeHtml(src)}" alt="${alt}" loading="lazy" decoding="async"/>
          <figcaption class="photoCap">${title}</figcaption>
        </figure>
      `;
    }
    return `
      <figure class="photoCard photoPlaceholder">
        <div class="photoPhInner">
          <div class="photoPhTitle">${title}</div>
          <div class="photoPhHint muted">assets/photos に画像を追加してください</div>
        </div>
        <figcaption class="photoCap">${title}</figcaption>
      </figure>
    `;
  }).join("");
}




function applyUiFlags(){
  const ui = window.PUPPYS_CONFIG?.ui || {};
  const teamReview = !!ui.teamReviewMode;

  // Dev hints
  const devNotes = document.querySelectorAll(".devOnly");
  devNotes.forEach(el => {
    el.style.display = ui.showDevHints ? "" : "none";
  });

  // Hide Media nav + CTA on official page while team is reviewing
  if(teamReview){
    const navMedia = document.getElementById("navMedia");
    if(navMedia) navMedia.style.display = "none";

    const mediaSection = document.getElementById("mediaCtaSection") || document.getElementById("media");
    // hide only the CTA section at bottom (leave footer contact text)
    if(mediaSection) mediaSection.style.display = "none";
  }
}

function setupLightbox(){
  const ui = window.PUPPYS_CONFIG?.ui || {};
  if(!ui.enableLightbox) return;

  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCap");
  const bg = document.getElementById("lightboxBg");
  const close = document.getElementById("lightboxClose");
  if(!lb || !img || !cap || !bg || !close) return;

  function open(src, caption, alt){
    img.src = src;
    img.alt = alt || caption || "";
    cap.textContent = caption || "";
    lb.classList.add("isOpen");
    lb.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function shut(){
    lb.classList.remove("isOpen");
    lb.setAttribute("aria-hidden","true");
    img.src = "";
    document.body.style.overflow = "";
  }

  bg.addEventListener("click", shut);
  close.addEventListener("click", shut);
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") shut(); });

  // delegate clicks from photo cards
  document.addEventListener("click", (e)=>{
    const t = e.target;
    if(!(t instanceof HTMLElement)) return;
    const imgEl = t.closest(".photoCard")?.querySelector("img.photoImg");
    if(imgEl && imgEl.getAttribute("src")){
      const fig = t.closest("figure");
      const caption = fig?.querySelector(".photoCap")?.textContent || "";
      open(imgEl.getAttribute("src"), caption, imgEl.getAttribute("alt")||caption);
    }
  });
}




function wireInstagram(){
  const a = document.getElementById("instaLink");
  if(!a) return;
  const url = window.PUPPYS_CONFIG?.instagramUrl || "";
  if(url){
    a.href = url;
    a.style.display = "";
  }else{
    a.style.display = "none";
  }
}


function initSite(){
  applyUiFlags();
  renderNews();
  renderCopy();
  wireInstagram();
  renderPhotos();
  setupLightbox();
  wireMediaLink();
  wireWebShare();
}

function initMedia(){
  wireMediaKit();
  wirePressMail();
  renderMediaTexts();
  wireCopyButtons();
}

document.addEventListener("DOMContentLoaded", ()=>{
  // page routing
  if(document.body.dataset.page === "media"){
    initMedia();
  }else{
    initSite();
  }
});
