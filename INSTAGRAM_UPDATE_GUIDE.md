# Instagram投稿 更新ガイド

**所要時間**: 約3分
**更新頻度**: 週1回推奨（新しい投稿をした時）

---

## 📋 更新の流れ

1. Instagram投稿のURLと画像URLを取得（6件分）
2. `instagram-posts.json` ファイルを編集
3. GitHubにコミット＆プッシュ
4. Webサイトで確認

---

## ステップ1: Instagram投稿情報を取得

### 1-1. 投稿URLを取得

1. ブラウザで https://www.instagram.com/pompuppysbright/ を開く
2. 最新の投稿を6件選ぶ
3. 各投稿をクリックして、URLバーのURLをコピー

**例:**
```
https://www.instagram.com/p/ABC123xyz/
https://www.instagram.com/p/DEF456xyz/
...
```

### 1-2. 画像URLを取得

各投稿について、以下の方法で画像URLを取得：

#### 方法A: 簡単な方法（推奨）

投稿URLの末尾に `/media/?size=l` を追加するだけ：

```
投稿URL: https://www.instagram.com/p/ABC123xyz/
画像URL: https://www.instagram.com/p/ABC123xyz/media/?size=l
```

#### 方法B: 確実な方法

1. 投稿ページで画像を右クリック → 「画像を新しいタブで開く」
2. 開いたタブのURLが画像URL

**画像URLの例:**
```
https://scontent.cdninstagram.com/v/t51.29350-15/123456789_123456789_123456789_n.jpg?...
```

または

```
https://www.instagram.com/p/ABC123xyz/media/?size=l
```

---

## ステップ2: JSONファイルを編集

### 2-1. ファイルを開く

```bash
# リポジトリのルートディレクトリで
open instagram-posts.json
```

または、テキストエディタで `instagram-posts.json` を開く。

### 2-2. 内容を更新

以下の形式で6件の投稿情報を記載：

```json
{
  "posts": [
    {
      "id": "post1",
      "url": "https://www.instagram.com/p/ABC123xyz/",
      "image": "https://www.instagram.com/p/ABC123xyz/media/?size=l",
      "caption": "JAMfest JAPAN vol.23 で優勝しました！"
    },
    {
      "id": "post2",
      "url": "https://www.instagram.com/p/DEF456xyz/",
      "image": "https://www.instagram.com/p/DEF456xyz/media/?size=l",
      "caption": "春日部市民文化会館での発表会"
    },
    {
      "id": "post3",
      "url": "https://www.instagram.com/p/GHI789xyz/",
      "image": "https://www.instagram.com/p/GHI789xyz/media/?size=l",
      "caption": "新メンバー募集中です！"
    },
    {
      "id": "post4",
      "url": "https://www.instagram.com/p/JKL012xyz/",
      "image": "https://www.instagram.com/p/JKL012xyz/media/?size=l",
      "caption": "チーム練習の様子"
    },
    {
      "id": "post5",
      "url": "https://www.instagram.com/p/MNO345xyz/",
      "image": "https://www.instagram.com/p/MNO345xyz/media/?size=l",
      "caption": "夏の発表会に向けて"
    },
    {
      "id": "post6",
      "url": "https://www.instagram.com/p/PQR678xyz/",
      "image": "https://www.instagram.com/p/PQR678xyz/media/?size=l",
      "caption": "新しい振り付けを練習中"
    }
  ],
  "_comment": "最新6件の投稿を上から順に記載してください"
}
```

### 2-3. 各項目の説明

| 項目 | 説明 | 必須 |
|------|------|------|
| `id` | 投稿の識別子（post1, post2...など任意） | ✅ |
| `url` | Instagram投稿のURL | ✅ |
| `image` | 画像のURL | ✅ |
| `caption` | 投稿のキャプション（短く要約してもOK） | ❌ |

**注意点:**
- 最新の投稿が**一番上**になるように並べる
- キャプションは100文字まで表示され、それ以上は「...」で省略される
- キャプションは省略してもOK（空文字 `""` でOK）

---

## ステップ3: GitHubにアップロード

### 3-1. 変更をコミット

```bash
git add instagram-posts.json
git commit -m "Instagram投稿を更新"
git push origin main
```

### 3-2. GitHub Actionsで自動デプロイ

プッシュ後、自動的にGitHub Pagesにデプロイされます（約1-2分）。

---

## ステップ4: 確認

1. https://pompuppys-kasukabe.github.io/ にアクセス
2. Instagramセクションまでスクロール
3. 最新6件の投稿が表示されているか確認
4. 画像をクリックして、正しいInstagram投稿に飛ぶか確認

**表示されない場合:**
- ブラウザのキャッシュをクリア（Ctrl+Shift+R または Cmd+Shift+R）
- 5分ほど待ってから再度確認

---

## 💡 便利なTips

### 1. VSCodeを使う場合

JSONファイルの編集には VSCode がおすすめ：
- シンタックスハイライトで見やすい
- エラーがあれば赤線で教えてくれる
- インデントを自動整形できる

### 2. JSON形式のチェック

保存前に https://jsonlint.com/ でJSON形式が正しいか確認できます。

### 3. キャプションの取得

Instagramアプリで投稿を開いて、キャプションをコピー＆ペーストするのが簡単です。

### 4. 一括更新の場合

新しい投稿が複数ある場合は、一気に全部更新してOKです。

### 5. 順番の変更

特定の投稿を目立たせたい場合は、配列の順番を入れ替えればOK。
（必ずしも投稿日順である必要はありません）

---

## ⚠️ トラブルシューティング

### 画像が表示されない

**原因1**: 画像URLが間違っている
- `/media/?size=l` を追加した形式を試す
- または方法Bで画像URLを直接取得

**原因2**: Instagramの投稿が削除された
- 別の投稿に差し替える

**原因3**: JSONの形式エラー
- https://jsonlint.com/ でチェック
- カンマの位置、ダブルクォートの閉じ忘れなど

### 投稿リンクが機能しない

**原因**: URLにエスケープ文字やスペースが入っている
- URLをコピーし直す
- 余計な空白や改行を削除

### Webサイトに反映されない

**原因1**: GitHubにプッシュしていない
```bash
git status  # 変更状態を確認
git push    # 再度プッシュ
```

**原因2**: ブラウザキャッシュ
- Ctrl+Shift+R（Mac: Cmd+Shift+R）でハードリロード

**原因3**: GitHub Pagesのビルド待ち
- GitHubリポジトリの「Actions」タブでビルド状況を確認
- 通常1-2分で完了

---

## 📅 運用スケジュール例

### パターンA: 投稿のたびに更新

1. Instagramに新しい投稿をする
2. その場で `instagram-posts.json` を更新
3. すぐにWebサイトに反映

### パターンB: 週1回まとめて更新

1. 月曜日に先週の投稿をまとめて確認
2. 最新6件を選んで更新
3. 5分で完了

### パターンC: イベント後に更新

1. 大会や発表会などのイベント後
2. ハイライト投稿を選んで更新
3. タイムリーな情報発信

---

## 📞 質問・サポート

更新方法で困ったことがあれば、リポジトリの Issues で質問してください。

**よくある質問:**
- Q: 6件より少なくてもいい？
  A: OK。最低1件あれば表示されます。

- Q: 動画の投稿も含めていい？
  A: OK。サムネイル画像が表示されます。

- Q: キャプションなしでもいい？
  A: OK。`"caption": ""` で空文字にすればOK。

---

**最終更新: 2026-01-04**
