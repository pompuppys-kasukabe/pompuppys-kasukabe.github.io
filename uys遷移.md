# UYS Showcase 移行に伴うサイト改修方針

**対象サイト**: `pompuppys-kasukabe.github.io` (POM PUPPYS bright 公式)
**作成日**: 2026-05-29

---

## ⚠️ 実装前の必須チェック（ブロッカー）

> 以下はコード検証(2026-05-29)で判明した、着手前に必ず潰すべき項目。

1. **`uys-showcase.com` の本番公開状態を確認**（最重要）
   本ページは全導線（告知バー・Hero・Next Stage・FAQ・Contact）が `https://uys-showcase.com` に着地する。**ドメイン未公開だと全CTAが404**になる。新サイト実体は `/Users/satmba/projects/UYSshowcase/official-site` にあるが、本番ドメイン稼働を要確認。
2. **`teams.html` 削除は3ファイル連動**（過去事故と同型の罠）
   - `index.html:237`（Hero/CTA「チームを見る」系リンク）→ §4.2のCTA変更で除去
   - `index.html:776`（フッターリンク）→ §4.9で除去
   - `sitemap.xml:7`（`<loc>.../teams.html</loc>`）→ **削除必須**。CLAUDE.md記載の「ファイル削除→サイトマップ読み込みエラー」事故と同型。
3. **`config.js` 追記時の引用符事故**（CLAUDE.md既知事故）
   新規 `worldResult.body` / `uys` の和文に ASCII の `"` を使うと **window.PUPPYS_CONFIG が壊れ全動的コンテンツが真っ白**になる。引用は必ず `「」『』` を使用。

---

## 1. 改修の背景と目的

- The Dance Summit 2026 が終了（**ファイナル進出・世界8位**）
- POM PUPPYS は新団体 **UYS Showcase（unite your smiles, https://uys-showcase.com）** に生まれ変わる
- UYS Showcase は ポン／ジャズ／ヒップホップの多ジャンル化＋シニアカテゴリ新設
  - チア: POMPUPPYS angel / fairy / bright / **Courage（新・高校生以上）**
  - ジャズ: **Glaze（新・中学生）**
  - ヒップホップ: 募集中
- bright はチーム名そのままで UYS 傘下を継続
- 既存サイトは **スポンサーリンクが指している** ため URL／ドメイン維持
- 本サイトの位置付け: **「POM PUPPYS bright 世界大会報告ページ＋アーカイブ＋UYS への導線」**
- メンバー募集・協賛問い合わせ等の新規アクションは **UYS Showcase 側に一本化**

---

## 2. ページ構成（採用：ハイブリッド案）

```
0.  UYS告知バー        【新規】 全ページ最上部・常時表示
1.  Header              【変更】 ナビを「Result / Story / Sponsors / UYS↗ / 共有」に
2.  Hero                【変更】 「世界8位、ありがとう。」軸／写真差し替え予定
3.  Result Report       【新規】 The Dance Summit 2026 結果（Hero直下）
×   About POM PUPPYS    【削除】 3チーム紹介はUYS側へ
×   Coaches             【削除】 1人退任のため
4.  Our Story           【更新】 タイムラインに「2026.5 世界8位」追加
5.  News                【更新】 先頭に世界8位RESULT記事を追加
6.  Team                【維持】 brightメンバーSwiper = 世界大会スクワッドとして保存
×   活動カレンダー       【削除】 セクションごと除去
7.  Photos              【維持】 Swiper（世界大会写真を後日追加予定）
8.  Instagram           【変更】 カルーセル削除、外部リンクボタンのみに
9.  Road to the World   【アーカイブ化】 バー/カウンター/モザイク/CTA全削除、完走報告だけ残す
10. Next Stage: UYS     【新規】 UYS Showcase 紹介＋大型CTA
11. FAQ                 【更新】 UYS への誘導 or 過去形に書き換え
12. Contact             【更新】 3カード維持、協賛/問い合わせ先をUYSへ
13. Sponsors            【維持】 リード文を感謝トーンに
14. Sponsor Topics      【維持】
15. Supporters          【維持】 リード文を感謝トーンに
16. Media               【維持】 リード文を感謝トーンに
17. Footer              【変更】 UYSリンク追加、teams.htmlリンク削除
```

---

## 3. 新規セクション3つの仕様

> **注意**: 本節で `config.js` に追記する和文（`worldResult.body`・`uys` の本文等）は、ASCII二重引用符 `"` を含めないこと。`「」『』` を使う。混入すると config.js が壊れサイト全体が空白化する（CLAUDE.md既知事故）。


### 3.1 UYS告知バー（全ページ最上部）

- 紫グラデ（#6b3fa0 → #8b5fbf）、白文字
- 文言: **「POM PUPPYS は UYS Showcase として生まれ変わりました」**
- ボタン: **「新サイトを見る →」**（白背景・紫文字・角丸）
- リンク先: `https://uys-showcase.com`
- 右端に閉じる × ボタン（localStorage で状態保持）
- モバイル短縮: **「UYS Showcase として生まれ変わりました →」**
- `position: sticky` で常時上部固定

### 3.2 The Dance Summit 2026 結果報告（Hero直下・新規）

- 背景: 濃紺グラデ（#1a1a2e → #16213e）、白文字、ゴールド差し色（#d4af37）
- 構成（中央寄せ）:
  - キッカー: **`FINAL REPORT`**
  - 見出し: **`The Dance Summit 2026`**
  - 3カラム指標:
    - 結果: **ファイナル進出**
    - 順位: **世界 8 位**
    - 場所: **Orlando, FL**
  - 写真（世界大会の新写真。提供までは `award_flag.jpg` をプレースホルダ）
  - 振り返り本文（2〜3段落、コーチ／チームコメント、感謝メッセージ）
  - 「**応援してくださった皆さま、ありがとうございました**」を必ず含む
- `config.js` に `worldResult` キーを新設（順位・写真・本文・コメント等）

### 3.3 Next Stage: UYS Showcase（本文中央付近・新規）

- 背景: 白〜薄ゴールドグラデ＋紫枠（border 2px #6b3fa0）
- 構成（中央寄せ）:
  - キッカー: **`REBORN`**
  - 見出し: **`UYS Showcase`**
  - サブ: **`unite your smiles`**（イタリック・紫）
  - 本文: **「POM PUPPYS は、UYS Showcase に生まれ変わりました。ポンに加えてジャズ・ヒップホップへとジャンルを広げ、シニア世代まで踊れる新しい集団として、笑顔をひとつにする活動を始めます。」**
  - 大型CTAボタン: **「UYS Showcase 公式サイトへ →」**（紫背景・白文字・角丸）→ `https://uys-showcase.com`
  - 補足: **`POMPUPPYS angel ・ fairy ・ bright ・ Courage（新）／ Glaze（ジャズ・新）／ ヒップホップ（募集中）`**
- `config.js` に `uys` キーを新設（URL・コンセプト・チーム一覧）
- UYS ロゴ画像を `assets/uys-logo.png` 等で受領後に追加

---

## 4. 既存セクションの変更詳細

### 4.1 Header ナビ

| Before | After |
|---|---|
| Road to the World / Media / Sponsor / Contact / 共有 | **Result / Story / Sponsors / UYS↗ / 共有** |

- 「UYS↗」は外部リンクアイコン付き（`target="_blank"`）
- Media / Sponsor は Contact セクション内のカードからアクセス可能なため省略

### 4.2 Hero

| 項目 | Before | After |
|---|---|---|
| Kicker | Saitama - Kasukabe | **The Dance Summit 2026 - Final Report** |
| H1 | 笑顔で踊る、世界へ挑む。 | **世界8位、ありがとう。** |
| Lead | 悔しさを転機に、「楽しむ」を取り戻した私たち。 | **たくさんの方に支えられて、ファイナルの舞台に立てました。** |
| Sub | （空） | **そして POM PUPPYS は、UYS Showcase へと生まれ変わります。** |
| CTA | [チームを見る] [Road to the World] | **[結果を見る ↓] [UYS Showcase へ ↗]** |
| 画像 | jam.jpg | 世界大会の新写真（提供待ち。当面 `award_flag.jpg`） |

### 4.3 Our Story（タイムライン追加）

`config.copy.timeline` 配列の末尾：

```js
// Before
{ year: "2026.5", text: "　The Dance Summit へ挑戦予定", highlight: true }

// After
{ year: "2026.5", text: "　The Dance Summit ファイナル進出・<strong>世界8位</strong>", highlight: true }
```

本文は現状維持。

### 4.4 News（記事追加）

`config.news` の先頭に追加：

```js
{
  date: "2026-05-?",  // 実日付に置換
  tag: "RESULT",
  title: "The Dance Summit 2026 ファイナル進出・世界8位",
  body: "応援いただいた皆さまのおかげでファイナルの舞台に立ち、世界8位を獲得しました。心より感謝申し上げます。",
  url: "#result"
}
```

### 4.5 Road to the World（アーカイブ化）

**削除するもの**:
- クラファン進捗バー（`#roadProgressBar`）
- #BrightWings1000 カウンター（`#messageCount`, `#progressBarFill`）
- モザイク表示（GO! BRIGHT!!）
- 「応援メッセージを送る」Tally ボタン（`data-tally-open="Y50Z5v"`）
- 「企業・団体スポンサーの皆様にも〜」CTA
- カウントダウンタイマー（`#countdownTimer`）
- 横断幕スポンサー募集の記述
- 直近メッセージプレビュー（`#roadMessagesPreview`）

**残すもの**:
- セクションタイトル「Road to the World」＋メインビジュアル
- クラファン完走報告: **543,000円・46名様**
- 「応援ありがとうございました」のメッセージ
- 使い道のサマリ: ご支援は渡航費用に充当しました
- 「特設ページを見る」リンク（`project-world-challenge.html` へ）

`main.js` の動的更新ロジック（カウンター取得・Tally イベント等）も併せて削除。

### 4.6 FAQ（4問の書き換え）

| 質問 | After |
|---|---|
| POM PUPPYS brightはどこで活動していますか？ | 現状維持＋「現在は UYS Showcase の一員として活動」追記 |
| 小学校低学年でも参加できますか？ | 「メンバー募集は UYS Showcase で行っています」リダイレクト |
| The Dance Summit 2026とは何ですか？ | 過去形に：「世界大会で、POM PUPPYS bright はファイナル進出・世界8位でした」 |
| 協賛や支援はどのように行えますか？ | 「協賛のご相談は UYS Showcase へ」リダイレクト |

### 4.7 Contact（3カード）

| カード | After リンク先 |
|---|---|
| メディアの方へ | `media.html`（現状維持・取材アーカイブ） |
| 協賛・応援出演 | **UYS Showcase 公式サイト（外部）** |
| お問い合わせ | **UYS Showcase 公式サイト（外部）** ※or メール |

### 4.8 Sponsors / Sponsor Topics / Supporters / Media

セクション内容自体は維持。各リード文を感謝トーンに：

- Sponsors: 「世界大会への挑戦をご支援いただいたスポンサーの皆様」
- Supporters: 「応援いただいた企業・団体の皆様」
- Media: 「取材・掲載いただいたメディアの皆様」

### 4.9 Footer

- 「© POM PUPPYS bright（ポンパピーズブライト）」
- **「POM PUPPYS は UYS Showcase に生まれ変わりました → 公式サイト」**を追加
- teams.html へのリンクを **削除**
- Instagram／取材窓口メールは維持

---

## 5. 削除対象ファイル

- `teams.html`（メンバーが変わり写真の流用も不可、UYS 側で別途作成）
  - **連動削除（3箇所）**: `index.html:237`（Hero/CTAリンク）・`index.html:776`（フッターリンク）・`sitemap.xml:7`（loc登録）
  - sitemap からの削除を忘れると検索インデックスでエラー（CLAUDE.md記載の過去事故と同型）
- 関連: `assets/photos/teams/` 配下の不要画像（必要なら整理）
- `messages.html` / `messages-all.html`: **アーカイブとして残す**（送信フォーム・カウンターは無効化）

---

## 6. SEO・メタタグ更新（要対応・未確定）

- `<title>`、meta description、OG タグの**「世界へ挑む」**→**「世界8位／報告ページ」**へ書き換え
- JSON-LD（schema.org）:
  - `Event` の `The Dance Summit 2026` を `eventStatus: EventScheduled` → `EventScheduled` のまま、`endDate` 経過後の自然形に
  - FAQPage の質問・回答を 4.6 と整合
- sitemap.xml の lastmod 更新 ＋ **`teams.html` のエントリ（line 7）を削除**（削除ファイルがsitemapに残ると読み込みエラー）
- 各ページの canonical 確認

---

## 7. UYS Showcase 導線まとめ（A + C + E 構成）

| # | 場所 | 形式 |
|---|---|---|
| A | 全ページ最上部 | 告知バー（常時） |
| C | 本文中央付近 | Next Stage セクション（広告） |
| E | フッター | リンク（保険） |

加えて Hero / Header ナビ / Contact カード / FAQ からも UYS へ自然導線。

---

## 8. 写真・素材の提供待ち項目

- [ ] 世界大会の Hero 用写真（Heroの差し替え）
- [ ] 結果報告セクション用写真（複数枚あれば望ましい）
- [ ] UYS Showcase ロゴ（透過PNG推奨）
- [ ] 振り返り本文の最終確定文言（コーチ／チームコメント等）
- [ ] News に追加する世界大会報告の正確な日付

---

## 9. 次のステップ（実装計画作成へ）

未対応：
- **設計④**: SEO・メタタグの詳細、`config.js` の構造変更マップ、`main.js` の削除コード箇所、CSS 影響範囲、削除ファイル一覧の最終化
- **実装プラン**: writing-plans スキルで段階的な実装手順を作成
- **段階展開**: ① 削除・整理コミット → ② 新規セクション追加 → ③ コピー差し替え → ④ 写真差し替え（受領後）

---

## 10. 参考: 関連リソース

- 新団体サイト: https://uys-showcase.com
- 現サイト: https://pompuppys-kasukabe.github.io/
- 設計ブレストの履歴（ビジュアル）: `.superpowers/brainstorm/12560-1779864136/content/`
- プロジェクト履歴 / 注意点: `CLAUDE.md`
