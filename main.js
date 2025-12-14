function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

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

  const h1 = document.getElementById("heroHeadline");
  const lead = document.getElementById("heroLead");
  const sub = document.getElementById("heroSub");
  if(h1) h1.textContent = c.hero?.headline || "";
  if(lead) lead.textContent = c.hero?.lead || "";
  if(sub) sub.textContent = c.hero?.sub || "";

  const chips = document.getElementById("factsChips");
  if(chips){
    const facts = c.facts || [];
    chips.innerHTML = facts.map(f => `
      <span class="chip"><strong>${escapeHtml(f.label)}</strong> ${escapeHtml(f.value)}</span>
    `).join("");
  }

  const kf = document.getElementById("keyFactsList");
  if(kf){
    const facts = c.facts || [];
    kf.innerHTML = facts.map(f =>
      `<li><span class="keyFacts__label">${escapeHtml(f.label)}</span><span class="keyFacts__value">${escapeHtml(f.value)}</span></li>`
    ).join("");
  }

  const sn = document.getElementById("summitNote");
  if(sn){
    const note = c.summitNote || "";
    sn.textContent = note;
    sn.style.display = note ? "block" : "none";
  }

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
  const ui = window.PUPPYS_CONFIG?.ui || {};
  const btn = document.getElementById("shareBtn");
  if(!btn) return;

  if(ui.showShareButton === false){
    btn.style.display = "none";
    return;
  }

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
    }catch(e){}
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

/** Hero: video/image auto (supports both legacy ids) */
function renderHeroMedia(){
  const imgs = window.PUPPYS_CONFIG?.siteImages;
  if(!imgs) return;

  const wrap = document.getElementById("heroMediaWrap");   // new
  const v = document.getElementById("heroVideo");          // new
  const img = document.getElementById("heroPhoto");        // reused id

  // legacy fallback
  const legacyWrap = document.getElementById("heroPhotoWrap");
  const legacyImg = document.getElementById("heroPhoto");

  const heroImgSrc = imgs.heroImage || imgs.heroPhoto || "";
  const heroImgAlt = imgs.heroImageAlt || imgs.heroPhotoAlt || "POM PUPPYS bright";
  const heroVid = imgs.heroVideo || {};

  const showImage = (w, imageEl)=>{
    if(!w || !imageEl) return;
    if(heroImgSrc){
      imageEl.src = heroImgSrc;
      imageEl.alt = heroImgAlt;
      imageEl.style.display = "block";
      w.style.display = "block";
      try{ w.style.setProperty("--hero-bg", `url("${heroImgSrc}")`); }catch(e){}
    }else{
      w.style.display = "none";
    }
  };

  // New markup available
  if(wrap && v && img){
    const useVideo = !!heroVid.enabled && (!!heroVid.mp4 || !!heroVid.webm);
    if(useVideo){
      wrap.style.display = "block";
      img.style.display = "none";
      v.style.display = "block";
      v.muted = true;
      v.playsInline = true;
      v.loop = heroVid.loop !== false;
      v.preload = "metadata";
      if(heroVid.poster) v.setAttribute("poster", heroVid.poster);

      v.innerHTML = "";
      if(heroVid.webm){
        const s = document.createElement("source");
        s.src = heroVid.webm;
        s.type = "video/webm";
        v.appendChild(s);
      }
      if(heroVid.mp4){
        const s = document.createElement("source");
        s.src = heroVid.mp4;
        s.type = "video/mp4";
        v.appendChild(s);
      }

      const bg = heroVid.poster || heroImgSrc;
      if(bg){
        try{ wrap.style.setProperty("--hero-bg", `url("${bg}")`); }catch(e){}
      }

      v.play().catch(()=>{ /* poster only */ });
    }else{
      v.style.display = "none";
      showImage(wrap, img);
    }
    return;
  }

  // Legacy markup
  if(legacyWrap && legacyImg){
    showImage(legacyWrap, legacyImg);
  }
}

function renderPhotos(){
  const grid = document.getElementById("photoGrid");
  const section = document.getElementById("photosSection");
  const mf = document.getElementById("mascotFloat");
  const mfImg = document.getElementById("mascotFloatImg");

  const imgs = window.PUPPYS_CONFIG?.siteImages;

  if(!imgs){
    if(section) section.style.display = "none";
    return;
  }

  // gallery
  if(grid && section){
    const list = Array.isArray(imgs.gallery) ? imgs.gallery : [];
    if(list.length === 0){
      section.style.display = "none";
    }else{
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
  }

  // mascot floating
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
}

function setupLightbox(){
  const ui = window.PUPPYS_CONFIG?.ui || {};
  if(ui.enableLightbox === false) return;

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

function renderSponsors(){
  const grid = document.getElementById("sponsorsGrid");
  if(!grid) return;

  const s = window.PUPPYS_CONFIG?.sponsors;
  const sec = document.getElementById("sponsors");
  if(!s || !s.enabled){
    if(sec) sec.style.display = "none";
    return;
  }

  const title = document.getElementById("sponsorsTitle");
  if(title) title.textContent = s.title || "スポンサー / 協賛";

  const note = document.getElementById("sponsorsNote");
  if(note){
    note.textContent = s.note || "";
    note.style.display = note.textContent ? "block" : "none";
  }

  const today = new Date();
  const items = (Array.isArray(s.items) ? s.items : []).filter(it=>{
    if(it.approved === false) return false;
    if(it.showOnOfficial === false) return false;
    const exp = new Date(String(it.expiresAt || ""));
    if(isFinite(exp.getTime()) && exp.getTime() < today.getTime()) return false;
    return true;
  });

  if(!items.length){
    grid.innerHTML = `<div class="muted">協賛企業を募集しています。</div>`;
    return;
  }

  grid.innerHTML = items.map(it=>{
    const inner = `
      <div class="sponsorCard">
        ${
          it.logo
            ? `<img src="${escapeHtml(it.logo)}" alt="${escapeHtml(it.name || "Sponsor")}" loading="lazy" decoding="async">`
            : `<div class="sponsorName">${escapeHtml(it.name || "")}</div>`
        }
      </div>
    `;
    return it.url
      ? `<a class="sponsorLink" href="${escapeHtml(it.url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">${inner}</a>`
      : inner;
  }).join("");
}

function wireProjectBadge(){
  const a = document.getElementById("projectBadgeLink");
  if(!a) return;
  a.href = window.PUPPYS_CONFIG?.pages?.project || "./project-world-challenge.html";
}

async function fetchJsonWithNoCache(url){
  const u = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
  const r = await fetch(u, { cache: "no-store" });
  if(!r.ok) throw new Error("fetch failed: " + r.status);
  return await r.json();
}

function normalizeMessages(list){
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter(x => x && x.approved !== false && String(x.message || "").trim())
    .map(x => ({
      date: String(x.date || ""),
      name: String(x.name || "匿名"),
      message: String(x.message || "").trim()
    }))
    .sort((a,b)=> String(b.date).localeCompare(String(a.date)));
}

async function renderSupportMessagesOfficial(){
  const cfg = window.PUPPYS_CONFIG?.supportMessages;
  if(!cfg || cfg.enabled === false) return;

  const grid = document.getElementById("supportMessagesGrid");
  if(!grid) return;

  const note = document.getElementById("supportMessagesNote");
  if(note){
    note.textContent = cfg.note || "";
    note.style.display = note.textContent ? "block" : "none";
  }

  const formBtn = document.getElementById("supportMessageFormBtn");
  if(formBtn){
    if(cfg.formUrl){
      formBtn.href = cfg.formUrl;
      formBtn.style.display = "inline-flex";
    }else{
      formBtn.style.display = "none";
    }
  }

  let data = [];
  try{
    if(cfg.dataUrl){
      data = await fetchJsonWithNoCache(cfg.dataUrl);
    }
  }catch(e){
    data = [];
  }

  const items = normalizeMessages(data).slice(0, Number(cfg.maxOnOfficial || 3));
  if(!items.length){
    grid.innerHTML = `<div class="muted">応援メッセージを募集中です。</div>`;
    return;
  }

  grid.innerHTML = items.map(m => `
    <div class="msgCard">
      <div class="msgTop">
        <div class="msgName">${escapeHtml(m.name)}</div>
        <div class="msgDate">${escapeHtml(formatDateLabel(m.date))}</div>
      </div>
      <p class="msgBody">${escapeHtml(m.message)}</p>
    </div>
  `).join("");
}

function initSite(){
  renderNews();
  renderCopy();
  wireMediaLink();
  wireWebShare();
  wireProjectBadge();

  renderHeroMedia();
  renderPhotos();
  setupLightbox();
  renderSponsors();

  renderSupportMessagesOfficial();
}

function initMedia(){
  wireMediaKit();
  wirePressMail();
  renderMediaTexts();
  wireCopyButtons();
}

document.addEventListener("DOMContentLoaded", ()=>{
  if(document.body.dataset.page === "media"){
    initMedia();
  }else{
    initSite();
  }
});
