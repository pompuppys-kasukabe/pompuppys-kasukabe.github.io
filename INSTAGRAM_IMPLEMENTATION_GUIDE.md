# Instagram自動表示 実装ガイド

**作成日**: 2026-01-04
**バージョン**: 1.0.0

---

## 📋 実装完了項目

### ✅ フロントエンド実装

1. **config.js設定**
   - Instagram API設定追加
   - キャッシュ時間設定
   - 表示件数設定

2. **main.js実装**
   - Instagram投稿取得機能
   - キャッシュ機能（30分）
   - エラーハンドリング
   - フォールバック表示

3. **ドキュメント**
   - INSTAGRAM_API_SETUP.md（Meta Developer設定ガイド）
   - 本ファイル（実装ガイド）

### ⏳ 次のステップ（ユーザー作業）

1. **Meta Developer設定**
   - `INSTAGRAM_API_SETUP.md` に従ってMeta for Developers登録
   - アプリ作成とInstagram Basic Display有効化
   - Instagram Tester承認
   - アクセストークン取得

2. **Google Apps Script設定**
   - GASプロジェクト作成
   - APIコード実装（セットアップガイド参照）
   - スクリプトプロパティ設定（アクセストークン）
   - デプロイしてAPIエンドポイント取得
   - トークン自動リフレッシュ設定

3. **config.js更新**
   - `instagram.apiUrl` にGASのデプロイURLを設定

---

## 🎨 機能詳細

### 1. 自動取得

- **Instagram Basic Display API** を使用
- GASプロキシ経由で安全にデータ取得
- 最新6投稿を自動表示（設定変更可能）

### 2. キャッシュ機能

```javascript
cacheMinutes: 30 // 30分間キャッシュ
```

- LocalStorageに投稿データを保存
- 30分間は再取得せずキャッシュを使用
- API呼び出し回数を削減

### 3. フォールバック

API取得失敗時の表示:
1. **apiUrl未設定** → プレースホルダー表示
2. **API呼び出し失敗** → エラーメッセージ + フォローボタン
3. **投稿0件** → Instagramへの誘導

### 4. レスポンシブ対応

- デスクトップ: 3カラム自動調整
- タブレット: 2カラム
- モバイル: 1カラム

---

## 🔧 設定オプション

### config.js

```javascript
instagram: {
  enabled: true,               // Instagram機能の有効/無効
  username: "pompuppysbright", // Instagramユーザー名
  apiUrl: "",                  // GASデプロイURL
  displayCount: 6,             // 表示する投稿数（最大12）
  cacheMinutes: 30             // キャッシュ時間（分）
}
```

### カスタマイズ例

**表示件数を増やす**:
```javascript
displayCount: 9  // 6件 → 9件
```

**キャッシュ時間を短くする**:
```javascript
cacheMinutes: 15  // 30分 → 15分
```

**機能を一時的に無効化**:
```javascript
enabled: false
```

---

## 📱 実装の仕組み

### データフロー

```
Instagram
    ↓
Instagram Basic Display API
    ↓
Google Apps Script（プロキシ）
    ↓
Webサイト（JavaScript）
    ↓
LocalStorage（キャッシュ）
    ↓
表示
```

### セキュリティ

- ✅ アクセストークンはGASで管理（クライアント非公開）
- ✅ GASが公開APIとして機能
- ✅ CORS問題を回避
- ✅ トークンの自動リフレッシュ（60日ごと）

---

## 🎯 表示仕様

### 投稿カード

```html
<a href="[Instagram投稿URL]" class="instagram-post">
  <img src="[投稿画像URL]" alt="Instagram post">
  <div class="instagram-post__overlay">
    [キャプション（最大100文字）]
  </div>
</a>
```

### ホバーエフェクト

- マウスホバーでキャプションを表示
- カード全体が浮き上がるアニメーション
- クリックでInstagram投稿へ遷移

### 画像

- **遅延読み込み**: `loading="lazy"` で最適化
- **アスペクト比**: 正方形（Instagram標準）
- **高さ**: 280px固定

---

## 🔍 デバッグ

### ブラウザコンソールでの確認

```javascript
// 設定確認
console.log(getConfig().instagram);

// キャッシュ確認
console.log(localStorage.getItem('instagram_feed_cache'));

// API接続確認
fetch(getConfig().instagram.apiUrl + '?action=getInstagramFeed')
  .then(r => r.json())
  .then(d => console.log(d));

// キャッシュクリア
localStorage.removeItem('instagram_feed_cache');
localStorage.removeItem('instagram_feed_cache_time');
```

### よくあるエラー

#### 1. 「読み込み中...」のまま

**原因**: apiUrlが設定されていない

**解決策**:
```javascript
// config.js
apiUrl: "https://script.google.com/macros/s/xxxxx/exec"
```

#### 2. 「投稿の読み込みに失敗しました」

**原因**:
- GASのデプロイURLが間違っている
- アクセストークンが期限切れ
- Instagram APIエラー

**解決策**:
1. ブラウザでGAS URLに直接アクセスしてテスト
2. GASで `refreshAccessToken()` 実行
3. GASの実行ログを確認

#### 3. 投稿が0件

**原因**:
- Instagramアカウントに投稿がない
- Instagram Tester承認が完了していない
- フィルタ条件（画像のみ）に該当する投稿がない

**解決策**:
1. Instagramアプリで「アプリとウェブサイト」を確認
2. GASの `.filter()` を一時的に外す

---

## 💡 運用のベストプラクティス

### 1. 定期的な動作確認

月に1回、以下を確認:
- [ ] Instagram投稿が正しく表示されているか
- [ ] GASのトークンリフレッシュが動作しているか
- [ ] エラーログがないか

### 2. トークン管理

**トークンの有効期限**: 60日

**自動リフレッシュ設定**:
- GASトリガーで30日ごとに実行
- 手動確認: GAS実行履歴でログチェック

**手動リフレッシュ方法**:
```javascript
// GASエディタで実行
refreshAccessToken()
```

### 3. パフォーマンス最適化

**キャッシュ活用**:
- 30分キャッシュで API呼び出し削減
- ページ表示速度向上

**画像最適化**:
- `loading="lazy"` で遅延読み込み
- スクロール時に読み込み開始

### 4. エラー監視

**GASでエラー通知**:
```javascript
// GASコードに追加
catch (error) {
  MailApp.sendEmail({
    to: "your-email@example.com",
    subject: "Instagram API Error",
    body: error.toString()
  });
  throw error;
}
```

---

## 🚀 今後の拡張アイデア

### Phase 2
- [ ] 動画投稿の対応（サムネイル表示）
- [ ] カルーセル投稿の複数画像表示
- [ ] いいね数・コメント数の表示

### Phase 3
- [ ] 投稿のフィルタリング（ハッシュタグ別）
- [ ] モーダルで投稿詳細表示
- [ ] Instagram Storiesの表示

### Phase 4
- [ ] 投稿の自動アーカイブ
- [ ] 活動カレンダーとの連携
- [ ] Instagram Insights統計表示

---

## 📊 技術仕様

### API制限

**Instagram Basic Display API**:
- **レート制限**: 200リクエスト/時間/ユーザー
- **データ取得**: 基本プロフィール、メディア（画像・動画）
- **トークン有効期限**: 60日（リフレッシュ可能）

**対策**:
- キャッシュ機能で API呼び出し削減
- 30分キャッシュ → 1時間あたり最大2回のAPI呼び出し

### ブラウザ対応

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**使用機能**:
- `fetch` API
- `localStorage`
- `Promise`
- ES5準拠（IE11非対応）

---

## 📝 チェックリスト

### セットアップ完了確認

- [ ] Meta Developer アカウント作成済み
- [ ] Instagram Basic Display アプリ作成済み
- [ ] Instagram Tester承認済み
- [ ] アクセストークン取得済み
- [ ] GASプロジェクト作成済み
- [ ] GASにトークン設定済み
- [ ] GASデプロイ完了（URL取得済み）
- [ ] GASトリガー設定済み（トークンリフレッシュ）
- [ ] config.js に apiUrl 設定済み
- [ ] ブラウザで動作確認済み

### トラブルシューティング確認

- [ ] GAS URLに直接アクセスしてJSONレスポンス確認
- [ ] ブラウザコンソールでエラーがないか確認
- [ ] キャッシュクリアしてリロード確認

---

**最終更新: 2026-01-04**
