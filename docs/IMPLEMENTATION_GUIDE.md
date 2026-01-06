# 選択肢A実装ガイド - 最大インパクト優先機能

**実装日**: 2026-01-04
**実装内容**: カウントダウンタイマー、Instagram埋め込み、メディア掲載セクション

---

## 🎯 実装完了機能

### 1. ⏰ カウントダウンタイマー

**実装場所**: `index.html` - Road to the World セクション

**機能**:
- The Dance Summit 2026までのリアルタイムカウントダウン
- 日・時間・分・秒を表示
- 毎秒自動更新

**設定方法** (`config.js`):

```javascript
danceSummit: {
  date: "2026-03-20", // 大会の日付（実際の日程が決まったら更新）
  location: "Orlando, Florida, USA",
  countdown: {
    enabled: true, // カウントダウンを表示するか
    title: "The Dance Summit 2026まで"
  }
}
```

**日付を変更する場合**:
1. `config.js` を開く
2. `danceSummit.date` を実際の大会日程に変更
3. 保存してリロード

**カウントダウンを非表示にする場合**:
```javascript
countdown: {
  enabled: false // falseに変更
}
```

---

### 2. 📱 Instagram埋め込みフィード

**実装場所**: `index.html` - Photosセクションの後

**機能**:
- Instagramアカウント(@pompuppysbright)へのリンク
- フォローボタン
- 将来的にInstagram投稿の自動表示にアップグレード可能

**現在の実装**:
- シンプルなプレースホルダー + フォローボタン

**今後のアップグレード方法**:

#### オプション1: Instagram Basic Display API
```javascript
// main.js の renderInstagramFeed() 関数を編集
// Instagram Access Tokenが必要
// https://developers.facebook.com/docs/instagram-basic-display-api
```

#### オプション2: Elfsight ウィジェット（推奨 - 簡単）
1. https://elfsight.com/instagram-feed-instashow/ にアクセス
2. 無料プランでウィジェット作成
3. 埋め込みコードをコピー
4. `index.html` の `<div id="instagramFeed">` 内に貼り付け

```html
<div id="instagramFeed">
  <!-- Elfsight埋め込みコードをここに貼り付け -->
  <script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script>
  <div class="elfsight-app-xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></div>
</div>
```

#### オプション3: 手動で投稿を追加
```javascript
// config.js に追加
instagram: {
  enabled: true,
  username: "pompuppysbright",
  posts: [
    {
      image: "./assets/instagram/post1.jpg",
      caption: "練習の様子です！",
      url: "https://www.instagram.com/p/xxxxx/"
    }
    // ...
  ]
}
```

**設定** (`config.js`):
```javascript
instagram: {
  enabled: true, // Instagramセクションを表示
  username: "pompuppysbright",
  displayCount: 6, // 表示する投稿数（将来の自動表示用）
  embedType: "simple" // または "widget"
}
```

**非表示にする場合**:
```javascript
instagram: {
  enabled: false
}
```

---

### 3. 📰 メディア掲載セクション

**実装場所**: `index.html` - Instagramセクションの後

**機能**:
- メディアロゴの表示
- 記事へのリンク
- グレースケール → ホバーでカラー化
- 掲載日表示

**メディア掲載を追加する方法**:

#### ステップ1: ロゴ画像を準備
```bash
# assetsフォルダにmediaフォルダを作成
mkdir -p assets/media

# ロゴ画像をコピー（PNG推奨、透過背景）
# 推奨サイズ: 横幅300-500px、高さ100-150px
```

#### ステップ2: config.jsに追加
```javascript
mediaFeatures: [
  {
    name: "朝日新聞デジタル",
    logo: "./assets/media/asahi.png",
    url: "https://www.asahi.com/articles/xxxxx",
    date: "2025-01-15"
  },
  {
    name: "埼玉新聞",
    logo: "./assets/media/saitama-np.png",
    url: "https://www.saitama-np.co.jp/articles/xxxxx",
    date: "2025-02-01"
  },
  {
    name: "読売新聞",
    logo: "./assets/media/yomiuri.png",
    url: "https://www.yomiuri.co.jp/local/saitama/xxxxx",
    date: "2025-02-10"
  }
]
```

#### ステップ3: ロゴ画像の最適化

**推奨仕様**:
- 形式: PNG（透過背景）
- サイズ: 横幅400px、高さ100-120px
- 容量: 50KB以下
- 色: カラー（グレースケール化はCSSで自動処理）

**画像最適化ツール**:
- TinyPNG: https://tinypng.com/
- ImageOptim (Mac): https://imageoptim.com/

#### ステップ4: 表示確認
```bash
# ローカルで確認
open http://localhost:8000/index.html
```

**非表示にする場合**:
```javascript
mediaFeatures: []  // 空配列にする
```

---

## 📁 変更されたファイル一覧

```
modified:   config.js
modified:   index.html
modified:   style-components.css
modified:   main.js
new file:   WEB_IMPROVEMENT_PLAN.md
new file:   IMPLEMENTATION_GUIDE.md
```

---

## 🧪 テスト方法

### ローカルテスト

1. **ローカルサーバー起動**
```bash
python3 -m http.server 8000
```

2. **ブラウザで確認**
```
http://localhost:8000/index.html
```

3. **確認項目**
- [ ] カウントダウンタイマーが表示されている
- [ ] タイマーの数字が1秒ごとに更新される
- [ ] Instagramセクションが表示されている
- [ ] Instagramフォローボタンが機能する
- [ ] メディア掲載セクション（掲載があれば表示）
- [ ] モバイル表示の確認（Chrome DevTools）
- [ ] レスポンシブデザインの動作

### モバイルテスト

**Chrome DevTools**:
1. F12キーを押す
2. デバイスツールバーをクリック（Ctrl+Shift+M / Cmd+Shift+M）
3. iPhone/Android各サイズで確認

**確認デバイス**:
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad (768px)
- Desktop (1920px)

---

## 🚀 デプロイ方法

### GitHub Pagesへのデプロイ

```bash
# 変更をステージング
git add .

# コミット
git commit -m "選択肢A実装: カウントダウンタイマー、Instagram、メディア掲載セクション追加

🎯 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# プッシュ
git push origin main
```

**GitHub Pagesの設定確認**:
1. GitHubリポジトリページにアクセス
2. Settings → Pages
3. Source: `main` ブランチ
4. 数分後に https://pompuppys-kasukabe.github.io/ で確認

---

## 🔧 トラブルシューティング

### カウントダウンタイマーが表示されない

**原因1**: `config.js` の設定が無効
```javascript
// 確認: countdown.enabled が true か確認
danceSummit: {
  countdown: {
    enabled: true  // ← これが false になっていないか
  }
}
```

**原因2**: 日付フォーマットが不正
```javascript
// 正しい形式: YYYY-MM-DD
date: "2026-03-20"  // ○
date: "2026/03/20"  // ×
date: "March 20, 2026"  // ×
```

**原因3**: JavaScript エラー
```
ブラウザのコンソールを確認（F12 → Console）
エラーメッセージがあれば報告
```

### Instagramセクションが表示されない

**原因**: `config.js` で無効化されている
```javascript
instagram: {
  enabled: true  // ← これが false になっていないか
}
```

### メディア掲載セクションが表示されない

**原因1**: `mediaFeatures` が空
```javascript
// config.jsに最低1件追加する
mediaFeatures: [
  { name: "...", logo: "...", url: "...", date: "..." }
]
```

**原因2**: ロゴ画像のパスが間違っている
```javascript
// 正しいパス例
logo: "./assets/media/logo.png"  // ○
logo: "assets/media/logo.png"    // ○
logo: "/assets/media/logo.png"   // ×（先頭の / に注意）
```

---

## 📈 パフォーマンス最適化

### 画像最適化

**メディアロゴ**:
```bash
# TinyPNGで圧縮（推奨）
# または ImageOptimを使用

# サイズ目標: 各ロゴ 50KB以下
```

**遅延読み込み** (将来の最適化):
```html
<!-- Instagram画像に loading="lazy" 追加 -->
<img src="..." loading="lazy" alt="...">
```

### JavaScriptパフォーマンス

**カウントダウンタイマー**:
- `setInterval` を1秒ごとに実行
- ページを離れた時も動作（問題なし）

**メモリリーク対策**（将来の改善）:
```javascript
// ページ離脱時にタイマーをクリア
window.addEventListener('beforeunload', function() {
  if (countdownInterval) clearInterval(countdownInterval);
});
```

---

## 🎨 カスタマイズ方法

### カウントダウンタイマーの色を変更

`style-components.css` を編集:

```css
.countdown__title {
  color: var(--purple);  /* ← 色を変更 */
}

.countdown__value {
  color: var(--navy);  /* ← 数字の色を変更 */
}
```

### Instagramセクションの背景色

```css
.instagram-placeholder {
  background: linear-gradient(135deg, rgba(107, 63, 160, 0.05), rgba(212, 168, 75, 0.05));
  /* ← グラデーションを変更 */
}
```

### メディアロゴのホバー効果

```css
.mediaFeature:hover {
  transform: translateY(-4px);  /* ← 持ち上がる距離 */
  box-shadow: var(--shadow-md);
}

.mediaFeature img {
  filter: grayscale(100%) opacity(0.6);  /* ← 初期状態 */
}

.mediaFeature:hover img {
  filter: grayscale(0%) opacity(1);  /* ← ホバー時 */
}
```

---

## 📚 次のステップ

### Phase 2 の準備

改善計画書 (`WEB_IMPROVEMENT_PLAN.md`) を参照:

**優先度の高い次の施策**:
1. スクロールアニメーション
2. Google Analytics 4 イベント設定
3. 活動日記/ブログ機能
4. メンバー紹介強化

### Instagram投稿の自動表示（上級）

**Instagram Basic Display API を使う場合**:
1. Facebook Developersアカウント作成
2. アプリ作成
3. Instagram Basic Display 製品を追加
4. アクセストークン取得
5. `main.js` の `renderInstagramFeed()` 関数を実装

**参考リンク**:
- https://developers.facebook.com/docs/instagram-basic-display-api

---

## 💡 よくある質問

### Q1: カウントダウンタイマーの日付を変更するには？

**A**: `config.js` の `danceSummit.date` を編集:
```javascript
date: "2026-03-20"  // ← ここを変更
```

### Q2: メディア掲載を追加するには？

**A**:
1. `assets/media/` にロゴ画像を配置
2. `config.js` の `mediaFeatures` 配列に追加
3. ブラウザをリロード

### Q3: Instagramの実際の投稿を表示したい

**A**:
- **簡単**: Elfsight ウィジェット使用（無料プランあり）
- **上級**: Instagram Basic Display API を実装

### Q4: セクションを非表示にしたい

**A**: `config.js` で各機能の `enabled` を `false` に:
```javascript
countdown: { enabled: false }
instagram: { enabled: false }
mediaFeatures: []  // 空にする
```

### Q5: モバイルでの表示を調整したい

**A**: `style-components.css` のメディアクエリを編集:
```css
@media (max-width: 600px) {
  /* モバイル専用スタイル */
}
```

---

## 📞 サポート

問題が発生した場合:
1. ブラウザのコンソール（F12）でエラー確認
2. `WEB_IMPROVEMENT_PLAN.md` で関連情報確認
3. 上記トラブルシューティングセクション参照

---

**最終更新: 2026-01-04**
**実装バージョン: v1.0**
