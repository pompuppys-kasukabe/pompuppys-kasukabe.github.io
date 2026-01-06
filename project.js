/* project.js - クラファン特設ページ用 */

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

async function renderSupportMessagesProject(){
  var msgCfg = getConfigValue("supportMessages", {});
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
    }else{
      btn.style.display = "none";
    }
  }

  // Loading state
  grid.innerHTML = '<div class="muted">読み込み中...</div>';

  var data = [];
  try{
    // Notion API連携を使用する場合
    if(msgCfg.useNotionAPI){
      var photosApiUrl = "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec";
      var url = photosApiUrl + "?action=getMessages&t=" + Date.now();
      var res = await fetch(url, { cache: "no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      data = await res.json();
    }
    // 従来のJSONファイルを使用する場合
    else if(msgCfg.dataUrl){
      data = await fetchJsonWithNoCache(msgCfg.dataUrl);
    }
  }catch(e){
    console.error("メッセージ取得失敗:", e);
    grid.innerHTML = '<div class="muted">メッセージの読み込みに失敗しました。</div>';
    return;
  }

  var max = Number(msgCfg.maxOnProject) || 24;
  var messages = Array.isArray(data) ? data : (data.messages || []);
　var items = messages
  .filter(function(m) { return m.approved !== false && m.message; })
  .sort(function(a, b) { return String(b.date).localeCompare(String(a.date)); })
  .slice(0, max);


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

function renderProject(){
  var p = getConfigValue("project", null);
  if(!p) return;

  var c = p.copy || {};

  setText("pKicker", c.heroKicker);
  setText("pHeadline", c.heroHeadline);
  setText("pLead", c.heroLead);

  mountHeroMediaProject(p);

  var goal = Number(p.goalYen || 0);
  var raised = Number(p.raisedYen || 0);
  var pct = goal > 0 ? (raised / goal) * 100 : 0;

  setText("goalYen", yen(goal));
  setText("raisedYen", yen(raised));
  setText("pct", Math.round(pct) + "%");

  var dl = daysLeft(p.endDate);
  if(dl === null){
    setText("daysLeft", "—");
  }else if(dl < 0){
    setText("daysLeft", "終了");
  }else{
    setText("daysLeft", dl + "日");
  }
  setText("updatedAt", p.updatedAt || "—");

  var bar = document.getElementById("barFill");
  if(bar) bar.style.width = clamp(pct, 0, 100).toFixed(1) + "%";

  var ppl = sumPeople(p.people);
  var perPackage = Number(p.costPerPersonYen || 0);
  var perExtras = Number(p.extrasPerPersonEstimateYen || 0);
  var perTotal = perPackage + perExtras;
  var totalCost = perPackage * ppl;

  setText("perPerson", yen(perPackage));
  setText("extrasPerPerson", yen(perExtras) + "（目安）");
  setText("totalPerPerson", yen(perTotal) + "（目安）");
  setText("headcount", ppl + "名（選手・コーチ合計）");
  setText("totalCost", yen(totalCost));

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

  // Sections
  var sections = c.sections || {};
  setText("whyTitle", sections.whyTitle || "なぜ支援が必要か");
  mountList("whyBody", sections.whyBody);
  setText("usageTitle", sections.usageTitle || "資金の使い道");
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
    "</tr>";
  }
  pt.innerHTML = ptHtml;
}

  mountList("extraCosts", p.extraCosts);

  // Fund flow
  var ff = p.fundFlow || {};
  setText("fundFlowTitle", ff.title || "ご支援の使い道（優先順位）");
  var ffNote = document.getElementById("fundFlowNote");
  if(ffNote){
    ffNote.textContent = ff.note || "";
    ffNote.style.display = ffNote.textContent ? "block" : "none";
  }
  var ffWrap = document.getElementById("fundFlow");
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
  setText("itineraryTitle", sections.scheduleTitle || "渡航〜大会までの流れ（抜粋）");
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
  var email = getConfigValue("pressEmail", "");
  var contactName = getConfigValue("pressContactName", "");

  setText("supportTitle", sup.title || "応援の方法");

  // Individual
  var ind = sup.individual || {};
  setText("supportIndTitle", ind.title || "個人で応援");
  setText("supportIndBody", ind.body);

  var iBtn = document.getElementById("supportIndBtn");
  var iNote = document.getElementById("supportIndNote");
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
  setText("supportCorpTitle", corp.title || "企業・団体として応援（協賛）");
  setText("supportCorpBody", corp.body);

  var cBtn = document.getElementById("supportCorpBtn");
  var cNote = document.getElementById("supportCorpNote");
  if(cBtn){
    cBtn.textContent = corp.ctaLabel || "協賛の相談をする（メール）";
    if(email){
      var subject = encodeURIComponent(corp.mailSubject || "【協賛のご相談】POM PUPPYS bright");
      var bodyText = (corp.mailBody || "") + (contactName ? "\n\n（署名）\n" + contactName : "");
      var bodyEnc = encodeURIComponent(bodyText);
      cBtn.href = "mailto:" + email + "?subject=" + subject + "&body=" + bodyEnc;
      if(cNote){
  cNote.textContent = "送信先：" + email + "（" + contactName + "）";
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

async function fetchMessages(){
  try {
    var cfg = getConfigValue("brightWings1000", null);
    if(!cfg || !cfg.apiUrl) return [];

    var url = cfg.apiUrl + "?action=getMessages&t=" + Date.now();
    var res = await fetch(url, { cache: "no-store" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();

    var messages = data.messages || data;
    return messages
      .filter(function(m){ return m.approved !== false && m.message; })
      .sort(function(a, b){ return String(b.date).localeCompare(String(a.date)); });
  } catch(e) {
    console.error("メッセージ取得失敗:", e);
    return [];
  }
}

function openMessageModal(message){
  var modal = document.getElementById("messageModal");
  var nameEl = document.getElementById("modalMessageName");
  var dateEl = document.getElementById("modalMessageDate");
  var categoryEl = document.getElementById("modalMessageCategory");
  var textEl = document.getElementById("modalMessageText");

  if(!modal) return;

  if(nameEl) nameEl.textContent = message.name || "匿名";
  if(dateEl) dateEl.textContent = message.date || "";
  if(categoryEl){
    categoryEl.textContent = message.category || "一般";
  }
  if(textEl) textEl.textContent = message.message || "";

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeMessageModal(){
  var modal = document.getElementById("messageModal");
  if(modal){
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

async function renderMosaicArt(){
  var mosaicGrid = document.getElementById("mosaicGrid");
  if(!mosaicGrid) return;

  // メッセージデータを取得
  var messages = [];
  try {
    messages = await fetchMessages();
  } catch(e) {
    console.error("モザイク用メッセージ取得失敗:", e);
  }

  var totalCells = 1000;
  var filledCount = Math.min(messages.length, totalCells);

  // グリッドをクリア
  mosaicGrid.innerHTML = "";

  // 1,000セルを生成
  for(var i = 0; i < totalCells; i++){
    var cell = document.createElement("div");
    cell.className = "mosaic-cell";

    // メッセージがある分だけ塗りつぶす
    if(i < filledCount){
      cell.classList.add("filled");
      var msg = messages[i];

      // クリック時にモーダルを開く
      (function(message){
        cell.addEventListener("click", function(){
          openMessageModal(message);
        });
      })(msg);

      // ホバー時のツールチップ効果
      cell.title = (msg.name || "匿名") + "さんからの応援";
    } else {
      cell.classList.add("empty");
      cell.title = "メッセージ募集中";
    }

    mosaicGrid.appendChild(cell);

    // アニメーション遅延（視覚効果）
    cell.style.animationDelay = (i * 2) + "ms";
  }
}

async function renderAllMessagesGrid(){
  var grid = document.getElementById("allMessagesGrid");
  if(!grid) return;

  var messages = await fetchMessages();

  if(!messages || messages.length === 0){
    grid.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #999;"><p>まだメッセージがありません。<br>最初の応援メッセージを送りませんか？</p></div>';
    return;
  }

  var html = "";
  for(var i = 0; i < messages.length; i++){
    var msg = messages[i];
    var initial = (msg.name && msg.name.charAt(0)) || "匿";

    html += '<div class="message-tile" onclick="openMessageModal(' + JSON.stringify(msg).replace(/"/g, '&quot;') + ')" style="cursor: pointer; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 12px; text-align: center; transition: all 0.3s ease;">' +
      '<div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #f4cf67); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; margin: 0 auto 8px;">' + escapeHtml(initial) + '</div>' +
      '<p style="font-size: 0.85rem; font-weight: 700; margin: 0; color: #333;">' + escapeHtml(msg.name || "匿名") + '</p>' +
      '<p style="font-size: 0.75rem; color: #999; margin: 4px 0 0;">' + escapeHtml(msg.date || "") + '</p>' +
    '</div>';
  }

  grid.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function(){
  try{
    renderProject();
    renderSupportMessagesProject();
    wireProjectShare();
    renderMosaicArt();
    renderAllMessagesGrid();

    // モーダルクローズイベント
    var modalClose = document.getElementById("modalClose");
    var modalOverlay = document.getElementById("modalOverlay");

    if(modalClose){
      modalClose.addEventListener("click", closeMessageModal);
    }

    if(modalOverlay){
      modalOverlay.addEventListener("click", closeMessageModal);
    }

    // Escキーでモーダルを閉じる
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape"){
        closeMessageModal();
      }
    });
  }catch(e){
    console.error(e);
  }
});
