# SITE_REVIEW_GUIDE

## 目的
チーム確認用に「見た目（文字・写真）」を先に固める手順です。

---

## 写真を入れる（最短）
1) `assets/photos/` に写真を入れる  
2) `config.js > siteImages` のパスを差し替える

### 推奨ファイル名（例）
- `assets/photos/hero.jpg`（HERO用：横長推奨）
- `assets/photos/event_01.jpg`
- `assets/photos/practice_01.jpg`
- `assets/photos/team_01.jpg`

---

## あて文字を直す（ここだけ触ればOK）
`config.js > copy` を編集してください。

---

## キャラクターを出す（任意）
`config.js > siteImages.mascot.enabled = true`  
`assets/mascot.png` を置く

---

## チーム確認の観点
- 表記ゆれ（bright / 春日部 / ふじみ野）
- 写真の写り込み（学校名/名札/車ナンバー）
- スマホでの読みやすさ
- 3秒で「何のチームか」伝わるか
