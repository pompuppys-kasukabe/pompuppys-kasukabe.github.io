# Instagram API セットアップガイド

**作成日**: 2026-01-04
**機能**: Instagram投稿を自動取得してWebサイトに表示

---

## 🎯 完成イメージ

```
Instagram
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最新の活動はInstagramで           [Instagramをフォロー]

┌─────────┐ ┌─────────┐ ┌─────────┐
│  投稿1   │ │  投稿2   │ │  投稿3   │
│  画像    │ │  画像    │ │  画像    │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐
│  投稿4   │ │  投稿5   │ │  投稿6   │
│  画像    │ │  画像    │ │  画像    │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘

※ ホバーでキャプション表示
※ クリックでInstagram投稿へ遷移
```

---

## 📋 前提条件

### 必要なもの
- ✅ Instagramアカウント（@pompuppysbright）
- ✅ Facebookアカウント
- ✅ Googleアカウント（Google Apps Script用）

### 注意事項
⚠️ **Instagramビジネスアカウントは不要**です
- Instagram Basic Display APIは個人アカウントでOK
- ただし、Meta Developerアカウントは必要

---

## 📋 Step 1: Meta Developer アカウント設定

### 1.1 Meta for Developers登録

1. https://developers.facebook.com/ にアクセス
2. 「Get Started」→ Facebookアカウントでログイン
3. 開発者登録を完了

### 1.2 アプリを作成

1. ダッシュボードで「Create App」をクリック
2. ユースケース選択: **「Consumer」** を選択
3. アプリタイプ: **「None」** を選択（または「Business」でもOK）
4. アプリ情報入力:
   - **App Name**: `POM PUPPYS Instagram Feed`
   - **App Contact Email**: チームの連絡先メール
5. 「Create App」をクリック

### 1.3 Instagram Basic Display を追加

1. アプリダッシュボードで「Add Product」
2. **「Instagram Basic Display」** を探して「Set Up」をクリック
3. 「Create New App」をクリック

### 1.4 基本設定

**Settings > Basic** で以下を設定：

| 項目 | 設定値 |
|------|--------|
| **Display Name** | POM PUPPYS Instagram Feed |
| **App Domain** | pompuppys-kasukabe.github.io |
| **Privacy Policy URL** | https://pompuppys-kasukabe.github.io/ |
| **Terms of Service URL** | https://pompuppys-kasukabe.github.io/ |

**Save Changes** をクリック

---

## 📋 Step 2: Instagram Basic Display 設定

### 2.1 アプリ設定

**Products > Instagram Basic Display > Basic Display** へ移動

#### Valid OAuth Redirect URIs

以下を追加：
```
https://developers.facebook.com/tools/debug/accesstoken/
https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback
```

**注意**: `YOUR_SCRIPT_ID` は後でGAS作成時に取得します。今は1つ目のURLだけ追加してOK。

#### Deauthorize Callback URL
```
https://pompuppys-kasukabe.github.io/
```

#### Data Deletion Request URL
```
https://pompuppys-kasukabe.github.io/
```

**Save Changes** をクリック

### 2.2 Instagram テスターを追加

1. **Instagram Testers** セクションへ
2. 「Add Instagram Testers」をクリック
3. Instagramユーザー名を検索: `pompuppysbright`
4. 追加

### 2.3 Instagram側で承認

1. Instagramアプリまたはブラウザでログイン
2. **設定 > アプリとウェブサイト > テスター招待** へ
3. `POM PUPPYS Instagram Feed` からの招待を **承認**

---

## 📋 Step 3: アクセストークン取得

### 3.1 App IDとApp Secretを確認

**Settings > Basic** で確認:
- **Instagram App ID**: `12345678901234`（例）
- **Instagram App Secret**: `abc123...`（「Show」をクリック）

### 3.2 認証URLを作成

以下のURLをブラウザで開く（値を置き換える）:

```
https://api.instagram.com/oauth/authorize
  ?client_id={instagram-app-id}
  &redirect_uri=https://developers.facebook.com/tools/debug/accesstoken/
  &scope=user_profile,user_media
  &response_type=code
```

**実際の例**:
```
https://api.instagram.com/oauth/authorize?client_id=12345678901234&redirect_uri=https://developers.facebook.com/tools/debug/accesstoken/&scope=user_profile,user_media&response_type=code
```

### 3.3 認証コードを取得

1. 上記URLにアクセス
2. Instagramアカウントでログイン
3. アプリの権限を **承認**
4. リダイレクト先URLのパラメータから `code` を取得:
   ```
   https://developers.facebook.com/tools/debug/accesstoken/?code=AQD...#_
                                                              ^^^^^^^^
                                                              このコード
   ```

### 3.4 短期アクセストークンを取得

以下のcURLコマンドを実行（値を置き換える）:

```bash
curl -X POST \
  https://api.instagram.com/oauth/access_token \
  -F client_id={instagram-app-id} \
  -F client_secret={instagram-app-secret} \
  -F grant_type=authorization_code \
  -F redirect_uri=https://developers.facebook.com/tools/debug/accesstoken/ \
  -F code={認証コード}
```

**レスポンス例**:
```json
{
  "access_token": "IGQWRPa...",
  "user_id": 1234567890
}
```

### 3.5 長期アクセストークンに交換

短期トークン（60分有効）を長期トークン（60日有効）に交換:

```bash
curl -X GET \
  "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={instagram-app-secret}&access_token={短期アクセストークン}"
```

**レスポンス例**:
```json
{
  "access_token": "IGQWRNa...",
  "token_type": "bearer",
  "expires_in": 5183944  // 約60日
}
```

**この長期アクセストークンを保存してください！**

---

## 📋 Step 4: Google Apps Script 設定

### 4.1 GASプロジェクト作成

1. https://script.google.com/ にアクセス
2. 「新しいプロジェクト」作成
3. プロジェクト名: `POM PUPPYS Instagram API`

### 4.2 コード実装

```javascript
// Google Apps Script - Instagram Feed API
function doGet(e) {
  const action = e.parameter.action;

  if (action === "getInstagramFeed") {
    return getInstagramFeed();
  }

  return ContentService.createTextOutput(JSON.stringify({error: "Invalid action"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getInstagramFeed() {
  const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('INSTAGRAM_ACCESS_TOKEN');

  if (!ACCESS_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Missing access token"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
  const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${ACCESS_TOKEN}&limit=12`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    // データ整形
    const posts = data.data.map(post => {
      return {
        id: post.id,
        caption: post.caption || "",
        mediaType: post.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
        mediaUrl: post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp
      };
    }).filter(post => post.mediaType === 'IMAGE' || post.mediaType === 'CAROUSEL_ALBUM'); // 画像のみ

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: posts.slice(0, 6), // 最新6件
      count: posts.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// トークンリフレッシュ関数（60日ごとに実行）
function refreshAccessToken() {
  const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('INSTAGRAM_ACCESS_TOKEN');

  if (!ACCESS_TOKEN) {
    Logger.log("No access token found");
    return;
  }

  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${ACCESS_TOKEN}`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    // 新しいトークンを保存
    PropertiesService.getScriptProperties().setProperty('INSTAGRAM_ACCESS_TOKEN', data.access_token);

    Logger.log("Token refreshed successfully. Expires in: " + data.expires_in + " seconds");

  } catch (error) {
    Logger.log("Error refreshing token: " + error.toString());
  }
}

// テスト用関数
function testAPI() {
  const result = getInstagramFeed();
  Logger.log(result.getContent());
}
```

### 4.3 スクリプトプロパティ設定

1. プロジェクト設定（歯車アイコン）→ 「スクリプトプロパティ」
2. プロパティを追加:
   - **Property**: `INSTAGRAM_ACCESS_TOKEN`
     **Value**: [Step 3.5で取得した長期アクセストークン]

### 4.4 デプロイ

1. 「デプロイ」→「新しいデプロイ」
2. タイプ: **ウェブアプリ**
3. 設定:
   - **説明**: Instagram Feed API v1
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **Web app URL** をコピー（例: `https://script.google.com/macros/s/xxxxx/exec`）

### 4.5 動作確認

ブラウザでアクセスして確認:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getInstagramFeed
```

期待されるレスポンス:
```json
{
  "success": true,
  "data": [
    {
      "id": "123456789",
      "caption": "JAMfest JAPAN vol.23 で優勝しました！🏆",
      "mediaType": "IMAGE",
      "mediaUrl": "https://scontent.cdninstagram.com/...",
      "permalink": "https://www.instagram.com/p/...",
      "timestamp": "2025-11-23T15:30:00+0000"
    }
  ],
  "count": 6
}
```

---

## 📋 Step 5: トークン自動リフレッシュ設定

### 5.1 トリガー設定

Instagramアクセストークンは60日で期限切れになるため、自動リフレッシュが必要：

1. GASエディタで「トリガー」（時計アイコン）をクリック
2. 「トリガーを追加」
3. 設定:
   - **実行する関数**: `refreshAccessToken`
   - **イベントのソース**: 時間主導型
   - **時間ベースのトリガータイプ**: 日付ベースのタイマー
   - **時刻**: 午前0時～1時（任意）
   - **間隔**: 30日ごと
4. 「保存」

---

## 🔒 セキュリティ

### 注意事項

- ❌ アクセストークンをGitHubにコミットしない
- ❌ クライアントサイドJSに直接トークンを記載しない
- ✅ GASのスクリプトプロパティで管理
- ✅ 30日ごとの自動リフレッシュ設定

---

## 🔧 トラブルシューティング

### エラー: Invalid OAuth access token

**原因**: アクセストークンが期限切れ

**解決策**:
1. GASで `refreshAccessToken()` を実行
2. それでもダメなら Step 3 からやり直し

### エラー: Application does not have permission

**原因**: Instagram Tester承認が完了していない

**解決策**:
1. Instagramアプリで「アプリとウェブサイト」を確認
2. テスター招待を承認

### 投稿が0件

**原因**: フィルタ条件（画像のみ）に該当する投稿がない

**解決策**:
1. GASコードの `.filter()` を一時的に外す
2. `testAPI()` でレスポンスを確認

---

## 💡 運用のベストプラクティス

### 1. 定期的なトークン確認

月に1回、GASのログを確認:
```
実行履歴 > refreshAccessToken > ログを表示
```

### 2. キャッシュ活用（オプション）

頻繁なAPI呼び出しを避けるため、GASでキャッシュ実装も可能:
```javascript
const cache = CacheService.getScriptCache();
const cached = cache.get('instagram_feed');
```

### 3. エラー通知設定

GASでエラー発生時にメール通知:
```javascript
catch (error) {
  MailApp.sendEmail({
    to: "your-email@example.com",
    subject: "Instagram API Error",
    body: error.toString()
  });
}
```

---

**最終更新: 2026-01-04**
