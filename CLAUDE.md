# Claude Code プロジェクトメモ

## プロジェクト概要
- **サイト**: POM PUPPYS 春日部（ポンパピーズ春日部）
- **URL**: https://pompuppys-kasukabe.github.io/
- **種類**: GitHub Pages 静的サイト
- **内容**: 埼玉県春日部市のチアダンスチーム

## チーム構成
- **Angel**: 小学校低学年（1〜3年生）
- **Fairy**: 小学校高学年（4〜6年生）
- **Bright**: 中学生（1〜3年生）- 2026年 The Dance Summit出場決定

---

## 重要: 過去のトラブルと対策

### 2026年1月 サイトマップ読み込みエラー事件

#### 症状
- Google検索で上位表示されていたサイトが急に表示されなくなった
- Search Consoleで「サイトマップの読み込みエラー」「URL が Google に認識されていません」

#### 原因
1. sitemap.xmlの更新時（1/8 SEO最適化コミット `1f87768`）に問題発生
2. lastmod日付が `2025-01-03` → `2026-01-08` に変更
3. デプロイ中の一時的なエラー、または末尾改行の欠如

#### 実施した対策
1. `.nojekyll` ファイル追加（Jekyll処理を無効化）
2. sitemap.xml に末尾改行を追加
3. 日付を正しい年（2026年）に設定
4. **自動検証ワークフロー** `.github/workflows/validate-sitemap.yml` を作成
   - プッシュ時にXML構文検証
   - 毎日9時（JST）に定期チェック
   - 全URLのHTTPステータス確認
   - エラー時はGitHubから通知

#### 復旧手順
1. Search Console → サイトマップ → 既存を削除 → 再送信
2. URL検査 → 主要ページを1つずつ入力 → 「インデックス登録をリクエスト」
3. 数日〜2週間で回復

---

## 日本語編集時の注意

### Edit toolでのクラッシュ問題
- 日本語文字を含む編集でクラッシュすることがある
- **対策**: Pythonスクリプトで編集する

```python
python3 -c "
with open('ファイル名', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('古い文字列', '新しい文字列')
with open('ファイル名', 'w', encoding='utf-8') as f:
    f.write(content)
"
```

---

## SEO対策メモ

### 日本語検索対応（2026/1/12実施）
- メタキーワードだけでは不十分
- 本文に「ポンパピーズ」「ポンパピーズブライト」を適度に配置
- 追加箇所:
  - ロゴalt属性
  - ヒーロー画像alt属性
  - チームセクション説明文
  - FAQ回答文
  - フッター

---

## 主要ファイル

| ファイル | 説明 |
|----------|------|
| index.html | Bright特設トップページ |
| teams.html | 全チーム紹介ページ（Angel/Fairy/Bright） |
| project-world-challenge.html | クラファン特設ページ |
| sitemap.xml | サイトマップ（更新時は検証ワークフローが自動実行） |
| .github/workflows/validate-sitemap.yml | サイトマップ自動検証 |
| .nojekyll | Jekyll処理無効化 |

---

## 連絡先
- Email: pompuppys.kasukabe@gmail.com
- Instagram: @pompuppysbright
