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
  var cached = localStorage.getItem('photos_data');
  var cachedTime = localStorage.getItem('photos_time');
  
  if (cached && cachedTime) {
    var age = Date.now() - parseInt(cachedTime, 10);
    if (age < CACHE_DURATION) {
      console.log('写真データ: キャッシュから取得');
      return JSON.parse(cached);
    }
  }
  
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
  var heroPhoto = document.getElementById('heroPhoto');
  var heroVideo = document.getElementById('heroVideo');
  
  if (!heroPhoto) return;
  
  var heroImage = null;
  var heroVideoSrc = null;
  
  if (photos && photos.hero && photos.hero.driveId) {
    heroImage = getDriveImageUrl(photos.hero.driveId, 1920);
  } else if (config.siteImages && config.siteImages.heroImage) {
    heroImage = config.siteImages.heroImage;
  }
  
  if (config.siteImages && config.siteImages.heroVideo) {
    heroVideoSrc = config.siteImages.heroVideo;
  }
  
  if (heroVideoSrc && heroVideo) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!reducedMotion) {
      heroVideo.src = heroVideoSrc;
      heroVideo.style.display = 'block';
      heroPhoto.style.display = 'none';
      
      heroVideo.addEventListener('ended', function() {
        heroVideo.style.opacity = '0';
        setTimeout(function() {
          heroVideo.style.display = 'none';
          if (heroImage) {
            heroPhoto.src = heroImage;
          }
          heroPhoto.style.display = 'block';
          heroPhoto.style.opacity = '1';
        }, 500);
      });
      
      heroVideo.addEventListener('error', function() {
        heroVideo.style.display = 'none';
        if (heroImage) {
          heroPhoto.src = heroImage;
        }
        heroPhoto.style.display = 'block';
      });
      
      return;
    }
  }
  
  if (heroImage) {
    heroPhoto.src = heroImage;
  }
}

// ===== メンバー レンダリング =====
function renderMembers(photos) {
  var config = getConfig();
  var container = document.getElementById('membersGrid');
  if (!container) return;
  
  var members = [];
  
  if (photos && photos.members && photos.members.length > 0) {
    members = photos.members;
  } else if (config.siteImages && config.siteImages.members) {
    members = config.siteImages.members;
  }
  
  if (members.length === 0) return;
  
  var html = '';
  members.forEach(function(member) {
    var imageUrl = '';
    if (member.driveId) {
      imageUrl = getDriveImageUrl(member.driveId, 400);
    } else if (member.image) {
      imageUrl = member.image;
    }
    
    html += '<div class="swiper-slide">';
    html += '<div class="member-card">';
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
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ===== 写真ギャラリー レンダリング =====
function renderPhotos(photos) {
  var mainContainer = document.getElementById('photoGrid');
  var thumbsContainer = document.getElementById('photoThumbs');
  
  if (!mainContainer) return;
  
  if (!photos || !photos.gallery || photos.gallery.length === 0) {
    mainContainer.innerHTML = '<div class="swiper-slide"><p class="no-photos">写真を準備中です</p></div>';
    if (thumbsContainer) thumbsContainer.innerHTML = '';
    return;
  }
  
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
    
    mainHtml += '<div class="swiper-slide">';
    mainHtml += '<img src="' + imageUrl + '" alt="' + alt + '" loading="lazy">';
    mainHtml += '</div>';
    
    thumbsHtml += '<div class="swiper-slide">';
    thumbsHtml += '<img src="' + thumbUrl + '" alt="' + alt + '" loading="lazy">';
    thumbsHtml += '</div>';
  });
  
  mainContainer.innerHTML = mainHtml;
  if (thumbsContainer) thumbsContainer.innerHTML = thumbsHtml;
}

// ===== Instagram レンダリング =====
function renderInstagramFeed(posts) {
  var container = document.getElementById('instagramFeed');
  if (!container) return;
  
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
    html += '</a>';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ===== Swiper 初期化 =====
function initSwipers() {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper が読み込まれていません');
    return;
  }
  
  // Team カルーセル
  var teamSwiperEl = document.querySelector('.teamSwiper');
  if (teamSwiperEl && teamSwiperEl.querySelectorAll('.swiper-slide').length > 0) {
    new Swiper(teamSwiperEl, {
      slidesPerView: 1.2,
      slidesPerGroup: 1,
      centeredSlides: true,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.teamSwiper .swiper-button-next',
        prevEl: '.teamSwiper .swiper-button-prev'
      },
      pagination: {
        el: '.teamSwiper .swiper-pagination',
        clickable: true
      },
      breakpoints: {
        480: { slidesPerView: 1.5, spaceBetween: 24 },
        768: { slidesPerView: 2.5, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 40 }
      }
    });
    console.log('Team Swiper 初期化完了');
  }
  
  // Photos カルーセル
  var photosSwiperEl = document.querySelector('.photosSwiper');
  var photosThumbsEl = document.querySelector('.photosThumbs');
  
  if (photosSwiperEl && photosSwiperEl.querySelectorAll('.swiper-slide').length > 0) {
    var thumbsSwiper = null;
    
    if (photosThumbsEl && photosThumbsEl.querySelectorAll('.swiper-slide').length > 0) {
      thumbsSwiper = new Swiper(photosThumbsEl, {
        spaceBetween: 10,
        slidesPerView: 4,
        slidesPerGroup: 1,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
          320: { slidesPerView: 3 },
          480: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 6 }
        }
      });
    }
    
    var photosConfig = {
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '.photosSwiper .swiper-button-next',
        prevEl: '.photosSwiper .swiper-button-prev'
      }
    };
    
    if (thumbsSwiper) {
      photosConfig.thumbs = { swiper: thumbsSwiper };
    }
    
    new Swiper(photosSwiperEl, photosConfig);
    console.log('Photos Swiper 初期化完了');
  }
  
  // Instagram カルーセル
  var instaSwiperEl = document.querySelector('.instagramSwiper');
  if (instaSwiperEl && instaSwiperEl.querySelectorAll('.swiper-slide').length > 0) {
    new Swiper(instaSwiperEl, {
      slidesPerView: 1.5,
      slidesPerGroup: 1,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
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
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxBg = document.getElementById('lightboxBg');
  
  if (!lightbox || !lightboxImg) return;
  
  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightboxBg) {
    lightboxBg.addEventListener('click', closeLightbox);
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
  
  document.addEventListener('click', function(e) {
    var slide = e.target.closest('.photosSwiper .swiper-slide img');
    if (slide) {
      lightboxImg.src = slide.src;
      lightbox.classList.add('is-active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
}

// ===== ニュース レンダリング =====
function renderNews() {
  var config = getConfig();
  var container = document.getElementById('newsGrid');
  if (!container) return;
  
  var news = config.news || [];
  if (news.length === 0) return;
  
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
  
  var kicker = document.getElementById('heroKicker');
  var headline = document.getElementById('heroHeadline');
  var lead = document.getElementById('heroLead');
  var sub = document.getElementById('heroSub');
  
  if (kicker && copy.kicker) kicker.textContent = copy.kicker;
  if (headline && copy.headline) headline.innerHTML = copy.headline;
  if (lead && copy.lead) lead.textContent = copy.lead;
  if (sub && copy.sub) sub.textContent = copy.sub;
}

// ===== ストーリー レンダリング =====
function renderStory() {
  var config = getConfig();
  var container = document.getElementById('storyBody');
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
  
  var bar = document.getElementById('roadProgressBar');
  var raisedText = document.getElementById('roadRaised');
  var goalText = document.getElementById('roadGoal');
  
  if (bar) bar.style.width = percent + '%';
  if (raisedText) raisedText.textContent = raisedYen.toLocaleString() + '円';
  if (goalText) goalText.textContent = goalYen.toLocaleString() + '円';
}

// ===== 応援メッセージ プレビュー =====
async function renderMessagePreview() {
  var config = getConfig();
  var container = document.getElementById('roadMessagesPreview');
  if (!container) return;
  
  var messages = [];
  
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
  
  if (messages.length === 0 && config.messages) {
    messages = config.messages;
  }
  
  messages = messages.filter(function(m) {
    return m.approved !== false;
  });
  
  messages.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  
  var preview = messages.slice(0, 3);
  
  if (preview.length === 0) {
    container.innerHTML = '<p class="no-messages">応援メッセージを募集中です</p>';
    return;
  }
  
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
  var container = document.getElementById('sponsorsGrid');
  if (!container) return;
  
  var sponsors = config.sponsors;
  
  // 配列でない場合は終了
  if (!sponsors || !Array.isArray(sponsors) || sponsors.length === 0) {
    return;
  }
  
  var now = new Date();
  
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
  var mascot = document.getElementById('mascotFloat');
  var mascotImg = document.getElementById('mascotFloatImg');
  
  if (!mascot) return;
  
  if (config.mascot && config.mascot.enabled && config.mascot.image) {
    mascotImg.src = config.mascot.image;
    mascot.style.display = 'block';
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
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
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
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

// ===== ハンバーガーメニュー =====
function initHamburger() {
  var toggle = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', function() {
    var isOpen = toggle.classList.toggle('is-active');
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
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
    reveals.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }
}

// ===== FAQ アコーディオン =====
function initFAQ() {
  var faqItems = document.querySelectorAll('.faqItem');
  if (faqItems.length === 0) return;
  
  faqItems.forEach(function(item) {
    var question = item.querySelector('.faqItem__question');
    if (!question) return;
    
    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('is-open');
      
      faqItems.forEach(function(otherItem) {
        otherItem.classList.remove('is-open');
        var otherQ = otherItem.querySelector('.faqItem__question');
        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
      });
      
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
  
  var container = document.getElementById('countdownTimer');
  if (!container) return;
  
  container.style.display = 'block';
  
  var titleEl = document.getElementById('countdownTitle');
  if (titleEl && countdown.title) {
    titleEl.textContent = countdown.title;
  }
  
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
    
    var daysEl = document.getElementById('countdownDays');
    var hoursEl = document.getElementById('countdownHours');
    var minutesEl = document.getElementById('countdownMinutes');
    var secondsEl = document.getElementById('countdownSeconds');
    
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== リンク設定 =====
function wireLinks() {
  var config = getConfig();
  
  var contactMailLink = document.getElementById('contactMailLink');
  if (contactMailLink && config.contact && config.contact.email) {
    contactMailLink.href = 'mailto:' + config.contact.email;
  }
}

// ===== メッセージフォーム =====
function initMessageForm() {
  var btn = document.getElementById('sendMessageBtn');
  if (!btn) return;
  
  var config = getConfig();
  if (config.tallyFormId) {
    btn.style.display = 'inline-block';
    btn.addEventListener('click', function() {
      var today = new Date().toISOString().split('T')[0];
      var url = 'https://tally.so/r/' + config.tallyFormId + '?date=' + today;
      window.open(url, '_blank');
    });
  }
}

// ===== メディアページ用 =====
function initMedia() {
  renderMediaTexts();
  wireMediaKit();
  wirePressMail();
  initCopyButtons();
  initHamburger();
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

// ===== メイン初期化 =====
async function initSite() {
  clearCacheOnReload();
  
  // 基本UI初期化
  initHamburger();
  initScrollReveal();
  initFAQ();
  initLightbox();
  initShare();
  initMascot();
  initCountdown();
  initMessageForm();
  wireLinks();
  
  // コンテンツレンダリング
  renderHeroCopy();
  renderStory();
  renderTimeline();
  renderNews();
  renderProgress();
  renderSponsors();
  
  // 非同期データ取得
  try {
    var photos = await fetchPhotosData();
    if (photos) {
      renderHero(photos);
      renderMembers(photos);
      renderPhotos(photos);
    }
    
    var instaPosts = await fetchInstagramPosts();
    renderInstagramFeed(instaPosts);
    
    await renderMessagePreview();
    
  } catch (error) {
    console.error('データ取得エラー:', error);
  }
  
  // Swiper 初期化（DOM更新後）
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
