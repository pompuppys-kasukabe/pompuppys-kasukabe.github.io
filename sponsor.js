function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#39;");
}

function initSponsorPage(){
  const s = window.PUPPYS_CONFIG?.sponsor;
  if(!s) return;

  const email = window.PUPPYS_CONFIG?.pressEmail || "";
  const name = window.PUPPYS_CONFIG?.pressContactName || "";

  const setText = (id, text)=>{
    const el = document.getElementById(id);
    if(el) el.textContent = text || "";
  };

  setText("spPageTitle", s.pageTitle || "企業・団体の方へ（協賛 / 応援出演）");
  setText("spLead",
    "協賛（ロゴ掲載）や、応援出演（有料・演技のみ）のご相談窓口です。まずはお気軽にご連絡ください。"
  );
  setText("spFeeNote", s.feeNote || "");
  setText("spAreaNote", s.areaNote || "");
  setText("spEmailText", email || "—");

  // Form button (optional)
  const formBtn = document.getElementById("spFormBtn");
  if(formBtn){
    if(s.formUrl){
      formBtn.href = s.formUrl;
      formBtn.style.display = "inline-flex";
    }else{
      formBtn.style.display = "none";
    }
  }

  // Mail button
  const mailBtn = document.getElementById("spMailBtn");
  if(mailBtn){
    if(email){
      const subject = encodeURIComponent(s.mail?.subject || "【協賛/応援出演のご相談】POM PUPPYS bright");
      const bodyBase = s.mail?.body || "";
      const body = encodeURIComponent(bodyBase + (name ? `\n\n（署名）\n${name}` : ""));
      mailBtn.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }else{
      mailBtn.href = "#";
    }
  }

  // Menus
  const menus = document.getElementById("spMenus");
  if(menus){
    const list = Array.isArray(s.menus) ? s.menus : [];
    menus.innerHTML = list.map(m=>`
      <div class="menuItem">
        <div class="menuItem__title">${escapeHtml(m.title || "")}</div>
        <div class="muted" style="line-height:1.8;margin-top:6px;">${escapeHtml(m.body || "")}</div>
      </div>
    `).join("");
  }

  // Required
  const req = document.getElementById("spRequired");
  if(req){
    const items = Array.isArray(s.required) ? s.required : [];
    req.innerHTML = items.map(t=>`<li>${escapeHtml(t)}</li>`).join("");
  }

  // Policy
  const pol = document.getElementById("spPolicy");
  if(pol){
    const items = Array.isArray(s.policy) ? s.policy : [];
    pol.innerHTML = items.map(t=>`<li>${escapeHtml(t)}</li>`).join("");
  }
}

document.addEventListener("DOMContentLoaded", initSponsorPage);
