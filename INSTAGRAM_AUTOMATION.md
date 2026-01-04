# Instagram投稿 自動更新システム

**完全自動 - 手間ゼロでWebサイトに最新投稿を表示**

---

## 🎯 概要

このシステムは、Instagram（@pompuppysbright）の最新6件の投稿を自動的に取得して、Webサイトに表示します。

**特徴:**
- ✅ **完全自動** - 毎週月曜日に自動更新
- ✅ **完全無料** - GitHub Actionsの無料枠で運用
- ✅ **API不要** - ビジネスアカウント不要
- ✅ **手動実行可能** - 必要な時にすぐ更新できる

---

## 📋 システム構成

### 1. スクレイピングスクリプト

**ファイル:** `scripts/update-instagram.py`

Instagramの公開ページから最新投稿を取得し、`instagram-posts.json` を更新します。

**動作:**
1. https://www.instagram.com/pompuppysbright/ にアクセス
2. ページ内のJSON-LDデータまたは埋め込みJSONを抽出
3. 最新6件の投稿URLと画像URLを取得
4. `instagram-posts.json` を更新

### 2. GitHub Actionsワークフロー

**ファイル:** `.github/workflows/update-instagram.yml`

毎週自動的にスクリプトを実行し、変更をコミット＆プッシュします。

**実行スケジュール:**
- 毎週月曜日 午前9時（JST）
- 手動実行も可能

### 3. テストスクリプト

**ファイル:** `scripts/test-instagram-update.sh`

ローカル環境で動作確認するためのスクリプトです。

---

## 🚀 セットアップ

### 前提条件

すでに完了しています！以下のファイルが配置済みです：

- ✅ `scripts/update-instagram.py` - スクレイピングスクリプト
- ✅ `.github/workflows/update-instagram.yml` - GitHub Actionsワークフロー
- ✅ `scripts/test-instagram-update.sh` - テストスクリプト
- ✅ `instagram-posts.json` - 投稿データファイル

### 有効化手順

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Instagram自動更新システムを追加"
   git push origin main
   ```

2. **GitHub Actionsの確認**
   - GitHubリポジトリ → 「Actions」タブ
   - 「Instagram投稿自動更新」ワークフローが表示される

3. **初回実行（テスト）**
   - 「Instagram投稿自動更新」をクリック
   - 「Run workflow」→ 「Run workflow」で手動実行
   - 約30秒で完了

4. **確認**
   - `instagram-posts.json` が更新されているか確認
   - Webサイトで投稿が表示されているか確認

---

## 📅 運用方法

### 自動運用（推奨）

何もする必要ありません！

- 毎週月曜日の朝9時に自動実行
- 新しい投稿があれば自動的に更新
- GitHubから変更通知メールが届く（オプション）

### 手動実行

必要な時にすぐ更新できます：

#### 方法A: GitHub上で実行

1. GitHubリポジトリ → 「Actions」タブ
2. 「Instagram投稿自動更新」をクリック
3. 「Run workflow」→ 「Run workflow」

#### 方法B: ローカルで実行

```bash
# テストスクリプトを実行
./scripts/test-instagram-update.sh

# または直接Pythonスクリプトを実行
python3 scripts/update-instagram.py

# 確認してコミット
git add instagram-posts.json
git commit -m "Instagram投稿を手動更新"
git push origin main
```

---

## 🔍 動作確認

### ローカルでテスト

```bash
# テストスクリプト実行
./scripts/test-instagram-update.sh
```

**期待される出力:**
```
==================================================
🤖 Instagram投稿自動取得スクリプト
==================================================
ユーザー名: @pompuppysbright
取得件数: 6件
出力先: /path/to/instagram-posts.json

📡 Fetching: https://www.instagram.com/pompuppysbright/
✓ Found window._sharedData
✓ 6件の投稿を取得しました

1. https://www.instagram.com/p/ABC123/
   JAMfest JAPAN vol.23 で優勝しました！...
2. https://www.instagram.com/p/DEF456/
   ...

✓ Saved to /path/to/instagram-posts.json

==================================================
✅ 完了しました！
==================================================
```

### GitHub Actionsで確認

1. GitHubリポジトリ → 「Actions」タブ
2. 最新のワークフロー実行をクリック
3. 緑色のチェックマーク ✅ → 成功
4. ログで詳細を確認

---

## ⚠️ トラブルシューティング

### エラー: 投稿データを取得できませんでした

**原因1:** InstagramがHTML構造を変更した
- **対処:** スクリプトの修正が必要（Issue報告してください）

**原因2:** ネットワークエラー
- **対処:** 再実行すれば解決することが多い

**原因3:** Instagramがレート制限をかけた
- **対処:** 数時間待ってから再実行

### エラー: requests module not found

**原因:** Python環境に requests がインストールされていない

**対処:**
```bash
pip3 install requests
```

### GitHub Actionsが実行されない

**原因1:** ワークフローが無効化されている
- **対処:** Actions タブ → ワークフローを有効化

**原因2:** リポジトリ設定でActionsが無効
- **対処:** Settings → Actions → General → "Allow all actions"

### 投稿が更新されない

**原因1:** Instagramに新しい投稿がない
- **対処:** 正常動作です。新しい投稿があれば自動更新されます

**原因2:** スクリプトエラー
- **対処:** Actions のログを確認

---

## 🛠️ カスタマイズ

### 実行スケジュール変更

`.github/workflows/update-instagram.yml` を編集：

```yaml
schedule:
  - cron: '0 0 * * 1'  # 毎週月曜 9:00 JST
```

**例:**
```yaml
# 毎日実行
- cron: '0 0 * * *'

# 毎週水曜と日曜
- cron: '0 0 * * 0,3'

# 毎月1日
- cron: '0 0 1 * *'
```

**Cron構文:**
```
分 時 日 月 曜日
0  0  *  *  1    = 毎週月曜 0:00 UTC (9:00 JST)
```

### 取得投稿数を変更

`scripts/update-instagram.py` の `count = 6` を変更：

```python
def main():
    username = "pompuppysbright"
    count = 12  # 12件に変更
```

`config.js` の `displayCount` も合わせて変更：

```javascript
instagram: {
  enabled: true,
  username: "pompuppysbright",
  jsonUrl: "./instagram-posts.json",
  displayCount: 12  // 12件に変更
}
```

---

## 📊 モニタリング

### GitHub Actions実行履歴

- リポジトリ → 「Actions」タブ
- 過去の実行履歴を確認
- エラーがあれば赤いアイコン ❌

### メール通知設定

GitHubからワークフロー失敗時に通知を受け取る：

1. GitHub → Settings（個人設定）
2. Notifications → Actions
3. 「Send notifications for failed workflows」を有効化

### ログ確認

```bash
# ローカルで実行してログ確認
python3 scripts/update-instagram.py
```

---

## 🔒 セキュリティ

### プライバシー

- ✅ 公開されている投稿のみ取得
- ✅ 認証不要
- ✅ トークンや個人情報は不要

### レート制限

- Instagramのレート制限を避けるため、週1回の実行を推奨
- 手動実行は必要な時だけに

### 規約

- Instagramの公開情報を取得しているため、個人利用の範囲では問題なし
- 商用利用や大規模スクレイピングは禁止

---

## 💡 ベストプラクティス

### 1. 定期的な確認

月に1回程度、以下を確認：
- GitHub Actionsが正常に実行されているか
- Webサイトに最新投稿が表示されているか

### 2. エラー通知の監視

GitHub Actionsでエラーが出たら：
1. ログを確認
2. 手動実行で再現するか確認
3. 再現したらIssue報告

### 3. Instagram投稿のベストプラクティス

- 画像投稿を優先（動画はサムネイルのみ表示）
- キャプションを分かりやすく記載
- ハッシュタグは適度に使用

---

## 📞 サポート

### よくある質問

**Q: 動画の投稿も表示される？**
A: はい。サムネイル画像が表示されます。

**Q: カルーセル投稿（複数画像）は？**
A: 1枚目の画像が表示されます。

**Q: ストーリーズは表示される？**
A: いいえ。通常の投稿のみです。

**Q: 投稿を削除したらどうなる？**
A: 次回更新時に自動的にリストから削除されます。

**Q: コストは？**
A: 完全無料です。GitHub Actionsの無料枠（月2,000分）で十分です。

### バグ報告

問題が発生した場合は、GitHubのIssuesで報告してください：

**必要な情報:**
- エラーメッセージ
- GitHub Actionsのログ
- 発生日時

---

## 📚 技術詳細

### スクレイピング方法

Instagram公開ページには、以下の形式でデータが埋め込まれています：

1. **window._sharedData** - ページロード時のデータ
2. **JSON-LD** - 構造化データ
3. **shortcode** - 投稿の一意識別子

スクリプトはこれらを順番に試行して、データを取得します。

### データ構造

```json
{
  "posts": [
    {
      "id": "post1",
      "url": "https://www.instagram.com/p/ABC123/",
      "image": "https://scontent.cdninstagram.com/...",
      "caption": "投稿のキャプション"
    }
  ],
  "_comment": "自動更新: 2026-01-04 09:00:00",
  "_last_update": "2026-01-04T09:00:00+09:00"
}
```

### GitHub Actions環境

- **OS:** Ubuntu latest
- **Python:** 3.11
- **依存関係:** requests
- **実行時間:** 約30秒

---

**最終更新: 2026-01-04**
