/* main.js - 公式サイト・Mediaページ用（追加機能版） */

// ===== 共通ユーティリティ =====

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

function setText(id, text){
  var el = document.getElementById(id);
  if(el) el.textContent = text || "";
}

function setHtml(id, html){
  var el = document.getElementById(id);
  if(el) el.innerHTML = html || "";
}

function getConfig(){
  return window.PUPPYS_CONFIG || {};
}

function getConfigValue(path, defaultValue){
  var cfg = getConfig();
  var keys = path.split(".");
  var value = cfg;
  for(var i = 0; i < keys.length; i++){
    if(value == null) return defaultValue;
    value = value[keys[i]];
  }
  return value != null ? value : defaultValue;
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

// ===== Road to the World セクション =====

function renderRoadToWorld(){
  var p = getConfigValue("project", {});
  if(!p) return;

  var goal = Number(p.goalYen || 0);
  var raised = Number(p.raisedYen || 0);
  var pct = goal > 0 ? (raised / goal) * 100 : 0;

  // 進捗バー
  var fill = document.getElementById("progressFill");
  if(fill){
    // アニメーション用に少し遅延
    setTimeout(function(){
      fill.style.width = clamp(pct, 0, 100).toFixed(1) + "%";
    }, 300);
  }

  // 金額表示
  setText("raisedAmount", yen(raised));
  setText("goalAmount", yen(goal));

  // 残り日数
  var dl = daysLeft(p.endDate);
  if(dl === null){
    setText("daysRemaining", "—");
  }else if(dl < 0){
    setText("daysRemaining", "終了");
  }else{
    setText("daysRemaining", dl + "日");
  }
}

// ===== 応援メッセージ（プレビュー・Road to World用） =====

async function renderMessagesPreview(){
  var msgCfg = getConfigValue("supportMessages", {});
  if(!msgCfg || msgCfg.enabled === false) return;

  var preview = document.getElementById("messagesPreview");
  var countEl = document.getElementById("messageCount");

  if(!preview) return;

  var data = [];
  try{
    if(msgCfg.dataUrl){
      data = await fetchJsonWithNoCache(msgCfg.dataUrl);
    }
  }catch(e){
    console.error("メッセージ取得失敗:", e);
    preview.innerHTML = '<div class="messagePreview"><span style="opacity:0.7;">メッセージを読み込めませんでした</span></div>';
    return;
  }

  var items = normalizeMessages(data);
  
  // カウント表示
  if(countEl){
    countEl.textContent = items.length;
  }

  // プレビュー（最新3件）
  var previewItems = items.slice(0, 3);
  
  if(!previewItems.length){
    preview.innerHTML = '<div class="messagePreview"><span style="opacity:0.7;">まだメッセージがありません。最初の応援者になろう！</span></div>';
    return;
  }

  var html = "";
  for(var i = 0; i < previewItems.length; i++){
    var m = previewItems[i];
    // メッセージを短く切る（40文字）
    var shortMsg = m.message.length > 40 ? m.message.substring(0, 40) + "..." : m.message;
    html += '<div class="messagePreview">' +
      '<span class="messagePreview__name">' + escapeHtml(m.name) + '</span>' +
      '<span>' + escapeHtml(shortMsg) + '</span>' +
    '</div>';
  }
  preview.innerHTML = html;
}

// ===== 応援メッセージ（フル表示・メッセージセクション用） =====

async function renderMessagesSection(){
  var msgCfg = getConfigValue("supportMessages", {});
  if(!msgCfg || msgCfg.enabled === false) return;

  var grid = document.getElementById("msgGrid");
  if(!grid) return;

  var data = [];
  try{
    if(msgCfg.dataUrl){
      data = await fetchJsonWithNoCache(msgCfg.dataUrl);
    }
  }catch(e){
    console.error("メッセージ取得失敗:", e);
    grid.innerHTML = '<div class="msgCard"><p class="msgCard__body muted">メッセージを読み込めませんでした</p></div>';
    return;
  }

  var max = Number(msgCfg.maxOnOfficial) || 12;
  var items = normalizeMessages(data).slice(0, max);

  if(!items.length){
    grid.innerHTML = '<div class="msgCard"><p class="msgCard__body muted">まだメッセージがありません。最初の応援者になろう！</p></div>';
    return;
  }

  var html = "";
  for(var i = 0; i < items.length; i++){
    var m = items[i];
    html += '<div class="msgCard">' +
      '<div class="msgCard__header">' +
        '<span class="msgCard__name">' + escapeHtml(m.name) + '</span>' +
        '<span class="msgCard__date">' + escapeHtml(formatDateLabel(m.date)) + '</span>' +
      '</div>' +
      '<p class="msgCard__body">' + escapeHtml(m.message) + '</p>' +
    '</div>';
  }
  grid.innerHTML = html;
}

// ===== 応援メッセージ送信ボタン =====

function wireMessageButtons(){
  var msgCfg = getConfigValue("supportMessages", {});
  var formUrl = msgCfg.formUrl || "";

  var btns = [
    document.getElementById("sendMessageBtn"),
    document.getElementById("sendMessageBtn2")
  ];

  for(var i = 0; i < btns.length; i++){
    var btn = btns[i];
    if(!btn) continue;

    if(formUrl){
      btn.href = formUrl;
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    }else{
      btn.style.display = "none";
    }
  }
}

// ===== News =====

function renderNews(){
  var wrap = document.getElementById("newsGrid");
  if(!wrap) return;

  var itemsRaw = getConfigValue("news", []);
  var items = itemsRaw.slice().sort(function(a, b){
    return String(b.date).localeCompare(String(a.date));
  });

  if(!items.length){
    wrap.innerHTML = '<div class="newsItem"><p class="muted">現在お知らせはありません</p></div>';
    return;
  }

  var html = "";
  for(var i = 0; i < items.length; i++){
    var n = items[i];
    var dateLabel = formatDateLabel(n.date);
    var link = n.url
      ? '<a class="newsLink" href="' + escapeHtml(n.url) + '" target="_blank" rel="noopener noreferrer">詳細を見る →</a>'
      : "";
    html += '<article class="newsItem">' +
      '<div class="newsTop">' +
        '<span class="badge">' + escapeHtml(n.tag || "NEWS") + '</span>' +
        (dateLabel ? '<span class="newsDate">' + escapeHtml(dateLabel) + '</span>' : '') +
      '</div>' +
      '<h3 class="newsTitle">' + escapeHtml(n.title || "") + '</h3>' +
      (n.body ? '<p class="newsBody">' + escapeHtml(n.body) + '</p>' : '') +
      link +
    '</article>';
  }
  wrap.innerHTML = html;
}

// ===== Sponsors =====

function renderSponsors(){
  var grid = document.getElementById("sponsorsGrid");
  if(!grid) return;

  var s = getConfigValue("sponsors", {});
  var sec = document.getElementById("sponsors");

  if(!s || !s.enabled){
    if(sec) sec.style.display = "none";
    return;
  }

  setText("sponsorsTitle", s.title || "🤝 Sponsors");

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
    grid.innerHTML = '<div class="sponsorCard"><span class="sponsorName muted">協賛企業募集中</span></div>';
    return;
  }

  var html = "";
  for(var j = 0; j < items.length; j++){
    var item = items[j];
    var inner = '<div class="sponsorCard">';
    if(item.logo){
      inner += '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name || "Sponsor") + '" loading="lazy" />';
    }else{
      inner += '<span class="sponsorName">' + escapeHtml(item.name || "") + '</span>';
    }
    inner += '</div>';

    if(item.url){
      html += '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="nofollow sponsored noopener noreferrer" style="text-decoration:none;">' + inner + '</a>';
    }else{
      html += inner;
    }
  }
  grid.innerHTML = html;
}

// ===== Lightbox =====

function setupLightbox(){
  var enableLightbox = getConfigValue("ui.enableLightbox", true);
  if(enableLightbox === false) return;

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var cap = document.getElementById("lightboxCap");
  var closeBtn = document.getElementById("lightboxClose");
  if(!lb || !lbImg || !cap || !closeBtn) return;

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

  // 閉じるボタン
  closeBtn.addEventListener("click", closeLightbox);
  
  // 背景クリック
  lb.addEventListener("click", function(e){
    if(e.target === lb){
      closeLightbox();
    }
  });
  
  // ESCキー
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeLightbox();
  });

  // 写真クリック
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

// ===== Share Button =====

function wireWebShare(){
  var showBtn = getConfigValue("ui.showShareButton", true);
  var btn = document.getElementById("shareBtn");
  if(!btn) return;

  if(showBtn === false){
    btn.style.display = "none";
    return;
  }

  btn.addEventListener("click", async function(){
    var title = document.title;
    var text = "POM PUPPYS bright｜埼玉・春日部のチアダンスチーム";
    var url = location.href;

    try{
      if(navigator.share){
        await navigator.share({ title: title, text: text, url: url });
      }else{
        await copyText(url);
        var prev = btn.textContent;
        btn.textContent = "コピーしました！";
        setTimeout(function(){ btn.textContent = prev; }, 1500);
      }
    }catch(e){
      console.log("Share cancelled or failed");
    }
  });
}

// ===== Mascot Float =====

function setupMascot(){
  var mascot = document.getElementById("mascotFloat");
  if(!mascot) return;

  var cfg = getConfigValue("siteImages.mascot", {});
  if(!cfg.enabled){
    mascot.style.display = "none";
    return;
  }

  // クリックで応援ページへ
  mascot.addEventListener("click", function(){
    var url = getConfigValue("supportMessages.formUrl", "");
    if(url){
      window.open(url, "_blank");
    }else{
      // 応援セクションへスクロール
      var section = document.getElementById("road-to-the-world");
      if(section){
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // スクロールで表示/非表示
  var lastScroll = 0;
  window.addEventListener("scroll", function(){
    var current = window.pageYOffset;
    if(current > 300){
      mascot.style.opacity = "1";
      mascot.style.pointerEvents = "auto";
    }else{
      mascot.style.opacity = "0";
      mascot.style.pointerEvents = "none";
    }
    lastScroll = current;
  }, { passive: true });

  // 初期状態
  mascot.style.opacity = "0";
  mascot.style.pointerEvents = "none";
  mascot.style.transition = "opacity 0.3s ease";
}

// ===== Media Page Functions =====

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
        btn.textContent = ok ? "コピーしました！" : "失敗";
        setTimeout(function(){ btn.textContent = prev; }, 1300);
      });
    })(buttons[i]);
  }
}

function wireMediaKit(){
  var url = getConfigValue("mediaKitUrl", "");
  var btn = document.getElementById("mediaKitBtn");
  if(!btn) return;
  if(!url){
    btn.style.display = "none";
    return;
  }
  btn.href = url;
}

function wirePressMail(){
  var email = getConfigValue("pressEmail", "");
  var name = getConfigValue("pressContactName", "");
  var btn = document.getElementById("pressMailBtn");
  if(!btn || !email) return;
  var subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  var body = encodeURIComponent("取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n（署名）\n" + name);
  btn.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
}

function renderMediaTexts(){
  var m = getConfigValue("mediaTexts", {});
  setText("mediaCredit", m.credit);
  setText("text100", m.short100);
  setText("text200", m.mid200);
  setText("text400", m.long400);
}

// ===== Scroll Animation =====

function setupScrollAnimations(){
  // IntersectionObserver でフェードイン
  if(!("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(".section, .card, .photoCard, .newsItem, .msgCard");
  
  var observer = new IntersectionObserver(function(entries){
    for(var i = 0; i < entries.length; i++){
      var entry = entries[i];
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  for(var j = 0; j < targets.length; j++){
    targets[j].classList.add("animate-on-scroll");
    observer.observe(targets[j]);
  }
}

// ===== Initialize =====

function initSite(){
  // 基本機能
  renderNews();
  renderSponsors();
  setupLightbox();
  wireWebShare();
  
  // Road to the World
  renderRoadToWorld();
  renderMessagesPreview();
  wireMessageButtons();
  
  // メッセージセクション
  renderMessagesSection();
  
  // マスコット
  setupMascot();
  
  // スクロールアニメーション
  setupScrollAnimations();
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
