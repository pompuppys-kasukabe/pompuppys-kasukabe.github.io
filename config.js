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
  pressEmail: "pompuppys.kasukabe@gmail.com",
  pressContactName: "POM PUPPYS 共同代表 今井 愛",
  
  // ===== 外部リンク =====
  mediaKitUrl: "https://drive.google.com/drive/folders/1jfploQJhKcJWmGzHVKrY2VnJykLoE-d0?usp=sharing",
  instagramUrl: "https://www.instagram.com/pompuppysbright",

  // ===== UI設定 =====
  ui: {
    enableLightbox: true,
    showShareButton: true
  },

  // ===== The Dance Summit 設定 =====
  danceSummit: {
    date: "2026-05-01", // The Dance Summit 2026 予選日
    location: "Orlando, Florida, USA",
    countdown: {
      enabled: true,
      title: "The Dance Summit 2026まで"
    }
  },

  // ===== Instagram設定 =====
  instagram: {
    enabled: true,
    username: "pompuppysbright",
    useNotion: true, // Notion連携を使用（true）またはJSONファイル（false）
    apiUrl: "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec", // GASエンドポイント
    jsonUrl: "./instagram-posts.json", // 手動更新方式のJSONファイル（useNotion: false の場合）
    displayCount: 3, // 表示する投稿数
    cacheMinutes: 30 // キャッシュ時間（分）※Notionの「更新バージョン」が変わると即時反映
  },

  // ===== メディア掲載実績 =====
  mediaFeatures: [
    // メディア掲載が増えたら追加
    // { name: "メディア名", logo: "./assets/media/logo.png", url: "記事URL", date: "2025-XX-XX" }
  ],

  // ===== 活動カレンダー =====
  activityCalendar: {
    enabled: true,
    apiUrl: "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec",
    displayMonths: 6, // 表示する月数（11月〜4月末の6ヶ月間）
    colorScheme: {
      "練習": "#8b5fbf",              // 紫
      "大会": "#d4a84b",              // ゴールド
      "イベント出演": "#4a90e2",      // 青
      "クラファン・協賛": "#2ecc71",  // 緑
      "メディア取材": "#e74c3c",      // 赤
      "リハーサル": "#f39c12",        // オレンジ
      "ミーティング": "#95a5a6",      // グレー
      "その他": "#bdc3c7"             // ライトグレー
    },
    typeIcons: {
      "練習": "fa-solid fa-dumbbell",
      "大会": "fa-solid fa-trophy",
      "イベント出演": "fa-solid fa-star",
      "クラファン・協賛": "fa-solid fa-gift",
      "メディア取材": "fa-solid fa-camera",
      "リハーサル": "fa-solid fa-masks-theater",
      "ミーティング": "fa-solid fa-users",
      "その他": "fa-solid fa-circle"
    },
    hoverInfo: {
      showTime: true,      // 開始・終了時間を表示
      showLocation: true,  // 場所を表示
      showNotes: true      // メモを表示
    },
    stats: {
      showMonthlyTotal: true,      // 月間活動日数
      showByType: true,            // タイプ別集計
      showUpcomingEvents: false    // 今後の予定（Phase 2で実装）
    }
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
      date: "2026-05-XX",
      tag: "RESULT",
      title: "The Dance Summit 2026 ファイナル進出・世界8位",
      body: "応援いただいた皆さまのおかげでファイナルの舞台に立ち、世界8位を獲得しました。心より感謝申し上げます。",
      url: "#result"
    },
    {
      date: "2026-04-01",
      tag: "INFO",
      title: "クラウドファンディング終了！46名の皆様ありがとうございました",
      body: "3月31日をもちましてCAMPFIREでのクラウドファンディングが終了しました。46名の皆様から543,000円のご支援をいただきました。温かい応援に心より感謝申し上げます。いただいたご支援は渡航費用に大切に充当いたします。",
      url: "./project-world-challenge.html"
    },
    {
      date: "2026-03-21",
      tag: "INFO",
      title: "春日部市スポーツ賞を受賞しました",
      body: "JAMfest JAPAN全国1位・世界大会出場の実績が評価され、春日部市スポーツ賞を受賞しました。",
      url: "./news-sports-award.html"
    },
    {
      date: "2026-03-19",
      tag: "MEDIA",
      title: "スポンサーのレジデンシャル不動産にチームをご紹介いただきました",
      body: "株式会社レジデンシャル不動産の公式サイトにてPOM PUPPYS brightをご紹介いただきました。私たちからもスポンサーのご紹介をさせていただきます。",
      url: "./sponsor-residential.html"
    },
    {
      date: "2026-03-01",
      tag: "MEDIA",
      title: "スタイルアリーナに掲載されました",
      body: "ファッション・カルチャー情報サイト「スタイルアリーナ」にPOM PUPPYS brightが掲載されました。",
      url: "https://www.style-arena.jp/trend/404"
    },
    {
      date: "2026-03-19",
      tag: "INFO",
      title: "クラファン40%・40人突破！ありがとうございます",
      body: "クラウドファンディングの支援率が40%、支援者数が40人を突破しました。温かいご支援に心より感謝申し上げます。引き続き、世界大会への挑戦を応援よろしくお願いいたします。",
      url: "https://camp-fire.jp/projects/920355/view"
    },
    {
      date: "2026-02-19",
      tag: "INFO",
      title: "クラファン30%・30人突破！ありがとうございます",
      body: "クラウドファンディングの支援率が30%、支援者数が30人を突破しました。温かいご支援に心より感謝申し上げます。引き続き、世界大会への挑戦を応援よろしくお願いいたします。",
      url: "https://camp-fire.jp/projects/920355/view"
    },
    {
      date: "2026-02-14",
      tag: "EVENT",
      title: "かすかべバレンタインマルシェに出演",
      body: "春日部市役所イベントに出演します。皆様のご来場をお待ちしています。",
      url: "https://www.city.kasukabe.lg.jp/eventjoho/eventjoho_kanko_omatsuri/35310.html"
    },
    {
      date: "2026-02-04",
      tag: "INFO",
      title: "春日部市長を表敬訪問",
      body: "岩谷一弘春日部市長にJAMfest JAPAN全国1位獲得と世界大会出場を報告しました。",
      url: "./news-mayor-visit.html"
    },
    {
      date: "2026-01-23",
      tag: "MEDIA",
      title: "東武朝日新聞に掲載されました",
      body: "本日発行の東武朝日新聞に、POM PUPPYS brightの世界大会挑戦が掲載されました。地域メディアからの応援に感謝いたします。",
      url: ""
    },
    {
      date: "2026-01-23",
      tag: "INFO",
      title: "クラウドファンディング開始！",
      body: "CAMPFIREにてクラウドファンディングを開始しました。春日部の子どもたちを世界の舞台へ。3月31日まで、皆様のご支援をお待ちしています。",
      url: "https://camp-fire.jp/projects/920355/view"
    },
    {
      date: "2025-12-29",
      tag: "RESULT",
      title: "USA Regionals で好成績、USA Nationals 2026 出場決定！",
      body: "USA Regionals 埼玉大会①にて見事好成績を収め、2026年3月開催のUSA Nationalsへの出場権を獲得しました。引き続き応援よろしくお願いします。",
      url: ""
    },
    {
      date: "2025-01-03",
      tag: "INFO",
      title: "公式Instagram開設しました",
      body: "チームの活動や日常を発信していきます。ぜひフォローお願いします！",
      url: "https://www.instagram.com/pompuppysbright"
    },
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
      title: "PUPPYS 発表会（ふじみ野合同）に出演しました",
      body: "ふじみ野合同の発表会に出演しました。応援いただいた皆さま、ありがとうございました。",
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
    heroImage: "./assets/photos/team_main.JPG",
    heroImageAlt: "POM PUPPYS bright チーム写真",

    heroVideo: {
  enabled: true,
  mp4: "./assets/video/official_hero.mp4",
  webm: "",
  poster: "./assets/photos/team_main.JPG",
  loop: false  // ← false に変更
},


    gallery: [
      { title: "", src: "./assets/photos/summit/world_01.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_02.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_03.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_04.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_05.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_06.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_07.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_08.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_09.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" },
      { title: "", src: "./assets/photos/summit/world_10.jpg", alt: "The Dance Summit 2026 世界大会 - POM PUPPYS bright", size: "half" }
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
      kicker: "The Dance Summit 2026 - Final Report",
      headline: "世界8位、ありがとう。",
      lead: "たくさんの方に支えられて、ファイナルの舞台に立てました。",
      sub: "そして POM PUPPYS は、UYS Showcase へと生まれ変わります。"
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
        "<strong>2025年秋、関東予選——結果は11位。</strong>",
        "悔しくて、悔しくて、涙が止まりませんでした。",
        "練習を止めて、みんなで話し合いました。「なんでチアを始めたんだっけ？」「踊るのが、好きだったから。」",
        "<em>私たちは「楽しむ」を取り戻すことにしました。</em>",
        "勝ち負けじゃない。届けたいのは、笑顔。表情、声、チームの空気づくりまで見直し、演技を一から再構築。",
        "<span class=\"highlight\">関東予選から、わずか2週間後——JAMfest JAPAN vol.23で全国1位。</span>",
        "11位から頂点へ。信じられませんでした。",
        "<strong>そして同時に、世界最高峰の舞台「The Dance Summit 2026」への出場権を獲得。先輩たちも届かなかった、チーム初の快挙です。</strong>"
      ]
    },

    timeline: [
      { year: "2016", text: "　　春日部で活動開始" },
      { year: "2020", text: "　　大会への挑戦を本格化" },
      { year: "2025.11", text: "　JAMfest JAPAN vol.23 で1位獲得" },
      { year: "2026.3", text: "　USA Nationals 出場" },
      { year: "2026.5", text: "　The Dance Summit ファイナル進出・世界8位", highlight: true }
    ],

    summitNote: "The Dance Summit は、米国Varsity社が主催する世界最高峰のチアダンス・ダンスの世界選手権大会です。"
  },

  // ===== スポンサー =====
  sponsors: {
    enabled: true,
    title: "Sponsors",
    note: "掲載は活動支援への謝意として行っています（原則1年更新・審査あり）",
    items: [
      { name: "正和工業株式会社", logo: "./assets/sponsors/seiwa.png", url: "https://www.showa-kougyo.co.jp/" },
      { name: "レジデンシャル不動産", logo: "./assets/sponsors/residential.png", url: "https://e-resi.jp/" },
      { name: "大成ホールディングス株式会社", logo: "./assets/sponsors/taisei.png", url: "https://taisei-hd.com/" },
      { name: "こだまホーム", logo: "./assets/sponsors/コダマホームロゴマークPNG.png", url: "https://kodamahome.com" },
      { name: "安達歯科クリニック", logo: "./assets/sponsors/adachi.png", url: "https://www.adachi-dental-office.com/" }
    ]
  },

  // ===== サポーター =====
  supporters: {
    enabled: true,
    title: "Supporters",
    note: "応援いただいている企業・団体",
    items: [
      { name: "コネコノヒタイ", logo: "./assets/supporters/koneko.png", url: "https://konekonohitai.jimdofree.com/" },
      { name: "Tumboo55", logo: "./assets/supporters/tumboo55.png", url: "https://www.instagram.com/tumboo55" },
      { name: "山崎麻矢モダンバレエスタジオ", logo: "./assets/supporters/yamazaki.jpg", url: "https://www.instagram.com/yamazakimaya.mbs" },
      { name: "味亭", logo: "./assets/supporters/ajitei.png", url: "https://ajiwaitei.polus.co.jp/" },
      { name: "maison", logo: "./assets/supporters/maison.png", url: "https://www.instagram.com/194maison" },
      { name: "teng", logo: "./assets/supporters/teng.jpg", url: null },
      { name: "ムラヤマ産業", logo: "./assets/supporters/murayama.png", url: "https://murayama100.com/index.html" },
      { name: "sosiji", logo: "./assets/supporters/sosiji.png", url: "https://www.instagram.com/soshiji114/" },
      { name: "simamura", logo: "./assets/supporters/simamura.jpg", url: "https://shimamuraindustry.com/" },
      { name: "goofy", logo: "./assets/supporters/goofy.png", url: "https://www.instagram.com/diningbar_goofy.s1997" }
    ]
  },

  // ===== メディア掲載 =====
  media: {
    enabled: true,
    title: "Media",
    note: "取材・掲載いただいたメディア",
    items: [
      {
        name: "東武朝日新聞",
        logo: "./campfire/東武朝日ロゴ.png",
        url: "",
        date: "2026年1月"
      },
      {
        name: "スタイルアリーナ",
        logo: "./assets/media/stlye-arena.png",
        url: "https://www.style-arena.jp/trend/404",
        date: "2026年3月"
      },
      {
        name: "J:COM",
        logo: "./assets/media/jcom.png",
        url: "https://www2.myjcom.jp/special/dolocal/",
        date: "2026年3月"
      }
    ]
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
    formUrl: "https://tally.so/r/Y50Z5v",
    dataUrl: "./assets/messages.json", // ローカルJSONファイル
    useNotionAPI: true, // Notion連携を使用
    maxOnOfficial: 12,
    maxOnProject: 24,
    note: "掲載は内容確認のうえ反映します。個人情報（学校名/住所/電話番号など）は記載しないでください。"
  },

  // ===== #BrightWings1000 千羽鶴企画 =====
  brightWings1000: {
    enabled: true,
    title: "#BrightWings1000",
    mainCopy: "1,000の想いを、世界へ届ける。",
    subCopy: "あなたの一言が、彼女たちの翼になる。",
    goal: 1000,
    deadline: "2026-05-01", // The Dance Summit 予選日
    deadlineText: "2026年5月1日（The Dance Summit 予選日）",
    mosaicText: "GO! BRIGHT!!",
    formUrl: "https://tally.so/r/Y50Z5v", // Tallyフォーム
    apiUrl: "https://script.google.com/macros/s/AKfycbzh1RHhRg0MJY0sdkm3QKDdEijEFkWHSKggZQoS7-vQk4sQmD9rK6r5ThqT1MDnKVgYkw/exec", // GASエンドポイント
    vipCategories: ["VIP", "市長・政治家", "スポンサー", "クラファン支援者"], // VIP表示するカテゴリ
    showPickup: true, // ピックアップメッセージを表示
    pickupCount: 20, // ピックアップ表示件数（日付順で最新N件を自動選択）
    gridColumns: {
      desktop: 10,
      tablet: 6,
      mobile: 3
    },
    note: "掲載は内容確認のうえ反映します。個人情報（学校名/住所/電話番号など）は記載しないでください。"
  },

  // ===== クラファン特設 =====
  project: {
    title: "Road to the World - Special Project",
    crowdfundingUrl: "https://camp-fire.jp/projects/920355/view",

    goalYen: 1000000,
    raisedYen: 543000,
    endDate: "2026-03-31",
    updatedAt: "2026-03-31",

    heroVideo: {
      enabled: false,
      mp4: "./assets/video/project_hero.mp4",
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
      "燃油サーチャージ等 諸費用：目安 73,000円（2025年12月時点）",
      "ESTA（米国電子渡航認証）：申請料実費",
      "日程内で「各自」と記載の食事",
      "その他個人的費用一式",
      "海外旅行保険：加入必須"
    ],

    copy: {
      heroKicker: "Road to the World - Special Project",
      heroHeadline: "子どもたち全員で、世界の舞台に立ちました。",
      heroLead: "POM PUPPYS bright は世界最高峰の舞台、米国「The Dance Summit 2026」に出場し、ファイナル進出・世界8位という結果を残しました。このページは、挑戦の記録です。温かいご支援、本当にありがとうございました。",

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
        { q: "The Dance Summit とは何ですか？", a: "アメリカ・フロリダ州オーランドで開催される世界最高峰のダンス競技大会です。世界30カ国以上から選抜されたチームが集結し、チアダンス界の「オリンピック」とも呼ばれています。" },
        { q: "費用の内訳を教えてください", a: "1人あたりの渡航費用は約68万円（航空券・宿泊・大会関連費用含む）。選手7名＋コーチ1名、計8名分で総額約544万円が必要です。クラファン目標の100万円は、この渡航費用の一部に充当します。" },
        { q: "All-In方式ですか？", a: "はい、All-In方式（目標未達でも実施）です。集まったご支援は渡航・大会関連費用の一部に充当します。" },
        { q: "目標未達の場合は？", a: "All-In方式のためプロジェクトは実施します。不足分は各家庭負担・協賛等で補います。" },
        { q: "応援メッセージだけでも送れますか？", a: "はい！金銭的な支援だけでなく、応援メッセージも大きな力になります。「#BrightWings1000」として1,000件の応援メッセージを集め、横断幕に刻んで世界大会へ持参します。支援の有無に関わらず、どなたでも参加できます。" },
        { q: "なぜ「最初で最後」なのですか？", a: "メンバーの中学3年生は来春に高校生になります。本来ならチームを引退する時期ですが、「このメンバーで世界へ行きたい」という夢のために5月の大会まで走り続けることを決めました。この7人で踊れるのは、この世界大会が最初で最後です。" },
        { q: "企業・団体として応援できますか？", a: "はい、企業・団体スポンサー枠をご用意しています。PLATINUM（30万円・限定1社・専用インタビュー記事付）、GOLD（10万円・限定2社）、SILVER（5万円・限定3社）、BRONZE（3万円・限定5社）があり、応援横断幕へのロゴ掲載などの特典があります。詳しくは「協賛の相談をする」からお問い合わせください。" },
        { q: "リターンの発送時期は？", a: "2026年6月頃を予定しています。大会終了後、活動報告とともにリターン品を順次発送いたします。" }
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
  },
  // 千羽鶴チャレンジ（これを追加）
  messagesChallenge: {
    enabled: true,
    goal: 1000,
    deadline: "2026-05-01",
    title: "1,000の想いを、世界へ届ける。",
    subtitle: "あなたの一言が、彼女たちの翼になる。"
  }
};
