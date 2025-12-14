/* main.js (BROWSER COMPATIBLE VERSION) */

// 共通ユーティリティ
function escapeHtml(str){
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateLabel(dateStr){
  if(!dateStr) return "";
  var m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return m[1] + "." + m[2] + "." + m[3];
}

async function copyText(text){
  try{
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(e){}
  try{
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }catch(e){
    return false;
  }
}

function wireCopyButtons(){
  var buttons = document.querySelectorAll("[data-copy-target]");
  for(var i = 0; i < buttons.length; i++){
    (function(btn){
      btn.addEventListener("click", async function(){
        var id = btn.getAttribute("data-copy-target");
        var el = document.getElementById(id);
        if(!el) return;
        var text = el.textContent || "";
        var ok = await copyText(text.trim());
        var prev = btn.textContent;
        btn.textContent = ok ? "コピーしました" : "コピー失敗";
        setTimeout(function(){ btn.textContent = prev; }, 1300);
      });
    })(buttons[i]);
  }
}

function renderNews(){
  var wrap = document.getElementById("newsGrid");
  if(!wrap) return;

  var cfg = window.PUPPYS_CONFIG;
  var itemsRaw = (cfg && cfg.news) ? cfg.news : [];
  var items = itemsRaw.slice().sort(function(a, b){
    return String(b.date).localeCompare(String(a.date));
  });

  if(!items.length){
    wrap.innerHTML = '<div class="muted">現在お知らせはありません。</div>';
    return;
  }

  var html = "";
  for(var i = 0; i < items.length; i++){
    var n = items[i];
    var dateLabel = formatDateLabel(n.date);
    var link = n.url
      ? '<a class="newsLink" href="' + escapeHtml(n.url) + '" target="_blank" rel="noopener noreferrer">詳細を見る</a>'
      : "";
    html += '<article class="newsItem">' +
      '<div class="newsTop">' +
        '<span class="badge">' + escapeHtml(n.tag || "NEWS") + '</span>' +
        (dateLabel ? '<span class="newsDate">' + escapeHtml(dateLabel) + '</span>' : '<span></span>') +
      '</div>' +
      '<h3 class="newsTitle">' + escapeHtml(n.title || "") + '</h3>' +
      (n.body ? '<p class="newsBody">' + escapeHtml(n.body) + '</p>' : '') +
      link +
    '</article>';
  }
  wrap.innerHTML = html;
}

function renderCopy(){
  var cfg = window.PUPPYS_CONFIG;
  var c = cfg && cfg.copy;
  if(!c) return;

  var h1 = document.getElementById("heroHeadline");
  var lead = document.getElementById("heroLead");
  var sub = document.getElementById("heroSub");
  if(h1) h1.textContent = (c.hero && c.hero.headline) || "";
  if(lead) lead.textContent = (c.hero && c.hero.lead) || "";
  if(sub) sub.textContent = (c.hero && c.hero.sub) || "";

  // Facts chips
  var chips = document.getElementById("factsChips");
  if(chips){
    var facts = c.facts || [];
    var chipsHtml = "";
    for(var i = 0; i < facts.length; i++){
      var f = facts[i];
      chipsHtml += '<span class="chip"><strong>' + escapeHtml(f.label) + '</strong> ' + escapeHtml(f.value) + '</span>';
    }
    chips.innerHTML = chipsHtml;
  }

  // Key facts list
  var kf = document.getElementById("keyFactsList");
  if(kf){
    var facts2 = c.facts || [];
    var kfHtml = "";
    for(var j = 0; j < facts2.length; j++){
      var f2 = facts2[j];
      kfHtml += '<li><span class="keyFacts__label">' + escapeHtml(f2.label) + '</span><span class="keyFacts__value">' + escapeHtml(f2.value) + '</span></li>';
    }
    kf.innerHTML = kfHtml;
  }

  // Summit note
  var sn = document.getElementById("summitNote");
  if(sn){
    var note = c.summitNote || "";
    sn.textContent = note;
    sn.style.display = note ? "block" : "none";
  }

  // About
  var at = document.getElementById("aboutTitle");
  var ab = document.getElementById("aboutBody");
  var an = document.getElementById("aboutNote");
  if(at) at.textContent = (c.about && c.about.title) || "";
  if(ab){
    var lines = (c.about && c.about.body) || [];
    var abHtml = "";
    for(var k = 0; k < lines.length; k++){
      abHtml += escapeHtml(lines[k]) + "<br/>";
    }
    ab.innerHTML = abHtml;
  }
  if(an){
    var aboutNote = (c.about && c.about.note) || "";
    an.style.display = aboutNote ? "block" : "none";
    an.textContent = aboutNote;
  }

  // Story
  var st = document.getElementById("storyTitle");
  if(st) st.textContent = (c.story && c.story.title) || "STORY";

  var sb = document.getElementById("storyBody");
  if(sb){
    var storyLines = (c.story && c.story.body) || [];
    var sbHtml = "";
    for(var m = 0; m < storyLines.length; m++){
      sbHtml += escapeHtml(storyLines[m]) + "<br/>";
    }
    sb.innerHTML = sbHtml;
  }

  var ip = document.getElementById("interviewPoints");
  if(ip){
    var pts = (c.story && c.story.interviewPoints) || [];
    var ipHtml = "";
    for(var n = 0; n < pts.length; n++){
      ipHtml += "<li>" + escapeHtml(pts[n]) + "</li>";
    }
    ip.innerHTML = ipHtml;
  }

  // Timeline
  var tl = document.getElementById("timelineList");
  if(tl){
    var rows = c.timeline || [];
    var tlHtml = "";
    for(var p = 0; p < rows.length; p++){
      var r = rows[p];
      tlHtml += "<li><strong>" + escapeHtml(r.year) + "</strong>：" + escapeHtml(r.text) + "</li>";
    }
    tl.innerHTML = tlHtml;
  }
}

function wireMediaKit(){
  var cfg = window.PUPPYS_CONFIG;
  var url = cfg && cfg.mediaKitUrl;
  var btn = document.getElementById("mediaKitBtn");
  if(!btn) return;
  if(!url){
    btn.style.display = "none";
    return;
  }
  btn.href = url;
}

function wirePressMail(){
  var cfg = window.PUPPYS_CONFIG;
  var email = cfg && cfg.pressEmail;
  var name = (cfg && cfg.pressContactName) || "";
  var btn = document.getElementById("pressMailBtn");
  if(!btn || !email) return;
  var subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  var body = encodeURIComponent("取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n（署名）\n" + name);
  btn.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
}

function wireWebShare(){
  var cfg = window.PUPPYS_CONFIG;
  var ui = (cfg && cfg.ui) || {};
  var btn = document.getElementById("shareBtn");
  if(!btn) return;

  if(ui.showShareButton === false){
    btn.style.display = "none";
    return;
  }

  var title = document.title;
  var text = "POM PUPPYS bright 公式サイト";
  var url = location.href;

  btn.style.display = "inline-flex";

  btn.addEventListener("click", async function(){
    try{
      if(navigator.share){
        await navigator.share({ title: title, text: text, url: url });
      }else{
        if(navigator.clipboard) await navigator.clipboard.writeText(url);
        var prev = btn.textContent;
        btn.textContent = "URLをコピーしました";
        setTimeout(function(){ btn.textContent = prev || "共有"; }, 1400);
      }
    }catch(e){}
  });
}

function wireMediaLink(){
  var a = document.getElementById("mediaPageLink");
  if(!a) return;
  var cfg = window.PUPPYS_CONFIG;
  var url = (cfg && cfg.pages && cfg.pages.media) || "./media.html";
  a.href = url;
}

function renderMediaTexts(){
  var cfg = window.PUPPYS_CONFIG;
  var m = cfg && cfg.mediaTexts;
  if(!m) return;

  var credit = document.getElementById("mediaCredit");
  var t100 = document.getElementById("text100");
  var t200 = document.getElementById("text200");
  var t400 = document.getElementById("text400");

  if(credit) credit.textContent = m.credit || "";
  if(t100) t100.textContent = m.short100 || "";
  if(t200) t200.textContent = m.mid200 || "";
  if(t400) t400.textContent = m.long400 || "";
}

function renderHeroMedia(){
  var cfg = window.PUPPYS_CONFIG;
  var imgs = cfg && cfg.siteImages;
  if(!imgs) return;

  var wrap = document.getElementById("heroMediaWrap");
  var img = document.getElementById("heroPhoto");
  var v = document.getElementById("heroVideo");

  var legacyWrap = document.getElementById("heroPhotoWrap");
  var legacyImg = document.getElementById("heroPhoto");

  var heroImgSrc = imgs.heroImage || imgs.heroPhoto || "";
  var heroImgAlt = imgs.heroImageAlt || imgs.heroPhotoAlt || "POM PUPPYS bright";
  var heroVid = imgs.heroVideo || {};

  function showImage(){
    var w = wrap || legacyWrap;
    var imageEl = img || legacyImg;
    if(!w || !imageEl) return;

    if(v){
      try{ v.pause(); }catch(e){}
      v.style.display = "none";
    }

    if(heroImgSrc){
      imageEl.src = heroImgSrc;
      imageEl.alt = heroImgAlt;
      imageEl.style.display = "block";
      w.style.display = "block";
      try{ w.style.setProperty("--hero-bg", 'url("' + heroImgSrc + '")'); }catch(e){}
    }else{
      w.style.display = "none";
    }
  }

  if(!wrap || !img){
    if(legacyWrap && legacyImg) showImage();
    return;
  }

  var useVideo = !!heroVid.enabled && (!!heroVid.mp4 || !!heroVid.webm);
  if(!useVideo){
    showImage();
    return;
  }

  if(!v){
    v = document.createElement("video");
    v.id = "heroVideo";
    v.className = "heroVideo";
    v.setAttribute("playsinline", "");
    v.muted = true;
    v.playsInline = true;
    v.loop = heroVid.loop !== false;
    v.preload = "metadata";
    wrap.insertBefore(v, wrap.firstChild);
  }

  v.innerHTML = "";
  if(heroVid.webm){
    var s1 = document.createElement("source");
    s1.src = heroVid.webm;
    s1.type = "video/webm";
    v.appendChild(s1);
  }
  if(heroVid.mp4){
    var s2 = document.createElement("source");
    s2.src = heroVid.mp4;
    s2.type = "video/mp4";
    v.appendChild(s2);
  }

  var bg = heroVid.poster || heroImgSrc;
  if(bg){
    v.setAttribute("poster", bg);
    try{ wrap.style.setProperty("--hero-bg", 'url("' + bg + '")'); }catch(e){}
  }

  wrap.style.display = "block";
  v.style.display = "block";
  img.style.display = "none";

  v.play().catch(function(){});
}

function renderPhotos(){
  var grid = document.getElementById("photoGrid");
  var section = document.getElementById("photosSection");
  var mf = document.getElementById("mascotFloat");
  var mfImg = document.getElementById("mascotFloatImg");

  var cfg = window.PUPPYS_CONFIG;
  var imgs = cfg && cfg.siteImages;

  if(!imgs){
    if(section) section.style.display = "none";
    return;
  }

  if(grid && section){
    var list = Array.isArray(imgs.gallery) ? imgs.gallery : [];
    if(list.length === 0){
      section.style.display = "none";
    }else{
      section.style.display = "";
      var html = "";
      for(var i = 0; i < list.length; i++){
        var item = list[i];
        var title = escapeHtml(item.title || "Photo");
        var src = item.src || "";
        var alt = escapeHtml(item.alt || item.title || "Photo");
        if(src){
          html += '<figure class="photoCard">' +
            '<img class="photoImg" src="' + escapeHtml(src) + '" alt="' + alt + '" loading="lazy" decoding="async"/>' +
            '<figcaption class="photoCap">' + title + '</figcaption>' +
          '</figure>';
        }else{
          html += '<figure class="photoCard photoPlaceholder">' +
            '<div class="photoPhInner">' +
              '<div class="photoPhTitle">' + title + '</div>' +
              '<div class="photoPhHint muted">assets/photos に画像を追加してください</div>' +
            '</div>' +
            '<figcaption class="photoCap">' + title + '</figcaption>' +
          '</figure>';
        }
      }
      grid.innerHTML = html;
    }
  }

  if(mf && mfImg){
    var m = imgs.mascot || {};
    if(m.enabled && m.src){
      mfImg.src = m.src;
      mfImg.alt = m.alt || "Mascot";
      mf.style.display = "block";
      mf.setAttribute("aria-hidden", "false");
    }else{
      mf.style.display = "none";
      mf.setAttribute("aria-hidden", "true");
    }
  }
}

function setupLightbox(){
  var cfg = window.PUPPYS_CONFIG;
  var ui = (cfg && cfg.ui) || {};
  if(ui.enableLightbox === false) return;

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var cap = document.getElementById("lightboxCap");
  var bg = document.getElementById("lightboxBg");
  var closeBtn = document.getElementById("lightboxClose");
  if(!lb || !lbImg || !cap || !bg || !closeBtn) return;

  function openLightbox(src, caption, alt){
    lbImg.src = src;
    lbImg.alt = alt || caption || "";
    cap.textContent = caption || "";
    lb.classList.add("isOpen");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lb.classList.remove("isOpen");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  bg.addEventListener("click", closeLightbox);
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeLightbox();
  });

  document.addEventListener("click", function(e){
    var t = e.target;
    if(!(t instanceof HTMLElement)) return;
    var card = t.closest(".photoCard");
    if(!card) return;
    var imgEl = card.querySelector("img.photoImg");
    if(imgEl && imgEl.getAttribute("src")){
      var fig = t.closest("figure");
      var caption = "";
      if(fig){
        var capEl = fig.querySelector(".photoCap");
        if(capEl) caption = capEl.textContent || "";
      }
      openLightbox(imgEl.getAttribute("src"), caption, imgEl.getAttribute("alt") || caption);
    }
  });
}

function renderSponsors(){
  var grid = document.getElementById("sponsorsGrid");
  if(!grid) return;

  var cfg = window.PUPPYS_CONFIG;
  var s = cfg && cfg.sponsors;
  var sec = document.getElementById("sponsors");

  if(!s || !s.enabled){
    if(sec) sec.style.display = "none";
    return;
  }

  var titleEl = document.getElementById("sponsorsTitle");
  if(titleEl) titleEl.textContent = s.title || "スポンサー / 協賛";

  var noteEl = document.getElementById("sponsorsNote");
  if(noteEl){
    noteEl.textContent = s.note || "";
    noteEl.style.display = noteEl.textContent ? "block" : "none";
  }

  var today = new Date();
  var rawItems = Array.isArray(s.items) ? s.items : [];
  var items = [];
  for(var i = 0; i < rawItems.length; i++){
    var it = rawItems[i];
    if(it.approved === false) continue;
    if(it.showOnOfficial === false) continue;
    var exp = new Date(String(it.expiresAt || ""));
    if(isFinite(exp.getTime()) && exp.getTime() < today.getTime()) continue;
    items.push(it);
  }

  if(!items.length){
    grid.innerHTML = '<div class="muted">協賛企業を募集しています。</div>';
    return;
  }

  var html = "";
  for(var j = 0; j < items.length; j++){
    var item = items[j];
    var inner = '<div class="sponsorCard">';
    if(item.logo){
      inner += '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name || "Sponsor") + '" loading="lazy" decoding="async">';
    }else{
      inner += '<div class="sponsorName">' + escapeHtml(item.name || "") + '</div>';
    }
    inner += '</div>';

    if(item.url){
      html += '<a class="sponsorLink" href="' + escapeHtml(item.url) + '" target="_blank" rel="nofollow sponsored noopener noreferrer">' + inner + '</a>';
    }else{
      html += inner;
    }
  }
  grid.innerHTML = html;
}

function wireProjectBadge(){
  var a = document.getElementById("projectBadgeLink") || document.querySelector("a.projectBadge");
  if(!a) return;
  var cfg = window.PUPPYS_CONFIG;
  a.href = (cfg && cfg.pages && cfg.pages.project) || "./project-world-challenge.html";
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

async function renderSupportMessagesOfficial(){
  var cfg = window.PUPPYS_CONFIG;
  var msgCfg = cfg && cfg.supportMessages;
  if(!msgCfg || msgCfg.enabled === false) return;

  var grid = document.getElementById("supportMessagesGrid");
  if(!grid) return;

  var noteEl = document.getElementById("supportMessagesNote");
  if(noteEl){
    noteEl.textContent = msgCfg.note || "";
    noteEl.style.display = noteEl.textContent ? "block" : "none";
  }

  var formBtn = document.getElementById("supportMessageFormBtn");
  if(formBtn){
    if(msgCfg.formUrl){
      formBtn.href = msgCfg.formUrl;
      formBtn.style.display = "inline-flex";
    }else{
      formBtn.style.display = "none";
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

  var max = Number(msgCfg.maxOnOfficial) || 3;
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

document.addEventListener("DOMContentLoaded", function(){
  var page = document.body.dataset.page || document.body.getAttribute("data-page");
  if(page === "media"){
    initMedia();
  }else{
    initSite();
  }
});
