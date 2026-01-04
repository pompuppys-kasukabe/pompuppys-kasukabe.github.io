# Google Apps Script - スクリプトプロパティ設定

**作成日**: 2026-01-04
**プロジェクト**: POM PUPPYS Website API

---

## 📋 設定手順

1. Google Apps Script エディタを開く
2. 「プロジェクト設定」（歯車アイコン）をクリック
3. 「スクリプトプロパティ」セクションへスクロール
4. 「スクリプト プロパティを追加」をクリック
5. 以下の5つのプロパティを追加

---

## 🔑 必須プロパティ一覧

### 1. NOTION_TOKEN
**説明**: Notion Integration の Internal Integration Token

**取得方法**:
1. https://www.notion.so/my-integrations にアクセス
2. 既存のIntegration（例: `POM PUPPYS Website`）を選択
3. 「Secrets」セクションで「Internal Integration Token」をコピー

**形式**: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 2. PHOTOS_DB_ID
**説明**: 写真管理用 Notion データベース ID

**取得方法**:
- NotionデータベースのURLから抽出
- URL形式: `https://www.notion.so/workspace/{database_id}?v=...`

**形式**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`（ハイフンあり）

**例**: `1a2b3c4d-5e6f-7890-abcd-ef1234567890`

---

### 3. MESSAGES_DB_ID
**説明**: 応援メッセージ用 Notion データベース ID

**取得方法**: PHOTOS_DB_ID と同様

**形式**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

### 4. ACTIVITY_DB_ID
**説明**: 活動カレンダー用 Notion データベース ID

**取得方法**: PHOTOS_DB_ID と同様

**現在の値**: `2dee35f6-ded1-80e5-b741-e0f5e4f08e51`

---

### 5. DRIVE_FOLDER_ID
**説明**: Google Drive の写真保存フォルダ ID

**取得方法**:
1. Google Drive でフォルダを開く
2. URLから ID を抽出
3. URL形式: `https://drive.google.com/drive/folders/{folder_id}`

**形式**: アルファベットと数字の羅列（ハイフンなし）

**例**: `1a2b3c4d5e6f7890ABCDEFGHIJKLMNO`

---

## 📝 設定例

```
Property: NOTION_TOKEN
Value: secret_abcdefghijklmnopqrstuvwxyz1234567890ABCD

Property: PHOTOS_DB_ID
Value: 1a2b3c4d-5e6f-7890-abcd-ef1234567890

Property: MESSAGES_DB_ID
Value: 2b3c4d5e-6f78-90ab-cdef-1234567890ab

Property: ACTIVITY_DB_ID
Value: 2dee35f6-ded1-80e5-b741-e0f5e4f08e51

Property: DRIVE_FOLDER_ID
Value: 3c4d5e6f7890abcdefghijklmno1234567890
```

---

## ✅ 設定確認

### テスト関数を実行

1. GASエディタで以下のテスト関数を実行：

```javascript
testGetPhotos()      // 写真データ取得テスト
testGetMessages()    // メッセージ取得テスト
testGetActivityData() // 活動カレンダー取得テスト
```

2. 実行ログ（「実行数」→「ログを表示」）でJSONレスポンスを確認

### 期待される結果

**testGetActivityData() の成功例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "定例練習",
      "date": "2026-01-04",
      "type": "練習",
      "typeColor": "purple",
      "startTime": "18:00",
      "endTime": "20:00",
      "location": "春日部体育館",
      "notes": ""
    }
  ],
  "count": 1
}
```

### よくあるエラー

#### エラー: "Missing configuration"
**原因**: スクリプトプロパティが設定されていない

**解決策**: 上記5つのプロパティをすべて設定

#### エラー: "Notion API: object_not_found"
**原因**:
- Database IDが間違っている
- Integrationがデータベースに接続されていない

**解決策**:
1. Database IDを確認
2. Notionデータベースで「・・・」→「コネクト」→ Integrationを選択

---

## 🔒 セキュリティ

### ✅ 良い例
- スクリプトプロパティで管理
- コード内にハードコードしない
- GitHubにコミットしない

### ❌ 悪い例
```javascript
// これはNG！
const NOTION_TOKEN = "secret_xxxxx"; // ハードコード
```

---

## 🚀 デプロイ後の確認

デプロイ後、ブラウザでAPIエンドポイントにアクセス：

### 活動カレンダー
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getActivityData
```

### 期待されるレスポンス
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

---

**最終更新: 2026-01-04**
