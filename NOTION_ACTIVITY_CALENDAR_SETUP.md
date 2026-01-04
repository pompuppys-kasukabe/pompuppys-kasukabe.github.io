# Notion 活動カレンダー セットアップガイド

**作成日**: 2026-01-04
**機能**: チームの全活動を可視化（練習・大会・イベント・クラファン等）

---

## 🎯 完成イメージ

```
活動カレンダー
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
月間統計
 ┌─────────────┬─────────────┬─────────────┐
 │ 活動日数    │ 大会・イベント│ 練習日数    │
 │    26日     │     4回     │    22日     │
 └─────────────┴─────────────┴─────────────┘

     月  火  水  木  金  土  日
    ┌──┬──┬──┬──┬──┬──┬──┐
 1  │🟣│🟣│  │🟣│🟣│🏆│  │  凡例:
    ├──┼──┼──┼──┼──┼──┼──┤  🟣 練習
 2  │🟣│  │🟣│🟣│🎪│🟣│🟣│  🏆 大会
    ├──┼──┼──┼──┼──┼──┼──┤  🎪 イベント出演
 3  │  │🟣│💰│🟣│🟣│🟣│  │  💰 クラファン・協賛
    └──┴──┴──┴──┴──┴──┴──┘  📢 メディア取材

 ※ ホバーで詳細表示（活動名、時間、場所、メモ）
```

---

## 📋 Step 1: Notionデータベース作成

### 1.1 新しいデータベースを作成

1. Notionで新しいページを作成
2. 「データベース - インライン」を選択
3. データベース名: **「活動記録」** または **「Activity Log」**

### 1.2 プロパティ設定

| プロパティ名 | タイプ | 設定 | 必須 | 説明 |
|------------|--------|------|------|------|
| **Name** | タイトル | - | ✅ | 活動名（例: JAMfest JAPAN 2025、定例練習） |
| **Date** | 日付 | - | ✅ | 活動日 |
| **Type** | 選択 | オプション設定 | ✅ | 活動タイプ |
| **Start Time** | テキスト | - | - | 開始時間（例: 18:00） |
| **End Time** | テキスト | - | - | 終了時間（例: 20:00） |
| **Location** | テキスト | - | - | 場所・会場 |
| **Notes** | テキスト | - | - | メモ・備考 |
| **Published** | チェックボックス | - | ✅ | サイトに表示するか |

### 1.3 Type（活動タイプ）オプション設定

| オプション名 | 色 | 説明 |
|------------|-----|------|
| **練習** | 紫 (Purple) | 通常の練習 |
| **大会** | ゴールド (Yellow) | 競技大会出場 |
| **イベント出演** | 青 (Blue) | 地域イベント・応援出演 |
| **クラファン・協賛** | 緑 (Green) | 資金調達関連の活動 |
| **メディア取材** | ピンク (Pink) | 取材・撮影 |
| **リハーサル** | オレンジ (Orange) | 本番前のリハーサル |
| **ミーティング** | グレー (Gray) | チームミーティング |
| **その他** | デフォルト | その他の活動 |

**Notionでの設定方法**:
1. Typeプロパティをクリック
2. 「オプションを編集」
3. 上記の各オプションを追加し、対応する色を設定

### 1.4 サンプルデータ入力

| Name | Date | Type | Start Time | End Time | Location | Published |
|------|------|------|------------|----------|----------|-----------|
| JAMfest JAPAN vol.23 | 2025-11-23 | 大会 | 09:00 | 18:00 | 東京 | ☑ |
| 定例練習 | 2026-01-04 | 練習 | 18:00 | 20:00 | 春日部体育館 | ☑ |
| 春日部夏祭り出演 | 2025-08-15 | イベント出演 | 16:00 | 16:30 | 春日部駅前 | ☑ |
| CAMPFIRE開始 | 2026-01-10 | クラファン・協賛 | - | - | オンライン | ☑ |
| 埼玉新聞取材 | 2025-12-20 | メディア取材 | 14:00 | 15:00 | 練習場 | ☑ |

---

## 📋 Step 2: Notion Integration設定

### 2.1 Integration作成

1. https://www.notion.so/my-integrations にアクセス
2. 「+ New integration」をクリック
3. 設定:
   - **Name**: `POM PUPPYS Website`
   - **Associated workspace**: 該当ワークスペースを選択
   - **Type**: Internal integration
   - **Capabilities**:
     - ✅ Read content
     - ✅ Read comments（オプション）

4. 「Submit」をクリック
5. **Internal Integration Token** をコピー（後で使用）

### 2.2 データベースにIntegrationを接続

1. 作成した「活動記録」データベースを開く
2. 右上の「・・・」メニューをクリック
3. 「コネクト」 → 作成したIntegrationを選択
4. 「接続を許可」

### 2.3 Database IDを取得

データベースのURLから Database ID を取得：

```
https://www.notion.so/workspace/1234567890abcdef1234567890abcdef?v=...
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              これがDatabase ID
```

---

## 📋 Step 3: Google Apps Script設定

### 3.1 GASプロジェクト作成

1. https://script.google.com/ にアクセス
2. 「新しいプロジェクト」作成
3. プロジェクト名: `POM PUPPYS Activity Calendar API`

### 3.2 コード実装

```javascript
// Google Apps Script - 活動カレンダーAPI
function doGet(e) {
  const action = e.parameter.action;

  if (action === "getActivityData") {
    return getActivityData();
  }

  return ContentService.createTextOutput(JSON.stringify({error: "Invalid action"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getActivityData() {
  const NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
  const DATABASE_ID = PropertiesService.getScriptProperties().getProperty('ACTIVITY_DB_ID');

  if (!NOTION_TOKEN || !DATABASE_ID) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Missing configuration"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      filter: {
        property: 'Published',
        checkbox: {
          equals: true
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      page_size: 100
    })
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    // データ整形
    const activities = data.results.map(page => {
      const props = page.properties;

      return {
        name: props.Name?.title?.[0]?.plain_text || "",
        date: props.Date?.date?.start || null,
        type: props.Type?.select?.name || "その他",
        typeColor: props.Type?.select?.color || "default",
        startTime: props["Start Time"]?.rich_text?.[0]?.plain_text || "",
        endTime: props["End Time"]?.rich_text?.[0]?.plain_text || "",
        location: props.Location?.rich_text?.[0]?.plain_text || "",
        notes: props.Notes?.rich_text?.[0]?.plain_text || ""
      };
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: activities,
      count: activities.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用関数
function testAPI() {
  const result = getActivityData();
  Logger.log(result.getContent());
}
```

### 3.3 スクリプトプロパティ設定

1. プロジェクト設定（歯車アイコン）→ 「スクリプトプロパティ」
2. プロパティを追加:
   - **Property**: `NOTION_TOKEN`
     **Value**: [Step 2.1でコピーしたToken]
   - **Property**: `ACTIVITY_DB_ID`
     **Value**: [Step 2.3で取得したDatabase ID]

### 3.4 デプロイ

1. 「デプロイ」→「新しいデプロイ」
2. タイプ: **ウェブアプリ**
3. 設定:
   - **説明**: Activity Calendar API v1
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **Web app URL** をコピー（例: `https://script.google.com/macros/s/xxxxx/exec`）

### 3.5 動作確認

ブラウザでアクセスして確認:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getActivityData
```

期待されるレスポンス:
```json
{
  "success": true,
  "data": [
    {
      "name": "JAMfest JAPAN vol.23",
      "date": "2025-11-23",
      "type": "大会",
      "typeColor": "yellow",
      "startTime": "09:00",
      "endTime": "18:00",
      "location": "東京",
      "notes": "優勝！"
    }
  ],
  "count": 1
}
```

---

## 📋 Step 4: Webサイト設定

### 4.1 config.js更新

```javascript
// config.js
activityCalendar: {
  enabled: true,
  apiUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  displayMonths: 3,
  colorScheme: {
    "練習": "#8b5fbf",              // 紫
    "大会": "#d4a84b",              // ゴールド
    "イベント出演": "#4a90e2",      // 青
    "クラファン・協賛": "#2ecc71",  // 緑
    "メディア取材": "#e74c3c",      // 赤
    "リハーサル": "#f39c12",        // オレンジ
    "ミーティング": "#95a5a6",      // グレー
    "その他": "#bdc3c7"             // ライトグレー
  },
  typeIcons: {
    "練習": "🟣",
    "大会": "🏆",
    "イベント出演": "🎪",
    "クラファン・協賛": "💰",
    "メディア取材": "📢",
    "リハーサル": "🎭",
    "ミーティング": "💬",
    "その他": "📌"
  },
  hoverInfo: {
    showTime: true,      // 開始・終了時間を表示
    showLocation: true,  // 場所を表示
    showNotes: true      // メモを表示
  },
  stats: {
    showMonthlyTotal: true,      // 月間活動日数
    showByType: true,            // タイプ別集計
    showUpcomingEvents: true     // 今後の予定
  }
}
```

**重要**: `apiUrl` を実際のGASデプロイURLに変更してください。

---

## 📊 活動タイプ別の使い分け

### 練習
- 通常の定例練習
- 個人練習
- グループ練習

### 大会
- JAMfest JAPAN
- USA Regionals
- USA Nationals
- The Dance Summit
- その他競技大会

### イベント出演
- 地域イベント
- お祭り
- 商業施設でのパフォーマンス
- チャリティーイベント

### クラファン・協賛
- クラウドファンディング開始/終了
- 協賛契約
- 資金調達イベント

### メディア取材
- 新聞取材
- テレビ取材
- ウェブメディア取材
- 写真撮影

### リハーサル
- 大会前リハーサル
- イベント前リハーサル
- 衣装合わせ

### ミーティング
- チームミーティング
- 保護者会
- スタッフ打ち合わせ

---

## 💡 活用例

### メディア向けアピール
「月26日の活動日数（練習22日 + イベント4回）」

### スポンサー向け報告
「過去3ヶ月で8回のイベント出演、地域貢献を実践」

### メンバー募集
「活動カレンダーで見える、本気で楽しむチーム」

### SNS発信
「今月の活動カレンダーを公開しました！」

---

## 🎨 カスタマイズ

### 色の変更

チームカラーに合わせて調整可能:
```javascript
colorScheme: {
  "練習": "#your-color",  // 好きな色のHEXコード
  // ...
}
```

### アイコンの変更

絵文字を好みのものに:
```javascript
typeIcons: {
  "練習": "💪",  // 筋肉
  "大会": "🥇",  // 金メダル
  // ...
}
```

---

## 📱 データ入力のベストプラクティス

### 1. テンプレート活用

Notionで各活動タイプのテンプレートを作成:

**練習テンプレート**:
```
Name: 定例練習 YYYY-MM-DD
Type: 練習
Start Time: 18:00
End Time: 20:00
Location: 春日部体育館
Published: ☑
```

**大会テンプレート**:
```
Name: [大会名]
Type: 大会
Start Time: [開始時刻]
End Time: [終了時刻]
Location: [会場]
Notes: [結果・コメント]
Published: ☑
```

### 2. 一括入力

過去データの一括入力はCSV活用:
1. Excelで活動記録を作成
2. CSV形式で保存
3. Notionでインポート

---

## 🔒 セキュリティ

### 注意事項

- ❌ Notion TokenをGitHubにコミットしない
- ❌ クライアントサイドJSに直接トークンを記載しない
- ✅ GASのスクリプトプロパティで管理
- ✅ Published = trueの活動のみ公開

---

## 🎯 今後の拡張アイデア

### Phase 2
- [ ] 今後の予定セクション（Upcoming Events）
- [ ] 活動タイプ別の統計グラフ
- [ ] 年間カレンダービュー

### Phase 3
- [ ] Googleカレンダー連携
- [ ] リマインダー機能
- [ ] メンバー個別の出欠管理

---

**最終更新: 2026-01-04**
