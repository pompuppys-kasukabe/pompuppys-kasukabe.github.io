/* main.js - POM PUPPYS bright（Notion + Google Drive 連携版） */

// ============================================
// 写真API設定
// ============================================

var PHOTOS_API_URL = "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec";

// ============================================
// ユーティリティ関数（utils.jsから読み込み）
// ============================================
// escapeHtml, formatDateLabel, yen, getConfig, getConfigValue は utils.js で定義

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
  var wrap = document.getElementById("heroPhotoWrap");
  var video = document.getElementById("heroVideo");
  var img = document.getElementById("heroPhoto");

  if (!wrap || !img) {
    return;
  }

  var cfg = getConfig();
  var imgs = cfg.siteImages || {};
  var videoCfg = imgs.heroVideo || {};

  var photos = await fetchPhotos();
  var hero = photos.hero;

  // 画像ソースの決定
  var imgSrc = "";
  var imgAlt = "POM PUPPYS bright";

  if (hero && hero.driveId) {
    imgSrc = getDriveImageUrl(hero.driveId);
    imgAlt = hero.alt || imgAlt;
  } else if (imgs.heroImage) {
    imgSrc = imgs.heroImage;
    imgAlt = imgs.heroImageAlt || imgAlt;
  }

  // 動画が有効な場合
  if (video && videoCfg.enabled) {
    var mp4 = videoCfg.mp4 || "";
    var webm = videoCfg.webm || "";

    if (mp4 || webm) {
      // ポスター画像の設定
      var poster = videoCfg.poster || imgSrc || "";
      if (poster) {
        video.setAttribute("poster", poster);
      }

      // video要素のクリア
      video.innerHTML = "";

      // ソースの追加
      if (webm) {
        var sourceWebm = document.createElement("source");
        sourceWebm.src = webm;
        sourceWebm.type = "video/webm";
        video.appendChild(sourceWebm);
      }
      if (mp4) {
        var sourceMp4 = document.createElement("source");
        sourceMp4.src = mp4;
        sourceMp4.type = "video/mp4";
        video.appendChild(sourceMp4);
      }

      // 動画属性の設定
      video.muted = true;
      video.playsInline = true;
      video.loop = videoCfg.loop !== false;

      // 動画を表示、画像を非表示
      video.style.display = "block";
      img.style.display = "none";
      wrap.style.display = "block";

      // エラー時は画像にフォールバック
      video.onerror = function() {
        video.style.display = "none";
        if (imgSrc) {
          img.src = imgSrc;
          img.alt = imgAlt;
          img.style.display = "block";
        }
      };

      // 自動再生（prefers-reduced-motion考慮）
      var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        video.play().catch(function() {
          // 自動再生失敗時は何もしない
        });
      }

      return;
    }
  }

  // 動画が無効または利用不可の場合は画像を表示
  if (video) {
    video.style.display = "none";
  }

  if (imgSrc) {
    img.src = imgSrc;
    img.alt = imgAlt;
    img.style.display = "block";
    wrap.style.display = "block";
  } else {
    wrap.style.display = "none";
  }
}

// ============================================
// メンバー写真
// ============================================

async function renderMembers() {
  var container = document.getElementById("membersGrid");
  if (!container) return;

  var photos = await fetchPhotos();
  var members = photos.members || [];

  if (members.length === 0) {
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    members = imgs.members || [];
  }

  container.innerHTML = "";

  members.forEach(function(member) {
    var src = member.driveId 
      ? getDriveImageUrl(member.driveId) 
      : member.src;
    var name = member.title || member.name || "Member";

    var card = document.createElement("div");
    card.className = "memberCard";
    card.innerHTML = 
      '<img src="' + src + '" alt="' + name + '" class="memberPhoto" loading="lazy">' +
      '<p class="memberName">' + name + '</p>';
    container.appendChild(card);
  });
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
      sbHtml += '<p>' + storyLines[m] + '</p>';
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
  if (raised) raised.textContent = yen(raisedYen);
  if (goal) goal.textContent = yen(goalYen);
}

// ============================================
// 応援メッセージ
// ============================================

async function fetchMessages() {
  var cfg = getConfig();
  var msgCfg = cfg.supportMessages;
  if (!msgCfg) return [];

  try {
    var url;

    // Notion API連携を使用する場合
    if (msgCfg.useNotionAPI) {
      url = PHOTOS_API_URL + "?action=getMessages&t=" + Date.now();
    }
    // 従来のJSONファイルを使用する場合
    else if (msgCfg.dataUrl) {
      url = msgCfg.dataUrl + "?v=" + Date.now();
    } else {
      return [];
    }

    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();

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
  var max = 3;
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
  
  var roadLink = document.getElementById("roadProjectLink");
  if (roadLink) {
    var projUrl = (cfg.pages && cfg.pages.project) || "./project-world-challenge.html";
    roadLink.href = projUrl;
  }

  var mediaLink = document.getElementById("mediaPageLink");
  if (mediaLink) {
    var mediaUrl = (cfg.pages && cfg.pages.media) || "./media.html";
    mediaLink.href = mediaUrl;
  }

  var sponsorLink = document.getElementById("sponsorPageLink");
  if (sponsorLink) {
    var sponsorUrl = (cfg.pages && cfg.pages.sponsor) || "./sponsor.html";
    sponsorLink.href = sponsorUrl;
  }

  var contactLink = document.getElementById("contactMailLink");
  if (contactLink && cfg.pressEmail) {
    var subject = encodeURIComponent("【お問い合わせ】POM PUPPYS bright");
    var body = encodeURIComponent("お問い合わせ内容をご記入ください。\n\n");
    contactLink.href = "mailto:" + cfg.pressEmail + "?subject=" + subject + "&body=" + body;
  }
}

// ============================================
// ハンバーガーメニュー
// ============================================

function setupHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var navList = document.querySelector(".nav-list");

  if (!hamburger || !navList) return;

  hamburger.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    navList.classList.toggle("is-open");
    hamburger.classList.toggle("is-active");
  });

  // メニュー項目をクリックしたら閉じる
  var navLinks = navList.querySelectorAll("a");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function() {
      navList.classList.remove("is-open");
      hamburger.classList.remove("is-active");
    });
  }
}

// ============================================
// スクロールアニメーション
// ============================================

function setupScrollAnimations() {
  var targets = document.querySelectorAll(".section, .card, .photoCard, .memberCard, .newsItem");
  
  if (!("IntersectionObserver" in window)) {
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
  var btn = document.getElementById("pressMailBtn");
  if (!btn || !email) return;
  var subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  var body = encodeURIComponent("取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n");
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
// 応援メッセージフォーム
// ============================================

function setupMessageForm() {
  var cfg = getConfig();
  var msgCfg = cfg.supportMessages || {};
  var btn = document.getElementById("sendMessageBtn");

  if (!btn || !msgCfg.formUrl) return;

  // TallyフォームIDを抽出（https://tally.so/r/Y50Z5v → Y50Z5v）
  var formId = msgCfg.formUrl.split('/').pop();

  // 現在の日付を取得（YYYY-MM-DD形式）
  var today = new Date();
  var dateStr = today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');

  // Tallyポップアップ用の属性を設定（日付パラメータを追加）
  btn.setAttribute("data-tally-open", formId);
  btn.setAttribute("data-tally-hidden-fields", JSON.stringify({ date: dateStr }));
  btn.setAttribute("data-tally-emoji-text", "👋");
  btn.setAttribute("data-tally-emoji-animation", "wave");

  btn.style.display = "inline-flex";
}

// ============================================
// カウントダウンタイマー
// ============================================

function initCountdown() {
  var config = getConfig();
  if (!config.danceSummit || !config.danceSummit.countdown || !config.danceSummit.countdown.enabled) {
    return;
  }

  var timer = document.getElementById("countdownTimer");
  if (!timer) return;

  var targetDate = new Date(config.danceSummit.date);

  // タイトル設定
  var titleEl = document.getElementById("countdownTitle");
  if (titleEl && config.danceSummit.countdown.title) {
    titleEl.textContent = config.danceSummit.countdown.title;
  }

  function updateCountdown() {
    var now = new Date();
    var diff = targetDate - now;

    if (diff <= 0) {
      // イベント終了
      timer.style.display = "none";
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("countdownDays").textContent = days;
    document.getElementById("countdownHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("countdownMinutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("countdownSeconds").textContent = String(seconds).padStart(2, "0");

    timer.style.display = "block";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================
// Instagram埋め込みフィード
// ============================================

function renderInstagramFeed() {
  var config = getConfig();
  if (!config.instagram || !config.instagram.enabled) {
    return;
  }

  var section = document.getElementById("instagram");
  if (!section) return;

  // セクションを表示
  section.style.display = "block";

  var feedContainer = document.getElementById("instagramFeed");
  if (!feedContainer) return;

  // API URLが設定されていない場合はプレースホルダー表示
  if (!config.instagram.apiUrl) {
    feedContainer.innerHTML = '<div class="instagram-placeholder">' +
      '<p style="margin-bottom: 16px;">📸 Instagramで最新の活動をチェック！</p>' +
      '<a href="https://www.instagram.com/' + escapeHtml(config.instagram.username) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">' +
      '@' + escapeHtml(config.instagram.username) + ' をフォロー' +
      '</a>' +
      '</div>';
    return;
  }

  // ローディング表示
  feedContainer.innerHTML = '<div class="instagram-placeholder">読み込み中...</div>';

  // キャッシュチェック
  var cacheKey = 'instagram_feed_cache';
  var cacheTimeKey = 'instagram_feed_cache_time';
  var cachedData = localStorage.getItem(cacheKey);
  var cacheTime = localStorage.getItem(cacheTimeKey);
  var cacheMinutes = config.instagram.cacheMinutes || 30;
  var now = new Date().getTime();

  // キャッシュが有効な場合は使用
  if (cachedData && cacheTime && (now - parseInt(cacheTime)) < cacheMinutes * 60 * 1000) {
    try {
      var posts = JSON.parse(cachedData);
      displayInstagramPosts(posts, feedContainer, config);
      return;
    } catch (e) {
      console.error('Instagram cache parse error:', e);
    }
  }

  // APIからデータ取得
  fetch(config.instagram.apiUrl + '?action=getInstagramFeed')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success && data.data && data.data.length > 0) {
        var posts = data.data.slice(0, config.instagram.displayCount);

        // キャッシュに保存
        try {
          localStorage.setItem(cacheKey, JSON.stringify(posts));
          localStorage.setItem(cacheTimeKey, now.toString());
        } catch (e) {
          console.error('Instagram cache save error:', e);
        }

        displayInstagramPosts(posts, feedContainer, config);
      } else {
        // データがない場合
        feedContainer.innerHTML = '<div class="instagram-placeholder">' +
          '<p style="margin-bottom: 16px;">📸 Instagramで最新の活動をチェック！</p>' +
          '<a href="https://www.instagram.com/' + escapeHtml(config.instagram.username) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">' +
          '@' + escapeHtml(config.instagram.username) + ' をフォロー' +
          '</a>' +
          '</div>';
      }
    })
    .catch(function(error) {
      console.error('Instagram API error:', error);
      feedContainer.innerHTML = '<div class="instagram-placeholder">' +
        '<p style="margin-bottom: 16px;">投稿の読み込みに失敗しました</p>' +
        '<a href="https://www.instagram.com/' + escapeHtml(config.instagram.username) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">' +
        '@' + escapeHtml(config.instagram.username) + ' をフォロー' +
        '</a>' +
        '</div>';
    });
}

function displayInstagramPosts(posts, container, config) {
  var html = posts.map(function(post) {
    var caption = post.caption ? escapeHtml(post.caption.substring(0, 100)) + (post.caption.length > 100 ? '...' : '') : '';

    return '<a href="' + escapeHtml(post.permalink) + '" target="_blank" rel="noopener noreferrer" class="instagram-post">' +
      '<img src="' + escapeHtml(post.mediaUrl) + '" alt="Instagram post" loading="lazy">' +
      (caption ? '<div class="instagram-post__overlay">' + caption + '</div>' : '') +
      '</a>';
  }).join('');

  container.innerHTML = html;
}

// ============================================
// メディア掲載セクション
// ============================================

function renderMediaFeatures() {
  var config = getConfig();
  if (!config.mediaFeatures || config.mediaFeatures.length === 0) {
    return;
  }

  var section = document.getElementById("media-features");
  if (!section) return;

  section.style.display = "block";

  var grid = document.getElementById("mediaFeaturesGrid");
  if (!grid) return;

  var html = config.mediaFeatures.map(function(media) {
    var url = media.url || "#";
    var target = media.url ? ' target="_blank" rel="noopener noreferrer"' : '';
    var date = media.date ? '<span class="mediaFeature__date">' + escapeHtml(media.date) + '</span>' : '';

    return '<a href="' + escapeHtml(url) + '" class="mediaFeature"' + target + '>' +
      '<img src="' + escapeHtml(media.logo) + '" alt="' + escapeHtml(media.name) + '">' +
      date +
      '</a>';
  }).join("");

  grid.innerHTML = html;
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
  setupHamburgerMenu();
  setupMessageForm();

  // 新機能の初期化
  initCountdown();
  renderInstagramFeed();
  renderMediaFeatures();

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
