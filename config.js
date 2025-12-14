/* config.js */
window.PUPPYS_CONFIG = {
  // Site URL (canonical / OGP). Keep trailing slash.
  siteUrl: "https://pompuppys-kasukabe.github.io/",
  ogImageUrl: "https://pompuppys-kasukabe.github.io/assets/ogp.jpg",
  ogImageUrlProject: "https://pompuppys-kasukabe.github.io/assets/ogp_project.jpg",

  // Pages（3部構成）
  pages: {
    media: "./media.html",
    project: "./project-world-challenge.html" // 公式/Mediaからはリンクしない（URL直打ちで案内）
  },

  // Media（取材導線）※Mediaにはクラファン導線を出さない設計
  mediaKitUrl: "https://drive.google.com/drive/folders/1jfploQJhKcJWmGzHVKrY2VnJykLoE-d0?usp=sharing",
  pressEmail: "moccy0306@gmail.com",
  pressContactName: "POM PUPPYS bright 保護者代表　飯田 絵里",

  // 記事用テキスト（サイト側にも同梱：コピペ1クリック用）
  mediaTexts: {
    credit: "写真クレジット：POM PUPPYS bright 提供",
    // 目安です。Drive側の03_TEXTと同じ内容に後で置き換えてOK（ここだけ編集）
    short100:
      "埼玉・春日部のチアダンスチーム「POM PUPPYS bright」。悔しさを転機に“楽しむ”へ立ち返り、演技を立て直してJAMfestで1位。The Dance Summit 2026に挑戦。",
    mid200:
      "埼玉・春日部のチアチーム「POM PUPPYS bright」（小6〜中3）が、世界最高峰「The Dance Summit 2026」に挑戦します。敗北を糧に“楽しむ原点”へ回帰し、見事JAMfestで1位を獲得。技術と心の立て直しが生んだ劇的勝利でした。ふじみ野の姉妹チームと切磋琢磨し、地域の誇りを胸に世界の頂点を目指します。",
    long400:
      "「勝つため」ではなく「踊ることを楽しむ」原点へ。その劇的な意識改革が、強豪ひしめく「JAMfest JAPAN」第1位という快挙を手繰り寄せました。 埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」（小6〜中3）は、この優勝を弾みに、世界最高峰の舞台、米国「The Dance Summit 2026」への切符を掴みました。 直前の大会での敗北という試練。どん底の中で技術だけでなく、表情やチームの空気感まで全てを見つめ直し、彼女たちは生まれ変わりました。ふじみ野発祥の姉妹チームの系譜を継ぎ、2016年の始動から苦節を乗り越え、ついに世界の扉を開いたのです。 「原点回帰」でチアの楽しさを再発見した彼女たちは、最高の笑顔を春日部から世界へ届けようとしています。困難を笑顔に変えて進む少女たちの挑戦は、見る人々に勇気と感動を与えています。"
  },

  // NEWS（dateは "YYYY-MM-DD" 推奨。空なら日付表示なし）
  news: [
    {
      date: "2025-12-28",
      tag: "EVENT",
      title: "USA Regionals 埼玉大会 出場予定",
      body: "大会クラスとして出場予定です。応援よろしくお願いします。",
      url: ""
    },
    {
      date: "2026-03-15",
      tag: "EVENT",
      title: "PUPPYS 発表会（ふじみ野合同）出演予定",
      body: "詳細は決まり次第お知らせします。",
      url: ""
    }
  ],

  // 公式サイト本文（修正はここだけでOK）
  copy: {
    hero: {
      headline: "悔しさを転機に、「楽しむ」へ。",
      lead: "胸がいっぱいになるほど悔しかった日を越えて、笑顔が戻った瞬間がありました。",
      sub: "埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」。勝ち負けだけではなく、“踊ることを楽しむ”原点に立ち返り、表情・一体感・空気づくりまで磨き直して The Dance Summit 2026 に挑戦します。"
    },
    facts: [
      { label: "拠点", value: "埼玉・春日部" },
      { label: "メンバー", value: "小学6年生〜中学3年生" },
      { label: "挑戦", value: "The Dance Summit 2026" },
      { label: "主な実績", value: "JAMfest JAPAN vol.23 in TOKYO / Junior編成 Pom部門 Small B：1位" }
    ],
    summitNote: "米国Varsity社が主催する、世界最高峰のチアダンス・ダンスの世界選手権大会。",
    about: {
      title: "POM PUPPYS bright について",
      body: [
        "POM PUPPYS brightは、埼玉・春日部を拠点に活動するチアダンスチームです。",
        "2016年に活動をスタートし、2020年から大会への挑戦を本格化しました。",
        "一人ひとりの表情とチームの一体感を大切に、日々練習を重ねています。"
      ],
      note: ""
    },
    story: {
      title: "STORY",
      body: [
        "直前の大会で悔しい結果を経験し、私たちは一度立ち止まりました。",
        "悔しさを抱えたままでは、踊る姿も硬くなってしまう——そう気づいたとき、原点の“楽しむ”に戻る決断をしました。",
        "表情、声、チームの空気づくりまで見直し、演技を一から再構築。",
        "気持ちが揃った瞬間、踊りが変わり、会場の空気も変わった感覚がありました。",
        "そのプロセスが結果につながり、JAMfestで1位を獲得。いま、次の舞台に向けて準備を進めています。"
      ],
      interviewPoints: [
        "教育：悔しさを経験し、“楽しむ”へ切り替えて伸びたプロセス",
        "地域：春日部の子どもたちが世界へ挑戦する地域のストーリー",
        "競技：表情・一体感・空気づくりまで含むチアの奥深さ",
        "家族・地域の支え：最初は参加も難しかったが、協力を得て挑戦が現実に"
      ]
    },
    timeline: [
      { year: "2016", text: "春日部で活動開始" },
      { year: "2020", text: "大会への挑戦を本格化" },
      { year: "2025", text: "演技を立て直し大きく躍進／JAMfestで1位" },
      { year: "2026", text: "The Dance Summit 2026 へ挑戦" }
    ]
  },

  // クラファン特設ページ用（設定値から自動計算）
  project: {
    title: "World Challenge Project",
    crowdfundingUrl: "", // 外部クラファンURLが決まったら入れる
    goalYen: 1000000,
    raisedYen: 0,
    endDate: "2026-03-31", // YYYY-MM-DD
    updatedAt: "2025-12-13"
  }
};
