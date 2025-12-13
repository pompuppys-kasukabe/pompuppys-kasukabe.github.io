/* config.js
  ✅運用は基本このファイルだけ編集
  - 確定日: "YYYY-MM-DD"（表示は自動で YYYY.MM.DD）
  - 月のみ: "YYYY-MM"（表示は YYYY.MM）
  - 未確定: ""（空文字）←これが最も綺麗で安全
  - pin:true を付けるとNEWSの先頭に固定表示
*/

window.PUPPYS_CONFIG = {
  brand: {
    nameMain: "POM PUPPYS",
    nameSub: "bright", // ★小文字固定
    star: "★",
    tagline: "Official Site"
  },

  pages: {
    home: "./index.html",
    project: "./project-world-challenge.html"
  },

  contact: {
    email: "example@example.com"
  },

  // SNS（未設定なら空でOK。空は自動非表示）
  social: {
    x: "",
    instagram: "",
    youtube: ""
  },

  // メディアキット（未設定なら空でOK。空は自動非表示/準備中表示）
  mediaKit: {
    kitUrl: "",
    photosUrl: "",
    logoUrl: ""
  },

  // =========================================================
  // HOME: NEWS
  // =========================================================
  news: [
    {
      pin: true,
      date: "2025-12-28",
      tag: "SCHEDULE",
      title: "USA Regionals 埼玉大会に出場します",
      body: "POM PUPPYS bright は、12/28開催の USA Regionals 埼玉大会に出場予定です。日々の練習の成果を出せるよう、チーム一丸で準備を進めています。"
    },
    {
      date: "2026-03-15",
      tag: "EVENT",
      title: "PUPPYS 発表会（ふじみ野合同）に出演します",
      body: "3/15は PUPPYS 発表会に出演予定です。ふじみ野合同でのステージを通して、日頃の感謝と成長の姿をお届けします。"
    },
    {
      // 未確定は空文字にする（表示されません）
      date: "2025-11-03",
      tag: "HIGHLIGHT",
      title: "JAMfestで大きく躍進。次の舞台へ",
      body: "挑戦5年目。演技の向き合い方を整え直し、JAMfestで大きく躍進しました。支えてくださる皆さまへの感謝を胸に、次の舞台へ向けて準備を進めます。"
    },
    {
      date: "2025-10",
      tag: "REPORT",
      title: "JCDA 関東大会を振り返って（転機）",
      body: "思うような結果に届かなかった経験を、次へつなげる転機にしました。原点の「楽しむ」に立ち返り、表情やチームの空気づくりまで含めて立て直しを進めています。"
    },
    {
      date: "",
      tag: "UPDATE",
      title: "The Dance Summit 2026 に向けて始動",
      body: "POM PUPPYS bright は The Dance Summit 2026 に向けて本格始動しました。練習の様子や活動の進捗は、このNEWSで定期的にお知らせします。"
    }
  ],

  // =========================================================
  // PROJECT: 進捗表示＋活動報告（特設）
  // =========================================================
  project: {
    goalYen: 1000000,
    currentYen: 0,
    endDate: "2026-03-31",

    crowdfundingUrl: "https://example.com",

    share: {
      title: "POM PUPPYS ★bright",
      text: "The Dance Summit 2026 への挑戦｜応援・取材はこちら"
    },

    updates: [
      {
        date: "",
        tag: "UPDATE",
        title: "練習の積み上げ（準備中）",
        body: "表情・空気・ライン。『楽しむ』を軸に、演技を整える練習を重ねています。"
      },
      {
        date: "",
        tag: "TRAINING",
        title: "USA Regionalsに向けた仕上げ（準備中）",
        body: "ルーティンの精度と一体感を高めています。"
      },
      {
        date: "",
        tag: "CHALLENGE",
        title: "The Dance Summit 2026 への挑戦",
        body: "挑戦の背景と進捗は、必要な範囲で継続的に更新します（未成年保護を優先）。"
      }
    ]
  }
};
