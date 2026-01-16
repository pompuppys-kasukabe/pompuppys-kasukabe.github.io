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

### 2026年1月 config.js構文エラーによるコンテンツ非表示

#### 症状
- トップページの「Our Story」「Steps to the World」「News」などのセクションが空白になる
- コンテンツが動的生成されない（HTMLの枠だけ表示される）
- ブラウザのDevToolsコンソールにJavaScriptエラーが出る

#### 原因
- config.js内の文字列にエスケープされていない引用符が含まれていた
- 例: `"私たちは"楽しむ"を取り戻す"` ← 内側の`"`がJS文字列を壊す
- config.jsが読み込めず `window.PUPPYS_CONFIG` が未定義になり、全動的コンテンツが生成されない

#### 診断手順

1. **セクションが空白かどうか確認**
```bash
curl -s "https://pompuppys-kasukabe.github.io/" | grep -A5 'id="storyBody"'
# 「config.jsから動的生成」のコメントだけなら問題あり
```

2. **config.js内の引用符問題をチェック**
```bash
# ローカルファイルをチェック
python3 << 'PYEOF'
with open('config.js', 'r', encoding='utf-8') as f:
    content = f.read()

in_string = False
string_char = None
line_num = 1
col = 0

for i, c in enumerate(content):
    if c == '\n':
        line_num += 1
        col = 0
        continue
    col += 1

    if not in_string:
        if c in ['"', "'"]:
            in_string = True
            string_char = c
    else:
        if c == '\\' and i + 1 < len(content):
            continue  # エスケープ文字をスキップ
        if c == string_char:
            in_string = False
            string_char = None

if in_string:
    print(f"警告: 文字列が閉じられていない可能性あり")
else:
    print("基本的な引用符チェック: OK")

# 危険なパターンを検索
import re
# 二重引用符で囲まれた文字列内に、エスケープされていない二重引用符がないかチェック
lines = content.split('\n')
for i, line in enumerate(lines, 1):
    # 日本語の「」『』以外の引用符が文字列内にないかチェック
    if re.search(r'"\s*<[^>]+>[^"]*"[^"]*"', line):
        print(f"Line {i}: 引用符の問題の可能性: {line[:60]}...")
PYEOF
```

3. **特定の行の文字コードを確認**
```bash
# 問題のある行番号がわかっている場合
sed -n 'XXXp' config.js | python3 -c "
import sys
line = sys.stdin.read()
for i, c in enumerate(line):
    if c == '\"':
        print(f'Position {i}: 二重引用符 (U+0022)')
"
```

#### 修正方法
- 文字列内の引用符を日本語の鉤括弧に変更: `"` → `「` `」`
- またはエスケープ: `\"楽しむ\"`
- またはシングルクォートで文字列を囲む: `'私たちは"楽しむ"を'`

#### 予防策
- config.jsを編集する際は、日本語テキスト内に ASCII引用符 `"` が含まれていないか確認
- 引用を表現する場合は `「」` `『』` を使用する

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
