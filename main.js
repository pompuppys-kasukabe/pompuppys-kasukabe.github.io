/* main.js - POM PUPPYS bright（Notion + Google Drive 連携版） */

// ============================================
// 写真API設定
// ============================================

var PHOTOS_API_URL = "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec";
// 例: "https://script.google.com/macros/s/AKfycbxxxxx.../exec"

// ============================================
// ユーティリティ関数
// ============================================

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  var m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(dateStr);
  return m[1] + "." + m[2] + "." + m[3];
}

function yen(n) {
  if (n == null || isNaN(n)) return "-";
  return Number(n).toLocaleString("ja-JP");
}

function getConfig() {
  return window.PUPPYS_CONFIG || {};
}

function getConfigValue(path, defaultValue) {
  var cfg = getConfig();
  var keys = path.split(".");
  var value = cfg;
  for (var i = 0; i < keys.length; i++) {
    if (value == null) return defaultValue;
    value = value[keys[i]];
  }
  return value != null ? value : defaultValue;
}

// ============================================
// 写真データ取得（GAS API経由）
// ============================================

var photosCache = null;

async function fetchPhotos() {
  if (photosCache) return photosCache;
  
  try {
    var url = PHOTOS_API_URL + "?action=getPhotos&t=" + Date.now();
    var res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    photosCache = await res.json();
    return photosCache;
  } catch (e) {
    console.error("写真データ取得失敗:", e);
    return { hero: null, gallery: [], members: [] };
  }
}

// Google Drive画像URL生成
function getDriveImageUrl(fileId, width) {
  if (!fileId) return "";
  var w = width || 1200;
  return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w" + w;
}

// ============================================
// Hero画像
// ============================================

async function renderHeroMedia() {
  var wrap = document.getElementById("heroMediaWrap");
  var img = document.getElementById("heroPhoto");
  if (!wrap || !img) return;

  var photos = await fetchPhotos();
  var hero = photos.hero;

  if (hero && hero.driveId) {
    img.src = getDriveImageUrl(hero.driveId);
    img.alt = hero.alt || "POM PUPPYS bright";
    img.style.display = "block";
    wrap.style.display = "block";
  } else {
    // フォールバック: config.jsから
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    if (imgs.heroImage) {
      img.src = imgs.heroImage;
      img.alt = imgs.heroImageAlt || "POM PUPPYS bright";
      img.style.display = "block";
      wrap.style.display = "block";
    } else {
      wrap.style.display = "none";
    }
  }
}

// ============================================
// メンバー写真
// ============================================

async function renderMembers() {
  var grid = document.getElementById("membersGrid");
  if (!grid) return;

  grid.innerHTML = '<p class="loadingText">読み込み中...</p>';

  var photos = await fetchPhotos();
  var members = (photos.members || []).slice().sort(function(a, b) {
    return (a.slot || 0) - (b.slot || 0);
  });

  // GASから取得できない場合はconfig.jsにフォールバック
  if (members.length === 0) {
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    var fallback = imgs.members || [];
    if (fallback.length > 0) {
      var html = "";
      for (var i = 0; i < fallback.length; i++) {
        var m = fallback[i];
        if (!m.src) continue;
        var name = m.name || "";
        html += '<figure class="memberCard">' +
          '<img class="memberPhoto" src="' + escapeHtml(m.src) + '" alt="' + escapeHtml(name || "Member") + '" loading="lazy" decoding="async">' +
          (name ? '<figcaption class="memberName">' + escapeHtml(name) + '</figcaption>' : '') +
        '</figure>';
      }
      grid.innerHTML = html;
      return;
    }
    grid.innerHTML = '<p class="muted">メンバー写真は準備中です</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < members.length; i++) {
    var m = members[i];
    if (!m.driveId) continue;
    
    var src = getDriveImageUrl(m.driveId);
    var name = m.name || "";
    
    html += '<figure class="memberCard">' +
      '<img class="memberPhoto" src="' + src + '" alt="' + escapeHtml(name || "Member") + '" ' +
        'loading="lazy" decoding="async" onerror="this.parentElement.style.display=\'none\'">' +
      (name ? '<figcaption class="memberName">' + escapeHtml(name) + '</figcaption>' : '') +
    '</figure>';
  }
  grid.innerHTML = html || '<p class="muted">メンバー写真は準備中です</p>';
}

// ============================================
// フォトギャラリー
// ============================================

async function renderPhotos() {
  var grid = document.getElementById("photoGrid");
  var section = document.getElementById("photosSection");
  if (!grid) return;

  grid.innerHTML = '<p class="loadingText">読み込み中...</p>';

  var photos = await fetchPhotos();
  var gallery = (photos.gallery || []).slice().sort(function(a, b) {
    return (a.slot || 0) - (b.slot || 0);
  });

  // GASから取得できない場合はconfig.jsにフォールバック
  if (gallery.length === 0) {
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    var fallback = imgs.gallery || [];
    if (fallback.length > 0) {
      var html = "";
      for (var i = 0; i < fallback.length; i++) {
        var item = fallback[i];
        if (!item.src) continue;
        var title = escapeHtml(item.title || "");
        var alt = escapeHtml(item.alt || item.title || "Photo");
        var sizeClass = item.size || "third";
        html += '<figure class="photoCard photoCard--' + sizeClass + '">' +
          '<img class="photoImg" src="' + escapeHtml(item.src) + '" alt="' + alt + '" loading="lazy" decoding="async">' +
          '<figcaption class="photoCap">' + title + '</figcaption>' +
        '</figure>';
      }
      grid.innerHTML = html;
      if (section) section.style.display = "";
      return;
    }
    if (section) section.style.display = "none";
    grid.innerHTML = '<p class="muted">写真は準備中です</p>';
    return;
  }

  if (section) section.style.display = "";

  var html = "";
  for (var i = 0; i < gallery.length; i++) {
    var item = gallery[i];
    if (!item.driveId) continue;
    
    var src = getDriveImageUrl(item.driveId);
    var title = escapeHtml(item.title || "");
    var alt = escapeHtml(item.alt || item.title || "Photo");
    var sizeClass = item.size || "third";

    html += '<figure class="photoCard photoCard--' + sizeClass + '">' +
      '<img class="photoImg" src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" ' +
        'onerror="this.parentElement.style.display=\'none\'">' +
      '<figcaption class="photoCap">' + title + '</figcaption>' +
    '</figure>';
  }
  grid.innerHTML = html || '<p class="muted">写真は準備中です</p>';
}

// ============================================
// Lightbox
// ============================================

function setupLightbox() {
  var ui = getConfigValue("ui", {});
  if (ui.enableLightbox === false) return;

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var cap = document.getElementById("lightboxCap");
  var bg = document.getElementById("lightboxBg");
  var closeBtn = document.getElementById("lightboxClose");
  if (!lb || !lbImg || !cap || !bg || !closeBtn) return;

  function openLightbox(src, caption, alt) {
    lbImg.src = src;
    lbImg.alt = alt || caption || "";
    cap.textContent = caption || "";
    lb.classList.add("isOpen");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("isOpen");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  bg.addEventListener("click", closeLightbox);
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeLightbox();
  });

  document.addEventListener("click", function(e) {
    var t = e.target;
    if (!(t instanceof HTMLElement)) return;
    var card = t.closest(".photoCard");
    if (!card) return;
    var imgEl = card.querySelector("img.photoImg");
    if (imgEl && imgEl.getAttribute("src")) {
      var fig = t.closest("figure");
      var caption = "";
      if (fig) {
        var capEl = fig.querySelector(".photoCap");
        if (capEl) caption = capEl.textContent || "";
      }
      openLightbox(imgEl.getAttribute("src"), caption, imgEl.getAttribute("alt") || caption);
    }
  });
}

// ============================================
// News
// ============================================

function renderNews() {
  var wrap = document.getElementById("newsGrid");
  if (!wrap) return;

  var cfg = getConfig();
  var itemsRaw = cfg.news || [];
  var items = itemsRaw.slice().sort(function(a, b) {
    return String(b.date).localeCompare(String(a.date));
  });

  if (!items.length) {
    wrap.innerHTML = '<div class="muted">現在お知らせはありません。</div>';
    return;
  }

  var html = "";
  for (var i = 0; i < items.length; i++) {
    var n = items[i];
    var dateLabel = formatDateLabel(n.date);
    var link = n.url
      ? '<a class="newsLink" href="' + escapeHtml(n.url) + '" target="_blank" rel="noopener noreferrer">詳細を見る</a>'
      : "";
    html += '<article class="newsItem">' +
      '<div class="newsTop">' +
        '<span class="badge badge--' + escapeHtml((n.tag || "NEWS").toLowerCase()) + '">' + escapeHtml(n.tag || "NEWS") + '</span>' +
        (dateLabel ? '<span class="newsDate">' + escapeHtml(dateLabel) + '</span>' : '') +
      '</div>' +
      '<h3 class="newsTitle">' + escapeHtml(n.title || "") + '</h3>' +
      (n.body ? '<p class="newsBody">' + escapeHtml(n.body) + '</p>' : '') +
      link +
    '</article>';
  }
  wrap.innerHTML = html;
}

// ============================================
// Copy（テキストコンテンツ）
// ============================================

function renderCopy() {
  var cfg = getConfig();
  var c = cfg.copy;
  if (!c) return;

  // Hero
  var kicker = document.getElementById("heroKicker");
  var h1 = document.getElementById("heroHeadline");
  var lead = document.getElementById("heroLead");
  var sub = document.getElementById("heroSub");
  
  if (kicker && c.hero) kicker.textContent = c.hero.kicker || "";
  if (h1 && c.hero) h1.textContent = c.hero.headline || "";
  if (lead && c.hero) lead.textContent = c.hero.lead || "";
  if (sub && c.hero) sub.textContent = c.hero.sub || "";

  // Key Facts
  var kf = document.getElementById("keyFactsList");
  if (kf && c.facts) {
    var facts = c.facts;
    var kfHtml = "";
    for (var j = 0; j < facts.length; j++) {
      var f = facts[j];
      kfHtml += '<li><span class="keyFacts__label">' + escapeHtml(f.label) + '</span><span class="keyFacts__value">' + escapeHtml(f.value) + '</span></li>';
    }
    kf.innerHTML = kfHtml;
  }

  // Story
  var st = document.getElementById("storyTitle");
  if (st && c.story) st.textContent = c.story.title || "Our Story";

  var sb = document.getElementById("storyBody");
  if (sb && c.story && c.story.body) {
    var storyLines = c.story.body;
    var sbHtml = "";
    for (var m = 0; m < storyLines.length; m++) {
      sbHtml += '<p>' + escapeHtml(storyLines[m]) + '</p>';
    }
    sb.innerHTML = sbHtml;
  }

  // Timeline
  var tl = document.getElementById("timelineList");
  if (tl && c.timeline) {
    var rows = c.timeline;
    var tlHtml = "";
    for (var p = 0; p < rows.length; p++) {
      var r = rows[p];
      var highlightClass = r.highlight ? ' class="timeline__item--highlight"' : '';
      tlHtml += '<li' + highlightClass + '><span class="timeline__year">' + escapeHtml(r.year) + '</span><span class="timeline__text">' + escapeHtml(r.text) + '</span></li>';
    }
    tl.innerHTML = tlHtml;
  }
}

// ============================================
// Road to the World（進捗表示）
// ============================================

function renderRoadProgress() {
  var cfg = getConfig();
  var proj = cfg.project;
  if (!proj) return;

  var bar = document.getElementById("roadProgressBar");
  var pct = document.getElementById("roadProgressPct");
  var raised = document.getElementById("roadRaised");
  var goal = document.getElementById("roadGoal");

  var goalYen = proj.goalYen || 1000000;
  var raisedYen = proj.raisedYen || 0;
  var percent = Math.min(Math.round((raisedYen / goalYen) * 100), 100);

  if (bar) bar.style.width = percent + "%";
  if (pct) pct.textContent = percent + "%";
  if (raised) raised.textContent = yen(raisedYen) + "円";
  if (goal) goal.textContent = yen(goalYen) + "円";
}

// ============================================
// 応援メッセージ
// ============================================

async function fetchMessages() {
  var cfg = getConfig();
  var msgCfg = cfg.supportMessages;
  if (!msgCfg || !msgCfg.dataUrl) return [];

  try {
    var url = msgCfg.dataUrl + "?v=" + Date.now();
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    
    // approved のみ、日付降順
    return data
      .filter(function(m) { return m.approved !== false && m.message; })
      .sort(function(a, b) { return String(b.date).localeCompare(String(a.date)); });
  } catch (e) {
    console.error("メッセージ取得失敗:", e);
    return [];
  }
}

async function renderMessagesPreview() {
  var grid = document.getElementById("roadMessagesPreview");
  if (!grid) return;

  var cfg = getConfig();
  var msgCfg = cfg.supportMessages || {};
  
  if (!msgCfg.enabled) {
    grid.innerHTML = '';
    return;
  }

  var messages = await fetchMessages();
  var max = 3; // プレビューは3件
  var items = messages.slice(0, max);

  if (items.length === 0) {
    grid.innerHTML = '<p class="muted">応援メッセージを募集中です</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < items.length; i++) {
    var m = items[i];
    html += '<div class="msgCard msgCard--mini">' +
      '<p class="msgBody">' + escapeHtml(m.message) + '</p>' +
      '<div class="msgMeta">' + escapeHtml(m.name || "匿名") + '</div>' +
    '</div>';
  }
  grid.innerHTML = html;
}

// ============================================
// スポンサー
// ============================================

function renderSponsors() {
  var grid = document.getElementById("sponsorsGrid");
  if (!grid) return;

  var cfg = getConfig();
  var s = cfg.sponsors;
  var sec = document.getElementById("sponsorsSection");

  if (!s || !s.enabled) {
    if (sec) sec.style.display = "none";
    return;
  }

  var titleEl = document.getElementById("sponsorsTitle");
  if (titleEl) titleEl.textContent = s.title || "Sponsors";

  var today = new Date();
  var rawItems = Array.isArray(s.items) ? s.items : [];
  var items = [];
  for (var i = 0; i < rawItems.length; i++) {
    var it = rawItems[i];
    if (it.approved === false) continue;
    if (it.showOnOfficial === false) continue;
    var exp = new Date(String(it.expiresAt || ""));
    if (isFinite(exp.getTime()) && exp.getTime() < today.getTime()) continue;
    items.push(it);
  }

  if (!items.length) {
    grid.innerHTML = '<p class="muted">スポンサーを募集しています</p>';
    return;
  }

  var html = "";
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var inner = '<div class="sponsorCard">';
    if (item.logo) {
      inner += '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name || "Sponsor") + '" loading="lazy" decoding="async">';
    } else {
      inner += '<div class="sponsorName">' + escapeHtml(item.name || "") + '</div>';
    }
    inner += '</div>';

    if (item.url) {
      html += '<a class="sponsorLink" href="' + escapeHtml(item.url) + '" target="_blank" rel="nofollow sponsored noopener noreferrer">' + inner + '</a>';
    } else {
      html += inner;
    }
  }
  grid.innerHTML = html;
}

// ============================================
// マスコット
// ============================================

function renderMascot() {
  var mf = document.getElementById("mascotFloat");
  var mfImg = document.getElementById("mascotFloatImg");
  if (!mf || !mfImg) return;

  var cfg = getConfig();
  var imgs = cfg.siteImages || {};
  var m = imgs.mascot || {};

  if (m.enabled && m.src) {
    mfImg.src = m.src;
    mfImg.alt = m.alt || "マスコット";
    mf.style.display = "block";
    mf.setAttribute("aria-hidden", "false");
  } else {
    mf.style.display = "none";
    mf.setAttribute("aria-hidden", "true");
  }
}

// ============================================
// シェアボタン
// ============================================

function wireWebShare() {
  var ui = getConfigValue("ui", {});
  var btn = document.getElementById("shareBtn");
  if (!btn) return;

  if (ui.showShareButton === false) {
    btn.style.display = "none";
    return;
  }

  var title = document.title;
  var text = "POM PUPPYS bright 公式サイト";
  var url = location.href;

  btn.style.display = "inline-flex";

  btn.addEventListener("click", async function() {
    try {
      if (navigator.share) {
        await navigator.share({ title: title, text: text, url: url });
      } else {
        if (navigator.clipboard) await navigator.clipboard.writeText(url);
        var prev = btn.textContent;
        btn.textContent = "URLをコピーしました";
        setTimeout(function() { btn.textContent = prev || "共有"; }, 1400);
      }
    } catch (e) {}
  });
}

// ============================================
// リンク設定
// ============================================

function wireLinks() {
  var cfg = getConfig();
  
  // Road to World リンク
  var roadLink = document.getElementById("roadProjectLink");
  if (roadLink) {
    var projUrl = (cfg.pages && cfg.pages.project) || "./project-world-challenge.html";
    roadLink.href = projUrl;
  }

  // メディアリンク
  var mediaLink = document.getElementById("mediaPageLink");
  if (mediaLink) {
    var mediaUrl = (cfg.pages && cfg.pages.media) || "./media.html";
    mediaLink.href = mediaUrl;
  }

  // スポンサーリンク
  var sponsorLink = document.getElementById("sponsorPageLink");
  if (sponsorLink) {
    var sponsorUrl = (cfg.pages && cfg.pages.sponsor) || "./sponsor.html";
    sponsorLink.href = sponsorUrl;
  }

  // お問い合わせメール
  var contactLink = document.getElementById("contactMailLink");
  if (contactLink && cfg.pressEmail) {
    var subject = encodeURIComponent("【お問い合わせ】POM PUPPYS bright");
    var body = encodeURIComponent("お問い合わせ内容をご記入ください。\n\n");
    contactLink.href = "mailto:" + cfg.pressEmail + "?subject=" + subject + "&body=" + body;
  }
}

// ============================================
// スクロールアニメーション
// ============================================

function setupScrollAnimations() {
  var targets = document.querySelectorAll(".section, .card, .photoCard, .memberCard, .newsItem");
  
  if (!("IntersectionObserver" in window)) {
    // フォールバック: 全て表示
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add("isVisible");
    }
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    for (var j = 0; j < entries.length; j++) {
      if (entries[j].isIntersecting) {
        entries[j].target.classList.add("isVisible");
      }
    }
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  for (var k = 0; k < targets.length; k++) {
    observer.observe(targets[k]);
  }
}

// ============================================
// メディアページ用関数
// ============================================

function wireMediaKit() {
  var cfg = getConfig();
  var url = cfg.mediaKitUrl;
  var btn = document.getElementById("mediaKitBtn");
  if (!btn) return;
  if (!url) {
    btn.style.display = "none";
    return;
  }
  btn.href = url;
}

function wirePressMail() {
  var cfg = getConfig();
  var email = cfg.pressEmail;
  var name = cfg.pressContactName || "";
  var btn = document.getElementById("pressMailBtn");
  if (!btn || !email) return;
  var subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  var body = encodeURIComponent("取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n（署名）\n" + name);
  btn.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
}

function renderMediaTexts() {
  var cfg = getConfig();
  var m = cfg.mediaTexts;
  if (!m) return;

  var credit = document.getElementById("mediaCredit");
  var t100 = document.getElementById("text100");
  var t200 = document.getElementById("text200");
  var t400 = document.getElementById("text400");

  if (credit) credit.textContent = m.credit || "";
  if (t100) t100.textContent = m.short100 || "";
  if (t200) t200.textContent = m.mid200 || "";
  if (t400) t400.textContent = m.long400 || "";
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}
  try {
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
  } catch (e) {
    return false;
  }
}

function wireCopyButtons() {
  var buttons = document.querySelectorAll("[data-copy-target]");
  for (var i = 0; i < buttons.length; i++) {
    (function(btn) {
      btn.addEventListener("click", async function() {
        var id = btn.getAttribute("data-copy-target");
        var el = document.getElementById(id);
        if (!el) return;
        var text = el.textContent || "";
        var ok = await copyText(text.trim());
        var prev = btn.textContent;
        btn.textContent = ok ? "コピーしました" : "コピー失敗";
        setTimeout(function() { btn.textContent = prev; }, 1300);
      });
    })(buttons[i]);
  }
}

// ============================================
// 初期化
// ============================================

async function initSite() {
  renderCopy();
  renderNews();
  wireLinks();
  wireWebShare();
  renderRoadProgress();
  renderSponsors();
  renderMascot();
  
  // 非同期処理
  await renderHeroMedia();
  await renderMembers();
  await renderPhotos();
  await renderMessagesPreview();
  
  setupLightbox();
  setupScrollAnimations();
}

function initMedia() {
  wireMediaKit();
  wirePressMail();
  renderMediaTexts();
  wireCopyButtons();
}

document.addEventListener("DOMContentLoaded", function() {
  var page = document.body.dataset.page || document.body.getAttribute("data-page");
  if (page === "media") {
    initMedia();
  } else {
    initSite();
  }
});
