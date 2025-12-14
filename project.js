/* project.js */
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#39;");
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
    // clear video
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

    // poster (fallback to award image)
    const poster = videoCfg.poster || imgSrc || "";
    if(poster){
      v.setAttribute("poster", poster);
      wrap.style.setProperty("--hero-bg", `url("${poster}")`);
    }

    // build sources
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

    // playback policy
    const allowAuto = !prefersReducedMotion() && !saveDataOn();
    v.muted = true;
    v.playsInline = true;
    v.loop = videoCfg.loop !== false;

    v.style.display = "block";
    img.style.display = "none";
    wrap.style.display = "block";

    // if video fails -> image
    v.onerror = showImage;

    // try play (may be blocked; poster still looks good)
    if(allowAuto){
      v.play().catch(()=>{ /* keep poster */ });
    }
  };

  if(videoCfg.enabled){
    showVideo();
  }else{
    showImage();
  }
}

function renderProject(){
  const p = window.PUPPYS_CONFIG?.project;
  if(!p) return;

  const c = p.copy || {};
  const set = (id, text) => { const el=document.getElementById(id); if(el) el.textContent = text || ""; };

  // HERO
  set("pKicker", c.heroKicker);
  set("pHeadline", c.heroHeadline);
  set("pLead", c.heroLead);

  // HERO media
  mountHeroMediaProject(p);

  // Progress
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

  // Cost summary
  const ppl = sumPeople(p.people);
  const perPackage = Number(p.costPerPersonYen || 0);
  const perExtras = Number(p.extrasPerPersonEstimateYen || 0);
  const perTotal = perPackage + perExtras;
  const totalCost = perPackage * ppl; // package total (for display)
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

  // Support meaning line
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

  // CTA button(s)
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

  // Why / Usage
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

  // Extra costs
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

  const iTitle = document.getElementById("supportIndTitle");
  const iBody  = document.getElementById("supportIndBody");
  const iBtn   = document.getElementById("supportIndBtn");
  const iNote  = document.getElementById("supportIndNote");
  if(iTitle) iTitle.textContent = sup.individual?.title || "個人で応援（CAMPFIRE）";
  if(iBody)  iBody.textContent  = sup.individual?.body || "";
  if(iBtn){
    if(url){
      iBtn.href = url;
      iBtn.textContent = sup.individual?.ctaLabel || "CAMPFIREで支援する";
      iBtn.style.display = "inline-flex";
      if(iNote) iNote.style.display = "none";
    }else{
      iBtn.style.display = "none";
      if(iNote){
        iNote.textContent = "※CAMPFIREページ公開後にリンクが表示されます。";
        iNote.style.display = "block";
      }
