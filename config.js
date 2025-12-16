/* config.js - サイト設定（完全版） */
window.PUPPYS_CONFIG = {
  
  // ===== 基本情報 =====
  siteUrl: "https://pompuppys-kasukabe.github.io/",
  siteName: "POM PUPPYS bright",
  siteDescription: "埼玉・春日部で活動するチアダンスチーム",
  
  ogImageUrl: "https://pompuppys-kasukabe.github.io/assets/ogp.jpg",
  ogImageUrlProject: "https://pompuppys-kasukabe.github.io/assets/ogp_project.jpg",

  // ===== ページURL =====
  pages: {
    home: "./index.html",
    media: "./media.html",
    project: "./project-world-challenge.html",
    sponsor: "./sponsor.html"
  },

  // ===== 連絡先 =====
  pressEmail: "moccy0306@gmail.com",
  pressContactName: "POM PUPPYS bright 保護者代表 飯田 絵里",
  
  // ===== 外部リンク =====
  mediaKitUrl: "https://drive.google.com/drive/folders/1jfploQJhKcJWmGzHVKrY2VnJykLoE-d0?usp=sharing",
  instagramUrl: "",

  // ===== UI設定 =====
  ui: {
    enableLightbox: true,
    showShareButton: true
  },

  // ===== メディア用テキスト =====
  mediaTexts: {
    credit: "写真クレジット：POM PUPPYS bright 提供",
    short100: "埼玉・春日部のチアダンスチーム「POM PUPPYS bright」。悔しさを転機に楽しむへ立ち返り、演技を立て直してJAMfest JAPAN 2025で1位。世界最高峰の舞台、米国「The Dance Summit 2026」に挑戦。",
    mid200: "埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」。直前の大会で悔しい結果を経験し、勝ち負けだけではなく踊ることを楽しむ原点へ。表情・一体感・空気づくりまで磨き直し、JAMfest JAPAN 2025で1位を獲得。世界最高峰の舞台、米国「The Dance Summit 2026」に向け準備を進めている。",
    long400: "「勝つため」ではなく「踊ることを楽しむ」原点へ。その劇的な意識改革が、強豪ひしめく「JAMfest JAPAN」第1位という快挙を手繰り寄せました。埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」（小6〜中3）は、この優勝を弾みに、世界最高峰の舞台、米国「The Dance Summit 2026」への切符を掴みました。直前の大会での敗北という試練。どん底の中で技術だけでなく、表情やチームの空気感まで全てを見つめ直し、彼女たちは生まれ変わりました。「原点回帰」でチアの楽しさを再発見した彼女たちは、最高の笑顔を春日部から世界へ届けようとしています。"
  },

  // ===== ニュース =====
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
    },
    {
      date: "2025-11-23",
      tag: "RESULT",
      title: "JAMfest JAPAN vol.23 in TOKYO 優勝！",
      body: "Junior編成 Pom部門 Small Bで1位を獲得し、世界最高峰の舞台、米国「The Dance Summit 2026」への出場権を獲得しました。",
      url: ""
    }
  ],

  // ===== サイト画像 =====
  siteImages: {
    heroImage: "./assets/photos/team_main.jpg",
    heroImageAlt: "POM PUPPYS bright チーム写真",

    heroVideo: {
      enabled: false,
      mp4: "",
      webm: "",
      poster: "",
      loop: true
    },

    gallery: [
      { title: "JAMfest JAPAN 2025 優勝", src: "./assets/photos/award_flag.jpg", alt: "表彰式でフラッグを掲げるチーム", size: "half" },
      { title: "チーム集合写真", src: "./assets/photos/team_01.jpg", alt: "チーム全員での集合写真", size: "half" },
      { title: "練習風景", src: "./assets/photos/practice_01.jpg", alt: "練習中の様子", size: "third" },
      { title: "演技中", src: "./assets/photos/performance_01.jpg", alt: "大会での演技", size: "third" },
      { title: "大会会場にて", src: "./assets/photos/jam.jpg", alt: "大会会場での一枚", size: "third" },
      { title: "オフショット", src: "./assets/photos/offshot_01.jpg", alt: "練習後のオフショット", size: "half" },
      { title: "みんなで記念撮影", src: "./assets/photos/offshot_02.jpg", alt: "みんなで記念撮影", size: "half" }
    ],

    members: [
      { name: "Member", src: "./assets/photos/member_01.jpg" },
      { name: "Member", src: "./assets/photos/member_02.jpg" },
      { name: "Member", src: "./assets/photos/member_03.jpg" },
      { name: "Member", src: "./assets/photos/member_04.jpg" },
      { name: "Member", src: "./assets/photos/member_05.jpg" },
      { name: "Member", src: "./assets/photos/member_06.jpg" },
      { name: "Member", src: "./assets/photos/member_07.jpg" }
    ],

    mascot: {
      enabled: true,
      src: "./assets/mascot.png",
      alt: "POM PUPPYS bright マスコット"
    }
  },

  // ===== コピー =====
  copy: {
    hero: {
      kicker: "Saitama - Kasukabe",
      headline: "笑顔で踊る、世界へ挑む。",
      lead: "悔しさを転機に、「楽しむ」を取り戻した私たち。",
      sub: "埼玉・春日部で活動するチアダンスチーム「POM PUPPYS bright」。JAMfest JAPAN 2025 で1位を獲得し、世界最高峰の舞台、米国「The Dance Summit 2026」への切符を掴みました。"
    },

    facts: [
      { label: "拠点", value: "埼玉・春日部" },
      { label: "メンバー", value: "小学6年生〜中学3年生" },
      { label: "挑戦", value: "The Dance Summit 2026" },
      { label: "主な実績", value: "JAMfest JAPAN vol.23 1位" }
    ],

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
  title: "Our Story",
  body: [
    "<strong>直前の大会で悔しい結果を経験し、私たちは一度立ち止まりました。</strong>",
    "悔しさを抱えたままでは、踊る姿も硬くなってしまう——<em>そう気づいたとき、原点の「楽しむ」に戻る決断をしました。</em>",
    "表情、声、チームの空気づくりまで見直し、<strong>演技を一から再構築。</strong>",
    "<span class=\"highlight\">気持ちが揃った瞬間、踊りが変わり、会場の空気も変わりました。</span>",
    "<strong>そして私たちは、世界最高峰の舞台、米国「The Dance Summit 2026」への挑戦権を手にしました。</strong>"
  ]
},


    timeline: [
      { year: "2016", text: "春日部で活動開始" },
      { year: "2020", text: "大会への挑戦を本格化" },
      { year: "2025", text: "JAMfest JAPAN vol.23 で1位獲得" },
      { year: "2026", text: "The Dance Summit へ挑戦予定", highlight: true }
    ],

    summitNote: "The Dance Summit は、米国Varsity社が主催する世界最高峰のチアダンス・ダンスの世界選手権大会です。"
  },

  // ===== スポンサー =====
  sponsors: {
    enabled: true,
    title: "Sponsors",
    note: "掲載は活動支援への謝意として行っています（原則1年更新・審査あり）",
    items: []
  },

  // ===== 協賛ページ設定 =====
  sponsor: {
    pageTitle: "企業・団体の方へ（協賛 / 応援出演）",
    formUrl: "",
    areaNote: "埼玉県を中心に、関東は要相談です。",
    feeNote: "協賛・応援出演は1万円〜を目安に、移動距離・拘束時間・内容によりお見積りします。交通費等が発生する場合は事前にご案内します。",
    policy: [
      "掲載は当チームの基準に基づき審査の上で行います。内容により掲載を見合わせる場合があります。",
      "掲載期間は原則1年（更新可）です。",
      "写真掲載・訪問レポート掲載は、事前に許諾をいただいた場合のみ行います。"
    ],
    menus: [
      { title: "広告協賛（ロゴ掲載）", body: "公式サイト／クラファン特設ページへのロゴ掲載（リンク付）、活動報告（NEWS）でのご紹介。" },
      { title: "応援出演（有料・演技のみ）", body: "イベント等での演技披露。距離・拘束時間・内容によりお見積りします。" },
      { title: "物品提供・告知協力", body: "備品提供、告知協力など。内容はご相談ください。" }
    ],
    required: [
      "企業・団体名／ご担当者名／ご連絡先",
      "ご希望（協賛／応援出演／物品提供等）",
      "（応援出演の場合）場所・日時候補・拘束時間の目安",
      "ロゴデータ（推奨：透過PNG）・掲載希望URL",
      "領収書の宛名"
    ],
    mail: {
      subject: "【協賛/応援出演のご相談】POM PUPPYS bright",
      body: "協賛/応援出演のご相談です。\n\n【企業・団体名】\n【ご担当者名】\n【ご連絡先（メール/電話）】\n\n【ご希望】（協賛 / 応援出演 / その他）\n【開催場所】\n【候補日時】\n【拘束時間の目安】\n【ご予算感】（任意）\n【領収書の宛名】\n\n【備考】\n\nよろしくお願いいたします。"
    }
  },

  // ===== 応援メッセージ =====
  supportMessages: {
    enabled: true,
    formUrl: "",
    dataUrl: "./assets/messages.json",
    maxOnOfficial: 12,
    maxOnProject: 24,
    note: "掲載は内容確認のうえ反映します。個人情報（学校名/住所/電話番号など）は記載しないでください。"
  },

  // ===== クラファン特設 =====
  project: {
    title: "Road to the World - Special Project",
    crowdfundingUrl: "",
    
    goalYen: 1000000,
    raisedYen: 0,
    endDate: "2026-03-31",
    updatedAt: "2025-12-14",

    heroVideo: {
      enabled: false,
      mp4: "",
      webm: "",
      poster: "./assets/photos/award_flag.jpg",
      loop: true
    },
    heroImage: "./assets/photos/award_flag.jpg",
    heroImageAlt: "表彰後、フラッグを掲げるPOM PUPPYS bright",

    costPerPersonYen: 580000,
    extrasPerPersonEstimateYen: 100000,
    nights: 6,
    mealPlanNote: "現地は物価高の影響もあり、費用が読みやすく結果的に総額を抑えやすい食事付プランを選択しています。",

    people: [
      { role: "選手", count: 7 },
      { role: "コーチ", count: 1 }
    ],

    priceTable: [
      { room: "4名1室", meal: "食事付", athleteCoachAdult: 580000 },
      { room: "3名1室", meal: "食事付", athleteCoachAdult: 597000 },
      { room: "2名1室", meal: "食事付", athleteCoachAdult: 625000 },
      { room: "1名1室", meal: "食事付", athleteCoachAdult: 707000 },
      { room: "4名1室", meal: "食事無", athleteCoachAdult: 537000 },
      { room: "3名1室", meal: "食事無", athleteCoachAdult: 554000 },
      { room: "2名1室", meal: "食事無", athleteCoachAdult: 582000 },
      { room: "1名1室", meal: "食事無", athleteCoachAdult: 664000 }
    ],

    extraCosts: [
      "燃油サーチャージ等 諸費用：目安 73,000円（2025年11月時点）",
      "ESTA（米国電子渡航認証）：申請料実費",
      "日程内で「各自」と記載の食事",
      "その他個人的費用一式",
      "海外旅行保険：加入必須"
    ],

    copy: {
      heroKicker: "Road to the World - Special Project",
      heroHeadline: "子どもたち全員が、同じ舞台に立てるように。",
      heroLead: "POM PUPPYS bright は世界最高峰の舞台、米国「The Dance Summit 2026」へ出場します。円安と物価高で渡航費が高騰する中、挑戦をプロジェクトとして記録しながら、世界への一歩を進めます。",

      sections: {
        whyTitle: "なぜ支援が必要か",
        whyBody: [
          "渡航・宿泊・大会関連費用が現実の壁になっています。",
          "円安・物価高の影響で費用が上昇しています。",
          "大会指定の旅行会社によるセット料金のため削減が難しい状況です。",
          "選手全員が同じ舞台に立てるよう準備を進めています。"
        ],
        usageTitle: "資金の使い道",
        usageBody: [
          "渡航パッケージ費用を中心に必要経費へ充当します。",
          "All-In方式（目標未達でも実施）です。",
          "使途の概要は活動報告等で共有します。"
        ],
        scheduleTitle: "渡航〜大会までの流れ"
      },

      faq: [
        { q: "All-In方式ですか？", a: "はい、All-In方式（目標未達でも実施）です。集まったご支援は渡航・大会関連費用の一部に充当します。" },
        { q: "目標未達の場合は？", a: "All-In方式のためプロジェクトは実施します。不足分は各家庭負担・協賛等で補います。" },
        { q: "応援メッセージだけでも送れますか？", a: "はい！金銭的な支援だけでなく、応援メッセージも大きな力になります。特設サイトからお送りいただけます。" }
      ]
    },

    fundFlow: {
      title: "ご支援の使い道（優先順位）",
      note: "固定配分ではなく、出場に必要な支払いを優先して充当します。",
      steps: [
        { title: "渡航パッケージ費（最優先）", body: "旅行会社パッケージ費用の支払いを優先します。", examples: ["航空券・宿泊・大会関連の基本費用"] },
        { title: "別途必要経費", body: "燃油等の変動も見込み、必要費用へ充当します。", examples: ["燃油サーチャージ等", "ESTA", "海外旅行保険"] },
        { title: "不足分・備品等", body: "状況に応じて不足分へ充当します。", examples: ["現地移動・備品等"] }
      ]
    },

    support: {
      title: "応援の方法",
      individual: {
        title: "個人で応援",
        body: "プロジェクトページからご支援いただけます（All-In方式）。応援メッセージだけでもOK！",
        ctaLabel: "支援ページを見る"
      },
      corporate: {
        title: "企業・団体として応援（協賛）",
        body: "協賛のご相談を承ります。まずはメールでご連絡ください。",
        ctaLabel: "協賛の相談をする",
        mailSubject: "【協賛のご相談】POM PUPPYS bright World Challenge",
        mailBody: "協賛のご相談です。\n\n【企業・団体名】\n【ご担当者名】\n【ご連絡先】\n【ご検討内容】\n【備考】\n\nどうぞよろしくお願いいたします。",
        menu: [
          { title: "ロゴ掲載", body: "公式サイト／特設ページへのロゴ掲載" },
          { title: "応援メッセージ掲載", body: "企業・団体からのメッセージを掲載" }
        ]
      }
    },

    itinerary: [
      { label: "Day 1", title: "日本出発〜現地到着", body: "移動・入国手続き・ホテルへ", meals: "機内食", hidden: false },
      { label: "Day 2", title: "調整日", body: "コンディション調整・準備", meals: "朝/昼/夜", hidden: false },
      { label: "Day 3", title: "練習", body: "ダンススタジオ等で練習", meals: "朝/昼/夜", hidden: false },
      { label: "Day 4", title: "The Dance Summit 予選", body: "", meals: "朝/昼/夜", hidden: false },
      { label: "Day 5", title: "The Dance Summit 決勝", body: "", meals: "朝/昼/夜", hidden: false },
      { label: "Day 6", title: "予備日", body: "", meals: "", hidden: true },
      { label: "Day 7", title: "現地出発", body: "空路移動", meals: "機内食", hidden: false },
      { label: "Day 8", title: "日本到着・解散", body: "", meals: "機内食", hidden: false }
    ]
  }
};
