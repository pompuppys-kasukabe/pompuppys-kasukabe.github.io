/* ============================================
   main.js - POM PUPPYS bright
   Notion + Google Drive 連携版（Swiperカルーセル対応）
   ============================================ */

// ===== 定数 =====
var PHOTOS_API_URL = "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec";
var CACHE_DURATION = 30 * 60 * 1000; // 30分

// ===== ユーティリティ関数 =====
function getConfig() {
  return window.PUPPYS_CONFIG || {};
}

function getDriveImageUrl(fileId, width) {
  if (!fileId) return '';
  var w = width || 800;
  return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w" + w;
}

function clearCacheOnReload() {
  if (window.location.search.indexOf('reload=1') !== -1) {
    localStorage.removeItem('photos_data');
    localStorage.removeItem('photos_time');
    localStorage.removeItem('instagram_data');
    localStorage.removeItem('instagram_time');
    console.log('キャッシュをクリアしました');
  }
}

// ===== 写真データ取得 =====
async function fetchPhotosData() {
  // キャッシュ確認
  var cached = localStorage.getItem('photos_data');
  var cachedTime = localStorage.getItem('photos_time');
  
  if (cached && cachedTime) {
    var age = Date.now() - parseInt(cachedTime, 10);
    if (age < CACHE_DURATION) {
      console.log('写真データ: キャッシュから取得');
      return JSON.parse(cached);
    }
  }
  
  // API から取得
  try {
    var url = PHOTOS_API_URL + '?action=getPhotos&t=' + Date.now();
    var response = await fetch(url);
    if (!response.ok) throw new Error('API response not ok');
    
    var data = await response.json();
    if (data.success && data.data) {
      localStorage.setItem('photos_data', JSON.stringify(data.data));
      localStorage.setItem('photos_time', Date.now().toString());
      console.log('写真データ: APIから取得');
      return data.data;
    }
  } catch (error) {
    console.error('写真データ取得エラー:', error);
  }
  
  return null;
}

// ===== Instagram データ取得 =====
async function fetchInstagramPosts() {
  var config = getConfig();
  var instagramConfig = config.instagram || {};
  var apiUrl = instagramConfig.apiUrl || PHOTOS_API_URL;
  
  if (!apiUrl) {
    console.error('Instagram API URLが設定されていません');
    return [];
  }
  
  // キャッシュ確認
  var cached = localStorage.getItem('instagram_data');
  var cachedTime = localStorage.getItem('instagram_time');
  
  if (cached && cachedTime) {
    var age = Date.now() - parseInt(cachedTime, 10);
    if (age < CACHE_DURATION) {
      console.log('Instagram: キャッシュから取得');
      return JSON.parse(cached);
    }
  }
  
  try {
    // useNotion フラグに応じてアクションを切り替え
    var action = instagramConfig.useNotion ? 'getInstagramFeedFromNotion' : 'getInstagramFeed';
    var url = apiUrl + '?action=' + action + '&t=' + Date.now();
    
    var response = await fetch(url);
    if (!response.ok) throw new Error('Instagram API response not ok');
    
    var data = await response.json();
    if (data.success && data.data) {
      var posts = data.data.slice(0, instagramConfig.displayCount || 6);
      localStorage.setItem('instagram_data', JSON.stringify(posts));
      localStorage.setItem('instagram_time', Date.now().toString());
      console.log('Instagram: APIから取得', posts.length + '件');
      return posts;
    } else {
      console.error('Instagram APIエラー:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Instagram取得エラー:', error);
  }
  
  return [];
}

// ===== Hero レンダリング =====
function renderHero(photos) {
  var config = getConfig();
  var heroSection = document.getElementById('hero');
  if (!heroSection) return;
  
  var heroImage = null;
  var heroVideo = null;
  
  // 写真データから Hero 画像を取得
  if (photos && photos.hero && photos.hero.driveId) {
    heroImage = getDriveImageUrl(photos.hero.driveId, 1920);
  } else if (config.siteImages && config.siteImages.heroImage) {
    heroImage = config.siteImages.heroImage;
  }
  
  // Hero 動画
  if (config.siteImages && config.siteImages.heroVideo) {
    heroVideo = config.siteImages.heroVideo;
  }
  
  var mediaContainer = heroSection.querySelector('.hero__media');
  if (!mediaContainer) return;
  
  // 動画がある場合
  if (heroVideo) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!reducedMotion) {
      var video = document.createElement('video');
      video.className = 'hero__video';
      video.autoplay = true;
      video.muted = true;
      video.loop = false;
      video.playsInline = true;
      video.poster = heroImage || '';
      
      var source = document.createElement('source');
      source.src = heroVideo;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      video.addEventListener('ended', function() {
        video.style.opacity = '0';
        setTimeout(function() {
          if (heroImage) {
            var img = document.createElement('img');
            img.src = heroImage;
            img.className = 'hero__image';
            img.alt = 'Hero image';
            mediaContainer.appendChild(img);
          }
        }, 500);
      });
      
      video.addEventListener('error', function() {
        if (heroImage) {
          var img = document.createElement('img');
          img.src = heroImage;
          img.className = 'hero__image';
          img.alt = 'Hero image';
          mediaContainer.innerHTML = '';
          mediaContainer.appendChild(img);
        }
      });
      
      mediaContainer.innerHTML = '';
      mediaContainer.appendChild(video);
      return;
    }
  }
  
  // 画像のみの場合
  if (heroImage) {
    var img = document.createElement('img');
    img.src = heroImage;
    img.className = 'hero__image';
    img.alt = 'Hero image';
    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(img);
  }
}

// ===== メンバー レンダリング =====
function renderMembers(photos) {
  var config = getConfig();
  var container = document.querySelector('.team-carousel .swiper-wrapper');
  if (!container) {
    // 通常のグリッド表示にフォールバック
    container = document.getElementById('memberGrid');
  }
  if (!container) return;
  
  var members = [];
  
  // 写真データからメンバーを取得
  if (photos && photos.members && photos.members.length > 0) {
    members = photos.members;
  } else if (config.siteImages && config.siteImages.members) {
    members = config.siteImages.members;
  }
  
  if (members.length === 0) return;
  
  var isSwiper = container.classList.contains('swiper-wrapper');
  var html = '';
  
  members.forEach(function(member) {
    var imageUrl = '';
    if (member.driveId) {
      imageUrl = getDriveImageUrl(member.driveId, 400);
    } else if (member.image) {
      imageUrl = member.image;
    }
    
    if (isSwiper) {
      html += '<div class="swiper-slide">';
      html += '<div class="member-card">';
    } else {
      html += '<div class="member-card">';
    }
    
    if (imageUrl) {
      html += '<div class="member-card__image">';
      html += '<img src="' + imageUrl + '" alt="' + (member.name || 'メンバー') + '" loading="lazy">';
      html += '</div>';
    }
    
    html += '<div class="member-card__info">';
    if (member.name) {
      html += '<h3 class="member-card__name">' + member.name + '</h3>';
    }
    if (member.role) {
      html += '<p class="member-card__role">' + member.role + '</p>';
    }
    html += '</div>';
    html += '</div>';
    
    if (isSwiper) {
      html += '</div>';
    }
  });
  
  container.innerHTML = html;
}

// ===== 写真ギャラリー レンダリング =====
function renderPhotos(photos) {
  var mainContainer = document.querySelector('.photos-main .swiper-wrapper');
  var thumbsContainer = document.querySelector('.photos-thumbs .swiper-wrapper');
  
  // Swiper構造がない場合は通常のグリッドにフォールバック
  if (!mainContainer || !thumbsContainer) {
    var gridContainer = document.getElementById('photoGrid');
    if (gridContainer) {
      renderPhotosGrid(photos, gridContainer);
    }
    return;
  }
  
  if (!photos || !photos.gallery || photos.gallery.length === 0) {
    mainContainer.innerHTML = '<div class="swiper-slide"><p class="no-photos">写真を準備中です</p></div>';
    thumbsContainer.innerHTML = '';
    return;
  }
  
  // slot でソート
  var gallery = photos.gallery.slice().sort(function(a, b) {
    return (a.slot || 999) - (b.slot || 999);
  });
  
  var mainHtml = '';
  var thumbsHtml = '';
  
  gallery.forEach(function(photo, index) {
    var imageUrl = '';
    if (photo.driveId) {
      imageUrl = getDriveImageUrl(photo.driveId, 1200);
    } else if (photo.url) {
      imageUrl = photo.url;
    }
    
    if (!imageUrl) return;
    
    var thumbUrl = photo.driveId ? getDriveImageUrl(photo.driveId, 200) : imageUrl;
    var alt = photo.caption || photo.title || '写真 ' + (index + 1);
    
    // メイン画像
    mainHtml += '<div class="swiper-slide">';
    mainHtml += '<img src="' + imageUrl + '" alt="' + alt + '" loading="lazy">';
    if (photo.caption) {
      mainHtml += '<div class="photo-caption">' + photo.caption + '</div>';
    }
    mainHtml += '</div>';
    
    // サムネイル
    thumbsHtml += '<div class="swiper-slide">';
    thumbsHtml += '<img src="' + thumbUrl + '" alt="' + alt + '" loading="lazy">';
    thumbsHtml += '</div>';
  });
  
  mainContainer.innerHTML = mainHtml;
  thumbsContainer.innerHTML = thumbsHtml;
}

// グリッド表示（フォールバック用）
function renderPhotosGrid(photos, container) {
  if (!photos || !photos.gallery || photos.gallery.length === 0) {
    container.innerHTML = '<p class="no-photos">写真を準備中です</p>';
    return;
  }
  
  var gallery = photos.gallery.slice().sort(function(a, b) {
    return (a.slot || 999) - (b.slot || 999);
  });
  
  var html = '';
  gallery.forEach(function(photo, index) {
    var imageUrl = '';
    if (photo.driveId) {
      imageUrl = getDriveImageUrl(photo.driveId, 800);
    } else if (photo.url) {
      imageUrl = photo.url;
    }
    
    if (!imageUrl) return;
    
    html += '<div class="photo-card" data-index="' + index + '">';
    html += '<img src="' + imageUrl + '" alt="' + (photo.caption || '写真') + '" loading="lazy">';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ===== Instagram レンダリング =====
function renderInstagramFeed(posts) {
  var container = document.querySelector('.instagram-carousel .swiper-wrapper');
  
  // Swiper構造がない場合は通常のグリッドにフォールバック
  if (!container) {
    var gridContainer = document.querySelector('.instagramFeed');
    if (gridContainer) {
      renderInstagramGrid(posts, gridContainer);
    }
    return;
  }
  
  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="swiper-slide"><p class="instagram-placeholder">Instagram投稿を読み込み中...</p></div>';
    return;
  }
  
  var html = '';
  posts.forEach(function(post) {
    var imageUrl = '';
    if (post.driveId) {
      imageUrl = getDriveImageUrl(post.driveId, 600);
    } else if (post.mediaUrl) {
      imageUrl = post.mediaUrl;
    } else if (post.thumbnail) {
      imageUrl = post.thumbnail;
    }
    
    if (!imageUrl) return;
    
    html += '<div class="swiper-slide">';
    html += '<a href="' + (post.permalink || post.url || '#') + '" target="_blank" rel="noopener noreferrer" class="instagram-post">';
    html += '<img src="' + imageUrl + '" alt="' + (post.caption || 'Instagram投稿').substring(0, 50) + '" loading="lazy">';
    html += '<div class="instagram-post__overlay">';
    if (post.caption) {
      html += '<p>' + post.caption.substring(0, 100) + (post.caption.length > 100 ? '...' : '') + '</p>';
    }
    html += '</div>';
    html += '</a>';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// グリッド表示（フォールバック用）
function renderInstagramGrid(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p class="instagram-placeholder">Instagram投稿を読み込み中...</p>';
    return;
  }
  
  var html = '';
  posts.forEach(function(post) {
    var imageUrl = '';
    if (post.driveId) {
      imageUrl = getDriveImageUrl(post.driveId, 400);
    } else if (post.mediaUrl) {
      imageUrl = post.mediaUrl;
    } else if (post.thumbnail) {
      imageUrl = post.thumbnail;
    }
    
    if (!imageUrl) return;
    
    html += '<a href="' + (post.permalink || post.url || '#') + '" target="_blank" rel="noopener noreferrer" class="instagram-post">';
    html += '<img src="' + imageUrl + '" alt="' + (post.caption || 'Instagram投稿').substring(0, 50) + '" loading="lazy">';
    html += '</a>';
  });
  
  container.innerHTML = html;
}

// ===== Swiper 初期化 =====
function initSwipers() {
  // Swiper が読み込まれているか確認
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper が読み込まれていません');
    return;
  }
  
  // Photos カルーセル
  var photosMain = document.querySelector('.photos-main .swiper');
  var photosThumbs = document.querySelector('.photos-thumbs .swiper');
  
  if (photosMain && photosThumbs) {
    // サムネイル Swiper を先に初期化
    var thumbsSwiper = new Swiper(photosThumbs, {
      spaceBetween: 10,
      slidesPerView: 4,
      slidesPerGroup: 1,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        320: { slidesPerView: 3, spaceBetween: 8 },
        480: { slidesPerView: 4, spaceBetween: 10 },
        768: { slidesPerView: 5, spaceBetween: 10 },
        1024: { slidesPerView: 6, spaceBetween: 12 }
      }
    });
    
    // メイン Swiper
    window.photosSwiper = new Swiper(photosMain, {
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '.photos-main .swiper-button-next',
        prevEl: '.photos-main .swiper-button-prev'
      },
      thumbs: {
        swiper: thumbsSwiper
      }
    });
    
    console.log('Photos Swiper 初期化完了');
  }
  
  // Team カルーセル
  var teamSwiper = document.querySelector('.team-carousel .swiper');
  if (teamSwiper) {
    new Swiper(teamSwiper, {
      slidesPerView: 1.2,
      slidesPerGroup: 1,
      centeredSlides: true,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.team-carousel .swiper-button-next',
        prevEl: '.team-carousel .swiper-button-prev'
      },
      breakpoints: {
        480: { slidesPerView: 1.5, spaceBetween: 24 },
        768: { slidesPerView: 2.2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 40 }
      }
    });
    
    console.log('Team Swiper 初期化完了');
  }
  
  // Instagram カルーセル
  var instaSwiper = document.querySelector('.instagram-carousel .swiper');
  if (instaSwiper) {
    new Swiper(instaSwiper, {
      slidesPerView: 1.5,
      slidesPerGroup: 1,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.instagram-carousel .swiper-button-next',
        prevEl: '.instagram-carousel .swiper-button-prev'
      },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 4, spaceBetween: 30 }
      }
    });
    
    console.log('Instagram Swiper 初期化完了');
  }
}

// ===== ライトボックス =====
function initLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  
  var lightboxImg = lightbox.querySelector('.lightbox__image');
  var closeBtn = lightbox.querySelector('.lightbox__close');
  
  // 閉じるボタン
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeLightbox();
    });
  }
  
  // 背景クリックで閉じる
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Escキーで閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
  
  // 写真クリックでライトボックス開く（イベント委任）
  document.addEventListener('click', function(e) {
    var photoCard = e.target.closest('.photo-card');
    if (photoCard) {
      var img = photoCard.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }
  });
  
  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.src = '';
    }
  }
}

// ===== ニュース レンダリング =====
function renderNews() {
  var config = getConfig();
  var container = document.getElementById('newsList');
  if (!container) return;
  
  var news = config.news || [];
  if (news.length === 0) return;
  
  // 日付でソート（新しい順）
  news.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  
  var html = '';
  news.forEach(function(item) {
    html += '<article class="news-item">';
    html += '<time class="news-item__date">' + item.date + '</time>';
    html += '<div class="news-item__content">';
    if (item.url) {
      html += '<a href="' + item.url + '" class="news-item__title">' + item.title + '</a>';
    } else {
      html += '<span class="news-item__title">' + item.title + '</span>';
    }
    if (item.description) {
      html += '<p class="news-item__desc">' + item.description + '</p>';
    }
    html += '</div>';
    html += '</article>';
  });
  
  container.innerHTML = html;
}

// ===== Hero コピー レンダリング =====
function renderHeroCopy() {
  var config = getConfig();
  var copy = config.copy || {};
  
  var kicker = document.querySelector('.hero__kicker');
  var headline = document.querySelector('.hero__headline');
  var lead = document.querySelector('.hero__lead');
  var sub = document.querySelector('.hero__sub');
  
  if (kicker && copy.kicker) kicker.textContent = copy.kicker;
  if (headline && copy.headline) headline.textContent = copy.headline;
  if (lead && copy.lead) lead.textContent = copy.lead;
  if (sub && copy.sub) sub.textContent = copy.sub;
}

// ===== Key Facts レンダリング =====
function renderKeyFacts() {
  var config = getConfig();
  var container = document.getElementById('keyFactsList');
  if (!container) return;
  
  var facts = config.keyFacts || [];
  if (facts.length === 0) return;
  
  var html = '';
  facts.forEach(function(fact) {
    html += '<li class="key-fact">';
    html += '<span class="key-fact__value">' + fact.value + '</span>';
    html += '<span class="key-fact__label">' + fact.label + '</span>';
    html += '</li>';
  });
  
  container.innerHTML = html;
}

// ===== ストーリー レンダリング =====
function renderStory() {
  var config = getConfig();
  var container = document.getElementById('storyContent');
  if (!container) return;
  
  var story = config.story || [];
  if (story.length === 0) return;
  
  var html = '';
  story.forEach(function(block) {
    if (block.type === 'heading') {
      html += '<h3 class="story__heading">' + block.text + '</h3>';
    } else if (block.type === 'paragraph') {
      html += '<p class="story__paragraph">' + block.text + '</p>';
    }
  });
  
  container.innerHTML = html;
}

// ===== タイムライン レンダリング =====
function renderTimeline() {
  var config = getConfig();
  var container = document.getElementById('timelineList');
  if (!container) return;
  
  var timeline = config.timeline || [];
  if (timeline.length === 0) return;
  
  var html = '';
  timeline.forEach(function(item) {
    var highlightClass = item.highlight ? ' timeline-item--highlight' : '';
    html += '<li class="timeline-item' + highlightClass + '">';
    html += '<span class="timeline-item__year">' + item.year + '</span>';
    html += '<span class="timeline-item__event">' + item.event + '</span>';
    html += '</li>';
  });
  
  container.innerHTML = html;
}

// ===== 資金調達プログレス =====
function renderProgress() {
  var config = getConfig();
  var project = config.project || {};
  
  var goalYen = project.goalYen || 0;
  var raisedYen = project.raisedYen || 0;
  
  if (goalYen === 0) return;
  
  var percent = Math.min(100, Math.round((raisedYen / goalYen) * 100));
  
  var bar = document.querySelector('.progress__bar-fill');
  var percentText = document.querySelector('.progress__percent');
  var raisedText = document.querySelector('.progress__raised');
  var goalText = document.querySelector('.progress__goal');
  
  if (bar) bar.style.width = percent + '%';
  if (percentText) percentText.textContent = percent + '%';
  if (raisedText) raisedText.textContent = '¥' + raisedYen.toLocaleString();
  if (goalText) goalText.textContent = '¥' + goalYen.toLocaleString();
}

// ===== 応援メッセージ プレビュー =====
async function renderMessagePreview() {
  var config = getConfig();
  var container = document.getElementById('messagePreview');
  if (!container) return;
  
  var messages = [];
  
  // API から取得
  if (config.messagesApi) {
    try {
      var response = await fetch(config.messagesApi);
      var data = await response.json();
      if (data.success && data.data) {
        messages = data.data;
      }
    } catch (error) {
      console.error('メッセージ取得エラー:', error);
    }
  }
  
  // フォールバック: config から
  if (messages.length === 0 && config.messages) {
    messages = config.messages;
  }
  
  // 承認済みのみフィルタ
  messages = messages.filter(function(m) {
    return m.approved !== false;
  });
  
  // 日付でソート
  messages.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  
  // 最大3件表示
  var preview = messages.slice(0, 3);
  
  if (preview.length === 0) return;
  
  var html = '';
  preview.forEach(function(msg) {
    html += '<div class="message-card">';
    html += '<p class="message-card__text">"' + msg.message + '"</p>';
    html += '<p class="message-card__author">— ' + (msg.name || '匿名') + '</p>';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ===== スポンサー レンダリング =====
function renderSponsors() {
  var config = getConfig();
  var container = document.getElementById('sponsorList');
  if (!container) return;
  
  var sponsors = config.sponsors || [];
  if (sponsors.length === 0) return;
  
  var now = new Date();
  
  // フィルタ: 承認済み、表示可、期限内
  sponsors = sponsors.filter(function(s) {
    if (s.approved === false) return false;
    if (s.visible === false) return false;
    if (s.expiry && new Date(s.expiry) < now) return false;
    return true;
  });
  
  if (sponsors.length === 0) return;
  
  var html = '';
  sponsors.forEach(function(sponsor) {
    html += '<div class="sponsor-card">';
    if (sponsor.url) {
      html += '<a href="' + sponsor.url + '" target="_blank" rel="noopener noreferrer">';
    }
    if (sponsor.logo) {
      html += '<img src="' + sponsor.logo + '" alt="' + sponsor.name + '" class="sponsor-card__logo">';
    } else {
      html += '<span class="sponsor-card__name">' + sponsor.name + '</span>';
    }
    if (sponsor.url) {
      html += '</a>';
    }
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ===== マスコット表示 =====
function initMascot() {
  var config = getConfig();
  var mascot = document.getElementById('mascot');
  
  if (!mascot) return;
  
  if (config.mascot && config.mascot.enabled) {
    mascot.style.display = 'block';
    if (config.mascot.image) {
      var img = mascot.querySelector('img');
      if (img) img.src = config.mascot.image;
    }
  } else {
    mascot.style.display = 'none';
  }
}

// ===== シェア機能 =====
function initShare() {
  var shareBtn = document.getElementById('shareBtn');
  if (!shareBtn) return;
  
  shareBtn.addEventListener('click', async function() {
    var config = getConfig();
    var shareData = {
      title: config.siteName || 'POM PUPPYS bright',
      text: config.siteDescription || '',
      url: config.siteUrl || window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(shareData.url);
        }
      }
    } else {
      copyToClipboard(shareData.url);
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    showToast('URLをコピーしました');
  }).catch(function() {
    // フォールバック
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('URLをコピーしました');
  });
}

function showToast(message) {
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add('is-visible');
  }, 10);
  
  setTimeout(function() {
    toast.classList.remove('is-visible');
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// ===== ハンバーガーメニュー =====
function initHamburger() {
  var toggle = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', function() {
    var isOpen = toggle.classList.toggle('is-active');
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
  // ナビリンクをクリックしたら閉じる
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ===== スクロールアニメーション =====
function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;
  
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // フォールバック: すべて表示
    reveals.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }
}

// ===== FAQ アコーディオン =====
function initFAQ() {
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;
  
  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) return;
    
    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('is-open');
      
      // 他を閉じる
      faqItems.forEach(function(otherItem) {
        otherItem.classList.remove('is-open');
        var otherQ = otherItem.querySelector('.faq-item__question');
        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
      });
      
      // 現在のアイテムをトグル
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ===== カウントダウン =====
function initCountdown() {
  var config = getConfig();
  var countdown = config.countdown;
  
  if (!countdown || !countdown.enabled) return;
  
  var container = document.getElementById('countdown');
  if (!container) return;
  
  var targetDate = new Date(countdown.date);
  
  function updateCountdown() {
    var now = new Date();
    var diff = targetDate - now;
    
    if (diff <= 0) {
      container.innerHTML = '<p class="countdown__message">' + (countdown.endMessage || 'イベント開催中！') + '</p>';
      return;
    }
    
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    container.innerHTML = 
      '<div class="countdown__item"><span class="countdown__value">' + days + '</span><span class="countdown__label">日</span></div>' +
      '<div class="countdown__item"><span class="countdown__value">' + hours + '</span><span class="countdown__label">時間</span></div>' +
      '<div class="countdown__item"><span class="countdown__value">' + minutes + '</span><span class="countdown__label">分</span></div>' +
      '<div class="countdown__item"><span class="countdown__value">' + seconds + '</span><span class="countdown__label">秒</span></div>';
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== コピーボタン =====
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.getAttribute('data-copy');
      var target = document.getElementById(targetId);
      if (target) {
        copyToClipboard(target.textContent);
      }
    });
  });
}

// ===== リンク設定 =====
function wireLinks() {
  var config = getConfig();
  
  // Instagram リンク
  document.querySelectorAll('[data-link="instagram"]').forEach(function(el) {
    if (config.instagram && config.instagram.url) {
      el.href = config.instagram.url;
    }
  });
  
  // メールリンク
  document.querySelectorAll('[data-link="email"]').forEach(function(el) {
    if (config.contact && config.contact.email) {
      el.href = 'mailto:' + config.contact.email;
    }
  });
}

// ===== メディアページ用 =====
function initMedia() {
  renderMediaTexts();
  wireMediaKit();
  wirePressMail();
  initCopyButtons();
}

function renderMediaTexts() {
  var config = getConfig();
  var mediaTexts = config.mediaTexts || {};
  
  var shortText = document.getElementById('shortText');
  var longText = document.getElementById('longText');
  
  if (shortText && mediaTexts.short) {
    shortText.textContent = mediaTexts.short;
  }
  if (longText && mediaTexts.long) {
    longText.textContent = mediaTexts.long;
  }
}

function wireMediaKit() {
  var config = getConfig();
  var btn = document.getElementById('mediaKitBtn');
  
  if (btn && config.mediaKit && config.mediaKit.url) {
    btn.href = config.mediaKit.url;
  }
}

function wirePressMail() {
  var config = getConfig();
  var btn = document.getElementById('pressMailBtn');
  
  if (btn && config.contact && config.contact.pressEmail) {
    btn.href = 'mailto:' + config.contact.pressEmail;
  }
}

// ===== メッセージフォーム（Tally） =====
function initMessageForm() {
  var btn = document.getElementById('openMessageForm');
  if (!btn) return;
  
  btn.addEventListener('click', function() {
    var config = getConfig();
    if (config.tallyFormId) {
      var today = new Date().toISOString().split('T')[0];
      var url = 'https://tally.so/r/' + config.tallyFormId + '?date=' + today;
      window.open(url, '_blank');
    }
  });
}

// ===== 活動カレンダー =====
async function initActivityCalendar() {
  var config = getConfig();
  var calendarConfig = config.activityCalendar;
  
  if (!calendarConfig || !calendarConfig.enabled) return;
  
  var container = document.getElementById('activityCalendar');
  if (!container) return;
  
  try {
    var data = await fetchActivityData();
    if (data) {
      renderActivityCalendar(data, container);
    }
  } catch (error) {
    console.error('活動カレンダー取得エラー:', error);
  }
}

async function fetchActivityData() {
  var config = getConfig();
  var calendarConfig = config.activityCalendar;
  
  if (!calendarConfig || !calendarConfig.apiUrl) return null;
  
  // キャッシュ確認
  var cached = localStorage.getItem('activity_data');
  var cachedTime = localStorage.getItem('activity_time');
  
  if (cached && cachedTime) {
    var age = Date.now() - parseInt(cachedTime, 10);
    if (age < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  }
  
  try {
    var url = calendarConfig.apiUrl + '?action=getActivityData&t=' + Date.now();
    var response = await fetch(url);
    var data = await response.json();
    
    if (data.success && data.data) {
      localStorage.setItem('activity_data', JSON.stringify(data.data));
      localStorage.setItem('activity_time', Date.now().toString());
      return data.data;
    }
  } catch (error) {
    console.error('活動データ取得エラー:', error);
  }
  
  return null;
}

function renderActivityCalendar(data, container) {
  // シンプルなカレンダー表示
  var html = '<div class="activity-calendar">';
  html += '<h3>活動カレンダー</h3>';
  
  if (data.activities && data.activities.length > 0) {
    html += '<ul class="activity-list">';
    data.activities.forEach(function(activity) {
      html += '<li class="activity-item">';
      html += '<span class="activity-date">' + activity.date + '</span>';
      html += '<span class="activity-title">' + activity.title + '</span>';
      html += '</li>';
    });
    html += '</ul>';
  } else {
    html += '<p>予定はありません</p>';
  }
  
  html += '</div>';
  container.innerHTML = html;
}

// ===== メイン初期化 =====
async function initSite() {
  // キャッシュクリア確認
  clearCacheOnReload();
  
  // 基本UI初期化
  initHamburger();
  initScrollReveal();
  initFAQ();
  initLightbox();
  initShare();
  initMascot();
  initCountdown();
  initCopyButtons();
  initMessageForm();
  wireLinks();
  
  // コンテンツレンダリング
  renderHeroCopy();
  renderKeyFacts();
  renderStory();
  renderTimeline();
  renderNews();
  renderProgress();
  renderSponsors();
  
  // 非同期データ取得＆レンダリング
  try {
    // 写真データ取得
    var photos = await fetchPhotosData();
    if (photos) {
      renderHero(photos);
      renderMembers(photos);
      renderPhotos(photos);
    }
    
    // Instagram 取得
    var instaPosts = await fetchInstagramPosts();
    renderInstagramFeed(instaPosts);
    
    // メッセージプレビュー
    await renderMessagePreview();
    
    // 活動カレンダー
    await initActivityCalendar();
    
  } catch (error) {
    console.error('データ取得エラー:', error);
  }
  
  // Swiper 初期化（データ読み込み後）
  setTimeout(function() {
    initSwipers();
  }, 100);
  
  console.log('サイト初期化完了');
}

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', function() {
  var page = document.body.getAttribute('data-page');
  
  if (page === 'media') {
    initMedia();
  } else {
    initSite();
  }
});
