# UYS Showcase 移行（記念ページ化）実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** POM PUPPYS bright 公式サイトを「世界大会報告＋アーカイブ＋UYS Showcase への導線」ページに作り変える。

**Architecture:** 既存の静的サイト（HTML/JS/CSS、ビルドなし、GitHub Pages）。動的コンテンツは `config.js`（`window.PUPPYS_CONFIG`）→ `main.js` の `render*()` 関数で描画。本プランでは ①不要機能の削除（Road の募金/メッセージ/カウントダウン、Instagram カルーセル、teams.html、活動カレンダー）→ ②記念用の新規3セクションを**静的HTMLで**追加 → ③コピー/メタ/sitemap 差し替え、の順で進める。

**Tech Stack:** 素の HTML5 / CSS3（`style.css`）/ Vanilla JS（`main.js`, `config.js`, `utils.js`）/ Swiper 11（CDN）/ Font Awesome 6.5 / GitHub Pages。

---

## 設計上の重要判断（実装前に確認）

1. **新規3セクションは静的HTMLで実装する**（config.js 連動にしない）。
   - 理由: 記念ページは内容が固定 / `config.js` のASCII引用符混入で全画面が白くなる既知事故（CLAUDE.md）を最初から回避 / YAGNI。
   - 影響: `uys遷移.md` §3.2「worldResult キー新設」/ §3.3「uys キー新設」は**採用しない**。異論があればここで差し替え。
2. **全 CTA の着地点 `https://uys-showcase.com` が本番公開済みであること**が前提（`uys遷移.md` ブロッカー①）。未公開なら Phase 2 開始前に解消する。本プランでは URL を定数 `UYS_URL = https://uys-showcase.com` として全箇所で使用。
3. **作業ブランチ**: `feature/uys-transition` を作成して進める（CLAUDE.md のCloudflareプレビューでPRレビュー可能）。各タスクでこまめにコミット。

---

## テスト方針（静的サイト版TDD）

このリポジトリにテストフレームワークは無い。各タスクの「テスト」は以下の**検証コマンド＋目視**で代替する。

- **構文検証**: `node --check config.js`（config.js 編集時は必須。終了コード0で成功）
- **存在/不在検証**: `grep -c` で要素ID・関数・リンクの件数を確認
- **リンク健全性**: `grep -rn` で削除ファイルへの参照が0件であること
- **描画確認（手動）**: `python3 -m http.server 8000` → http://localhost:8000/ を開き、**DevToolsコンソールにエラーが無いこと**と `window.PUPPYS_CONFIG` が定義済みであることを確認（CLAUDE.md の白画面事故検知）
- **コミット**: 各タスク末尾で必ずコミット。**`git add -A` は使わず、変更したファイルのみを明示的に `git add <path...>` する**（リポジトリには意図的に未追跡のままにしている素材ファイル群があり、`-A` で巻き込むため）。削除は `git add -A -- <deleted-path>` で個別にステージする。

**日本語を含むファイル編集は CLAUDE.md の方針に従い Python スクリプトで行う**（Edit tool のクラッシュ回避）。雛形:
```bash
python3 - <<'PYEOF'
with open('FILE','r',encoding='utf-8') as f: c=f.read()
c=c.replace('OLD','NEW')
with open('FILE','w',encoding='utf-8') as f: f.write(c)
PYEOF
```

---

## ファイル構成（変更マップ）

| ファイル | 役割 | 本プランでの変更 |
|----------|------|------------------|
| `index.html` | トップページ本体 | nav/hero/about/coaches/team/活動カレンダー/Road/Instagram/FAQ/Contact/Footer を変更、新規3セクション追加 |
| `style.css` | 全スタイル | 新規3セクション用CSSを末尾に追加 |
| `main.js` | 動的描画・初期化 | `initSite()` から不要呼び出しを削除、未使用関数を削除、Instagram をリンク化 |
| `config.js` | コンテンツ設定 | `copy.timeline` / `news` / `copy.hero` / `project.faq` 等のコピー更新（**新キーは追加しない**） |
| `sitemap.xml` | サイトマップ | `teams.html` エントリ削除、`lastmod` 更新 |
| `teams.html` | 全チーム紹介 | **削除** |
| `messages.html`, `messages-all.html` | メッセージアーカイブ | 残す（フォーム/カウンターは Phase 1 で確認のみ、無効化は任意） |

---

# Phase 0: 準備

### Task 0: 作業ブランチ作成と現状スナップショット

**Files:** なし（git操作のみ）

- [ ] **Step 1: ブランチ作成**

```bash
cd /Users/satmba/projects/pompuppys-kasukabe.github.io
git checkout main && git pull
git checkout -b feature/uys-transition
```

- [ ] **Step 2: 現状の検証ベースライン取得**

Run:
```bash
node --check config.js && echo "config OK"
grep -c "teams.html" index.html        # 期待値: 2
grep -c "teams" sitemap.xml             # 期待値: 1
python3 -m http.server 8000 &           # 別ターミナルでhttp://localhost:8000/を開きコンソール無エラー確認後 kill
```
Expected: `config OK` / `2` / `1` を確認できること。

- [ ] **Step 3: コミット（空コミットで起点を明示）**

```bash
git commit --allow-empty -m "chore: UYS移行作業の起点"
```

---

# Phase 1: 不要機能の削除・整理

> このフェーズ完了時点で「縮小版だが正常動作するサイト」になること。

### Task 1: teams.html の削除（3ファイル連動）

**Files:**
- Delete: `teams.html`
- Modify: `index.html:237`（About内の全チーム紹介ボタン）
- Modify: `index.html:776`（Footerリンク）
- Modify: `sitemap.xml:7`（loc登録）

- [ ] **Step 1: index.html の About 内ボタンを削除**

`index.html` の以下ブロック（236〜240行目相当）を削除する。

削除対象:
```html
          <div style="margin-top: 1.5rem;">
            <a href="./teams.html" class="btn btn-ghost">
              <i class="fas fa-users" style="margin-right: 8px;"></i>全チーム紹介を見る
            </a>
          </div>
```

Python:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
old='''          <div style="margin-top: 1.5rem;">
            <a href="./teams.html" class="btn btn-ghost">
              <i class="fas fa-users" style="margin-right: 8px;"></i>全チーム紹介を見る
            </a>
          </div>
'''
assert old in c, "About内teams.htmlボタンが見つからない"
c=c.replace(old,'')
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("About内ボタン削除OK")
PYEOF
```

- [ ] **Step 2: Footer のリンクを削除**

削除対象（index.html 775〜777行目相当）:
```html
    <div style="margin-top: 8px;">
      <a href="./teams.html" style="color: #d4af37;">POM PUPPYS 春日部 全チーム紹介</a>
    </div>
```

Python:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
old='''    <div style="margin-top: 8px;">
      <a href="./teams.html" style="color: #d4af37;">POM PUPPYS 春日部 全チーム紹介</a>
    </div>
'''
assert old in c, "Footerのteams.htmlリンクが見つからない"
c=c.replace(old,'')
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("Footerリンク削除OK")
PYEOF
```

- [ ] **Step 3: sitemap.xml から teams.html の `<url>` エントリを削除**

まず該当ブロックを確認: `grep -n -A2 -B2 "teams.html" sitemap.xml`
`<url>...<loc>https://pompuppys-kasukabe.github.io/teams.html</loc>...</url>` の塊を削除する（前後の `<url>`〜`</url>` ごと）。

Python（loc行を含む url ブロックを正規表現で除去）:
```bash
python3 - <<'PYEOF'
import re
with open('sitemap.xml','r',encoding='utf-8') as f: c=f.read()
new=re.sub(r'\s*<url>(?:(?!</url>).)*teams\.html.*?</url>', '', c, flags=re.S)
assert 'teams.html' not in new, "teams.htmlがsitemapに残存"
with open('sitemap.xml','w',encoding='utf-8') as f: f.write(new)
print("sitemapからteams.html削除OK")
PYEOF
```

- [ ] **Step 4: teams.html 本体を削除**

```bash
git rm teams.html
```

- [ ] **Step 5: 検証（参照0件・sitemap健全）**

Run:
```bash
grep -rn "teams.html" --include="*.html" --include="*.js" --include="*.xml" . ; echo "exit=$?"
python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('sitemap.xml'); print('sitemap XML OK')"
```
Expected: grep の結果が**0件**（`exit=1`）、`sitemap XML OK` が出ること。

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "削除: teams.html（index 2箇所・sitemap 連動削除）"
```

---

### Task 2: 活動カレンダーセクションの削除

**Files:**
- Modify: `index.html`（`<section id="activity-calendar">` ブロック全体, 323行目〜該当 `</section>`）
- Modify: `main.js`（`initSite()` 内 `initActivityCalendar();` の呼び出し行, 1909〜の関数内）
- Modify: `config.js`（任意: `activityCalendar.enabled` を `false` に）

- [ ] **Step 1: index.html の activity-calendar セクションを削除**

`<!-- ========== 活動カレンダー ========== -->` 直後の `<section id="activity-calendar" ...>` から対応する `</section>` までを削除。範囲は `grep -n 'id="activity-calendar"' index.html` と、その次の `<section` 直前までで特定する。

Python（コメント＋セクションを範囲削除）:
```bash
python3 - <<'PYEOF'
import re
with open('index.html','r',encoding='utf-8') as f: c=f.read()
# 活動カレンダーのコメントから、次セクション(<!-- ===... Photos)の直前まで削除
pat=re.compile(r'\s*<!-- =+ 活動カレンダー =+ -->.*?(?=\n\s*<!-- =+ Photos)', re.S)
new=pat.sub('\n', c, count=1)
assert 'id="activity-calendar"' not in new, "活動カレンダーが残存"
with open('index.html','w',encoding='utf-8') as f: f.write(new)
print("活動カレンダーセクション削除OK")
PYEOF
```
注: Photos セクションが activity-calendar の直後に無い場合は、`grep -n '<section' index.html` で実際の次セクションのコメント文言に置き換えてから実行する。

- [ ] **Step 2: main.js の初期化呼び出しを削除**

`initSite()`（main.js:1909〜）内の以下行を削除:
```js
  initActivityCalendar();
```

Python:
```bash
python3 - <<'PYEOF'
with open('main.js','r',encoding='utf-8') as f: c=f.read()
assert '  initActivityCalendar();\n' in c
c=c.replace('  initActivityCalendar();\n','',1)
with open('main.js','w',encoding='utf-8') as f: f.write(c)
print("initActivityCalendar呼び出し削除OK")
PYEOF
```
（関数定義 `initActivityCalendar`〜`createTooltip` 群 1574〜1874 は未使用となるが、削除は任意。残しても害は無い。削除する場合は Step 内で関数群をまとめて除去し `node --check main.js` を通すこと。）

- [ ] **Step 3: 検証**

Run:
```bash
node --check main.js && echo "main.js OK"
grep -c 'id="activity-calendar"' index.html   # 期待値: 0
grep -c 'initActivityCalendar();' main.js      # 期待値: 0（定義側を残す場合は定義行のみ残るので 0 にならない→ "initActivityCalendar();" 呼び出し限定でgrep）
```
Expected: `main.js OK`、`id="activity-calendar"` が 0。

- [ ] **Step 4: 描画確認**

`python3 -m http.server 8000` → トップを開き、活動カレンダーが消えコンソールエラーが無いこと。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "削除: 活動カレンダーセクション（HTML + 初期化呼び出し）"
```

---

### Task 3: Road to the World のアーカイブ化（募金バー/カウンター/Tally/カウントダウン除去）

**Files:**
- Modify: `index.html`（`<section id="road">` 458〜597行）
- Modify: `main.js`（`initSite()` から `renderRoadProgress(); setupMessageForm(); initCountdown();` と `renderMessagesPreview()` 呼び出しを削除）

**残すもの**: セクションタイトル「Road to the World」＋メインビジュアル＋クラファン完走報告（543,000円・46名）＋「ありがとうございました」＋使い道サマリ＋「特設ページを見る」リンク。
**消すもの**: カウントダウン(`#countdownTimer`)、進捗バー(`#roadProgressBar`)、#BrightWings1000 カウンター(`#messageCount`,`#progressBarFill`)、メッセージプレビュー(`#roadMessagesPreview`)、Tallyボタン(`#sendMessageBtn`)、スポンサー募集CTA、横断幕記述。

- [ ] **Step 1: Road セクション全体を「アーカイブ版」に置換**

`index.html` の 458〜597行（`<section id="road" ...>` 〜 `</section>`）を、以下の静的アーカイブ版で**丸ごと置換**する。

新HTML:
```html
  <!-- ========== Road to the World（アーカイブ） ========== -->
  <section id="road" class="roadSection">
    <div class="container roadSection__inner">
      <div class="roadSection__header">
        <span class="roadSection__kicker">Project Archive</span>
        <h2 class="roadSection__title">Road to the World</h2>
        <p class="roadSection__lead">世界最高峰の舞台、米国「The Dance Summit 2026」への挑戦の記録</p>
      </div>

      <div class="roadSection__grid roadSection__grid--single">
        <div class="roadCard">
          <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
            <img src="./assets/photos/award_flag.jpg" alt="表彰後、フラッグを掲げるPOM PUPPYS bright" style="width: 100%; height: auto; display: block;">
          </div>

          <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)); border-radius: 12px; border: 2px solid rgba(212,175,55,0.3);">
            <p style="margin: 0 0 8px 0; font-size: 1rem; color: #fff; font-weight: 700;">
              <i class="fas fa-check-circle" style="margin-right: 6px; color: #d4af37;"></i>クラウドファンディング 完走報告
            </p>
            <p style="margin: 0; font-size: 0.95rem; color: rgba(255,255,255,0.9); line-height: 1.7;">
              46名の皆様から <strong style="color:#d4af37;">543,000円</strong> のご支援をいただきました。<br>
              いただいたご支援は、選手たちの渡航費用に大切に充当いたしました。<br>
              <strong style="color: #d4af37;">温かいご支援、本当にありがとうございました。</strong>
            </p>
          </div>

          <p class="roadCard__note">#BrightWings1000 でいただいた応援メッセージは、横断幕に刻んで世界大会の舞台へ届けました。</p>
        </div>
      </div>

      <div class="roadSection__cta">
        <a href="./project-world-challenge.html" class="btn btn-gold btn-outlined">特設ページ（記録）を見る</a>
      </div>
    </div>
  </section>
```

Python（範囲置換: `id="road"` のセクション開始コメントから `id="faq"` の直前まで）:
```bash
python3 - <<'PYEOF'
import re
with open('index.html','r',encoding='utf-8') as f: c=f.read()
new_html = open('/tmp/road_new.html','r',encoding='utf-8').read()  # 上記HTMLを/tmp/road_new.htmlに保存しておく
pat=re.compile(r'\s*<!-- =+ Road to the World =+ -->.*?</section>\n(?=\s*<!-- =+ FAQ)', re.S)
assert pat.search(c), "Roadセクション範囲が特定できない"
c=pat.sub('\n'+new_html+'\n', c, count=1)
assert 'id="roadProgressBar"' not in c and 'id="messageCount"' not in c and 'id="countdownTimer"' not in c
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("Roadアーカイブ化OK")
PYEOF
```
（実装時は上記 新HTML を `/tmp/road_new.html` に保存してから実行する。または old 文字列を厳密一致で置換しても良い。）

- [ ] **Step 2: main.js から Road 関連の初期化呼び出しを削除**

`initSite()` 内の以下4行を削除:
```js
  renderRoadProgress();
```
```js
  setupMessageForm();
```
```js
  initCountdown();
```
```js
  try { await renderMessagesPreview(); } catch (e) { console.error("renderMessagesPreview failed:", e); }
```

Python:
```bash
python3 - <<'PYEOF'
with open('main.js','r',encoding='utf-8') as f: c=f.read()
for line in ['  renderRoadProgress();\n','  setupMessageForm();\n','  initCountdown();\n',
             '  try { await renderMessagesPreview(); } catch (e) { console.error("renderMessagesPreview failed:", e); }\n']:
    assert line in c, f"見つからない: {line!r}"
    c=c.replace(line,'',1)
with open('main.js','w',encoding='utf-8') as f: f.write(c)
print("Road関連の初期化呼び出し削除OK")
PYEOF
```
（関数定義 `renderRoadProgress`/`setupMessageForm`/`initCountdown` 本体は未使用化。削除は任意。残置可。）

- [ ] **Step 3: 検証**

Run:
```bash
node --check main.js && echo "main.js OK"
for id in roadProgressBar messageCount progressBarFill countdownTimer roadMessagesPreview sendMessageBtn; do echo "$id: $(grep -c $id index.html)"; done
```
Expected: 全ID **0件**、`main.js OK`。

- [ ] **Step 4: 描画確認**

ローカルサーバでトップを開き、Road セクションが完走報告のみになり、カウンター/フォーム/カウントダウンが消え、コンソールエラーが無いこと。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "Road to the World をアーカイブ化（募金/メッセージ/カウントダウン除去）"
```

---

### Task 4: Instagram カルーセルを外部リンクボタンに置換

**Files:**
- Modify: `index.html`（`<section id="instagram">` 418〜442行のSwiper構造）
- Modify: `main.js`（`initSite()` の `renderInstagramFeed()` 呼び出し削除）

- [ ] **Step 1: Instagram セクションの中身をボタンに置換**

`index.html` の Instagram セクション内、`<div class="swiper ...">`〜該当 `</div>`（Swiperラッパ一式, 430行付近〜442行）を以下に置換:
```html
      <div style="text-align:center; margin-top: 8px;">
        <a href="https://www.instagram.com/pompuppysbright" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class="fab fa-instagram" style="margin-right:8px;"></i>@pompuppysbright をフォロー
        </a>
      </div>
```
実装時は `grep -n 'id="instagramFeed"' index.html` で範囲を特定し、その親 `<div class="swiper">` 開始から対応する閉じ `</div>` までを置換する。`#instagramFeed` が残らないこと。

- [ ] **Step 2: main.js の呼び出し削除**

`initSite()` 内の以下行を削除:
```js
  try { await renderInstagramFeed(); } catch (e) { console.error("renderInstagramFeed failed:", e); }
```

Python:
```bash
python3 - <<'PYEOF'
with open('main.js','r',encoding='utf-8') as f: c=f.read()
line='  try { await renderInstagramFeed(); } catch (e) { console.error("renderInstagramFeed failed:", e); }\n'
assert line in c
c=c.replace(line,'',1)
with open('main.js','w',encoding='utf-8') as f: f.write(c)
print("renderInstagramFeed呼び出し削除OK")
PYEOF
```

- [ ] **Step 3: 検証**

```bash
node --check main.js && echo "OK"
grep -c 'id="instagramFeed"' index.html   # 期待値: 0
```

- [ ] **Step 4: コミット**

```bash
git add -A
git commit -m "Instagram: カルーセル廃止しフォローリンクに変更"
```

---

### Task 5: Coaches セクションの削除（1名退任のため）

**Files:**
- Modify: `index.html`（`<section id="coaches">` 247〜257行）

- [ ] **Step 1: Coaches セクションを削除**

Python:
```bash
python3 - <<'PYEOF'
import re
with open('index.html','r',encoding='utf-8') as f: c=f.read()
pat=re.compile(r'\s*<!-- =+ Coaches =+ -->.*?</section>\n(?=\s*<!-- =+ Story)', re.S)
assert pat.search(c), "Coachesセクション範囲が特定できない"
c=pat.sub('\n', c, count=1)
assert 'id="coaches"' not in c
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("Coaches削除OK")
PYEOF
```

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c 'id="coaches"' index.html   # 期待値: 0
git add -A && git commit -m "削除: Coachesセクション（1名退任のため）"
```

---

### Task 5B: About セクションの削除（決定: 丸ごと削除）

**Files:**
- Modify: `index.html`（`<section id="about">` 211〜244行を丸ごと削除。3チーム紹介はUYS側へ集約するため）

> 注: About 内の teams.html ボタンは Task1 で既に除去済み。本タスクで About セクション全体を削除する。

- [ ] **Step 1: About セクションを削除**

Python:
```bash
python3 - <<'PY'
import re
with open('index.html','r',encoding='utf-8') as f: c=f.read()
pat=re.compile(r'\s*<!-- =+ About POM PUPPYS =+ -->.*?</section>\n(?=\s*<!-- =+ (Result|Story|Coaches))', re.S)
assert pat.search(c), "Aboutセクション範囲が特定できない（前後コメント要確認）"
c=pat.sub('\n', c, count=1)
assert 'id="about"' not in c, "Aboutが残存"
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("About削除OK")
PY
```
注: About の直後セクションは実装順により Result（Task8後）/ Story になる。`grep -n '<section' index.html` で実際の次セクションのコメント文言を確認してから lookahead を合わせる。

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c 'id="about"' index.html   # 期待値: 0
git add -A && git commit -m "削除: About POM PUPPYSセクション（3チーム紹介はUYS側へ集約）"
```

---

# Phase 2: 記念用 新規セクションの追加（静的HTML）

> 前提: `https://uys-showcase.com` は仮ページとして閲覧可能（公開済み）＝全CTAは404にならない。ブロッカー解消済み。

### Task 6: 新規セクション用CSSを追加

**Files:**
- Modify: `style.css`（末尾に追記）

- [ ] **Step 1: style.css 末尾に以下を追記**

```css
/* ===== UYS移行: 告知バー ===== */
.uysBar{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:center;gap:14px;
  padding:10px 16px;background:linear-gradient(135deg,#6b3fa0,#8b5fbf);color:#fff;font-size:.95rem;text-align:center;}
.uysBar[hidden]{display:none;}
.uysBar__text{font-weight:600;}
.uysBar__btn{flex-shrink:0;background:#fff;color:#6b3fa0;border-radius:999px;padding:6px 16px;font-weight:700;
  text-decoration:none;font-size:.85rem;white-space:nowrap;transition:transform .15s;}
.uysBar__btn:hover{transform:translateY(-1px);}
.uysBar__close{position:absolute;right:10px;background:none;border:none;color:#fff;font-size:1.3rem;line-height:1;cursor:pointer;opacity:.8;}
.uysBar__close:hover{opacity:1;}
.uysBar__short{display:none;}
@media(max-width:640px){.uysBar__full{display:none;}.uysBar__short{display:inline;}.uysBar{font-size:.85rem;}}

/* ===== UYS移行: 結果報告（Result Report） ===== */
.resultReport{background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:64px 0;}
.resultReport__inner{max-width:960px;margin:0 auto;padding:0 20px;text-align:center;}
.resultReport__kicker{letter-spacing:.25em;font-size:.8rem;color:#d4af37;font-weight:700;margin-bottom:8px;}
.resultReport__title{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:900;margin:0 0 28px;}
.resultReport__stats{display:flex;flex-wrap:wrap;justify-content:center;gap:24px;margin-bottom:32px;}
.resultStat{min-width:130px;}
.resultStat__label{font-size:.8rem;color:rgba(255,255,255,.6);margin-bottom:4px;}
.resultStat__value{font-size:1.6rem;font-weight:800;color:#d4af37;}
.resultReport__photo{border-radius:14px;overflow:hidden;margin:0 auto 28px;max-width:720px;box-shadow:0 8px 32px rgba(0,0,0,.4);}
.resultReport__photo img{width:100%;height:auto;display:block;}
.resultReport__body{max-width:680px;margin:0 auto;line-height:2;color:rgba(255,255,255,.92);text-align:left;}
.resultReport__body p{margin:0 0 1em;}
.resultReport__thanks{text-align:center;font-weight:700;color:#d4af37;font-size:1.1rem;margin-top:8px;}

/* ===== UYS移行: Next Stage（UYS Showcase 紹介） ===== */
.nextStage{padding:64px 0;background:linear-gradient(135deg,#fff,#f8f4ec);}
.nextStage__inner{max-width:760px;margin:0 auto;padding:32px 24px;text-align:center;border:2px solid #6b3fa0;border-radius:18px;background:#fff;}
.nextStage__kicker{letter-spacing:.25em;font-size:.8rem;color:#6b3fa0;font-weight:700;margin-bottom:6px;}
.nextStage__title{font-size:clamp(2rem,5vw,3rem);font-weight:900;color:#1a1a2e;margin:0;}
.nextStage__sub{font-style:italic;color:#6b3fa0;font-size:1.1rem;margin:4px 0 20px;}
.nextStage__body{line-height:2;color:#333;margin:0 auto 24px;max-width:620px;}
.nextStage__btn{display:inline-block;background:#6b3fa0;color:#fff;border-radius:999px;padding:14px 32px;font-weight:700;
  text-decoration:none;font-size:1.05rem;transition:transform .15s,box-shadow .15s;}
.nextStage__btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(107,63,160,.35);}
.nextStage__teams{margin-top:18px;font-size:.85rem;color:#666;line-height:1.8;}

/* Road 単一カラム時の中央寄せ */
.roadSection__grid--single{display:block;max-width:560px;margin:0 auto;}
```

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c "uysBar" style.css        # 期待値: 1以上
git add style.css && git commit -m "追加: UYS移行用セクションCSS（告知バー/結果報告/Next Stage）"
```

---

### Task 7: 告知バーを全ページ最上部に追加

**Files:**
- Modify: `index.html`（`<body data-page="home">` 直後, 161行）
- 任意（横展開）: `media.html`, `project-world-challenge.html` など他HTMLの `<body>` 直後にも同じバーを追加

- [ ] **Step 1: index.html の `<body>` 直後に告知バーを挿入**

挿入HTML:
```html
<!-- ========== UYS告知バー ========== -->
<div class="uysBar" id="uysBar" role="region" aria-label="UYS Showcase のお知らせ">
  <span class="uysBar__text">
    <span class="uysBar__full">POM PUPPYS は <strong>UYS Showcase</strong> として生まれ変わりました</span>
    <span class="uysBar__short">UYS Showcase として生まれ変わりました</span>
  </span>
  <a class="uysBar__btn" href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer">新サイトを見る →</a>
  <button class="uysBar__close" id="uysBarClose" type="button" aria-label="閉じる">×</button>
</div>
```

Python:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
anchor='<body data-page="home">\n'
assert anchor in c
bar=open('/tmp/uysbar.html','r',encoding='utf-8').read()  # 上記HTMLを保存
c=c.replace(anchor, anchor+'\n'+bar+'\n',1)
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("告知バー挿入OK")
PYEOF
```

- [ ] **Step 2: main.js に閉じる挙動（localStorage保持）を追加**

`main.js` 末尾に以下を追記:
```js
// ===== UYS告知バー: 閉じる状態を保持 =====
document.addEventListener("DOMContentLoaded", function () {
  var bar = document.getElementById("uysBar");
  var closeBtn = document.getElementById("uysBarClose");
  if (!bar || !closeBtn) return;
  if (localStorage.getItem("uysBarClosed") === "1") {
    bar.hidden = true;
    return;
  }
  closeBtn.addEventListener("click", function () {
    bar.hidden = true;
    localStorage.setItem("uysBarClosed", "1");
  });
});
```

- [ ] **Step 3: 検証**

```bash
node --check main.js && echo "OK"
grep -c 'id="uysBar"' index.html   # 期待値: 1
```
ローカルサーバで: バーが最上部に表示 → × で消える → リロードしても消えたまま、を確認。

- [ ] **Step 4: コミット**

```bash
git add -A && git commit -m "追加: UYS告知バー（sticky・localStorageで閉じ状態保持）"
```

---

### Task 8: 結果報告セクション（The Dance Summit 2026）を Hero 直下に追加

**Files:**
- Modify: `index.html`（`</section>` of `#hero`（208行相当）の直後）

- [ ] **Step 1: Hero 直後に Result Report セクションを挿入**

挿入HTML（写真は提供までプレースホルダ `award_flag.jpg`。**本文は確定文言が来るまで仮**＝Phase 3/4 で差し替え）:
```html
  <!-- ========== Result Report ========== -->
  <section id="result" class="resultReport">
    <div class="resultReport__inner">
      <p class="resultReport__kicker">FINAL REPORT</p>
      <h2 class="resultReport__title">The Dance Summit 2026</h2>
      <div class="resultReport__stats">
        <div class="resultStat"><div class="resultStat__label">結果</div><div class="resultStat__value">ファイナル進出</div></div>
        <div class="resultStat"><div class="resultStat__label">順位</div><div class="resultStat__value">世界 8 位</div></div>
        <div class="resultStat"><div class="resultStat__label">開催地</div><div class="resultStat__value">Orlando, FL</div></div>
      </div>
      <div class="resultReport__photo">
        <img src="./assets/photos/award_flag.jpg" alt="The Dance Summit 2026 でのPOM PUPPYS bright">
      </div>
      <div class="resultReport__body">
        <p>世界最高峰の舞台、米国「The Dance Summit 2026」。POM PUPPYS bright は予選を勝ち抜き、ファイナルの舞台に立つことができました。結果は世界8位。小さなチームの大きな挑戦が、世界に届いた瞬間でした。</p>
        <p>ここまで来られたのは、応援し、支えてくださったすべての皆さまのおかげです。</p>
        <p class="resultReport__thanks">応援してくださった皆さま、本当にありがとうございました。</p>
      </div>
    </div>
  </section>
```

Python:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
# Heroセクションの閉じタグ直後（About開始コメントの直前）に挿入
import re
anchor='<!-- ========== About POM PUPPYS ========== -->'
assert anchor in c
block=open('/tmp/result.html','r',encoding='utf-8').read()
c=c.replace(anchor, block+'\n\n  '+anchor,1)
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("Result Report挿入OK")
PYEOF
```

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c 'id="result"' index.html   # 期待値: 1
git add -A && git commit -m "追加: The Dance Summit 2026 結果報告セクション（世界8位）"
```

---

### Task 9: Next Stage（UYS Showcase 紹介）セクションを本文中央付近に追加

**Files:**
- Modify: `index.html`（`#road`（アーカイブ）セクションの直前 = FAQ より前、Media/Photos の流れの中。`uys遷移.md` の構成では Road の前後どちらでも可。ここでは Road アーカイブの**直前**に置く）

- [ ] **Step 1: Road セクションの直前に Next Stage を挿入**

挿入HTML:
```html
  <!-- ========== Next Stage: UYS Showcase ========== -->
  <section id="next-stage" class="nextStage">
    <div class="nextStage__inner">
      <p class="nextStage__kicker">REBORN</p>
      <h2 class="nextStage__title">UYS Showcase</h2>
      <p class="nextStage__sub">unite your smiles</p>
      <p class="nextStage__body">POM PUPPYS は、UYS Showcase に生まれ変わりました。ポンに加えてジャズ・ヒップホップへとジャンルを広げ、シニア世代まで踊れる新しい集団として、笑顔をひとつにする活動を始めます。</p>
      <a class="nextStage__btn" href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer">UYS Showcase 公式サイトへ →</a>
      <p class="nextStage__teams">POMPUPPYS angel ・ fairy ・ bright ・ Courage（新）／ Glaze（ジャズ・新）／ ヒップホップ（募集中）</p>
    </div>
  </section>
```

Python:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
anchor='<!-- ========== Road to the World（アーカイブ） ========== -->'
assert anchor in c, "Roadアーカイブのコメントが見つからない（Task3未完？）"
block=open('/tmp/nextstage.html','r',encoding='utf-8').read()
c=c.replace(anchor, block+'\n\n  '+anchor,1)
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("Next Stage挿入OK")
PYEOF
```

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c 'id="next-stage"' index.html   # 期待値: 1
git add -A && git commit -m "追加: Next Stage（UYS Showcase 紹介・大型CTA）"
```

---

# Phase 3: コピー・ナビ・メタ情報の差し替え

### Task 10: ナビゲーションを更新

**Files:** `index.html`（nav, 170〜178行）

- [ ] **Step 1: nav-list を差し替え**

旧（170〜177行）を以下に置換:
```html
        <nav class="nav" id="nav" aria-label="メインナビゲーション">
            <ul class="nav-list">
                <li><a href="#result">Result</a></li>
                <li><a href="#story">Story</a></li>
                <li><a href="#sponsorsSection">Sponsors</a></li>
                <li><a href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer">UYS ↗</a></li>
                <li><button id="shareBtn" class="btn btn-small" type="button" aria-label="このページを共有する">共有</button></li>
            </ul>
        </nav>
```

Python（厳密一致置換。実装時は現行の `<nav ...>`〜`</nav>` を `/tmp/nav_old.html` に控えてから置換）:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
old=open('/tmp/nav_old.html').read(); new=open('/tmp/nav_new.html').read()
assert old in c, "現行navが一致しない"
c=c.replace(old,new,1)
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("nav更新OK")
PYEOF
```

- [ ] **Step 2: 検証＆コミット**

```bash
grep -c 'uys-showcase.com' index.html   # 告知バー/NextStage/nav で 3以上
git add -A && git commit -m "Header: ナビを Result/Story/Sponsors/UYS/共有 に更新"
```

---

### Task 11: Hero コピーを「世界8位、ありがとう。」に更新

**Files:** `config.js`（`copy.hero` 258〜263行）, `index.html`（hero CTA 196〜199行, heroの初期表示テキスト）

- [ ] **Step 1: config.js の copy.hero を更新**

`config.js` の該当ブロックを置換（**ASCII二重引用符を本文に入れないこと**）:
```js
    hero: {
      kicker: "The Dance Summit 2026 - Final Report",
      headline: "世界8位、ありがとう。",
      lead: "たくさんの方に支えられて、ファイナルの舞台に立てました。",
      sub: "そして POM PUPPYS は、UYS Showcase へと生まれ変わります。"
    },
```

Python:
```bash
python3 - <<'PYEOF'
with open('config.js','r',encoding='utf-8') as f: c=f.read()
old='''    hero: {
      kicker: "Saitama - Kasukabe",
      headline: "笑顔で踊る、世界へ挑む。",
      lead: "悔しさを転機に、「楽しむ」を取り戻した私たち。",
      sub: "埼玉・春日部で活動するチアダンスチーム「POM PUPPYS bright」。JAMfest JAPAN 2025 で1位を獲得し、世界最高峰の舞台、米国「The Dance Summit 2026」への切符を掴みました。"
    },'''
new='''    hero: {
      kicker: "The Dance Summit 2026 - Final Report",
      headline: "世界8位、ありがとう。",
      lead: "たくさんの方に支えられて、ファイナルの舞台に立てました。",
      sub: "そして POM PUPPYS は、UYS Showcase へと生まれ変わります。"
    },'''
assert old in c, "copy.heroが一致しない"
c=c.replace(old,new,1)
with open('config.js','w',encoding='utf-8') as f: f.write(c)
print("copy.hero更新OK")
PYEOF
node --check config.js && echo "config OK"
```

- [ ] **Step 2: index.html の Hero CTA を更新**

旧（196〜199行）:
```html
        <div class="heroCta">
          <a href="#team" class="btn btn-primary">チームを見る</a>
          <a href="./project-world-challenge.html" class="btn btn-secondary">Road to the World</a>
        </div>
```
新:
```html
        <div class="heroCta">
          <a href="#result" class="btn btn-primary">結果を見る ↓</a>
          <a href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">UYS Showcase へ ↗</a>
        </div>
```

Python: 上記 old/new を厳密一致置換。

- [ ] **Step 3: 検証**

```bash
node --check config.js && echo "OK"
python3 -c "import json"   # ダミー
```
ローカルサーバで Hero に「世界8位、ありがとう。」が表示され、コンソールエラー無し（`window.PUPPYS_CONFIG` 定義確認）。

- [ ] **Step 4: コミット**

```bash
git add -A && git commit -m "Hero: コピーを『世界8位、ありがとう。』＋UYS導線に更新"
```

---

### Task 12: タイムライン・News の更新

**Files:** `config.js`（`copy.timeline` 301行, `news` 配列先頭 107行）

- [ ] **Step 1: timeline の 2026.5 を結果反映に更新**

Python:
```bash
python3 - <<'PYEOF'
with open('config.js','r',encoding='utf-8') as f: c=f.read()
old='{ year: "2026.5", text: "　The Dance Summit へ挑戦予定", highlight: true }'
new='{ year: "2026.5", text: "　The Dance Summit ファイナル進出・<strong>世界8位</strong>", highlight: true }'
assert old in c
c=c.replace(old,new,1)
with open('config.js','w',encoding='utf-8') as f: f.write(c)
print("timeline更新OK")
PYEOF
node --check config.js && echo "OK"
```

- [ ] **Step 2: news 配列の先頭に世界8位記事を追加**

`news: [` の直後に以下を挿入（**日付は実日付に要置換**。仮 `2026-05-XX`）:
```js
    {
      date: "2026-05-XX",
      tag: "RESULT",
      title: "The Dance Summit 2026 ファイナル進出・世界8位",
      body: "応援いただいた皆さまのおかげでファイナルの舞台に立ち、世界8位を獲得しました。心より感謝申し上げます。",
      url: "#result"
    },
```

Python:
```bash
python3 - <<'PYEOF'
with open('config.js','r',encoding='utf-8') as f: c=f.read()
anchor='  news: [\n'
assert anchor in c
item='''    {
      date: "2026-05-XX",
      tag: "RESULT",
      title: "The Dance Summit 2026 ファイナル進出・世界8位",
      body: "応援いただいた皆さまのおかげでファイナルの舞台に立ち、世界8位を獲得しました。心より感謝申し上げます。",
      url: "#result"
    },
'''
c=c.replace(anchor, anchor+item, 1)
with open('config.js','w',encoding='utf-8') as f: f.write(c)
print("news追加OK（日付は要確定）")
PYEOF
node --check config.js && echo "OK"
```

- [ ] **Step 3: コミット**

```bash
git add config.js && git commit -m "News/Timeline: 世界8位の結果を追加（日付は後日確定）"
```

---

### Task 13: FAQ・Contact・Footer・各リード文を感謝/過去形トーンに更新

**Files:** `index.html`（FAQ 600〜650, Contact 661〜700, Footer 772〜789）, `config.js`（FAQが config 駆動の場合は該当データ）

> FAQ の描画元を確認: `grep -n "faq" main.js`（`initFAQ` がHTML直書きか config 駆動かで編集対象が変わる）。`index.html` の `#faq` 内が静的なら HTML を、config 駆動なら該当データを編集する。

- [ ] **Step 1: Contact カードのリンク先を UYS に変更**

`index.html` Contact 内:
- 「協賛・応援出演」カード（`id="sponsorPageLink"`, href `./sponsor.html`）→ `https://uys-showcase.com`（`target="_blank" rel="noopener noreferrer"` 付与）
- **両カードとも UYS へ遷移する**（協賛＋お問い合わせ。決定済み）
- 「お問い合わせ」カード（`id="contactMailLink"`）→ **`https://uys-showcase.com`**（決定済み：メールではなくUYSへ遷移。`target="_blank" rel="noopener noreferrer"` 付与）

Python（協賛カードのみ変更例）:
```bash
python3 - <<'PYEOF'
with open('index.html','r',encoding='utf-8') as f: c=f.read()
old='<a id="sponsorPageLink" href="./sponsor.html" class="contactCard">'
new='<a id="sponsorPageLink" href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer" class="contactCard">'
assert old in c
c=c.replace(old,new,1)
with open('index.html','w',encoding='utf-8') as f: f.write(c)
print("協賛カード→UYS OK")
PYEOF
```
注: `wireLinks()`（main.js:1078）が `sponsorPageLink` の href を config から上書きしている可能性がある。`grep -n "sponsorPageLink" main.js` で確認し、上書きしているなら config.js 側（`pages.sponsor`）も `https://uys-showcase.com` に変更するか、main.js の該当上書きを外す。

- [ ] **Step 2: Footer に UYS リンクを追加（teams.html は Task1 で削除済み）**

`index.html` Footer の `© POM PUPPYS bright（ポンパピーズブライト）` 行の直後に:
```html
    <div style="margin-top: 8px;">
      POM PUPPYS は <a href="https://uys-showcase.com" target="_blank" rel="noopener noreferrer" style="color: #6b3fa0; font-weight:700;">UYS Showcase</a> に生まれ変わりました
    </div>
```

- [ ] **Step 3: FAQ を過去形/UYS誘導に書き換え**

`uys遷移.md` §4.6 の4問に従い、`The Dance Summit 2026とは？`→過去形（世界8位）、`小学校低学年でも参加できますか？`→「メンバー募集は UYS Showcase で」、`協賛や支援は？`→「協賛のご相談は UYS Showcase へ」、活動場所→「現在は UYS Showcase の一員として活動」追記。
編集対象は Step冒頭の `grep` で判明した FAQ の実体（HTML直書き or config）。**config の場合は ASCII引用符厳禁**。編集後 `node --check config.js`。

- [ ] **Step 4: 各セクションのリード文を感謝トーンに（任意・軽微）**

`index.html` の Sponsors/Supporters/Media の `<p>` リード文、または config の `sponsors.note`/`supporters.note`/`media.note` を感謝トーンへ（`uys遷移.md` §4.8）。

- [ ] **Step 5: 検証＆コミット**

```bash
node --check config.js && echo "OK"
grep -c "teams.html" index.html        # 期待値: 0（Task1で削除済を再確認）
git add -A && git commit -m "Copy: FAQ/Contact/Footer/リード文を感謝・過去形トーンとUYS導線に更新"
```

---

### Task 14: SEO メタ・JSON-LD・sitemap の更新

**Files:** `index.html`（`<head>` 1〜159: title, meta description, OGP, JSON-LD）, `sitemap.xml`

- [ ] **Step 1: title / meta description / OGP を「世界8位・報告」基調に更新**

`grep -n "<title>\|og:title\|og:description\|name=\"description\"" index.html` で対象行を特定。
- `<title>`: 例 `POM PUPPYS bright｜The Dance Summit 2026 世界8位 / UYS Showcase へ`
- description: 「JAMfest JAPAN 1位、The Dance Summit 2026 世界8位。POM PUPPYS bright の世界大会報告と、新団体 UYS Showcase のご案内。」
「世界へ挑む」系の未来表現を過去/報告表現へ。

- [ ] **Step 2: JSON-LD を整合**

`<script type="application/ld+json">`（41行〜）内の Event/FAQPage を確認。Event は終了済みのため `eventStatus` を `https://schema.org/EventScheduled` のまま残すのは不適切 → 終了表現に。FAQPage の質問・回答を Task13 と一致させる。`python3 -c "import json,re; ..."` でJSON-LDが妥当なJSONか検証。

- [ ] **Step 3: sitemap.xml の lastmod 更新**

全 `<lastmod>` を本日付 `2026-05-29`（実施日）に更新。末尾改行を保持（CLAUDE.md のsitemap事故対策）。
```bash
python3 - <<'PYEOF'
import re
with open('sitemap.xml','r',encoding='utf-8') as f: c=f.read()
c=re.sub(r'<lastmod>.*?</lastmod>','<lastmod>2026-05-29</lastmod>',c)
if not c.endswith('\n'): c+='\n'
with open('sitemap.xml','w',encoding='utf-8') as f: f.write(c)
print("sitemap lastmod更新OK")
PYEOF
python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml'); print('XML OK')"
```

- [ ] **Step 4: 検証＆コミット**

```bash
python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml'); print('OK')"
git add -A && git commit -m "SEO: title/description/OGP/JSON-LD/sitemap を世界8位・UYS基調に更新"
```

---

# Phase 4: 写真・最終文言の差し替え（素材受領後・ブロック）

> `uys遷移.md` §8 の素材が揃うまで着手不可。揃ったら実施。

### Task 15: 受領素材で差し替え

**Files:** `index.html`（hero `#heroPhoto`, `#result` の写真）, `config.js`（`siteImages.heroImage` / `news` の日付）, `assets/`（新規画像）

- [ ] **Step 1: 世界大会 Hero 写真を配置・差し替え**

受領写真を `assets/photos/world_hero.jpg` 等で配置し、`config.js` の `siteImages.heroImage` と index.html の `#heroPhoto` src を更新。

- [ ] **Step 2: Result セクションの写真を差し替え**

`#result` 内 `award_flag.jpg` プレースホルダを受領写真に差し替え。複数枚あれば簡易ギャラリー化（CSSは Task6 の `.resultReport__photo` を流用、複数なら横並びdivを追加）。

- [ ] **Step 3: UYS ロゴを配置（任意）**

`assets/uys-logo.png` を配置し、Next Stage の見出し上にロゴ `<img>` を追加。

- [ ] **Step 4: 振り返り本文・News日付を確定文言に差し替え**

Task8 の `resultReport__body` 仮文言と、Task12 の `news` 日付 `2026-05-XX` を確定値へ。`node --check config.js`。

- [ ] **Step 5: 検証＆コミット**

```bash
node --check config.js && echo "OK"
git add -A && git commit -m "写真・最終文言を確定素材に差し替え"
```

---

# 完了後: マージ

### Task 16: プレビュー確認とマージ

- [ ] **Step 1: プッシュして Cloudflare プレビューで全画面確認**

```bash
git push -u origin feature/uys-transition
```
Cloudflare プレビューURLで: 告知バー / Hero / Result / Next Stage / Road アーカイブ / FAQ / Contact / Footer / 全CTAの遷移先（uys-showcase.com）/ コンソール無エラー / モバイル表示 を確認。

- [ ] **Step 2: main にマージ**

```bash
git checkout main && git merge feature/uys-transition && git push origin main
```

- [ ] **Step 3: Search Console でサイトマップ再送信**（CLAUDE.md手順）

teams.html を削除したため、Search Console → サイトマップ → 再送信し、teams.html のインデックス削除を確認。

---

## Self-Review チェック結果

- **Spec coverage**: `uys遷移.md` §2 の全項目（告知バー=Task7 / Hero=Task11 / Result=Task8 / About削除→※下記 / Coaches削除=Task5 / Story=Task12 / News=Task12 / Team維持 / 活動カレンダー削除=Task2 / Photos維持 / Instagram=Task4 / Road archive=Task3 / Next Stage=Task9 / FAQ=Task13 / Contact=Task13 / Sponsors系維持+リード=Task13 / Footer=Task13 / SEO=Task14）。
  - **未カバー検出 → 要判断**: §2 で「About POM PUPPYS【削除】（3チーム紹介はUYS側へ）」とあるが、本プランは About の teams.html ボタンのみ削除し**Aboutセクション自体は残している**。About を丸ごと削除するか、文面を「UYS の一員」に更新して残すか判断が必要（Task5 に倣い `id="about"` セクション削除タスクを追加可能）。
- **Placeholder scan**: 仮値は2点のみで明示済み（Result本文＝Phase4で確定 / News日付 `2026-05-XX`＝要確定）。それ以外にTBD無し。
- **Type consistency**: 新規ID（`uysBar`,`uysBarClose`,`result`,`next-stage`）とCSSクラス（`uysBar*`,`resultReport*`,`nextStage*`,`roadSection__grid--single`）はTask6で定義しTask7-9で使用、一致。削除対象ID（`roadProgressBar`等）は検証stepで0件確認。

## 確認が必要な判断（実装前）→ 全て決定済み（2026-05-29）

1. ~~About セクション~~ → **丸ごと削除**（Task 5B 追加）
2. ~~Contact「お問い合わせ」カード~~ → **UYS外部リンクに変更**（Task13 Step1、両カードともUYSへ）
3. ~~新規セクションの実装方式~~ → **静的HTMLで実装**（config.js連動にしない）
4. ~~`uys-showcase.com` の公開状態~~ → **仮ページとして閲覧可能**＝CTAは404にならない
