# セッション開始ガイド

> 新しいセッションを開始する際の効率的な作業フローガイド。
> トークンリミット削減のため、必要最小限のファイルのみを読み込みます。

---

## 🚀 クイックスタート（3ステップ）

### Step 1: 要求の分類
ユーザーの要求を以下に分類：

```
A. コンテンツ更新（テキスト・画像）
B. 機能追加・修正
C. デザイン・スタイル変更
D. バグ修正
E. その他
```

### Step 2: 必要ファイルの特定
分類に応じて読み込むファイルを決定（下記の決定木を参照）

### Step 3: 実装・テスト・コミット

---

## 📊 決定木：変更内容→必要ファイル

### A. コンテンツ更新

#### A-1. ニュース追加
```
READ: config.js (news セクション)
EDIT: config.js
```

#### A-2. FAQ追加・編集
```
READ: index.html (行89-121, 441-480)
EDIT: index.html (2箇所を同期)
```

#### A-3. スポンサー追加
```
READ: config.js (sponsors セクション)
EDIT: config.js
```

#### A-4. タイムライン更新
```
READ: config.js (timeline セクション)
EDIT: config.js
```

#### A-5. Hero画像/動画変更
```
READ: config.js (siteImages セクション)
EDIT: config.js
CHECK: ファイル名の大文字小文字
```

#### A-6. メタタグ・SEO更新
```
READ: index.html (行7-27)
EDIT: index.html (3箇所: description, og:description, twitter:description)
```

---

### B. 機能追加・修正

#### B-1. 新セクション追加（HTML+CSS+JS）
```
READ: index.html (該当箇所)
READ: style-components.css (末尾)
READ: main.js (initSite関数)
EDIT: index.html (セクション追加)
EDIT: style-components.css (スタイル追加)
EDIT: main.js (必要に応じて機能追加)
```

#### B-2. アコーディオン・インタラクション追加
```
READ: style-components.css (FAQ等の既存例)
READ: main.js (既存のinit関数)
EDIT: index.html
EDIT: style-components.css
EDIT: main.js (イベントリスナー追加)
```

#### B-3. API連携追加
```
READ: config.js (apiUrls)
READ: main.js (fetchPhotos等の既存例)
EDIT: config.js (APIエンドポイント追加)
EDIT: main.js (fetch関数追加)
```

---

### C. デザイン・スタイル変更

#### C-1. 色・変数変更
```
READ: style-core.css (:root セクション)
EDIT: style-core.css
```

#### C-2. ボタンスタイル変更
```
READ: style-components.css (行1-70)
EDIT: style-components.css
```

#### C-3. レイアウト変更
```
READ: style-layout.css
EDIT: style-layout.css
```

#### C-4. 特定コンポーネントのスタイル変更
```
READ: style-components.css (該当コンポーネント)
EDIT: style-components.css
```

---

### D. バグ修正

#### D-1. モバイルで画像が見えない
```
CAUSE: ファイル名の大文字小文字不一致
READ: config.js (siteImages)
CHECK: assets/photos/ のファイル名
EDIT: config.js (正確なファイル名に修正)
```

#### D-2. JavaScriptエラー
```
READ: main.js (該当関数)
READ: ブラウザコンソール
EDIT: main.js
```

#### D-3. スタイルが反映されない
```
CHECK: CSSファイルの読み込み順序（index.html）
CHECK: セレクタの優先順位
READ: 該当CSSファイル
EDIT: CSSファイル
```

---

## 📝 実例：よくあるタスク

### 例1: 「ニュースを1件追加して」

```bash
# 必要ファイル: config.js のみ
READ: config.js (newsセクションの最初の数件を確認)

# 編集
EDIT: config.js
  news: [
    { date: "2025-01-10", title: "新着", body: "..." },  # 追加
    # 既存のニュース...
  ]

# コミット
git add config.js
git commit -m "ニュース追加: 新着情報"
git push
```

**読み込みトークン**: 約500トークン（config.jsの一部のみ）

---

### 例2: 「FAQに質問を2つ追加して」

```bash
# 必要ファイル: index.html (特定行のみ)
READ: index.html (行89-121: 構造化データ)
READ: index.html (行441-480: 表示用HTML)

# 編集（2箇所）
EDIT: index.html
  # 1. 構造化データに追加
  # 2. 表示用HTMLに追加

# コミット
git add index.html
git commit -m "FAQ追加: 2件の質問を追加"
git push
```

**読み込みトークン**: 約800トークン（index.htmlの2箇所のみ）

---

### 例3: 「Hero画像を変更して」

```bash
# 必要ファイル: config.js
READ: config.js (siteImagesセクション)

# ファイル確認
ls -la assets/photos/new_image.*

# 編集（大文字小文字注意）
EDIT: config.js
  siteImages: {
    heroImage: "./assets/photos/new_image.JPG",  # 正確なファイル名
    heroImageAlt: "新しい画像の説明"
  }

# コミット
git add config.js
git commit -m "Hero画像を更新"
git push
```

**読み込みトークン**: 約400トークン（config.jsの一部のみ）

---

### 例4: 「新しいセクション『お問い合わせフォーム』を追加して」

```bash
# 必要ファイル: 3つ
READ: index.html (Contactセクション周辺を参考)
READ: style-components.css (カード・フォーム関連を参考)
READ: main.js (initSite関数)

# 編集
EDIT: index.html (新セクション追加)
EDIT: style-components.css (フォームスタイル追加)
EDIT: main.js (フォーム送信処理追加、必要に応じて)

# コミット
git add index.html style-components.css main.js
git commit -m "お問い合わせフォームセクションを追加"
git push
```

**読み込みトークン**: 約3000トークン（3ファイルの関連部分）

---

## 🎯 トークン削減のベストプラクティス

### 1. **Read は必要な範囲のみ**
```bash
# ❌ 悪い例: ファイル全体を読む
READ: index.html (全530行)

# ✅ 良い例: 必要な行のみ読む
READ: index.html (offset=89, limit=35)  # FAQの構造化データのみ
```

### 2. **Grep で場所を特定してから Read**
```bash
# まず場所を特定
GREP: "heroImage" in config.js
# → 147行目と判明

# その周辺のみ読む
READ: config.js (offset=145, limit=10)
```

### 3. **参照用には PROJECT_STRUCTURE.md を活用**
```bash
# ファイルを読む前に
READ: PROJECT_STRUCTURE.md (該当セクション)
# → 必要なファイルと行番号が判明

# 必要最小限のみ読む
READ: config.js (指定範囲)
```

### 4. **類似の既存実装を参考にする**
```bash
# 新しいカードコンポーネントを追加する場合
READ: style-components.css (既存の.newsCardを参考に、行520-680のみ)
# → 同じパターンで実装可能
```

---

## ⚡ 超効率セッションフロー

### フロー図
```
開始
  ↓
PROJECT_STRUCTURE.md の該当セクションを確認 (100トークン)
  ↓
決定木で必要ファイルを特定 (0トークン)
  ↓
Grep で正確な行番号を特定 (100トークン)
  ↓
Read で必要な範囲のみ読む (500-1000トークン)
  ↓
Edit で変更 (300トークン)
  ↓
コミット・プッシュ (200トークン)
  ↓
完了（合計: 1200-1700トークン）
```

### 従来のフロー（非効率）
```
開始
  ↓
複数ファイル全体を Read (5000-10000トークン)
  ↓
コードを探索 (2000トークン)
  ↓
Edit で変更 (300トークン)
  ↓
コミット (200トークン)
  ↓
完了（合計: 7500-12500トークン）
```

**削減率: 約85%のトークン削減！**

---

## 📋 セッションチェックリスト

### 開始時
- [ ] ユーザーの要求を明確に理解
- [ ] PROJECT_STRUCTURE.md で該当パターンを確認
- [ ] 必要なファイルと行番号を特定
- [ ] 最小限の Read で情報収集

### 実装中
- [ ] 変更は1ファイルずつ、段階的に
- [ ] 関連ファイルの整合性を確認
- [ ] 大文字小文字、ファイル名を正確に

### 完了時
- [ ] git diff で変更を確認
- [ ] コミットメッセージは日本語で明確に
- [ ] プッシュして動作確認を依頼

---

## 🔍 トラブルシューティング早見表

| 症状 | 原因 | 確認ファイル | 解決方法 |
|------|------|-------------|----------|
| モバイルで画像表示されない | ファイル名大文字小文字 | config.js | 正確なファイル名に修正 |
| FAQ が動かない | JS未初期化 | main.js | initSite()でinitFAQ()呼び出し確認 |
| スタイル反映されない | CSS優先順位 | style-*.css | セレクタを具体的に |
| ニュースが表示されない | config.js の書式エラー | config.js | JSON構文チェック |
| 動画が再生されない | enabled=false | config.js | heroVideo.enabled: true |

---

## 📚 関連ドキュメント

- **PROJECT_STRUCTURE.md**: プロジェクト全体構造の詳細
- **IMPLEMENTATION_GUIDE.md**: 実装ガイド
- **WEB_IMPROVEMENT_PLAN.md**: 改善計画

---

**最終更新**: 2026-01-06
**目的**: セッション効率化・トークン削減
