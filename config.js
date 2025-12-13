/* config.js */
window.PUPPYS_CONFIG = {
  // Site URL (canonical / OGP). Keep trailing slash.
  siteUrl: "https://pompuppys-kasukabe.github.io/",
  ogImageUrl: "https://pompuppys-kasukabe.github.io/assets/ogp.jpg",
  ogImageUrlProject: "https://pompuppys-kasukabe.github.io/assets/ogp_project.jpg",

  // Media（取材導線）
  mediaKitUrl: "https://drive.google.com/drive/folders/1jfploQJhKcJWmGzHVKrY2VnJykLoE-d0?usp=sharing",
  pressEmail: "moccy0306@gmail.com",
  pressContactName: "POM PUPPYS bright 保護者代表　飯田 絵里",

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
      lead: "演技が変わった瞬間から、世界への道が始まりました。",
      sub: "埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」。 “表情・一体感・空気づくり”まで含めて演技を磨き、The Dance Summit 2026 に挑戦します。"
    },
    facts: [
      { label: "拠点", value: "埼玉・春日部" },
      { label: "メンバー", value: "小学6年生〜中学3年生" },
      { label: "挑戦", value: "The Dance Summit 2026" },
      { label: "主な実績", value: "JAMfest JAPAN vol.23 in TOKYO / Junior編成 Pom部門 Small B：1位" }
    ],
    about: {
      title: "POM PUPPYS bright について",
      body: [
        "POM PUPPYSは埼玉県・ふじみ野で生まれたチアダンスチームです。",
        "その流れを受けて2016年、春日部で活動が始まりました。",
        "現在は大会クラスが独立した形で活動し、少人数ならではの結束力で日々練習を重ねています。"
      ],
      // 必要なときだけ残し、不要なら空文字にしてください
      note: ""
    },
    story: {
      title: "STORY",
      body: [
        "直前の大会で悔しい結果を経験し、私たちは一度立ち止まりました。",
        "そこで勝ち負けだけではなく、“踊ることを楽しむ”原点へ立ち返ることを選びました。",
        "表情、声、チームの空気づくりまで見直し、演技を再構築。",
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
      { year: "2016", text: "春日部で活動開始（埼玉・ふじみ野発祥の流れを受ける）" },
      { year: "2020", text: "大会への挑戦を本格化" },
      { year: "2025", text: "挑戦5年目、演技を立て直し大きく躍進／JAMfestで1位" },
      { year: "2026", text: "The Dance Summit 2026 へ挑戦" }
    ]
  },

  // プロジェクト（特設ページ用：目標/現在/締切を入れるだけで自動計算）
  project: {
    title: "World Challenge Project",
    crowdfundingUrl: "", // 外部クラファンURLが決まったら入れる
    goalYen: 1000000,
    raisedYen: 0,
    endDate: "2026-03-31", // YYYY-MM-DD
    updatedAt: "2025-12-13"
  }
};
