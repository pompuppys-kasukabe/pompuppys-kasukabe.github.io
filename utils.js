/* utils.js - 共通ユーティリティ関数 */

/**
 * HTML特殊文字をエスケープ
 */
function escapeHtml(str){
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 日付文字列をフォーマット (YYYY-MM-DD → YYYY.MM.DD)
 */
function formatDateLabel(dateStr){
  if(!dateStr) return "";
  var m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return String(dateStr);
  return m[1] + "." + m[2] + "." + m[3];
}

/**
 * 数値を日本円表記に変換
 */
function yen(n){
  var v = Number(n || 0);
  try{
    return new Intl.NumberFormat("ja-JP").format(v) + "円";
  }catch(e){
    return v + "円";
  }
}

/**
 * 数値を範囲内に収める
 */
function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

/**
 * 終了日までの残り日数を計算
 */
function daysLeft(endDateStr){
  var end = new Date(String(endDateStr || ""));
  if(!isFinite(end.getTime())) return null;
  var today = new Date();
  var ms = end.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/**
 * people配列の合計人数を計算
 */
function sumPeople(people){
  var arr = Array.isArray(people) ? people : [];
  var total = 0;
  for(var i = 0; i < arr.length; i++){
    total += Number(arr[i].count || 0);
  }
  return total;
}

/**
 * テキストをクリップボードにコピー
 */
async function copyText(text){
  try{
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(e){}
  try{
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
  }catch(e){
    return false;
  }
}

/**
 * JSONをキャッシュなしで取得
 */
async function fetchJsonWithNoCache(url){
  var u = url + (url.indexOf("?") >= 0 ? "&" : "?") + "v=" + Date.now();
  var r = await fetch(u, { cache: "no-store" });
  if(!r.ok) throw new Error("fetch failed: " + r.status);
  return await r.json();
}

/**
 * 応援メッセージ配列を正規化・ソート
 */
function normalizeMessages(list){
  var arr = Array.isArray(list) ? list : [];
  var result = [];
  for(var i = 0; i < arr.length; i++){
    var x = arr[i];
    if(!x) continue;
    if(x.approved === false) continue;
    var msg = String(x.message || "").trim();
    if(!msg) continue;
    result.push({
      date: String(x.date || ""),
      name: String(x.name || "匿名"),
      message: msg
    });
  }
  result.sort(function(a, b){
    return String(b.date).localeCompare(String(a.date));
  });
  return result;
}

/**
 * 要素にテキストを設定
 */
function setText(id, text){
  var el = document.getElementById(id);
  if(el) el.textContent = text || "";
}

/**
 * 要素にHTMLを設定
 */
function setHtml(id, html){
  var el = document.getElementById(id);
  if(el) el.innerHTML = html || "";
}

/**
 * 要素の表示/非表示を切り替え
 */
function setVisible(id, visible){
  var el = document.getElementById(id);
  if(el) el.style.display = visible ? "" : "none";
}

/**
 * reduced-motion設定を確認
 */
function prefersReducedMotion(){
  try{
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }catch(e){
    return false;
  }
}

/**
 * データセーバーモードを確認
 */
function saveDataOn(){
  try{
    return !!(navigator.connection && navigator.connection.saveData);
  }catch(e){
    return false;
  }
}

/**
 * 設定オブジェクトを安全に取得
 */
function getConfig(){
  return window.PUPPYS_CONFIG || {};
}

/**
 * ネストしたプロパティを安全に取得
 */
function getConfigValue(path, defaultValue){
  var cfg = getConfig();
  var keys = path.split(".");
  var value = cfg;
  for(var i = 0; i < keys.length; i++){
    if(value == null) return defaultValue;
    value = value[keys[i]];
  }
  return value != null ? value : defaultValue;
}
