/* main.js */
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

// "2025-12-28" -> "2025.12.28"（空なら空）
function formatDateLabel(dateStr){
  if(!dateStr) return "";
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return `${m[1]}.${m[2]}.${m[3]}`;
}

function renderNews(){
  const wrap = document.getElementById("newsGrid");
  if(!wrap) return;

  const items = window.PUPPYS_CONFIG?.news || [];
  if(!items.length){
    wrap.innerHTML = `<div class="muted">現在お知らせはありません。</div>`;
    return;
  }

  wrap.innerHTML = items.map(n=>{
    const dateLabel = formatDateLabel(n.date);
    const link = n.url ? `<a class="newsLink" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">詳細を見る</a>` : "";
    return `
      <article class="newsItem">
        <div class="newsTop">
          <span class="badge">${escapeHtml(n.tag || "NEWS")}</span>
          ${dateLabel ? `<span class="newsDate">${escapeHtml(dateLabel)}</span>` : `<span></span>`}
        </div>
        <h3 class="newsTitle">${escapeHtml(n.title || "")}</h3>
        ${n.body ? `<p class="newsBody">${escapeHtml(n.body)}</p>` : ``}
        ${link}
      </article>
    `;
  }).join("");
}

function wireMediaKit(){
  const url = window.PUPPYS_CONFIG?.mediaKitUrl;
  const btn = document.getElementById("mediaKitBtn");
  if(!btn) return;
  if(!url){
    btn.style.display = "none";
    return;
  }
  btn.href = url;
}

function wirePressMail(){
  const email = window.PUPPYS_CONFIG?.pressEmail;
  const name = window.PUPPYS_CONFIG?.pressContactName || "";
  const btn = document.getElementById("pressMailBtn");
  if(!btn || !email) return;
  const subject = encodeURIComponent("POM PUPPYS bright 取材のご相談");
  const body = encodeURIComponent(`取材のご相談です。\n\n媒体名：\nご担当者名：\nご希望内容：\nご希望日時：\n\n（署名）\n${name}`);
  btn.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function wireWebShare(){
  const btn = document.getElementById("shareBtn");
  if(!btn) return;

  const title = document.title;
  const text = "POM PUPPYS bright 公式サイト";
  const url = location.href;

  const canShare = !!navigator.share;
  btn.style.display = "inline-flex";

  btn.addEventListener("click", async ()=>{
    try{
      if(canShare){
        await navigator.share({ title, text, url });
      }else{
        await navigator.clipboard.writeText(url);
        btn.textContent = "URLをコピーしました";
        setTimeout(()=>btn.textContent="共有", 1400);
      }
    }catch(e){
      // ユーザーキャンセル等は無視
    }
  });
}

function initSite(){
  renderNews();
  wireMediaKit();
  wirePressMail();
  wireWebShare();
}

document.addEventListener("DOMContentLoaded", initSite);
