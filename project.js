/* project.js (BROWSER COMPATIBLE VERSION) */

// 共通ユーティリティ
function escapeHtml(str){
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function yen(n){
  var v = Number(n || 0);
  try{
    return new Intl.NumberFormat("ja-JP").format(v) + "円";
  }catch(e){
    return v + "円";
  }
}

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function daysLeft(endDateStr){
  var end = new Date(String(endDateStr || ""));
  if(!isFinite(end.getTime())) return null;
  var today = new Date();
  var ms = end.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function sumPeople(people){
  var arr = Array.isArray(people) ? people : [];
  var total = 0;
  for(var i = 0; i < arr.length; i++){
    total += Number(arr[i].count || 0);
  }
  return total;
}

function formatDateLabel(dateStr){
  if(!dateStr) return "";
  var m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return m[1] + "." + m[2] + "." + m[3];
}

function prefersReducedMotion(){
  try{
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }catch(e){
    return false;
  }
}

function saveDataOn(){
  try{
    return !!(navigator.connection && navigator.connection.saveData);
  }catch(e){
    return false;
  }
}

function mountHeroMediaProject(p){
  var wrap = document.getElementById("pHeroMediaWrap");
  var v = document.getElementById("pHeroVideo");
  var img = document.getElementById("pHeroImg");
  if(!wrap || !v || !img) return;

  var videoCfg = p.heroVideo || {};
  var imgSrc = p.heroImage || "";
  var imgAlt = p.heroImageAlt || "";

  function showImage(){
    try{
      v.pause();
      v.removeAttribute("src");
      var sources = v.querySelectorAll("source");
      for(var i = 0; i < sources.length; i++){
        sources[i].parentNode.removeChild(sources[i]);
      }
    }catch(e){}
    v.style.display = "none";

    if(imgSrc){
      img.src = imgSrc;
      img.alt = imgAlt || "";
      img.style.display = "block";
      wrap.style.display = "block";
      wrap.style.setProperty("--hero-bg", 'url("' + imgSrc + '")');
    }else{
      wrap.style.display = "none";
    }
  }

  function showVideo(){
    var mp4 = videoCfg.mp4 || "";
    var webm = videoCfg.webm || "";
    if(!mp4 && !webm){
      showImage();
      return;
    }

    var poster = videoCfg.poster || imgSrc || "";
    if(poster){
      v.setAttribute("poster", poster);
      wrap.style.setProperty("--hero-bg", 'url("' + poster + '")');
    }

    v.innerHTML = "";
    if(webm){
      var s1 = document.createElement("source");
      s1.src = webm;
      s1.type = "video/webm";
      v.appendChild(s1);
    }
    if(mp4){
      var s2 = document.createElement("source");
      s2.src = mp4;
      s2.type = "video/mp4";
      v.appendChild(s2);
    }

    var allowAuto = !prefersReducedMotion() && !saveDataOn();
    v.muted = true;
    v.playsInline = true;
    v.loop = videoCfg.loop !== false;

    v.style.display = "block";
    img.style.display = "none";
    wrap.style.display = "block";

    v.onerror = showImage;
    if(allowAuto){
      v.play().catch(function(){});
    }
  }

  if(videoCfg.enabled){
    showVideo();
  }else{
    showImage();
  }
}

async function fetchJsonWithNoCache(url){
  var u = url + (url.indexOf("?") >= 0 ? "&" : "?") + "v=" + Date.now();
  var r = await fetch(u, { cache: "no-store" });
  if(!r.ok) throw new Error("fetch failed: " + r.status);
  return await r.json();
}

function normalizeMessages(list){
  var arr = Array.isArray(list) ? list : [];
  var result = [];
  for(var i = 0; i < arr.length; i++){
    var x = arr[i];
    if(!x) continue;
    if(x.approved === false) continue;
    var msg = String(x.message || "").trim();
    if(!msg) continue;
    result.push({
      date: String(x.date || ""),
      name: String(x.name || "匿名"),
      message: msg
    });
  }
  result.sort(function(a, b){
    return String(b.date).localeCompare(String(a.date));
  });
  return result;
}

async function renderSupportMessagesProject(){
  var cfg = window.PUPPYS_CONFIG;
  var msgCfg = cfg && cfg.supportMessages;
  if(!msgCfg || msgCfg.enabled === false) return;

  var grid = document.getElementById("projectMessagesGrid");
  if(!grid) return;

  var noteEl = document.getElementById("projectMessagesNote");
  if(noteEl){
    noteEl.textContent = msgCfg.note || "";
    noteEl.style.display = noteEl.textContent ? "block" : "none";
  }

  var btn = document.getElementById("projectMessageFormBtn");
  if(btn){
    if(msgCfg.formUrl){
      btn.href = msgCfg.formUrl;
      btn.style.display = "inline-flex";
    }else{
      btn.style.display = "none";
    }
  }

  // Loading state
  grid.innerHTML = '<div class="muted">読み込み中...</div>';

  var data = [];
  try{
    if(msgCfg.dataUrl){
      data = await fetchJsonWithNoCache(msgCfg.dataUrl);
    }
  }catch(e){
    console.error("メッセージ取得失敗:", e);
    grid.innerHTML = '<div class="muted">メッセージの読み込みに失敗しました。</div>';
    return;
  }

  var max = Number(msgCfg.maxOnProject) || 24;
  var items = normalizeMessages(data).slice(0, max);

  if(!items.length){
    grid.innerHTML = '<div class="muted">応援メッセージを募集中です。</div>';
    return;
  }

  var html = "";
  for(var i = 0; i < items.length; i++){
    var m = items[i];
    html += '<div class="msgCard">' +
      '<div class="msgTop">' +
        '<div class="msgName">' + escapeHtml(m.name) + '</div>' +
        '<div class="msgDate">' + escapeHtml(formatDateLabel(m.date)) + '</div>' +
      '</div>' +
      '<p class="msgBody">' + escapeHtml(m.message) + '</p>' +
    '</div>';
  }
  grid.innerHTML = html;
}

function wireProjectShare(){
  var btn = document.getElementById("projectShareBtn");
  if(!btn) return;

  var title = document.title;
  var text = "World Challenge Project｜POM PUPPYS bright";
  var url = location.href;

  btn.addEventListener("click", async function(){
    try{
      if(navigator.share){
        await navigator.share({ title: title, text: text, url: url });
      }else{
        if(navigator.clipboard) await navigator.clipboard.writeText(url);
        var prev = btn.textContent;
        btn.textContent = "URLをコピーしました";
        setTimeout(function(){
          btn.textContent = prev || "共有";
        }, 1400);
      }
    }catch(e){}
  });
}

function renderProject(){
  var cfg = window.PUPPYS_CONFIG;
  var p = cfg && cfg.project;
  if(!p) return;

  var c = p.copy || {};

  function set(id, text){
    var el = document.getElementById(id);
    if(el) el.textContent = text || "";
  }

  set("pKicker", c.heroKicker);
  set("pHeadline", c.heroHeadline);
  set("pLead", c.heroLead);

  mountHeroMediaProject(p);

  var goal = Number(p.goalYen || 0);
  var raised = Number(p.raisedYen || 0);
  var pct = goal > 0 ? (raised / goal) * 100 : 0;

  set("goalYen", yen(goal));
  set("raisedYen", yen(raised));
  set("pct", Math.round(pct) + "%");

  var dl = daysLeft(p.endDate);
  if(dl === null){
    set("daysLeft", "—");
  }else if(dl < 0){
    set("daysLeft", "終了");
  }else{
    set("daysLeft", dl + "日");
  }
  set("updatedAt", p.updatedAt || "—");

  var bar = document.getElementById("barFill");
  if(bar) bar.style.width = clamp(pct, 0, 100).toFixed(1) + "%";

  var ppl = sumPeople(p.people);
  var perPackage = Number(p.costPerPersonYen || 0);
  var perExtras = Number(p.extrasPerPersonEstimateYen || 0);
  var perTotal = perPackage + perExtras;
  var totalCost = perPackage * ppl;

  set("perPerson", yen(perPackage));
  set("extrasPerPerson", yen(perExtras) + "（目安）");
  set("totalPerPerson", yen(perTotal) + "（目安）");
  set("headcount", ppl + "名（選手・コーチ合計）");
  set("totalCost", yen(totalCost));

  var mp = document.getElementById("mealPlanNote");
  if(mp){
    mp.textContent = p.mealPlanNote || "";
    mp.style.display = mp.textContent ? "block" : "none";
  }

  var supportEl = document.getElementById("supportMeaning");
  if(supportEl){
    var eq = perTotal > 0 ? (goal / perTotal) : 0;
    var rounded = Math.round(eq * 10) / 10;
    if(perTotal > 0 && eq > 0){
      supportEl.innerHTML =
        "目標" + yen(goal) + "は、1人あたりの費用目安（" + yen(perTotal) + "）の <strong>約" + rounded + "人分</strong> に相当します。" +
        " <small>※あくまで目安（燃油等は変動）</small>";
      supportEl.style.display = "block";
    }else{
      supportEl.style.display = "none";
    }
  }

  // CTA
  var url = p.crowdfundingUrl || "";
  var ctaBtn = document.getElementById("crowdfundingBtn");
  var sticky = document.getElementById("stickyCta");
  var sbtn = document.getElementById("stickyCrowdfundingBtn");

  if(ctaBtn){
    if(url){
      ctaBtn.href = url;
      ctaBtn.style.display = "inline-flex";
    }else{
      ctaBtn.style.display = "none";
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

  // Lists helper
  function mountList(id, lines){
    var el = document.getElementById(id);
    if(!el) return;
    var arr = Array.isArray(lines) ? lines : [];
    var html = "";
    for(var i = 0; i < arr.length; i++){
      html += "<li>" + escapeHtml(arr[i]) + "</li>";
    }
    el.innerHTML = html;
  }

  var sections = c.sections || {};
  set("whyTitle", sections.whyTitle || "なぜ支援が必要か");
  mountList("whyBody", sections.whyBody);
  set("usageTitle", sections.usageTitle || "資金の使い道");
  mountList("usageBody", sections.usageBody);

  // Price table
  var pt = document.getElementById("priceTable");
  if(pt){
    var rows = Array.isArray(p.priceTable) ? p.priceTable : [];
    var ptHtml = "";
    for(var i = 0; i < rows.length; i++){
      var r = rows[i];
      ptHtml += "<tr>" +
        "<td>" + escapeHtml(r.room || "") + "</td>" +
        "<td>" + escapeHtml(r.meal || "") + "</td>" +
        '<td style="text-align:right;font-weight:900;color:var(--navy)">' + escapeHtml(yen(r.athleteCoachAdult)) + "</td>" +
        '<td style="text-align:right">' + (r.child ? escapeHtml(yen(r.child)) : "—") + "</td>" +
      "</tr>";
    }
    pt.innerHTML = ptHtml;
  }

  var ex = document.getElementById("extraCosts");
  if(ex){
    var extraLines = Array.isArray(p.extraCosts) ? p.extraCosts : [];
    var exHtml = "";
    for(var j = 0; j < extraLines.length; j++){
      exHtml += "<li>" + escapeHtml(extraLines[j]) + "</li>";
    }
    ex.innerHTML = exHtml;
  }

  // Fund flow
  var ff = p.fundFlow || {};
  var ffTitle = document.getElementById("fundFlowTitle");
  var ffNote = document.getElementById("fundFlowNote");
  var ffWrap = document.getElementById("fundFlow");

  if(ffTitle) ffTitle.textContent = ff.title || "ご支援の使い道（優先順位）";
  if(ffNote){
    ffNote.textContent = ff.note || "";
    ffNote.style.display = ffNote.textContent ? "block" : "none";
  }
  if(ffWrap){
    var steps = Array.isArray(ff.steps) ? ff.steps : [];
    var ffHtml = "";
    for(var k = 0; k < steps.length; k++){
      var s = steps[k];
      var examplesHtml = "";
      if(Array.isArray(s.examples) && s.examples.length){
        examplesHtml = '<ul class="muted flowStep__list">';
        for(var l = 0; l < s.examples.length; l++){
          examplesHtml += "<li>" + escapeHtml(s.examples[l]) + "</li>";
        }
        examplesHtml += "</ul>";
      }
      ffHtml += '<div class="flowStep">' +
        '<div class="flowStep__top">' +
          '<div class="flowStep__index">' + (k + 1) + '</div>' +
          '<div class="flowStep__title">' + escapeHtml(s.title || "") + '</div>' +
        '</div>' +
        (s.body ? '<div class="muted" style="line-height:1.8;margin-top:8px;">' + escapeHtml(s.body) + '</div>' : '') +
        examplesHtml +
      '</div>';
    }
    ffWrap.innerHTML = ffHtml;
  }

  // Itinerary
  set("itineraryTitle", sections.scheduleTitle || "渡航〜大会までの流れ（抜粋）");
  var itWrap = document.getElementById("itinerary");
  if(itWrap){
    var itList = Array.isArray(p.itinerary) ? p.itinerary : [];
    var itHtml = "";
    for(var m = 0; m < itList.length; m++){
      var row = itList[m];
      if(row.hidden) continue;
      itHtml += '<div class="step">' +
        '<div class="step__label">' + escapeHtml(row.label || "") + '</div>' +
        '<div class="step__body">' +
          '<div class="step__title">' + escapeHtml(row.title || "") + '</div>' +
          (row.body ? '<div class="step__text muted">' + escapeHtml(row.body || "") + '</div>' : '') +
          (row.meals ? '<div class="step__meta muted">食事：' + escapeHtml(row.meals) + '</div>' : '') +
        '</div>' +
      '</div>';
    }
    itWrap.innerHTML = itHtml;
  }

  // FAQ
  var faqWrap = document.getElementById("faq");
  if(faqWrap){
    var faqItems = Array.isArray(c.faq) ? c.faq : [];
    var faqHtml = "";
    for(var n = 0; n < faqItems.length; n++){
      var item = faqItems[n];
      faqHtml += '<details class="faqItem">' +
        '<summary>' + escapeHtml(item.q || "") + '</summary>' +
        '<div class="muted" style="margin-top:8px;line-height:1.8;">' + escapeHtml(item.a || "") + '</div>' +
      '</details>';
    }
    faqWrap.innerHTML = faqHtml;
  }

  // Support section
  var sup = p.support || {};
  var email = (cfg && cfg.pressEmail) || "";
  var contactName = (cfg && cfg.pressContactName) || "";

  var supTitle = document.getElementById("supportTitle");
  if(supTitle) supTitle.textContent = sup.title || "応援の方法";

  // Individual
  var ind = sup.individual || {};
  var iTitle = document.getElementById("supportIndTitle");
  var iBody = document.getElementById("supportIndBody");
  var iBtn = document.getElementById("supportIndBtn");
  var iNote = document.getElementById("supportIndNote");

  if(iTitle) iTitle.textContent = ind.title || "個人で応援";
  if(iBody) iBody.textContent = ind.body || "";

  if(iBtn){
    if(url){
      iBtn.href = url;
      iBtn.textContent = ind.ctaLabel || "支援ページを見る";
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
  var corp = sup.corporate || {};
  var cTitle = document.getElementById("supportCorpTitle");
  var cBody = document.getElementById("supportCorpBody");
  var cBtn = document.getElementById("supportCorpBtn");
  var cNote = document.getElementById("supportCorpNote");

  if(cTitle) cTitle.textContent = corp.title || "企業・団体として応援（協賛）";
  if(cBody) cBody.textContent = corp.body || "";

  if(cBtn){
    cBtn.textContent = corp.ctaLabel || "協賛の相談をする（メール）";
    if(email){
      var subject = encodeURIComponent(corp.mailSubject || "【協賛のご相談】POM PUPPYS bright");
      var bodyText = (corp.mailBody || "") + (contactName ? "\n\n（署名）\n" + contactName : "");
      var body = encodeURIComponent(bodyText);
      cBtn.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
      if(cNote){
        cNote.textContent = "送信先：" + email;
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

  // Corporate menu
  var menuWrap = document.getElementById("supportCorpMenu");
  if(menuWrap){
    var menu = corp.menu;
    if(Array.isArray(menu) && menu.length){
      menuWrap.style.display = "grid";
      var menuHtml = "";
      for(var o = 0; o < menu.length; o++){
        var menuItem = menu[o];
        menuHtml += '<div class="supportMenuItem">' +
          '<div class="supportMenuItem__title">' + escapeHtml(menuItem.title || "") + '</div>' +
          (menuItem.body ? '<div class="muted" style="line-height:1.8;margin-top:6px;">' + escapeHtml(menuItem.body || "") + '</div>' : '') +
        '</div>';
      }
      menuWrap.innerHTML = menuHtml;
    }else{
      menuWrap.style.display = "none";
      menuWrap.innerHTML = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  try{
    renderProject();
    renderSupportMessagesProject();
    wireProjectShare();
  }catch(e){
    console.error(e);
  }
});
