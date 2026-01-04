# Notion + GAS で Instagram投稿管理

**所要時間**: 初回セットアップ10分、以降は投稿追加30秒

---

## 🎯 完成イメージ

### Notionデータベース（入力）

| 投稿名 | URL | キャプション | 表示順 |
|--------|-----|--------------|--------|
| JAMfest優勝 | https://instagram.com/p/ABC123/ | 優勝しました！ | 1 |
| 練習風景 | https://instagram.com/p/DEF456/ | 新しい振付練習中 | 2 |
| ... | ... | ... | ... |

↓ GASが自動処理

### Webサイト（出力）

最新6件のInstagram投稿が自動表示！

---

## 📋 セットアップ手順

### ステップ1: Notionデータベース作成

#### 1-1. 新しいページを作成

1. Notionを開く
2. 「+ New Page」をクリック
3. ページ名: **「Instagram投稿管理」**

#### 1-2. データベースを追加

1. ページ内で `/database` と入力
2. 「Table - Inline」を選択

#### 1-3. プロパティを設定

以下のプロパティを作成：

| プロパティ名 | タイプ | 設定 |
|------------|--------|------|
| **Name** (デフォルト) | Title | そのまま使用 |
| **Instagram URL** | URL | 新規追加 |
| **キャプション** | Text | 新規追加 |
| **表示順** | Number | 新規追加 |

**プロパティの追加方法:**
1. テーブルの右端の「+」をクリック
2. プロパティ名を入力
3. タイプを選択

#### 1-4. サンプルデータを入力

| Name | Instagram URL | キャプション | 表示順 |
|------|---------------|--------------|--------|
| JAMfest優勝 | https://www.instagram.com/p/ABC123/ | JAMfest JAPAN vol.23 で優勝！ | 1 |
| 練習風景 | https://www.instagram.com/p/DEF456/ | 新しい振付を練習中 | 2 |

---

### ステップ2: Notion Integration作成

#### 2-1. Integration作成

1. https://www.notion.so/my-integrations にアクセス
2. **「+ New integration」**をクリック
3. 設定:
   - **Name**: `POM PUPPYS Instagram`
   - **Associated workspace**: 自分のワークスペース
   - **Type**: Internal
4. **「Submit」**をクリック

#### 2-2. Internal Integration Tokenをコピー

表示される **「Internal Integration Token」** をコピー:
```
secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ このトークンは誰にも教えないでください！**

#### 2-3. データベースにIntegrationを接続

1. 作成したNotionデータベースのページを開く
2. 右上の「…」メニュー → **「Add connections」**
3. 作成したIntegration（`POM PUPPYS Instagram`）を選択

---

### ステップ3: Database IDを取得

#### 3-1. データベースURLをコピー

ブラウザのアドレスバーからURLをコピー:
```
https://www.notion.so/username/1234567890abcdef1234567890abcdef?v=...
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              これがDatabase ID
```

#### 3-2. Database IDを抽出

URLの `?v=` より前の部分（32文字）がDatabase IDです:
```
1234567890abcdef1234567890abcdef
```

ハイフンなしの32文字の英数字です。

---

### ステップ4: GASにNotion設定を追加

#### 4-1. GASエディタを開く

1. https://script.google.com/ にアクセス
2. プロジェクト「POM PUPPYS Instagram API」を開く

#### 4-2. スクリプトプロパティに追加

1. プロジェクト設定（歯車アイコン）
2. 「スクリプトプロパティ」タブ
3. 以下の2つを追加:

| Property | Value |
|----------|-------|
| `NOTION_API_KEY` | `secret_XXXX...`（Step 2-2でコピーしたトークン） |
| `NOTION_INSTAGRAM_DB_ID` | `1234567890abcdef...`（Step 3-2で取得したID） |

#### 4-3. GASコードを更新

gas.txt の内容を最新版に更新（次のステップで提供）

#### 4-4. デプロイを更新

1. 「デプロイ」→「デプロイを管理」
2. 現在のデプロイの「✏️」をクリック
3. 「バージョン」を「新バージョン」に変更
4. 「デプロイ」をクリック

---

### ステップ5: 動作確認

#### 5-1. GAS APIをテスト

ブラウザで以下のURLにアクセス:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getInstagramFeedFromNotion
```

期待されるレスポンス:
```json
{
  "success": true,
  "data": [
    {
      "id": "post1",
      "url": "https://www.instagram.com/p/ABC123/",
      "image": "https://www.instagram.com/p/ABC123/media/?size=l",
      "caption": "JAMfest JAPAN vol.23 で優勝！"
    }
  ],
  "count": 2
}
```

#### 5-2. Webサイトで確認

1. https://pompuppys-kasukabe.github.io/ にアクセス
2. Instagramセクションまでスクロール
3. Notionに登録した投稿が表示される

---

## 💡 日常の運用方法

### 新しい投稿を追加（30秒）

#### 方法A: PCで追加

1. Notionデータベースを開く
2. 「+ New」をクリック
3. 情報を入力:
   - **Name**: 投稿の簡単な説明（例: 大会結果）
   - **Instagram URL**: 投稿URLをペースト
   - **キャプション**: 表示するテキスト（任意）
   - **表示順**: 1（最新）
4. 既存の投稿の表示順を +1 する（2, 3, 4...）

#### 方法B: スマホで追加（Notionアプリ）

1. Notionアプリを開く
2. 「Instagram投稿管理」ページ
3. 右下の「+」ボタン
4. 同じように入力

#### 画像URLは自動生成される

GASが自動的に `/media/?size=l` を追加するので、入力不要！

---

## 🎨 Notionデータベースのカスタマイズ

### おすすめビュー設定

#### ビュー1: 表示中（デフォルト）

**フィルタ:**
- 表示順 ≤ 6

**ソート:**
- 表示順（昇順）

#### ビュー2: 全て

**フィルタ:** なし

**ソート:**
- 表示順（昇順）

### 追加プロパティ（オプション）

| プロパティ名 | タイプ | 用途 |
|------------|--------|------|
| **投稿日** | Date | いつの投稿か記録 |
| **カテゴリ** | Select | 大会/練習/イベント等 |
| **いいね数** | Number | エンゲージメント記録 |
| **メモ** | Text | 内部メモ |

---

## 🔄 更新頻度

### 自動更新

Webサイトは30分キャッシュなので、Notionを更新してから：
- 最大30分で反映
- すぐ反映したい場合はブラウザのハードリロード（Ctrl+Shift+R）

### Notion → Webサイト

```
Notionで追加
  ↓ 即座
GASで読み込み可能
  ↓ 最大30分（キャッシュ）
Webサイトに表示
```

---

## ⚠️ トラブルシューティング

### エラー: Missing NOTION_API_KEY

**原因:** スクリプトプロパティが設定されていない

**対処:**
1. GASプロジェクト設定
2. スクリプトプロパティを確認
3. `NOTION_API_KEY` と `NOTION_INSTAGRAM_DB_ID` が正しく設定されているか確認

### エラー: Notion API error: object not found

**原因:** Database IDが間違っている、またはIntegrationが接続されていない

**対処:**
1. Database IDを再確認
2. Notionデータベースで「Add connections」から Integrationを接続

### 投稿が表示されない

**原因1:** 表示順が7以上になっている

**対処:** 表示順を1-6に設定

**原因2:** Instagram URLの形式が間違っている

**対処:** `https://www.instagram.com/p/XXXXXX/` の形式で入力

---

## 📊 データ構造

### Notionデータベース

```
Instagram投稿管理
├─ Name (Title): 投稿の説明
├─ Instagram URL (URL): Instagram投稿URL
├─ キャプション (Text): Webサイトに表示するテキスト
└─ 表示順 (Number): 1-6（1が最新）
```

### GAS出力（JSON）

```json
{
  "success": true,
  "data": [
    {
      "id": "post1",
      "url": "https://www.instagram.com/p/ABC123/",
      "image": "https://www.instagram.com/p/ABC123/media/?size=l",
      "caption": "キャプション"
    }
  ],
  "count": 6
}
```

---

## 🎯 まとめ

### セットアップ（初回のみ）

- ⏱️ 所要時間: 10分
- 📝 手順: Notion DB作成 → Integration作成 → GAS設定

### 日常運用

- ⏱️ 所要時間: 30秒/投稿
- 📝 手順: NotionにURL追加するだけ
- 📱 スマホからも可能

### メリット

- ✅ URLコピペだけ（画像URLは自動生成）
- ✅ スマホから更新可能
- ✅ 見やすいUI
- ✅ 完全無料
- ✅ Git操作不要

---

**最終更新: 2026-01-04**
