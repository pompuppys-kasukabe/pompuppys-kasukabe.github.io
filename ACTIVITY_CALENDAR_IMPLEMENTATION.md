# 活動カレンダー 実装ガイド

**作成日**: 2026-01-04
**バージョン**: 1.0.0

---

## 📋 実装状況

### ✅ 完了項目

1. **config.js設定**
   - activityCalendar設定を追加
   - 8種類の活動タイプとカラースキーム定義
   - 絵文字アイコン設定

2. **HTML構造**
   - 活動統計セクション（月間活動日数、タイプ別集計）
   - カレンダーグリッド表示エリア
   - 活動タイプ凡例

3. **CSSスタイリング**
   - GitHub風カレンダーヒートマップ
   - 活動タイプ別カラーリング（8色）
   - レスポンシブデザイン
   - ホバーエフェクト

4. **ドキュメント**
   - NOTION_ACTIVITY_CALENDAR_SETUP.md（Notion設定ガイド）
   - 本ファイル（実装ガイド）

### ⏳ 次のステップ

1. **Notion設定**（ユーザー作業）
   - `NOTION_ACTIVITY_CALENDAR_SETUP.md` に従ってNotion側を設定
   - Integration作成とToken取得
   - Database作成とプロパティ設定
   - サンプルデータ入力

2. **Google Apps Script設定**（ユーザー作業）
   - GASプロジェクト作成
   - APIコード実装
   - スクリプトプロパティ設定（Token、Database ID）
   - デプロイしてAPIエンドポイント取得

3. **config.js更新**（ユーザー作業）
   - `activityCalendar.apiUrl` にGASのデプロイURLを設定

4. **JavaScript実装**（今後の開発）
   - カレンダーレンダリング関数実装
   - データフェッチ処理
   - 統計計算ロジック
   - エラーハンドリング

---

## 🎨 活動タイプとビジュアル

### カラースキーム

| 活動タイプ | カラー | HEXコード | アイコン |
|-----------|--------|----------|---------|
| 練習 | 紫 | `#8b5fbf` | 🟣 |
| 大会 | ゴールド | `#d4a84b` | 🏆 |
| イベント出演 | 青 | `#4a90e2` | 🎪 |
| クラファン・協賛 | 緑 | `#2ecc71` | 💰 |
| メディア取材 | 赤 | `#e74c3c` | 📢 |
| リハーサル | オレンジ | `#f39c12` | 🎭 |
| ミーティング | グレー | `#95a5a6` | 💬 |
| その他 | ライトグレー | `#bdc3c7` | 📌 |

---

## 📊 表示要素

### 1. 月間統計

```
┌─────────────┬─────────────┬─────────────┐
│ 活動日数     │ 大会・イベント│ 練習日数     │
│    26日      │     4回      │    22日      │
└─────────────┴─────────────┴─────────────┘
```

- **活動日数**: 全活動タイプの合計日数
- **大会・イベント**: 大会＋イベント出演の回数
- **練習日数**: 練習タイプの日数

### 2. カレンダーグリッド

GitHub風のヒートマップ表示:
- 縦軸: 曜日（月〜日）
- 横軸: 週（過去3ヶ月分）
- セルの色: 活動タイプに応じた色
- 複数活動がある日: ストライプ表示（将来実装）

### 3. ホバー情報

マウスホバー時に表示:
```
活動名: JAMfest JAPAN vol.23
日付: 2025年11月23日
時間: 09:00 - 18:00
場所: 東京
メモ: 優勝！
```

### 4. 凡例

全活動タイプをアイコン付きで表示:
```
🟣 練習  🏆 大会  🎪 イベント出演  💰 クラファン・協賛
📢 メディア取材  🎭 リハーサル  💬 ミーティング  📌 その他
```

---

## 🔧 カスタマイズ

### 表示月数の変更

```javascript
// config.js
activityCalendar: {
  displayMonths: 6,  // 3ヶ月 → 6ヶ月に変更
}
```

### カラースキームの変更

```javascript
// config.js
activityCalendar: {
  colorScheme: {
    "練習": "#yourColor",  // 好きな色に変更
    // ...
  }
}
```

### アイコンの変更

```javascript
// config.js
activityCalendar: {
  typeIcons: {
    "練習": "💪",  // 筋肉アイコンに変更
    "大会": "🥇",  // 金メダルに変更
    // ...
  }
}
```

### 統計表示の調整

```javascript
// config.js
activityCalendar: {
  stats: {
    showMonthlyTotal: true,      // 月間活動日数を表示
    showByType: true,            // タイプ別集計を表示
    showUpcomingEvents: false    // 今後の予定を非表示
  }
}
```

---

## 🚀 JavaScript実装予定

### 関数構成（予定）

```javascript
// 1. 初期化
function initActivityCalendar() {
  if (!getConfig().activityCalendar.enabled) return;
  fetchActivityData();
}

// 2. データ取得
async function fetchActivityData() {
  const apiUrl = getConfig().activityCalendar.apiUrl;
  const response = await fetch(`${apiUrl}?action=getActivityData`);
  const data = await response.json();

  if (data.success) {
    renderActivityCalendar(data.data);
    renderActivityStats(data.data);
  }
}

// 3. カレンダー描画
function renderActivityCalendar(activities) {
  const grid = document.getElementById('activityCalendarGrid');
  const months = getConfig().activityCalendar.displayMonths;

  // カレンダーグリッド生成
  // 活動データをマッピング
  // セルに色とホバー情報を設定
}

// 4. 統計計算・描画
function renderActivityStats(activities) {
  const stats = calculateStats(activities);

  document.getElementById('statMonthlyTotal').textContent = stats.total;
  document.getElementById('statEvents').textContent = stats.events;
  document.getElementById('statPractice').textContent = stats.practice;
}

// 5. 統計計算
function calculateStats(activities) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyActivities = activities.filter(a => {
    const date = new Date(a.date);
    return date >= monthStart;
  });

  return {
    total: monthlyActivities.length,
    events: monthlyActivities.filter(a =>
      a.type === '大会' || a.type === 'イベント出演'
    ).length,
    practice: monthlyActivities.filter(a =>
      a.type === '練習'
    ).length
  };
}
```

---

## 📱 レスポンシブ対応

### デスクトップ（1024px以上）
- フルカレンダー表示（3ヶ月分）
- 統計を3カラムで表示
- 凡例を横並び

### タブレット（768px〜1023px）
- カレンダーをスクロール可能に
- 統計を2カラムで表示

### モバイル（767px以下）
- カレンダーを横スクロール
- 統計を1カラムで表示
- 凡例を縦並び

---

## 🎯 今後の拡張予定

### Phase 2（短期）
- [ ] 複数活動がある日のストライプ表示
- [ ] 今後の予定セクション
- [ ] 活動詳細モーダル表示

### Phase 3（中期）
- [ ] タイプ別フィルタリング
- [ ] 年間カレンダービュー切り替え
- [ ] 活動統計グラフ（Chart.js）

### Phase 4（長期）
- [ ] Googleカレンダー連携
- [ ] iCal形式エクスポート
- [ ] メンバー個別出欠管理

---

## 🔍 デバッグ

### ブラウザコンソールでの確認

```javascript
// 設定確認
console.log(getConfig().activityCalendar);

// API接続確認
fetch(getConfig().activityCalendar.apiUrl + '?action=getActivityData')
  .then(r => r.json())
  .then(d => console.log(d));
```

### よくあるエラー

1. **カレンダーが表示されない**
   - config.js の `enabled: true` を確認
   - apiUrl が正しく設定されているか確認
   - ブラウザコンソールでエラー確認

2. **データが取得できない**
   - GASのデプロイURL確認
   - Notion Integration接続確認
   - Published = true の活動があるか確認

3. **色が正しく表示されない**
   - Notionの Type オプション名が正確か確認
   - CSSの data-type 属性確認

---

## 📝 使い方

### 日常運用

1. **Notionで活動を記録**
   - 練習後、大会後に Notion へ入力
   - Published にチェック

2. **サイトに自動反映**
   - GAS APIが自動でデータ提供
   - ページリロードで最新カレンダー表示

3. **定期的な確認**
   - 月間統計で活動量確認
   - スポンサー報告資料に活用
   - SNS発信素材として活用

---

**最終更新: 2026-01-04**
