/* sponsor.js - 協賛ページ用 */

function initSponsorPage(){
  var s = getConfigValue("sponsor", null);
  if(!s) return;

  var email = getConfigValue("pressEmail", "");
  var name = getConfigValue("pressContactName", "");

  setText("spPageTitle", s.pageTitle || "企業・団体の方へ（協賛 / 応援出演）");
  setText("spLead", "協賛（ロゴ掲載）や、応援出演（有料・演技のみ）のご相談窓口です。まずはお気軽にご連絡ください。");
  setText("spFeeNote", s.feeNote || "");
  setText("spAreaNote", s.areaNote || "");
  setText("spEmailText", email || "—");

  // Form button (optional)
  var formBtn = document.getElementById("spFormBtn");
  if(formBtn){
    if(s.formUrl){
      formBtn.href = s.formUrl;
      formBtn.style.display = "inline-flex";
    }else{
      formBtn.style.display = "none";
    }
  }

  // Mail button
  var mailBtn = document.getElementById("spMailBtn");
  if(mailBtn){
    if(email){
      var mail = s.mail || {};
      var subject = encodeURIComponent(mail.subject || "【協賛/応援出演のご相談】POM PUPPYS bright");
      var bodyBase = mail.body || "";
      var bodyText = bodyBase;
      var body = encodeURIComponent(bodyText);
      mailBtn.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
    }else{
      mailBtn.href = "#";
    }
  }

  // Menus
  var menus = document.getElementById("spMenus");
  if(menus){
    var list = Array.isArray(s.menus) ? s.menus : [];
    var menusHtml = "";
    for(var i = 0; i < list.length; i++){
      var m = list[i];
      menusHtml += '<div class="menuItem">' +
        '<div class="menuItem__title">' + escapeHtml(m.title || "") + '</div>' +
        '<div class="muted" style="line-height:1.8;margin-top:6px;">' + escapeHtml(m.body || "") + '</div>' +
      '</div>';
    }
    menus.innerHTML = menusHtml;
  }

  // Required
  var req = document.getElementById("spRequired");
  if(req){
    var reqItems = Array.isArray(s.required) ? s.required : [];
    var reqHtml = "";
    for(var j = 0; j < reqItems.length; j++){
      reqHtml += "<li>" + escapeHtml(reqItems[j]) + "</li>";
    }
    req.innerHTML = reqHtml;
  }

  // Policy
  var pol = document.getElementById("spPolicy");
  if(pol){
    var polItems = Array.isArray(s.policy) ? s.policy : [];
    var polHtml = "";
    for(var k = 0; k < polItems.length; k++){
      polHtml += "<li>" + escapeHtml(polItems[k]) + "</li>";
    }
    pol.innerHTML = polHtml;
  }
}

document.addEventListener("DOMContentLoaded", initSponsorPage);
