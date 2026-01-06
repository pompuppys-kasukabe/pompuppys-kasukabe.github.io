# プロジェクト構造ドキュメント

> このファイルは、セッション開始時に効率よく作業するためのプロジェクト構造の全体像を提供します。
> どのファイルを変更すればよいか迅速に判断できるよう設計されています。

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [コアファイル詳細](#コアファイル詳細)
4. [よくある変更パターン](#よくある変更パターン)
5. [クイックリファレンス](#クイックリファレンス)

---

## プロジェクト概要

**プロジェクト名**: POM PUPPYS bright 公式サイト
**種類**: GitHub Pages 静的サイト
**URL**: https://pompuppys-kasukabe.github.io/
**技術スタック**: HTML, CSS, JavaScript (Vanilla), Google Apps Script API

### 主要機能
- チーム紹介・メンバー表示
- ニュース・活動報告
- 写真ギャラリー（Google Drive連携）
- FAQ（アコーディオン形式）
- Road to the World（世界大会プロジェクト）
- スポンサー・協賛情報
- メディアキット
- Instagram連携（予定）

---

## ディレクトリ構造

```
pompuppys-kasukabe.github.io/
├── index.html              # メインページ
├── media.html              # メディアキット用ページ
├── sponsor.html            # スポンサー募集ページ
├── project-world-challenge.html  # 世界大会プロジェクトページ
│
├── config.js               # サイト設定（最重要）
├── main.js                 # メイン機能（メンバー、写真、News等）
├── utils.js                # ユーティリティ関数
├── project.js              # プロジェクトページ専用JS
├── sponsor.js              # スポンサーページ専用JS
│
├── style.css               # レガシーCSS（使用非推奨）
├── style-core.css          # CSS変数・基本スタイル
├── style-layout.css        # レイアウト・グリッド
├── style-components.css    # コンポーネント（ボタン、カード等）
├── style-pages.css         # ページ固有スタイル
├── style-utils.css         # ユーティリティクラス
│
├── assets/
│   ├── photos/            # 画像ファイル
│   ├── video/             # 動画ファイル
│   ├── logo_*.png         # ロゴファイル
│   ├── ogp.jpg            # OGP画像
│   ├── messages.json      # 応援メッセージデータ
│   └── *.pdf              # メディアキット資料
│
├── scripts/
│   ├── update-instagram.py      # Instagram更新スクリプト
│   └── test-instagram-update.sh # Instagram更新テスト
│
└── *.md                   # ドキュメント（セットアップ、ガイド等）
```

---

## コアファイル詳細

### 1. **index.html** (530行)
メインページのHTML構造。

#### 主要セクション（行番号）
- **7-27**: メタタグ・SEO設定
- **32-125**: 構造化データ（JSON-LD）
  - SportsTeam schema
  - Event schema (The Dance Summit 2026)
  - FAQPage schema
- **147-173**: ヘッダー・ナビゲーション
- **179-199**: Hero（トップビジュアル）
- **201-219**: Story
- **221-234**: News
- **236-249**: Team
- **251-316**: 活動カレンダー（非表示）
- **318-331**: Photos
- **333-352**: Instagram（非表示）
- **354-367**: メディア掲載（非表示）
- **369-429**: Road to the World
- **431-482**: FAQ（アコーディオン）
- **484-481**: Contact
- **483-496**: Sponsors
- **498-513**: Footer

#### 変更時の注意点
- メタディスクリプション更新時は3箇所（8, 17, 26行目）
- 構造化データとFAQセクションの内容を同期
- ファイル名は大文字小文字を区別（モバイル対応）

---

### 2. **config.js** (300+行)
サイト全体の設定を管理する最重要ファイル。

#### 主要セクション
```javascript
window.PUPPYS_CONFIG = {
  // ===== API設定 =====
  apiUrls: {
    photos: "GASエンドポイント",
    members: "GASエンドポイント"
  },

  // ===== 連絡先 =====
  contact: {
    email: "pompuppys.kasukabe@gmail.com",
    instagram: "pompuppysbright"
  },

  // ===== ストーリー =====
  story: {
    title: "...",
    paragraphs: ["...", "..."]
  },

  // ===== タイムライン =====
  timeline: [
    { date: "2024.11", event: "..." },
    ...
  ],

  // ===== ニュース =====
  news: [
    { date: "2025-01-XX", title: "...", body: "..." },
    ...
  ],

  // ===== サイト画像 =====
  siteImages: {
    heroImage: "./assets/photos/team_main.JPG",  // 大文字小文字注意！
    heroVideo: {
      enabled: true,
      mp4: "./assets/video/official_hero.mp4",
      poster: "./assets/photos/team_main.JPG"
    }
  },

  // ===== Road to the Worldプロジェクト =====
  roadProject: {
    enabled: true,
    eventName: "The Dance Summit 2026",
    eventDate: "2026-05-01",
    goal: 3000000,
    raised: 500000
  },

  // ===== スポンサー =====
  sponsors: [
    { name: "...", logo: "...", url: "..." },
    ...
  ]
}
```

#### 変更パターン
- **ニュース追加**: `news` 配列の先頭に追加
- **タイムライン更新**: `timeline` 配列に追加
- **画像変更**: `siteImages` のパスを更新（大文字小文字注意）
- **スポンサー追加**: `sponsors` 配列に追加

---

### 3. **main.js** (1410行)
サイトのメイン機能を提供。

#### 主要関数（行番号）
- **20-72**: `fetchPhotos()` - Google Drive写真取得
- **85-212**: `renderHeroMedia()` - Hero画像/動画レンダリング
- **218-280**: `renderMembers()` - メンバー表示
- **282-370**: `renderPhotos()` - 写真ギャラリー
- **520-620**: `renderNews()` - ニュース表示
- **780-850**: `renderRoadProgress()` - プロジェクト進捗表示
- **950-1050**: `renderSponsors()` - スポンサー表示
- **1339-1372**: `initFAQ()` - FAQ アコーディオン機能
- **1374-1398**: `initSite()` - サイト初期化

#### 機能追加時
新機能を追加する際は：
1. 関数を定義（適切なセクションに）
2. `initSite()` 内で呼び出し

---

### 4. **style-components.css** (1772行)
コンポーネント単位のスタイル定義。

#### 主要コンポーネント（行番号）
- **1-70**: ボタン (.btn-primary, .btn-secondary等)
- **134-259**: Hero (.hero, .heroCard, .heroPhoto等)
- **261-340**: カード (.card)
- **520-680**: ニュース (.newsGrid, .newsCard等)
- **780-920**: メンバー (.membersGrid, .memberCard等)
- **1100-1250**: Road to the World (.roadSection等)
- **1668-1772**: FAQ (.faqList, .faqItem等)

#### 新コンポーネント追加時
ファイル末尾に追加し、モバイル対応（@media）も含める。

---

### 5. **style-core.css**
CSS変数・リセット・基本スタイル。

#### CSS変数
```css
:root {
  --purple: #6b3fa0;
  --navy: #1a1a2e;
  --gold: #d4af37;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: ...;
  --shadow-md: ...;
}
```

---

## よくある変更パターン

### 1. ニュースを追加する
**変更ファイル**: `config.js`

```javascript
news: [
  {
    date: "2025-01-XX",
    title: "新しいニュース",
    body: "本文...",
    link: "リンクURL（オプション）"
  },
  // 既存のニュース...
]
```

### 2. FAQを追加する
**変更ファイル**: `index.html` (2箇所)

#### A. 構造化データ（SEO用）
```html
<!-- 89-121行目あたり -->
{
  "@type": "Question",
  "name": "質問文",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "回答文"
  }
}
```

#### B. 表示用HTML
```html
<!-- 441-480行目あたり -->
<div class="faqItem">
  <button class="faqItem__question" type="button" aria-expanded="false">
    <span>質問文</span>
    <span class="faqItem__icon">+</span>
  </button>
  <div class="faqItem__answer">
    <p>回答文</p>
  </div>
</div>
```

### 3. スポンサーを追加する
**変更ファイル**: `config.js`

```javascript
sponsors: [
  {
    name: "企業名",
    logo: "./assets/logos/company.png",
    url: "https://example.com",
    tier: "gold" // gold/silver/bronze
  },
  // 既存のスポンサー...
]
```

### 4. Hero画像を変更する
**変更ファイル**: `config.js`

```javascript
siteImages: {
  heroImage: "./assets/photos/new_image.jpg",
  heroImageAlt: "画像の説明",
  heroVideo: {
    enabled: true/false,
    mp4: "./assets/video/hero.mp4",
    poster: "./assets/photos/poster.jpg"
  }
}
```

**注意**: ファイル名の大文字小文字を正確に（モバイル対応）

### 5. 新しいセクションを追加する
**変更ファイル**: `index.html`, `style-components.css`, `main.js`

1. **HTML**: セクション構造を追加
2. **CSS**: スタイルを `style-components.css` に追加
3. **JS**: 動的コンテンツがある場合、`main.js` に関数追加

### 6. メタタグ（SEO）を更新する
**変更ファイル**: `index.html`

更新箇所（3箇所すべて）:
- 8行目: `<meta name="description">`
- 17行目: `<meta property="og:description">`
- 26行目: `<meta name="twitter:description">`

### 7. ナビゲーションメニューを追加する
**変更ファイル**: `index.html`

```html
<!-- 156-164行目あたり -->
<li><a href="#新セクションID">新メニュー</a></li>
```

---

## クイックリファレンス

### 📝 テキスト変更
| 内容 | ファイル | 行番号 |
|------|---------|--------|
| サイトタイトル | index.html | 7 |
| メタディスクリプション | index.html | 8, 17, 26 |
| ストーリー本文 | config.js | story.paragraphs |
| タイムライン | config.js | timeline |
| ニュース | config.js | news |
| FAQ | index.html | 89-121, 441-480 |

### 🎨 スタイル変更
| 内容 | ファイル | セクション |
|------|---------|-----------|
| 色・変数 | style-core.css | :root |
| ボタン | style-components.css | 1-70 |
| カード | style-components.css | 261-340 |
| レイアウト | style-layout.css | 全体 |

### 🔧 機能変更
| 内容 | ファイル | 関数名 |
|------|---------|--------|
| 写真表示 | main.js | renderPhotos() |
| メンバー表示 | main.js | renderMembers() |
| ニュース表示 | main.js | renderNews() |
| FAQ機能 | main.js | initFAQ() |

### 🖼️ 画像・動画
| 内容 | ファイル | 設定項目 |
|------|---------|----------|
| Hero画像 | config.js | siteImages.heroImage |
| Hero動画 | config.js | siteImages.heroVideo |
| ロゴ | assets/ | logo_*.png |
| OGP画像 | assets/ | ogp.jpg |

### 🔗 API連携
| 内容 | ファイル | 設定項目 |
|------|---------|----------|
| 写真API | config.js | apiUrls.photos |
| メンバーAPI | config.js | apiUrls.members |

---

## セッション開始時のチェックリスト

新しいセッションを始める際：

1. ✅ このファイル（PROJECT_STRUCTURE.md）を確認
2. ✅ ユーザーの要求を確認
3. ✅ [よくある変更パターン](#よくある変更パターン) から該当を探す
4. ✅ 必要なファイルのみを Read で確認
5. ✅ 変更を実施
6. ✅ 関連ファイルの整合性を確認
7. ✅ コミット・プッシュ

---

## トラブルシューティング

### モバイルで画像が表示されない
- **原因**: ファイル名の大文字小文字不一致
- **確認**: `config.js` のパスと実ファイル名を比較
- **解決**: 正確なファイル名に修正

### FAQ が動作しない
- **確認**: `main.js` の `initFAQ()` が `initSite()` で呼ばれているか
- **確認**: HTML の class名が正しいか（faqItem, faqItem__question等）
- **確認**: CSS が読み込まれているか

### スタイルが反映されない
- **確認**: CSS ファイルの読み込み順序
- **確認**: キャッシュをクリア
- **確認**: CSS セレクタの優先順位

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-06 | 初版作成。FAQセクション追加、Hero画像修正を反映 |

---

**最終更新**: 2026-01-06
**管理者**: POM PUPPYS bright 開発チーム
