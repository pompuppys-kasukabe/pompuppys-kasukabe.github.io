# Notion連携セットアップガイド

応援メッセージをNotionで管理するための設定手順です。

## 1. Notionデータベース

✅ **完了済み**

データベースURL: https://www.notion.so/fe21498e1b844cda93ccd6fd74ea3b3e
データソースID: `659a737c-3994-4bc5-9f52-143ea2a70b7e`

## 2. Notion Integrationの作成

1. https://www.notion.so/my-integrations にアクセス
2. 「New integration」をクリック
3. 以下の情報を入力：
   - **Name**: `POM PUPPYS Messages API`
   - **Associated workspace**: 自分のワークスペースを選択
   - **Type**: Internal
4. 「Submit」をクリック
5. 表示される **Internal Integration Token** をコピー（後で使用）

## 3. データベースにIntegrationを接続

1. Notionで応援メッセージデータベースを開く
2. 右上の「…」メニューをクリック
3. 「Connect to」→ 作成したIntegration (`POM PUPPYS Messages API`) を選択

## 4. Google Apps Scriptの更新

既存のGASスクリプトに以下を追加してください：

### 4-1. スクリプトエディタを開く

既存の写真API用のGASプロジェクトを開く

### 4-2. コードを追加

`Code.gs` に以下のコードを追加：

```javascript
// ===== Notion設定 =====
var NOTION_API_TOKEN = "YOUR_NOTION_INTEGRATION_TOKEN"; // 手順2でコピーしたトークン
var NOTION_DATABASE_ID = "659a737c39944bc59f52143ea2a70b7e";

// ===== メッセージ取得関数 =====
function getMessages() {
  try {
    var url = "https://api.notion.com/v1/databases/" + NOTION_DATABASE_ID + "/query";

    var payload = {
      "filter": {
        "property": "承認済み",
        "checkbox": {
          "equals": true
        }
      },
      "sorts": [
        {
          "property": "日付",
          "direction": "descending"
        }
      ]
    };

    var options = {
      "method": "post",
      "headers": {
        "Authorization": "Bearer " + NOTION_API_TOKEN,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText());

    if (!data.results) {
      Logger.log("Error: " + response.getContentText());
      return [];
    }

    var messages = data.results.map(function(page) {
      var props = page.properties;

      return {
        date: props["日付"] && props["日付"].date ? props["日付"].date.start : "",
        name: props["名前"] && props["名前"].rich_text[0] ? props["名前"].rich_text[0].plain_text : "匿名",
        message: props["メッセージ"] && props["メッセージ"].rich_text[0] ? props["メッセージ"].rich_text[0].plain_text : "",
        approved: props["承認済み"] ? props["承認済み"].checkbox : false
      };
    });

    return messages;

  } catch (e) {
    Logger.log("Error in getMessages: " + e.toString());
    return [];
  }
}
```

### 4-3. doGet関数を更新

既存の `doGet` 関数に `getMessages` アクションを追加：

```javascript
function doGet(e) {
  var action = e.parameter.action;

  if (action === "getPhotos") {
    // 既存の写真取得コード
    return getPhotosResponse();
  }
  else if (action === "getMessages") {
    // 新しいメッセージ取得
    var messages = getMessages();
    return ContentService
      .createTextOutput(JSON.stringify(messages))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({error: "Invalid action"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 4-4. デプロイ

1. 「デプロイ」→「デプロイを管理」
2. 既存のデプロイの右側の鉛筆アイコンをクリック
3. 「バージョン」を「新しいバージョン」に変更
4. 「デプロイ」をクリック

## 5. 動作確認

1. ブラウザで以下のURLにアクセス（GASのURLに `?action=getMessages` を追加）：
   ```
   https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getMessages
   ```

2. サンプルメッセージのJSONが表示されればOK：
   ```json
   [
     {
       "date": "2025-01-20",
       "name": "応援する人",
       "message": "世界大会頑張ってください！",
       "approved": true
     },
     ...
   ]
   ```

## 6. フロントエンドの更新

✅ **完了済み**

- `config.js`: Notion連携を有効化
- `main.js`: GAS APIからメッセージを取得するように更新

## メッセージの管理方法

### 新しいメッセージを追加

1. Notionデータベースで「New」をクリック
2. 各フィールドを入力：
   - **Name**: メッセージのタイトル（プレビュー用）
   - **日付**: 投稿日
   - **名前**: 送信者名
   - **メッセージ**: メッセージ本文
   - **承認済み**: チェックを入れると公開

### メッセージを非公開にする

- 「承認済み」のチェックを外す

### メッセージを削除

- ページを削除（または「…」→「Delete」）

## トラブルシューティング

### メッセージが表示されない場合

1. GAS APIのURLが正しいか確認
2. Notion Integrationがデータベースに接続されているか確認
3. ブラウザのコンソールでエラーを確認

### 「Error: 401」が表示される場合

- Notion APIトークンが正しく設定されているか確認
- Integrationがデータベースに接続されているか確認
