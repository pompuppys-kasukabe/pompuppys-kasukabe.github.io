/* main.js - POM PUPPYS bright（Notion + Google Drive 連携版 + Swiper カルーセル） */

// ============================================
// 写真API設定
// ============================================

var PHOTOS_API_URL = "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec";

// ============================================
// Swiper インスタンス管理
// ============================================

var teamSwiper = null;
var photosSwiper = null;
var photosThumbs = null;
var instagramSwiper = null;

// ============================================
// ユーティリティ関数（utils.jsから読み込み）
// ============================================
// escapeHtml, formatDateLabel, yen, getConfig, getConfigValue は utils.js で定義

// ============================================
// 写真データ取得（GAS API経由）
// ============================================

var photosCache = null;

async function fetchPhotos() {
  // メモリキャッシュチェック
  if (photosCache) return photosCache;

  var cachedData = null;
  var cachedTime = null;
  var now = Date.now();
  var cacheMinutes = 30;

  // localStorage アクセス（Safari/iPad でブロックされる可能性があるためtry-catch）
  try {
    // URLパラメータでキャッシュクリア（?reload=1 でキャッシュ削除）
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reload') === '1') {
      localStorage.removeItem('photos_data');
      localStorage.removeItem('photos_time');
      console.log('📸 写真キャッシュをクリアしました');
    }

    cachedData = localStorage.getItem('photos_data');
    cachedTime = localStorage.getItem('photos_time');

    if (cachedData && cachedTime) {
      var elapsed = (now - parseInt(cachedTime, 10)) / 1000 / 60;
      if (elapsed < cacheMinutes) {
        photosCache = JSON.parse(cachedData);
        console.log('📸 写真データをキャッシュから取得（残り ' + Math.round(cacheMinutes - elapsed) + '分）');
        return photosCache;
      }
    }
  } catch (storageError) {
    console.warn('📸 localStorage アクセス不可（プライベートモード等）:', storageError);
  }

  // APIから取得
  try {
    var url = PHOTOS_API_URL + "?action=getPhotos&t=" + now;
    var res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();

    // キャッシュに保存（可能な場合のみ）
    photosCache = data;
    try {
      localStorage.setItem('photos_data', JSON.stringify(data));
      localStorage.setItem('photos_time', now.toString());
      console.log('📸 写真データをAPIから取得してキャッシュ');
    } catch (e) {
      console.log('📸 写真データをAPIから取得（キャッシュ保存不可）');
    }

    return photosCache;
  } catch (e) {
    console.error("写真データ取得失敗:", e);

    // エラー時は古いキャッシュでも使用
    if (cachedData) {
      console.log('📸 エラーのため古いキャッシュを使用');
      try {
        return JSON.parse(cachedData);
      } catch (parseErr) {
        console.error('キャッシュ解析失敗:', parseErr);
      }
    }

    return { hero: null, gallery: [], members: [] };
  }
}

// iPad/iOS Safari検出
function isIOSSafari() {
  var ua = navigator.userAgent;
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
  return isIOS && isSafari;
}

// Google Drive画像URL生成
function getDriveImageUrl(fileId, width) {
  if (!fileId) return "";

  // iOS Safariでは別のURL形式を使用（thumbnailがブロックされるため）
  if (isIOSSafari()) {
    // console.log('[DEBUG] iOS Safari detected, using alternative Google Drive URL');
    // Google CDN形式を試す
    return "https://lh3.googleusercontent.com/d/" + fileId;
  }

  var w = width || 600;
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
      video.removeAttribute('loop'); // loop属性を明示的に削除

      // 動画を表示、画像を非表示
      video.style.display = "block";
      video.style.opacity = "1";
      img.style.display = "none";
      wrap.style.display = "block";

      // エラー時は画像にフォールバック
      video.onerror = function() {
        console.log('Hero video error - switching to image');
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
        // 動画終了時に静止画に切り替え（一度だけ実行）
        var switchedToImage = false;
        var switchToImage = function() {
          if (switchedToImage) return;
          switchedToImage = true;

          console.log('Hero video ended - switching to image');
          video.style.opacity = '0';
          video.style.transition = 'opacity 0.8s ease';

          setTimeout(function() {
            video.style.display = 'none';
            if (imgSrc) {
              img.src = imgSrc;
              img.alt = imgAlt;
              img.style.display = 'block';
              img.style.opacity = '0';

              // 少し遅らせてフェードイン
              setTimeout(function() {
                img.style.transition = 'opacity 0.8s ease';
                img.style.opacity = '1';
              }, 50);
            }
          }, 800);
        };

        video.addEventListener('ended', switchToImage, { once: true });

        video.play().catch(function(error) {
          // 自動再生失敗時は静止画を表示
          console.log('Hero video autoplay failed:', error);
          video.style.display = 'none';
          if (imgSrc) {
            img.src = imgSrc;
            img.alt = imgAlt;
            img.style.display = 'block';
          }
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
// メンバー写真（Swiperカルーセル対応）
// ============================================

async function renderMembers() {
  // console.log('[DEBUG] renderMembers started');
  var container = document.getElementById("membersGrid");
  if (!container) {
    // console.log('[DEBUG] membersGrid container not found');
    return;
  }

  var photos = await fetchPhotos();
  // console.log('[DEBUG] fetchPhotos result:', photos);
  var members = photos.members || [];
  // console.log('[DEBUG] members from API:', members.length);

  if (members.length === 0) {
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    members = imgs.members || [];
    // console.log('[DEBUG] members from config fallback:', members.length);
  }

  if (members.length === 0) {
    // console.log('[DEBUG] No members found, showing placeholder');
    container.innerHTML = '<div class="swiper-slide"><p class="muted">メンバー情報は準備中です</p></div>';
    return;
  }
  // console.log('[DEBUG] Rendering', members.length, 'members');

  container.innerHTML = "";

  // config.jsのフォールバック画像を取得
  var cfg = getConfig();
  var fallbackMembers = (cfg.siteImages && cfg.siteImages.members) || [];

  members.forEach(function(member, index) {
  var driveUrl = member.driveId ? getDriveImageUrl(member.driveId) : '';
  var fallbackSrc = fallbackMembers[index] ? fallbackMembers[index].src : '';
  // Google Drive URLが空（iOS Safari等）の場合はフォールバックを使用
  var src = driveUrl || member.src || fallbackSrc;
  var name = member.title || member.name || "Member";
  var comment = member.comment || member.description || member.alt || "";

  if (!src) {
    // console.log('[DEBUG] No image source for member:', name);
    return;
  }

  // Swiper用にswiper-slideクラスを追加
  var slide = document.createElement("div");
  slide.className = "swiper-slide";

  var card = document.createElement("div");
  card.className = "memberCard";

  // 画像要素を作成（onerrorでフォールバック）
  var img = document.createElement("img");
  img.src = src;
  img.alt = name;
  img.className = "memberPhoto";
  img.loading = "lazy";
  // srcがフォールバックでない場合のみonerrorを設定
  if (fallbackSrc && src !== fallbackSrc) {
    img.onerror = function() {
      // console.log('[DEBUG] Image failed, using fallback:', fallbackSrc);
      this.onerror = null;
      this.src = fallbackSrc;
    };
  }

  var nameP = document.createElement("p");
  nameP.className = "memberName";
  nameP.textContent = name;

  card.appendChild(img);
  card.appendChild(nameP);

  // コメントがある場合は追加（初期は非表示、下に伸びる）
  if (comment) {
    var commentDiv = document.createElement("div");
    commentDiv.className = "memberComment";
    commentDiv.innerHTML = '<p>' + escapeHtml(comment) + '</p>';
    card.appendChild(commentDiv);
  }

  // クリックでコメント表示/非表示を切り替え（下に伸びる）
  if (comment) {
    card.addEventListener('click', function(e) {
      e.stopPropagation();
      var isExpanded = card.classList.contains('is-expanded');
      
      // 他のカードを閉じる
      var allCards = document.querySelectorAll('.memberCard.is-expanded');
      allCards.forEach(function(c) {
        c.classList.remove('is-expanded');
      });
      
      // クリックしたカードを開閉
      if (!isExpanded) {
        card.classList.add('is-expanded');
      }
    });
    card.style.cursor = 'pointer';
  }

  slide.appendChild(card);
  container.appendChild(slide);
});


  // Swiperを初期化
  initTeamSwiper(members.length);
}

function initTeamSwiper(memberCount) {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper is not loaded');
    return;
  }

  // 既存のSwiperを破棄
  if (teamSwiper) {
    teamSwiper.destroy(true, true);
    teamSwiper = null;
  }

  var swiperElement = document.querySelector('.teamSwiper');
  if (!swiperElement) return;

  teamSwiper = new Swiper('.teamSwiper', {
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: 24,
    slidesPerGroup: 1,
    initialSlide: 0,
    loop: memberCount > 3,
    loopAdditionalSlides: 2,
    allowTouchMove: false,
    speed: 500,
    pagination: {
      el: '.teamSwiper .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.teamSwiper .swiper-button-next',
      prevEl: '.teamSwiper .swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerGroup: 1,
        spaceBetween: 32,
      },
      1024: {
        slidesPerGroup: 1,
        spaceBetween: 32,
      }
    }
  });
}

// ============================================
// フォトギャラリー（Swiperカルーセル対応）
// ============================================

async function renderPhotos() {
  var grid = document.getElementById("photoGrid");
  var thumbsContainer = document.getElementById("photoThumbs");
  var section = document.getElementById("photos");
  if (!grid) return;

  grid.innerHTML = '<div class="swiper-slide swiper-loading"></div>';

  // Intersection Observerでスマートプリロード
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        observer.disconnect();
        loadPhotosContent(grid, thumbsContainer, section);
      }
    });
  }, {
    rootMargin: '500px'
  });

  observer.observe(section || grid);
}

async function loadPhotosContent(grid, thumbsContainer, section) {
  var photos = await fetchPhotos();
  var gallery = (photos.gallery || []).slice().sort(function(a, b) {
    return (a.slot || 0) - (b.slot || 0);
  });

  if (gallery.length === 0) {
    var cfg = getConfig();
    var imgs = cfg.siteImages || {};
    gallery = imgs.gallery || [];
  }

  if (gallery.length === 0) {
    if (section) section.style.display = "none";
    grid.innerHTML = '<div class="swiper-slide"><p class="muted">写真は準備中です</p></div>';
    return;
  }

  if (section) section.style.display = "";

  // メインスライド生成
  var mainHtml = "";
  var thumbHtml = "";

  for (var i = 0; i < gallery.length; i++) {
    var item = gallery[i];
    var src = item.driveId ? getDriveImageUrl(item.driveId) : item.src;
    if (!src) continue;
    
    var title = escapeHtml(item.title || "");
    var alt = escapeHtml(item.alt || item.title || "Photo");

    mainHtml += '<div class="swiper-slide">' +
      '<figure class="photoCard">' +
        '<img class="photoImg" src="' + escapeHtml(src) + '" alt="' + alt + '" loading="lazy">' +
        (title ? '<figcaption class="photoCap">' + title + '</figcaption>' : '') +
      '</figure>' +
    '</div>';

    thumbHtml += '<div class="swiper-slide">' +
      '<img src="' + escapeHtml(src) + '" alt="' + alt + '" loading="lazy">' +
    '</div>';
  }

  grid.innerHTML = mainHtml;
  if (thumbsContainer) thumbsContainer.innerHTML = thumbHtml;

  // Swiperを初期化
  initPhotosSwiper(gallery.length);
}

function initPhotosSwiper(photoCount) {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper is not loaded');
    return;
  }

  // 既存のSwiperを破棄
  if (photosThumbs) {
    photosThumbs.destroy(true, true);
    photosThumbs = null;
  }
  if (photosSwiper) {
    photosSwiper.destroy(true, true);
    photosSwiper = null;
  }

  // サムネイルSwiper
  var thumbsElement = document.querySelector('.photosThumbs');
  if (thumbsElement) {
    photosThumbs = new Swiper('.photosThumbs', {
      spaceBetween: 12,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        480: {
          slidesPerView: 5,
        },
        768: {
          slidesPerView: 6,
        },
        1024: {
          slidesPerView: 8,
        }
      }
    });
  }

  // メインSwiper
  var mainElement = document.querySelector('.photosSwiper');
  if (mainElement) {
    photosSwiper = new Swiper('.photosSwiper', {
      spaceBetween: 10,
      slidesPerGroup: 1,  // ← この1行を追加
      loop: photoCount > 1,
      grabCursor: true,
      speed: 500,
      navigation: {
        nextEl: '.photosSwiper .swiper-button-next',
        prevEl: '.photosSwiper .swiper-button-prev',
      },
      thumbs: {
        swiper: photosThumbs,
      },
    });
  }
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

    // キャプションの改行を<br>に変換
    if (caption) {
      var formattedCaption = escapeHtml(caption).replace(/\n/g, '<br>');
      cap.innerHTML = formattedCaption;
    } else {
      cap.textContent = "";
    }

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

    // フォトギャラリーのライトボックス（Swiper内の画像）
    var photoCard = t.closest(".photoCard");
    if (photoCard) {
      var imgEl = photoCard.querySelector("img.photoImg");
      if (imgEl && imgEl.getAttribute("src")) {
        var fig = t.closest("figure");
        var caption = "";
        if (fig) {
          var capEl = fig.querySelector(".photoCap");
          if (capEl) caption = capEl.textContent || "";
        }
        openLightbox(imgEl.getAttribute("src"), caption, imgEl.getAttribute("alt") || caption);
      }
    }
  });
}

// ============================================
// News
// ============================================

function renderNews(options) {
  options = options || {};
  var limit = options.limit || 0; // 0 = 全件表示
  var showAllButton = options.showAllButton !== false; // デフォルトtrue

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

  var totalCount = items.length;
  var displayItems = limit > 0 ? items.slice(0, limit) : items;
  var hasMore = limit > 0 && totalCount > limit;

  var html = "";
  for (var i = 0; i < displayItems.length; i++) {
    var n = displayItems[i];
    var dateLabel = formatDateLabel(n.date);
    // 内部リンク（./で始まる）の場合はtarget="_blank"を付けない
    var isInternal = n.url && (n.url.indexOf('./') === 0 || n.url.indexOf('/') === 0);
    var link = n.url
      ? '<a class="newsLink" href="' + escapeHtml(n.url) + '"' + (isInternal ? '' : ' target="_blank" rel="noopener noreferrer"') + '>詳細を見る</a>'
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

  // 「ニュース一覧を見る」ボタン
  var moreWrap = document.getElementById("newsMoreWrap");
  if (moreWrap && hasMore && showAllButton) {
    moreWrap.innerHTML = '<a href="./news.html" class="btn btn--outline">ニュース一覧を見る <span class="newsMoreCount">(' + totalCount + '件)</span></a>';
  } else if (moreWrap) {
    moreWrap.innerHTML = '';
  }
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
      url = PHOTOS_API_URL + "?action=getMessages&limit=1000&t=" + Date.now();
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

    // データ形式の統一（Notion APIは{messages: []}、JSONは配列）
    var messages = data.messages || data;

    return messages
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

  // 千羽鶴プロジェクトの進捗を更新
  var messageCountEl = document.getElementById("messageCount");
  var progressBarFillEl = document.getElementById("progressBarFill");
  var goal = 1000;

  if (messageCountEl) {
    messageCountEl.textContent = messages.length.toLocaleString();
  }

  if (progressBarFillEl) {
    var percentage = Math.min((messages.length / goal) * 100, 100);
    progressBarFillEl.style.width = percentage + '%';
  }

  if (items.length === 0) {
    grid.innerHTML = '<p class="muted" style="text-align: center;">応援メッセージを募集中です</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < items.length; i++) {
    var m = items[i];
    html += '<div class="msgCard msgCard--mini">' +
      '<p class="msgBody">' + escapeHtml(m.message.substring(0, 80)) + (m.message.length > 80 ? '...' : '') + '</p>' +
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
      html += '<a class="sponsor-item-link" style="display:block;" href="' + escapeHtml(item.url) + '" target="_blank" rel="nofollow sponsored noopener noreferrer">' + inner + '</a>';
    } else {
      html += inner;
    }
  }
  grid.innerHTML = html;
}

// ============================================
// メディア掲載
// ============================================

function renderMedia() {
  var grid = document.getElementById("mediaGrid");
  if (!grid) return;

  var cfg = getConfig();
  var m = cfg.media;
  var sec = document.getElementById("mediaSection");

  if (!m || !m.enabled) {
    if (sec) sec.style.display = "none";
    return;
  }

  var titleEl = document.getElementById("mediaTitle");
  if (titleEl) titleEl.textContent = m.title || "Media";

  var items = Array.isArray(m.items) ? m.items : [];

  if (!items.length) {
    if (sec) sec.style.display = "none";
    return;
  }

  var html = "";
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var inner = '<div class="mediaCard">';
    if (item.logo) {
      inner += '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name || "Media") + '" loading="lazy" decoding="async">';
    } else {
      inner += '<div class="mediaName">' + escapeHtml(item.name || "") + '</div>';
    }
    if (item.date) {
      inner += '<span class="mediaDate">' + escapeHtml(item.date) + '</span>';
    }
    inner += '</div>';

    if (item.url) {
      html += '<a class="mediaLink" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
    } else {
      html += inner;
    }
  }
  grid.innerHTML = html;
}

// ============================================
// サポーター
// ============================================

function renderSupporters() {
  var grid = document.getElementById("supportersGrid");
  if (!grid) return;

  var cfg = getConfig();
  var s = cfg.supporters;
  var sec = document.getElementById("supportersSection");

  if (!s || !s.enabled) {
    if (sec) sec.style.display = "none";
    return;
  }

  var titleEl = document.getElementById("supportersTitle");
  if (titleEl) titleEl.textContent = s.title || "Supporters";

  var items = Array.isArray(s.items) ? s.items : [];

  if (!items.length) {
    if (sec) sec.style.display = "none";
    return;
  }

  var html = "";
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var inner = '<div class="supporterCard">';
    if (item.logo) {
      inner += '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name || "Supporter") + '" loading="lazy" decoding="async">';
    } else {
      inner += '<div class="supporterName">' + escapeHtml(item.name || "") + '</div>';
    }
    inner += '</div>';

    if (item.url) {
      html += '<a class="supporterLink" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
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

  // CAMPFIRE お気に入り登録ボタン
  var campfireBtn = document.getElementById("campfireFavoriteBtn");
  if (campfireBtn && cfg.project && cfg.project.crowdfundingUrl) {
    campfireBtn.href = cfg.project.crowdfundingUrl;
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
// Instagram埋め込みフィード（Swiperカルーセル対応）
// ============================================

async function renderInstagramFeed() {
  // console.log('[DEBUG] renderInstagramFeed started');
  var config = getConfig();
  if (!config.instagram || !config.instagram.enabled) {
    // console.log('[DEBUG] Instagram disabled in config');
    return;
  }

  var section = document.getElementById("instagram");
  if (!section) {
    // console.log('[DEBUG] Instagram section not found');
    return;
  }

  section.style.display = "block";

  var feedContainer = document.getElementById("instagramFeed");
  if (!feedContainer) {
    // console.log('[DEBUG] instagramFeed container not found');
    return;
  }
  // console.log('[DEBUG] Instagram containers found, setting up observer');

  feedContainer.innerHTML = '<div class="swiper-slide swiper-loading"></div>';

  // ページ読み込み直後にAPI取得開始（遅延なし）
  loadInstagramPosts(feedContainer, config);
}

async function loadInstagramPosts(feedContainer, config) {
  try {
    var posts = await fetchInstagramPosts();
    if (posts && posts.length > 0) {
      displayInstagramPosts(posts, feedContainer, config);
    } else {
      showInstagramPlaceholder(feedContainer, config);
    }
  } catch (error) {
    console.error("Instagram投稿の取得に失敗:", error);
    showInstagramPlaceholder(feedContainer, config);
  }
}

async function fetchInstagramPosts() {
  var config = getConfig();
  var apiUrl = config.instagram.apiUrl;

  if (!apiUrl) {
    console.error("Instagram API URLが設定されていません");
    return [];
  }

  try {
    // useNotionがtrueならNotion連携版を使用、falseならInstagram API版を使用
    var action = config.instagram.useNotion ? "getInstagramFeedFromNotion" : "getInstagramFeed";
    var url = apiUrl + "?action=" + action + "&t=" + Date.now();
    
    var res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();

    if (data.success && data.data) {
      return data.data.slice(0, config.instagram.displayCount || 6);
    }
    return [];
  } catch (error) {
    console.error("Instagram API エラー:", error);
    return [];
  }
}

function showInstagramPlaceholder(container, config) {
  container.innerHTML = '<div class="swiper-slide">' +
    '<div class="instagram-placeholder">' +
      '<p>📸 Instagramで最新の活動をチェック！</p>' +
      '<a href="https://www.instagram.com/' + escapeHtml(config.instagram.username) + '" target="_blank" rel="noopener noreferrer" class="btn btn-instagram">' +
        '<i class="fab fa-instagram"></i> @' + escapeHtml(config.instagram.username) + ' をフォロー' +
      '</a>' +
    '</div>' +
  '</div>';
}

function displayInstagramPosts(posts, container, config) {
  container.innerHTML = '';

  posts.forEach(function(post) {
    var caption = post.caption ? escapeHtml(post.caption.substring(0, 100)) + (post.caption.length > 100 ? '...' : '') : '';

    // Google Drive URLを取得（iOS Safariでは空になる）
    var driveUrl = post.driveId ? getDriveImageUrl(post.driveId, 600) : '';
    // フォールバック用Instagram直接URL
    var fallbackUrl = post.mediaUrl || post.image || '';
    // driveUrlが空の場合はフォールバックを使用
    var imageUrl = driveUrl || post.image || post.mediaUrl || '';

    var postUrl = post.url || post.permalink || post.instagramUrl;

    if (!imageUrl || !postUrl) {
      // console.log('[DEBUG] Instagram post skipped - no image or URL');
      return;
    }

    var slide = document.createElement('div');
    slide.className = 'swiper-slide';

    var link = document.createElement('a');
    link.href = postUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'instagram-post';

    var img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Instagram post';
    img.loading = 'lazy';
    // Google Drive画像が失敗したらInstagram直接URLにフォールバック
    if (fallbackUrl && fallbackUrl !== imageUrl) {
      img.onerror = function() {
        // console.log('[DEBUG] Instagram image failed, using fallback');
        this.onerror = null;
        this.src = fallbackUrl;
      };
    }

    link.appendChild(img);

    if (caption) {
      var overlay = document.createElement('div');
      overlay.className = 'instagram-post__overlay';
      overlay.innerHTML = '<p>' + caption + '</p>';
      link.appendChild(overlay);
    }

    slide.appendChild(link);
    container.appendChild(slide);
  });

  initInstagramSwiper(posts.length);
}

function initInstagramSwiper(postCount) {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper is not loaded');
    return;
  }

  if (instagramSwiper) {
    instagramSwiper.destroy(true, true);
    instagramSwiper = null;
  }

  var swiperElement = document.querySelector('.instagramSwiper');
  if (!swiperElement) return;

  // シンプルな設定（loopもrewindも使わない）
  instagramSwiper = new Swiper('.instagramSwiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: true,
    speed: 400,
    pagination: {
      el: '.instagramSwiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 24,
      }
    }
  });

  // カスタムナビゲーション（手動で制御）
  var prevBtn = document.querySelector('.instagramSwiper .swiper-button-prev');
  var nextBtn = document.querySelector('.instagramSwiper .swiper-button-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (instagramSwiper.isBeginning) {
        instagramSwiper.slideTo(instagramSwiper.slides.length - 1);
      } else {
        instagramSwiper.slidePrev();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (instagramSwiper.isEnd) {
        instagramSwiper.slideTo(0);
      } else {
        instagramSwiper.slideNext();
      }
    });
  }
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
// 活動カレンダー
// ============================================

function initActivityCalendar() {
  var config = getConfig();
  if (!config.activityCalendar || !config.activityCalendar.enabled) {
    return;
  }

  var section = document.getElementById("activity-calendar");
  if (!section) return;

  section.style.display = "block";

  // API URLが設定されていない場合はプレースホルダー表示
  if (!config.activityCalendar.apiUrl) {
    var grid = document.getElementById("activityCalendarGrid");
    if (grid) {
      grid.innerHTML = '<div class="calendar-loading">' +
        '<p>活動カレンダーを表示するには、Notion APIの設定が必要です。</p>' +
        '<p style="margin-top: 8px; font-size: 0.9rem; color: var(--text-muted);">NOTION_ACTIVITY_CALENDAR_SETUP.md を参照してください。</p>' +
        '</div>';
    }
    return;
  }

  fetchActivityData();
}

function fetchActivityData() {
  var config = getConfig();
  var grid = document.getElementById("activityCalendarGrid");

  if (!grid) return;

  // ローディング表示
  grid.innerHTML = '<div class="calendar-loading">読み込み中...</div>';

  // キャッシュチェック
  var cacheKey = 'activity_calendar_cache';
  var cacheTimeKey = 'activity_calendar_cache_time';
  var cachedData = localStorage.getItem(cacheKey);
  var cacheTime = localStorage.getItem(cacheTimeKey);
  var cacheMinutes = 30;
  var now = new Date().getTime();

  // キャッシュが有効な場合は使用
  if (cachedData && cacheTime && (now - parseInt(cacheTime)) < cacheMinutes * 60 * 1000) {
    try {
      var activities = JSON.parse(cachedData);
      renderActivityCalendar(activities);
      renderActivityStats(activities);
      return;
    } catch (e) {
      console.error('Activity calendar cache parse error:', e);
    }
  }

  // APIからデータ取得
  fetch(config.activityCalendar.apiUrl + '?action=getActivityData')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success && data.data && data.data.length > 0) {
        var activities = data.data;

        // キャッシュに保存
        try {
          localStorage.setItem(cacheKey, JSON.stringify(activities));
          localStorage.setItem(cacheTimeKey, now.toString());
        } catch (e) {
          console.error('Activity calendar cache save error:', e);
        }

        renderActivityCalendar(activities);
        renderActivityStats(activities);
      } else {
        grid.innerHTML = '<div class="calendar-loading">' +
          '<p>活動データがありません。</p>' +
          '<p style="margin-top: 8px; font-size: 0.9rem; color: var(--text-muted);">Notionに活動を記録してください。</p>' +
          '</div>';
      }
    })
    .catch(function(error) {
      console.error('Activity calendar API error:', error);
      grid.innerHTML = '<div class="calendar-loading">' +
        '<p>データの読み込みに失敗しました。</p>' +
        '<p style="margin-top: 8px; font-size: 0.9rem; color: var(--text-muted);">しばらくしてから再度お試しください。</p>' +
        '</div>';
    });
}

function renderActivityCalendar(activities) {
  var config = getConfig();
  var grid = document.getElementById("activityCalendarGrid");

  if (!grid) return;

  var displayMonths = config.activityCalendar.displayMonths || 3;
  var colorScheme = config.activityCalendar.colorScheme || {};

  // アクティビティを日付でマッピング
  var activityMap = {};
  activities.forEach(function(activity) {
    if (activity.date) {
      var dateKey = activity.date.substring(0, 10); // YYYY-MM-DD
      if (!activityMap[dateKey]) {
        activityMap[dateKey] = [];
      }
      activityMap[dateKey].push(activity);
    }
  });

  // カレンダーグリッド生成（11月〜4月の6ヶ月固定）
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth(); // 0-11

  // シーズン開始年を決定（11月以降なら今年、10月以前なら前年）
  var seasonStartYear = currentMonth >= 10 ? currentYear : currentYear - 1;

  // 11月から6ヶ月間（11, 12, 1, 2, 3, 4月）を生成
  var monthsHtml = [];
  var months = [10, 11, 0, 1, 2, 3]; // 10=11月, 11=12月, 0=1月, 1=2月, 2=3月, 3=4月

  for (var i = 0; i < months.length; i++) {
    var monthIndex = months[i];
    var year = monthIndex >= 10 ? seasonStartYear : seasonStartYear + 1;
    var month = new Date(year, monthIndex, 1);
    var monthHtml = renderMonth(month, activityMap, colorScheme);
    monthsHtml.push(monthHtml);
  }

  grid.innerHTML = '<div class="calendar-grid">' +
    '<div class="calendar-months">' + monthsHtml.join('') + '</div>' +
    '</div>';
}

function renderMonth(month, activityMap, colorScheme) {
  var monthLabel = (month.getMonth() + 1) + '月';
  var year = month.getFullYear();
  var monthIndex = month.getMonth();

  var firstDay = new Date(year, monthIndex, 1);
  var lastDay = new Date(year, monthIndex + 1, 0);
  var daysInMonth = lastDay.getDate();

  var weeks = [];
  var currentWeek = [];

  // 月の最初の週の空白を埋める
  var startDayOfWeek = firstDay.getDay(); // 0=日曜
  for (var i = 0; i < startDayOfWeek; i++) {
    currentWeek.push('<div class="calendar-day" data-level="0"></div>');
  }

  // 日付を追加
  for (var day = 1; day <= daysInMonth; day++) {
    var date = new Date(year, monthIndex, day);
    var dateKey = formatDateKey(date);
    var activities = activityMap[dateKey] || [];
    var level = Math.min(activities.length, 4);

    // 優先順位に基づいて最高優先度の活動の色を使用
    var highestActivity = getHighestPriorityActivity(activities);
    var color = highestActivity ? getActivityColor(highestActivity, colorScheme) : '';
    var tooltip = activities.length > 0 ? createTooltip(activities) : '';

    var style = color ? ' style="background-color: ' + color + ';"' : '';

    currentWeek.push(
      '<div class="calendar-day" data-level="' + level + '"' + style + '>' +
      (tooltip ? '<div class="calendar-tooltip">' + tooltip + '</div>' : '') +
      '</div>'
    );

    // 週が完成したら追加
    if (currentWeek.length === 7) {
      weeks.push('<div class="calendar-weeks">' + currentWeek.join('') + '</div>');
      currentWeek = [];
    }
  }

  // 最後の週の空白を埋める
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push('<div class="calendar-day" data-level="0"></div>');
  }
  if (currentWeek.length > 0) {
    weeks.push('<div class="calendar-weeks">' + currentWeek.join('') + '</div>');
  }

  return '<div class="calendar-month">' +
    '<div class="calendar-month-label">' + monthLabel + '</div>' +
    weeks.join('') +
    '</div>';
}

function renderActivityStats(activities) {
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth(); // 0-11

  // シーズン開始年を決定（11月以降なら今年、10月以前なら前年）
  var seasonStartYear = currentMonth >= 10 ? currentYear : currentYear - 1;

  // 11月1日から4月30日までの期間を設定
  var startDate = new Date(seasonStartYear, 10, 1); // 11月1日
  var endDate = new Date(seasonStartYear + 1, 4, 0); // 4月末（5月0日 = 4月末）

  // 11月〜4月の活動をフィルタ
  var periodActivities = activities.filter(function(a) {
    if (!a.date) return false;
    var date = new Date(a.date);
    return date >= startDate && date <= endDate;
  });

  // 統計計算
  var total = periodActivities.length;
  var events = periodActivities.filter(function(a) {
    return a.type === '大会' || a.type === 'イベント出演';
  }).length;
  var practice = periodActivities.filter(function(a) {
    return a.type === '練習';
  }).length;

  // DOM更新
  var totalEl = document.getElementById('statMonthlyTotal');
  var eventsEl = document.getElementById('statEvents');
  var practiceEl = document.getElementById('statPractice');

  if (totalEl) totalEl.textContent = total + '日';
  if (eventsEl) eventsEl.textContent = events + '回';
  if (practiceEl) practiceEl.textContent = practice + '日';
}

function formatDateKey(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function getActivityColor(activity, colorScheme) {
  return colorScheme[activity.type] || '#bdc3c7';
}

function getHighestPriorityActivity(activities) {
  if (!activities || activities.length === 0) return null;
  if (activities.length === 1) return activities[0];

  // 優先順位: 大会 > イベント > メディア取材 > 協賛 > 練習
  var priority = {
    '大会': 1,
    'イベント': 2,
    'メディア取材': 3,
    '協賛': 4,
    '練習': 5
  };

  // 最高優先度の活動を見つける
  var highest = activities[0];
  var highestPriority = priority[highest.type] || 999;

  for (var i = 1; i < activities.length; i++) {
    var activityPriority = priority[activities[i].type] || 999;
    if (activityPriority < highestPriority) {
      highest = activities[i];
      highestPriority = activityPriority;
    }
  }

  return highest;
}

function createTooltip(activities) {
  var config = getConfig();
  var typeIcons = config.activityCalendar.typeIcons || {};

  return activities.map(function(a) {
    var time = '';
    if (a.startTime && a.endTime) {
      time = a.startTime + ' - ' + a.endTime;
    } else if (a.startTime) {
      time = a.startTime + ' ~';
    }

    // アイコン取得
    var iconClass = typeIcons[a.type] || typeIcons['その他'] || '';
    var icon = iconClass ? '<i class="' + iconClass + '"></i> ' : '';

    var parts = [a.name];
    if (time) parts.push(time);
    if (a.location) parts.push(a.location);

    return icon + escapeHtml(parts.join(' / '));
  }).join('<br>');
}

// ============================================
// 初期化
// ============================================

// FAQ アコーディオン機能
function initFAQ() {
  var faqItems = document.querySelectorAll('.faqItem');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faqItem__question');

    if (question) {
      question.addEventListener('click', function() {
        var isOpen = item.classList.contains('is-open');

        // 他の開いているFAQを閉じる（オプション）
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            var otherQuestion = otherItem.querySelector('.faqItem__question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // クリックされたFAQの開閉を切り替え
        if (isOpen) {
          item.classList.remove('is-open');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

async function initSite() {
  // console.log('[DEBUG] initSite started');
  renderCopy();
  // ニュース表示：newsGridにdata-limit属性があれば制限、なければ全件
  var newsGrid = document.getElementById("newsGrid");
  var newsLimit = newsGrid && newsGrid.dataset.limit ? parseInt(newsGrid.dataset.limit, 10) : 0;
  renderNews({ limit: newsLimit, showAllButton: newsLimit > 0 });
  wireLinks();
  wireWebShare();
  renderSponsors();
  renderSupporters();
  renderMedia();
  renderMascot();
  setupHamburgerMenu();

  // 新機能の初期化
  renderMediaFeatures();
  initFAQ();

  // 非同期処理（Swiper対応版）- 各処理を独立してエラーハンドリング
  try { await renderHeroMedia(); } catch (e) { console.error("renderHeroMedia failed:", e); }
  try { await renderMembers(); } catch (e) { console.error("renderMembers failed:", e); }
  try { await renderPhotos(); } catch (e) { console.error("renderPhotos failed:", e); }

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
// ========================================
// 千羽鶴チャレンジ バナー更新
// ========================================
async function updateChallengeProgress() {
  try {
    const response = await fetch(CONFIG.instagram.apiUrl + "?action=getMessagesWithCount");
    const data = await response.json();
    
    if (data.success) {
      const countEl = document.getElementById("challengeCount");
      const barEl = document.getElementById("challengeBar");
      const remainingEl = document.getElementById("challengeRemaining");
      
      if (countEl) {
        // カウントアップアニメーション
        animateCount(countEl, 0, data.count, 1500);
      }
      
      if (barEl) {
        setTimeout(() => {
          barEl.style.width = data.percentage + "%";
        }, 300);
      }
      
      if (remainingEl) {
        const remaining = data.goal - data.count;
        if (remaining > 0) {
          remainingEl.textContent = `あと ${remaining.toLocaleString()} 件で目標達成！`;
        } else {
          remainingEl.textContent = "🎉 目標達成！ありがとうございます！";
        }
      }
    }
  } catch (e) {
    console.error("Challenge progress error:", e);
    const remainingEl = document.getElementById("challengeRemaining");
    if (remainingEl) {
      remainingEl.textContent = "目標: 1,000件の応援メッセージ";
    }
  }
}

// カウントアップアニメーション
function animateCount(element, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ページ読み込み時に実行（既存のinitSite内または別途）
document.addEventListener("DOMContentLoaded", function() {
  // 千羽鶴バナーがあれば更新
  if (document.getElementById("challengeCount")) {
    updateChallengeProgress();
  }
});
