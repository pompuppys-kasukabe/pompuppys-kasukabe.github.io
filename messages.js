/* messages.js - #BrightWings1000 千羽鶴企画 */

(function() {
  'use strict';

  let allMessages = [];
  let config = null;

  // ============================================
  // 初期化
  // ============================================
  function initMessagesPage() {
    if (typeof window.PUPPYS_CONFIG === 'undefined' || !window.PUPPYS_CONFIG.brightWings1000) {
      console.error('BrightWings1000 config not found');
      return;
    }

    config = window.PUPPYS_CONFIG.brightWings1000;

    if (!config.enabled) {
      console.log('BrightWings1000 is disabled');
      return;
    }

    // ページ情報を更新
    updatePageInfo();

    // メッセージを取得して表示
    fetchAndDisplayMessages();
  }

  // ============================================
  // ページ情報更新
  // ============================================
  function updatePageInfo() {
    // タイトル・コピー
    const titleEl = document.getElementById('messagesTitle');
    const mainCopyEl = document.getElementById('messagesMainCopy');
    const subCopyEl = document.getElementById('messagesSubCopy');
    const deadlineEl = document.getElementById('messagesDeadline');
    const noteEl = document.getElementById('messagesNote');
    const goalEl = document.getElementById('messageGoal');

    if (titleEl) titleEl.textContent = config.title || '#BrightWings1000';
    if (mainCopyEl) mainCopyEl.textContent = config.mainCopy || '';
    if (subCopyEl) subCopyEl.textContent = config.subCopy || '';
    if (deadlineEl) deadlineEl.textContent = '目標期限：' + (config.deadlineText || config.deadline);
    if (noteEl) noteEl.textContent = config.note || '';
    if (goalEl) goalEl.textContent = config.goal.toLocaleString();
  }

  // ============================================
  // メッセージ取得と表示
  // ============================================
  async function fetchAndDisplayMessages() {
    try {
      const url = config.apiUrl + '?action=getMessages&limit=1000&t=' + Date.now();
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const data = await response.json();
      allMessages = data.messages || [];

      // 進捗更新
      updateProgress(allMessages.length, config.goal);

      // メッセージ分類と表示
      const categorized = categorizeMessages(allMessages);

      renderVIPMessages(categorized.vip);
      renderPickupMessages(categorized.pickup);
      renderAllMessages(allMessages);

    } catch (error) {
      console.error('Failed to fetch messages:', error);
      showError();
    }
  }

  // ============================================
  // メッセージ分類
  // ============================================
  function categorizeMessages(messages) {
    const vipCategories = config.vipCategories || ['VIP', '市長・政治家', 'スポンサー', 'クラファン支援者'];
    const pickupCount = config.pickupCount || 20; // デフォルト20件

    const vip = messages.filter(m => vipCategories.includes(m.category));

    // VIP以外のメッセージを日付順（新しい順）にソートして最新N件をピックアップ
    const nonVipMessages = messages.filter(m => !vipCategories.includes(m.category));

    // 日付でソート（新しい順）
    const sortedByDate = nonVipMessages.slice().sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA; // 降順（新しい順）
    });

    // 最新N件をピックアップとして取得
    const pickup = sortedByDate.slice(0, pickupCount);

    console.log('Total messages:', messages.length, 'VIP:', vip.length, 'Pickup (latest ' + pickupCount + '):', pickup.length);

    return { vip, pickup };
  }

  // 日付文字列をDateオブジェクトに変換
  function parseDate(dateStr) {
    if (!dateStr) return new Date(0); // 日付がない場合は最古扱い
    // 様々な日付フォーマットに対応（YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD等）
    const normalized = dateStr.replace(/[./]/g, '-');
    const parsed = new Date(normalized);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  }

  // ============================================
  // VIPメッセージ表示
  // ============================================
  function renderVIPMessages(vipMessages) {
    const section = document.getElementById('vipMessages');
    const grid = document.getElementById('vipMessagesGrid');

    if (!vipMessages || vipMessages.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    const html = vipMessages.map(msg => {
      const categoryClass = getCategoryClass(msg.category);
      return `
        <div class="vip-message-card ${categoryClass}">
          <div class="vip-message-card__category">${escapeHtml(msg.category)}</div>
          <div class="vip-message-card__header">
            <p class="vip-message-card__name">${escapeHtml(msg.name)}</p>
            <p class="vip-message-card__date">${escapeHtml(msg.date)}</p>
          </div>
          <p class="vip-message-card__text">${escapeHtml(msg.message)}</p>
        </div>
      `;
    }).join('');

    grid.innerHTML = html;
  }

  // ============================================
  // ピックアップメッセージ表示
  // ============================================
  function renderPickupMessages(pickupMessages) {
    const section = document.getElementById('pickupMessages');
    const grid = document.getElementById('pickupMessagesGrid');

    console.log('renderPickupMessages called with:', pickupMessages.length, 'messages');

    if (!config.showPickup || !pickupMessages || pickupMessages.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    // Swiperカルーセル用のHTML生成
    let html = '<div class="swiper pickupSwiper" style="width: 100%; padding: 20px 0;">' +
      '<div class="swiper-wrapper">';

    pickupMessages.forEach((msg, index) => {
      html += '<div class="swiper-slide">' +
        '<div class="pickup-message-card" style="background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,168,75,0.05)); border: 2px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 32px; min-height: 280px; display: flex; flex-direction: column; cursor: pointer;" onclick="window.showMessageDetail(' + JSON.stringify(msg).replace(/"/g, '&quot;') + ')">' +
        '<p style="font-size: 0.9rem; color: #999; margin: 0 0 12px 0; text-align: center;">' + escapeHtml(msg.date || "") + '</p>' +
        '<p style="font-size: 1.3rem; font-weight: 700; margin: 0 0 24px 0; color: #333; text-align: center;">' + escapeHtml(msg.name || "匿名") + '</p>' +
        '<p style="font-size: 1.05rem; line-height: 1.9; color: #555; margin: 0; flex: 1; text-align: center;">' + escapeHtml(msg.message || "") + '</p>' +
        '</div></div>';
    });

    html += '</div>' +
      '<div class="swiper-pagination"></div>' +
      '<div class="swiper-button-prev"></div>' +
      '<div class="swiper-button-next"></div>' +
      '</div>';

    grid.innerHTML = html;

    // Swiper初期化（自動再生付き）
    setTimeout(() => {
      const pickupSwiper = new Swiper('.pickupSwiper', {
        effect: 'slide',
        slidesPerView: 1,
        slidesPerGroup: 1,
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        loopedSlides: pickupMessages.length,
        speed: 600,
        allowTouchMove: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: true,
        },
        pagination: {
          el: '.pickupSwiper .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.pickupSwiper .swiper-button-next',
          prevEl: '.pickupSwiper .swiper-button-prev',
        },
        on: {
          init: function() {
            console.log('Pickup carousel initialized:', pickupMessages.length, 'messages');
            this.autoplay.start();
          },
          slideChange: function() {
            console.log('Slide changed to:', this.realIndex);
          }
        }
      });
    }, 100);
  }

  // ============================================
  // 全メッセージグリッド表示
  // ============================================
  function renderAllMessages(messages) {
    const grid = document.getElementById('allMessagesGrid');

    // 要素が存在しない場合は何もしない（project-world-challenge.htmlでは削除済み）
    if (!grid) {
      console.log('allMessagesGrid not found - skipping renderAllMessages');
      return;
    }

    if (!messages || messages.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>まだメッセージがありません。<br>最初の応援メッセージを送りませんか？</p></div>';
      return;
    }

    const html = messages.map((msg, index) => {
      const isPickup = msg.pickup;
      const isVIP = (config.vipCategories || []).includes(msg.category);
      const tileClass = isVIP ? 'message-tile--vip' : (isPickup ? 'message-tile--pickup' : '');

      // ヒートマップカラー（新しい順に色を変える）
      const colorIndex = Math.min(Math.floor(index / (messages.length / 4)), 3);
      const heatmapClass = `message-tile--heat-${colorIndex}`;

      return `
        <div class="message-tile ${tileClass} ${heatmapClass}" onclick="window.showMessageDetail(${JSON.stringify(msg).replace(/"/g, '&quot;')})">
          <div class="message-tile__inner">
            ${isPickup ? '<i class="fas fa-star message-tile__icon"></i>' : ''}
            ${isVIP ? '<i class="fas fa-crown message-tile__icon"></i>' : ''}
            <p class="message-tile__name">${escapeHtml(msg.name)}</p>
          </div>
        </div>
      `;
    }).join('');

    grid.innerHTML = html;
  }

  // ============================================
  // 進捗更新
  // ============================================
  function updateProgress(current, goal) {
    const countEl = document.getElementById('messageCount');
    const fillEl = document.getElementById('progressBarFill');

    if (countEl) {
      countEl.textContent = current.toLocaleString();
    }

    if (fillEl) {
      const percentage = Math.min((current / goal) * 100, 100);
      fillEl.style.width = percentage + '%';
    }
  }

  // ============================================
  // メッセージ詳細モーダル表示
  // ============================================
  window.showMessageDetail = function(message) {
    const modal = document.getElementById('messageModal');
    const nameEl = document.getElementById('modalMessageName');
    const dateEl = document.getElementById('modalMessageDate');
    const categoryEl = document.getElementById('modalMessageCategory');
    const textEl = document.getElementById('modalMessageText');

    if (!modal) return;

    if (nameEl) nameEl.textContent = message.name;
    if (dateEl) dateEl.textContent = message.date;
    if (categoryEl) {
      categoryEl.textContent = message.category || '一般';
      categoryEl.className = 'message-detail__category ' + getCategoryClass(message.category);
    }
    if (textEl) textEl.textContent = message.message;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  // モーダルを閉じる
  function closeModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // ============================================
  // エラー表示
  // ============================================
  function showError() {
    const grid = document.getElementById('allMessagesGrid');
    if (grid) {
      grid.innerHTML = '<div class="error-state"><p>メッセージの読み込みに失敗しました。<br>しばらくしてから再度お試しください。</p></div>';
    }
  }

  // ============================================
  // ユーティリティ
  // ============================================
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getCategoryClass(category) {
    const categoryMap = {
      'VIP': 'category--vip',
      '市長・政治家': 'category--official',
      'スポンサー': 'category--sponsor',
      'クラファン支援者': 'category--supporter',
      '一般': 'category--general'
    };
    return categoryMap[category] || 'category--general';
  }

  // ============================================
  // イベントリスナー
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    // ページ初期化
    initMessagesPage();

    // モーダル閉じる
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Escキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  });

})();
