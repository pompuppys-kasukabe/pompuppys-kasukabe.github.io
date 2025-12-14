/* project.js (FULL REPLACEMENT) */
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}
function yen(n){
  const v = Number(n || 0);
  try{ return new Intl.NumberFormat("ja-JP").format(v) + "円"; }
  catch(e){ return v + "円"; }
}
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function daysLeft(endDateStr){
  const end = new Date(String(endDateStr || ""));
  if(!isFinite(end.getTime())) return null;
  const today = new Date();
  const ms = end.getTime() - today.getTime();
  return Math.ceil(ms / (1000*60*60*24));
}
function sumPeople(people){
  return (Array.isArray(people) ? people : []).reduce((a,p)=> a + Number(p.count||0), 0);
}
function formatDateLabel(dateStr){
  if(!dateStr) return "";
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return `${m[1]}.${m[2]}.${m[3]}`;
}

function prefersReducedMotion(){
  try{ return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch(e){ return false; }
}
function saveDataOn(){
  try{ return !!navigator.connection?.saveData; }
  catch(e){ return false; }
}

function mountHeroMediaProject(p){
  const wrap = document.getElementById("pHeroMediaWrap");
  const v = document.getElementById("pHeroVideo");
  const img = document.getElementById("pHeroImg");
  if(!wrap || !v || !img) return;

  const videoCfg = p.heroVideo || {};
  const imgSrc = p.heroImage || "";
  const imgAlt = p.heroImageAlt || "";

  const showImage = ()=>{
    try{
      v.pause();
      v.removeAttribute("src");
      v.querySelectorAll("source").forEach(s=>s.remove());
    }catch(e){}
    v.style.display = "none";

    if(imgSrc){
      img.src = imgSrc;
      img.alt = imgAlt || "";
      img.style.display = "block";
      wrap.style.display = "block";
      wrap.style.setProperty("--hero-bg", `url("${imgSrc}")`);
    }else{
      wrap.style.display = "none";
    }
  };

  const showVideo = ()=>{
    const mp4 = videoCfg.mp4 || "";
    const webm = videoCfg.webm || "";
    if(!mp4 && !webm) return showImage();

    const poster = videoCfg.poster || imgSrc || "";
    if(poster){
      v.setAttribute("poster", poster);
      wrap.style.setProperty("--hero-bg", `url("${poster}")`);
    }

    v.innerHTML = "";
    if(webm){
      const s = document.createElement("source");
      s.src = webm;
      s.type = "video/webm";
      v.appendChild(s);
    }
    if(mp4){
      const s = document.createElement("source");
      s.src = mp4;
      s.type = "video/mp4";
      v.appendChild(s);
    }

    const allowAuto = !prefersReducedMotion() && !saveDataOn();
    v.muted = true;
    v.playsInline = true;
    v.loop = videoCfg.loop !== false;

    v.style.display = "block";
    img.style.display = "none";
    wrap.style.display = "block";

    v.onerror = showImage;
    if(allowAuto){
      v.play().catch(()=>{});
    }
  };

  if(videoCfg.enabled) showVideo();
  else showImage();
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

async function renderSupportMessagesProject(){
  const cfg = window.PUPPYS_CONFIG?.supportMessages;
  if(!cfg || cfg.enabled === false) return;

  const grid = document.getElementById("projectMessagesGrid");
  if(!grid) return;

  const note = document.getElementById("projectMessagesNote");
  if(note){
    note.textContent = cfg.note || "";
    note.style.display = note.textContent ? "block" : "none";
  }

  const btn = document.getElementById("projectMessageFormBtn");
  if(btn){
    if(cfg.formUrl){
      btn.href = cfg.formUrl;
      btn.style.display = "inline-flex";
    }else{
      btn.style.display = "none";
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

  const items = normalizeMessages(data).slice(0, Number(cfg.maxOnProject || 24));
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

function wireProjectShare(){
  const btn = document.getElementById("projectShareBtn");
  if(!btn) return;

  const title = document.title;
  const text = "World Challenge Project｜POM PUPPYS bright";
  const url = location.href;

  btn.addEventListener("click", async ()=>{
    try{
      if(navigator.share){
        await navigator.share({ title, text, url });
      }else{
        if(navigator.clipboard) await navigator.clipboard.writeText(url);
        const prev = btn.textContent;
        btn.textContent = "URLをコピーしました";
        setTimeout(()=> btn.textContent = prev || "共有", 1400);
      }
    }catch(e){}
  });
}

function renderProject(){
  const p = window.PUPPYS_CONFIG?.project;
  if(!p) return;

  const c = p.copy || {};
  const set = (id, text) => {
    const el = document.getElementById(id);
    if(el) el.textContent = text || "";
  };

  set("pKicker", c.heroKicker);
  set("pHeadline", c.heroHeadline);
  set("pLead", c.heroLead);

  mountHeroMediaProject(p);

  const goal = Number(p.goalYen || 0);
  const raised = Number(p.raisedYen || 0);
  const pct = goal > 0 ? (raised / goal) * 100 : 0;

  set("goalYen", yen(goal));
  set("raisedYen", yen(raised));
  set("pct", Math.round(pct) + "%");

  const dl = daysLeft(p.endDate);
  set("daysLeft", dl === null ? "—" : (dl < 0 ? "終了" : `${dl}日`));
  set("updatedAt", p.updatedAt || "—");

  const bar = document.getElementById("barFill");
  if(bar) bar.style.width = clamp(pct,0,100).toFixed(1) + "%";

  const ppl = sumPeople(p.people);
  const perPackage = Number(p.costPerPersonYen || 0);
  const perExtras = Number(p.extrasPerPersonEstimateYen || 0);
  const perTotal = perPackage + perExtras;
  const totalCost = perPackage * ppl;

  set("perPerson", yen(perPackage));
  set("extrasPerPerson", yen(perExtras) + "（目安）");
  set("totalPerPerson", yen(perTotal) + "（目安）");
  set("headcount", `${ppl}名（選手・コーチ合計）`);
  set("totalCost", yen(totalCost));

  const mp = document.getElementById("mealPlanNote");
  if(mp){
    mp.textContent = p.mealPlanNote || "";
    mp.style.display = mp.textContent ? "block" : "none";
  }

  const supportEl = document.getElementById("supportMeaning");
  if(supportEl){
    const eq = perTotal > 0 ? (goal / perTotal) : 0;
    const rounded = Math.round(eq * 10) / 10;
    if(perTotal > 0 && eq > 0){
      supportEl.innerHTML =
        `目標${yen(goal)}は、1人あたりの費用目安（${yen(perTotal)}）の <strong>約${rounded}人分</strong> に相当します。` +
        ` <small>※あくまで目安（燃油等は変動）</small>`;
      supportEl.style.display = "block";
    }else{
      supportEl.style.display = "none";
    }
  }

  // CTA
  const url = p.crowdfundingUrl || "";
  const btn = document.getElementById("crowdfundingBtn");
  const sticky = document.getElementById("stickyCta");
  const sbtn = document.getElementById("stickyCrowdfundingBtn");

  if(btn){
    if(url){
      btn.href = url;
      btn.style.display = "inline-flex";
    }else{
      btn.style.display = "none";
    }
  }
  if(sticky && sbtn){
    if(url){
      sbtn.href = url;
      sticky.style.display = "block";
    }else{
      sticky.style.display = "none";
    }
  }

  // Lists
  const mountList = (id, lines)=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = (Array.isArray(lines)?lines:[]).map(t=>`<li>${escapeHtml(t)}</li>`).join("");
  };

  set("whyTitle", c.sections?.whyTitle || "なぜ支援が必要か");
  mountList("whyBody", c.sections?.whyBody);
  set("usageTitle", c.sections?.usageTitle || "資金の使い道");
  mountList("usageBody", c.sections?.usageBody);

  // Price table
  const pt = document.getElementById("priceTable");
  if(pt){
    const rows = Array.isArray(p.priceTable) ? p.priceTable : [];
    pt.innerHTML = rows.map(r=>`
      <tr>
        <td>${escapeHtml(r.room || "")}</td>
        <td>${escapeHtml(r.meal || "")}</td>
        <td style="text-align:right;font-weight:900;color:var(--navy)">${escapeHtml(yen(r.athleteCoachAdult))}</td>
        <td style="text-align:right">${r.child ? escapeHtml(yen(r.child)) : "—"}</td>
      </tr>
    `).join("");
  }

  const ex = document.getElementById("extraCosts");
  if(ex){
    const lines = Array.isArray(p.extraCosts) ? p.extraCosts : [];
    ex.innerHTML = lines.map(t=>`<li>${escapeHtml(t)}</li>`).join("");
  }

  // Fund flow
  const ff = p.fundFlow || {};
  const ffTitle = document.getElementById("fundFlowTitle");
  const ffNote = document.getElementById("fundFlowNote");
  const ffWrap = document.getElementById("fundFlow");

  if(ffTitle) ffTitle.textContent = ff.title || "ご支援の使い道（優先順位）";
  if(ffNote){
    ffNote.textContent = ff.note || "";
    ffNote.style.display = ffNote.textContent ? "block" : "none";
  }
  if(ffWrap){
    const steps = Array.isArray(ff.steps) ? ff.steps : [];
    ffWrap.innerHTML = steps.map((s, i)=>`
      <div class="flowStep">
        <div class="flowStep__top">
          <div class="flowStep__index">${i+1}</div>
          <div class="flowStep__title">${escapeHtml(s.title || "")}</div>
        </div>
        ${s.body ? `<div class="muted" style="line-height:1.8;margin-top:8px;">${escapeHtml(s.body)}</div>` : ""}
        ${
          Array.isArray(s.examples) && s.examples.length
            ? `<ul class="muted flowStep__list">${s.examples.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>`
            : ""
        }
      </div>
    `).join("");
  }

  // Itinerary
  set("itineraryTitle", c.sections?.scheduleTitle || "渡航〜大会までの流れ（抜粋）");
  const itWrap = document.getElementById("itinerary");
  if(itWrap){
    const list = Array.isArray(p.itinerary) ? p.itinerary.filter(x=>!x.hidden) : [];
    itWrap.innerHTML = list.map(row=>`
      <div class="step">
        <div class="step__label">${escapeHtml(row.label || "")}</div>
        <div class="step__body">
          <div class="step__title">${escapeHtml(row.title || "")}</div>
          ${row.body ? `<div class="step__text muted">${escapeHtml(row.body || "")}</div>` : ""}
          ${row.meals ? `<div class="step__meta muted">食事：${escapeHtml(row.meals)}</div>` : ""}
        </div>
      </div>
    `).join("");
  }

  // FAQ
  const faqWrap = document.getElementById("faq");
  if(faqWrap){
    const items = Array.isArray(c.faq) ? c.faq : [];
    faqWrap.innerHTML = items.map(item=>`
      <details class="faqItem">
        <summary>${escapeHtml(item.q || "")}</summary>
        <div class="muted" style="margin-top:8px;line-height:1.8;">${escapeHtml(item.a || "")}</div>
      </details>
    `).join("");
  }

  // Support section
  const sup = p.support || {};
  const email = window.PUPPYS_CONFIG?.pressEmail || "";
  const contactName = window.PUPPYS_CONFIG?.pressContactName || "";

  const supTitle = document.getElementById("supportTitle");
  if(supTitle) supTitle.textContent = sup.title || "応援の方法";

  // Individual
  const iTitle = document.getElementById("supportIndTitle");
  const iBody  = document.getElementById("supportIndBody");
  const iBtn   = document.getElementById("supportIndBtn");
  const iNote  = document.getElementById("supportIndNote");

  if(iTitle) iTitle.textContent = sup.individual?.title || "個人で応援";
  if(iBody)  iBody.textContent  = sup.individual?.body || "";

  if(iBtn){
    if(url){
      iBtn.href = url;
      iBtn.textContent = sup.individual?.ctaLabel || "支援ページを見る";
      iBtn.style.display = "inline-flex";
      if(iNote) iNote.style.display = "none";
    }else{
      iBtn.style.display = "none";
      if(iNote){
        iNote.textContent = "※支援ページ公開後にリンクが表示されます。";
        iNote.style.display = "block";
      }
    }
  }

  // Corporate
  const cTitle = document.getElementById("supportCorpTitle");
  const cBody  = document.getElementById("supportCorpBody");
  const cBtn   = document.getElementById("supportCorpBtn");
  const cNote  = document.getElementById("supportCorpNote");

  if(cTitle) cTitle.textContent = sup.corporate?.title || "企業・団体として応援（協賛）";
  if(cBody)  cBody.textContent  = sup.corporate?.body || "";

  if(cBtn){
    cBtn.textContent = sup.corporate?.ctaLabel || "協賛の相談をする（メール）";
    if(email){
      const subject = encodeURIComponent(sup.corporate?.mailSubject || "【協賛のご相談】POM PUPPYS bright");
      const body = encodeURIComponent((sup.corporate?.mailBody || "") + (contactName ? `\n\n（署名）\n${contactName}` : ""));
      cBtn.href = `mailto:${email}?subject=${subject}&body=${body}`;
      if(cNote){
        cNote.textContent = `送信先：${email}`;
        cNote.style.display = "block";
      }
    }else{
      cBtn.href = "#";
      if(cNote){
        cNote.textContent = "メールアドレスが未設定です。";
        cNote.style.display = "block";
      }
    }
  }

  // Corporate menu（ここが元コードで壊れやすかったので完全に安全化）
  const menuWrap = document.getElementById("supportCorpMenu");
  if(menuWrap){
    const menu = sup.corporate?.menu;
    if(Array.isArray(menu) && menu.length){
      menuWrap.style.display = "grid";
      menuWrap.innerHTML = menu.map(m => `
        <div class="supportMenuItem">
          <div class="supportMenuItem__title">${escapeHtml(m.title || "")}</div>
          ${m.body ? `<div class="muted" style="line-height:1.8;margin-top:6px;">${escapeHtml(m.body || "")}</div>` : ""}
        </div>
      `).join("");
    }else{
      menuWrap.style.display = "none";
      menuWrap.innerHTML = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  try{
    renderProject();
    renderSupportMessagesProject();
    wireProjectShare();
  }catch(e){
    console.error(e);
  }
});

