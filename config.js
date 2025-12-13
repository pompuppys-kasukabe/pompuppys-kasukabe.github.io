/* config.js */
window.PUPPYS_CONFIG = {
  // OGPなどで使う（後で差し替えOK）
  siteUrl: "", // 例: "https://example.github.io/puppys/"
  ogImageUrl: "./assets/ogp.jpg",
  ogImageUrlProject: "./assets/ogp.jpg",

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
