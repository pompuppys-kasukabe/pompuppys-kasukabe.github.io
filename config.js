/* config.js */
window.PUPPYS_CONFIG = {
  // Site URL (canonical / OGP). Keep trailing slash.
  siteUrl: "https://pompuppys-kasukabe.github.io/",
  ogImageUrl: "https://pompuppys-kasukabe.github.io/assets/ogp.jpg",
  ogImageUrlProject: "https://pompuppys-kasukabe.github.io/assets/ogp_project.jpg",

  // Pages（4ページ）
  pages: {
    media: "./media.html",
    project: "./project-world-challenge.html", // 公式/Mediaからはリンクしない運用も可
    sponsor: "./sponsor.html"
  },

  // Media（取材導線）※Mediaにはクラファン導線を出さない設計
  mediaKitUrl: "https://drive.google.com/drive/folders/1jfploQJhKcJWmGzHVKrY2VnJykLoE-d0?usp=sharing",
  instagramUrl: "",
  pressEmail: "moccy0306@gmail.com",
  pressContactName: "POM PUPPYS bright 保護者代表　飯田 絵里",

  // UI flags
  ui: {
    enableLightbox: true,
    showShareButton: true
  },

  // 記事用テキスト（サイト側にも同梱：コピペ1クリック用）
  mediaTexts: {
    credit: "写真クレジット：POM PUPPYS bright 提供",
    short100:
      "埼玉・春日部のチアダンスチーム「POM PUPPYS bright」。悔しさを転機に“楽しむ”へ立ち返り、演技を立て直してJAMfestで1位。The Dance Summit 2026に挑戦。",
    mid200:
      "埼玉・春日部を拠点に活動するチアダンスチーム「POM PUPPYS bright」。直前の大会で悔しい結果を経験し、勝ち負けだけではなく“踊ることを楽しむ”原点へ。表情・一体感・空気づくりまで磨き直し、JAMfestで1位を獲得。The Dance Summit 2026に向け準備を進めている。",
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

  // サイト見た目用（写真・差し替え用）
  siteImages: {
    // 公式トップ：縦長の表彰写真をヒーローに（CSS/JSで「ぼかし背景 + contain」でリッチに表示）
    heroImage: "./assets/photos/award_flag.jpg",
    heroImageAlt: "表彰後、フラッグを掲げるPOM PUPPYS bright",

    // 公式トップ：動画ヒーロー（必要なら enabled=true に）
    heroVideo: {
      enabled: false,
      mp4: "./assets/video/official_hero.mp4",
      webm: "./assets/video/official_hero.webm", // 任意（無ければ空文字でもOK）
      poster: "./assets/photos/award_flag.jpg",
      alt: "POM PUPPYS bright 公式映像",
      loop: true
    },

    gallery: [
      { title: "表彰のあと", src: "./assets/photos/award_flag.jpg", alt: "表彰後の様子" },
      { title: "練習風景", src: "./assets/photos/practice_01.jpg", alt: "練習風景" },
      { title: "チーム集合", src: "./assets/photos/team_01.jpg", alt: "チーム集合写真" }
    ],

    mascot: {
      enabled: true,
      src: "./assets/mascot.png",
      alt: "オリジナルキャラクター"
    }
  },

  // スポンサー（公式トップに表示：ロゴ+リンク）
  sponsors: {
    enabled: true,
    title: "スポンサー / 協賛",
    note: "掲載は活動支援への謝意として行っています（原則1年更新・審査あり）。",
    items: []
  },

  // 企業・団体向け（フォームは一旦なし、メール導線のみ）
  sponsor: {
    pageTitle: "企業・団体の方へ（協賛 / 応援出演）",
    formUrl: "",

    areaNote: "埼玉県を中心に、関東は要相談です。",
    feeNote:
      "協賛・応援出演は1万円〜を目安に、移動距離・拘束時間・内容によりお見積りします。交通費等が発生する場合は事前にご案内します。",

    policy: [
      "掲載は当チームの基準に基づき審査の上で行います。内容により掲載を見合わせる場合があります（例：成人向け、ギャンブル、反社会的勢力に該当する恐れがあるもの等）。",
      "掲載期間は原則1年（更新可）です。",
      "写真掲載・訪問レポート掲載は、事前に許諾をいただいた場合のみ行います。"
    ],

    menus: [
      {
        title: "広告協賛（ロゴ掲載）",
        body: "公式サイト／クラファン特設ページへのロゴ掲載（リンク付）、活動報告（NEWS）でのご紹介。"
      },
      {
        title: "応援出演（有料・演技のみ）",
        body:
          "イベント等での演技披露（体験会は原則行っていません）。距離・拘束時間・内容によりお見積りします。企業様との記念写真（集合写真）をNEWS素材として掲載する場合があります。※実施可否はチーム判断となります。"
      },
      { title: "物品提供・告知協力", body: "備品提供、告知協力など。内容はご相談ください。" }
    ],

    required: [
      "企業・団体名／ご担当者名／ご連絡先",
      "ご希望（協賛／応援出演／物品提供等）",
      "（応援出演の場合）場所・日時候補・拘束時間の目安・音響/床/控室の有無",
      "ロゴデータ（推奨：透過PNG）・掲載希望URL（ロゴ掲載の場合）",
      "領収書の宛名（会社名でOK）"
    ],

    mail: {
      subject: "【協賛/応援出演のご相談】POM PUPPYS bright",
      body:
`協賛/応援出演のご相談です。

【企業・団体名】
【ご担当者名】
【ご連絡先（メール/電話）】

【ご希望】（協賛 / 応援出演 / その他）
【開催場所（市区町村・会場名）】
【候補日時】
【拘束時間の目安】
【ご予算感】（任意）
【領収書の宛名】（会社名でOK）

【応援出演をご希望の場合】
・演技披露のみ（可/不可の希望）
・音響（音源再生可否、スピーカー有無）
・床（フロア種類）
・控室（有/無）
・撮影（企業様との集合写真：可/不可）

【備考】

よろしくお願いいたします。`
    }
  },

  // クラファン特設ページ用（LP仕様）
  project: {
    title: "World Challenge Project",
    crowdfundingUrl: "", // CAMPFIRE URL が決まったら入れる
    goalYen: 1000000,
    raisedYen: 0,
    endDate: "2026-03-31",
    updatedAt: "2025-12-13",

    // 特設：ヒーロー動画（こちらはON推奨）
    heroVideo: {
      enabled: true,
      mp4: "./assets/video/project_hero.mp4",
      webm: "./assets/video/project_hero.webm", // 任意
      poster: "./assets/photos/award_flag.jpg",
      alt: "World Challenge Project 映像",
      loop: true
    },
    // 特設：動画が出ない環境向けの静止画フォールバック
    heroImage: "./assets/photos/award_flag.jpg",
    heroImageAlt: "表彰後、フラッグを掲げるPOM PUPPYS bright",

    // cost assumptions
    costPerPersonYen: 580000,
    extrasPerPersonEstimateYen: 100000,
    nights: 6,
    mealPlanNote:
      "現地は物価高の影響もあり、6泊の滞在で3食を外食等で賄うと総額が膨らみやすいため、費用が読みやすく結果的に総額を抑えやすい食事付プランを選択しています。",

    people: [
      { role: "選手", count: 7 },
      { role: "コーチ", count: 1 }
    ],

    priceTable: [
      { room: "4名1室", meal: "食事付", athleteCoachAdult: 580000, child: 479000 },
      { room: "3名1室", meal: "食事付", athleteCoachAdult: 597000, child: 479000 },
      { room: "2名1室", meal: "食事付", athleteCoachAdult: 625000, child: 500000 },
      { room: "1名1室", meal: "食事付", athleteCoachAdult: 707000, child: null },

      { room: "4名1室", meal: "食事無", athleteCoachAdult: 537000, child: 436000 },
      { room: "3名1室", meal: "食事無", athleteCoachAdult: 554000, child: 436000 },
      { room: "2名1室", meal: "食事無", athleteCoachAdult: 582000, child: 456000 },
      { room: "1名1室", meal: "食事無", athleteCoachAdult: 664000, child: null }
    ],

    extraCosts: [
      "燃油サーチャージ等 諸費用：目安 73,000円（2025年11月時点）",
      "ESTA（米国電子渡航認証）：代行手数料 8,800円（税込）/件 + 申請料実費（USD40）",
      "日程内で「—」「各自」と記載の食事",
      "日本国内線（国際線乗継）の航空券",
      "その他個人的費用一式",
      "海外旅行保険：加入必須（保険会社案内あり）"
    ],

    copy: {
      heroKicker: "World Stage / みんなで同じ舞台へ",
      heroHeadline: "挫折からの返り咲きで掴んだ世界大会。その一歩を、費用の壁で止めたくありません。",
      heroLead:
        "POM PUPPYS bright は「The Dance Summit 2026」へ出場します。直前の悔しさを乗り越え、演技を立て直して世界大会出場を勝ち取りました。しかし円安と物価高で渡航費が高騰し、指定旅行会社のセット料金のため削減が難しい状況です。選手全員が同じ舞台に立てるよう、費用の一部として目標100万円のご支援をお願いしています。※本プロジェクトはAll-In方式（目標未達でも実施）です。",

      sections: {
        whyTitle: "なぜ支援が必要か",
        whyBody: [
          "世界大会出場を勝ち取った一方で、渡航・宿泊・大会関連費用が現実の壁になっています。",
          "近年の円安・物価高の影響で費用が大きく上昇しています。",
          "大会指定の旅行会社によるセット料金のため、こちら側での削減が難しい状況です。",
          "親戚・企業協賛などでもお願いしていますが、あと一歩をクラファンでも支えていただきたいです。"
        ],
        usageTitle: "資金の使い道（目標100万円）",
        usageBody: [
          "ご支援は、世界大会出場に必要な費用の一部（渡航パッケージ費用を中心に、燃油サーチャージ・ESTA・海外旅行保険などの必要経費を含む）に充当します。",
          "まずは大会指定の旅行パッケージ費用の支払いを優先し、不足や状況に応じて別途必要となる費用へ充当します（All-In方式／目標未達でも実施）。",
          "旅行パッケージ約58万円/人に加え、別途費用が約10万円/人前後かかる見込みです（燃油等は変動するため目安です）。",
          "使途の概要は活動報告等で共有します。"
        ],
        scheduleTitle: "渡航〜大会までの流れ（抜粋）"
      },

      faq: [
        {
          q: "このプロジェクトはAll-In方式ですか？",
          a: "はい、All-In方式（目標未達でも実施）です。集まったご支援は渡航・大会関連費用の一部に充当し、出場を最優先に準備します。"
        },
        {
          q: "目標に届かなかった場合はどうなりますか？",
          a: "All-In方式のためプロジェクトは実施します。不足分は各家庭負担・協賛等で補い、選手全員で出場できるよう準備を進めます。"
        },
        {
          q: "目標を超えた場合はどう使われますか？",
          a: "追加分も渡航・大会関連費用（現地移動、備品、諸経費等）に充当します。使途は活動報告等で共有します。"
        },
        {
          q: "費用はなぜ削減できないのですか？",
          a: "大会指定の旅行会社によるパッケージ料金が基本となるため、チーム側で大きく削ることが難しい状況です。"
        },
        {
          q: "企業として協賛したいです。",
          a: "特設の「企業・団体の方へ」ページからご連絡ください。協賛内容をご案内します。"
        }
      ]
    },

    fundFlow: {
      title: "ご支援の使い道（優先順位）",
      note:
        "※特定費目への固定配分ではなく、出場に必要な支払いを優先して充当します（All-In方式）。",
      steps: [
        {
          title: "① 渡航パッケージ費（最優先）",
          body: "大会指定の旅行会社パッケージ費用の支払いを優先します。",
          examples: ["航空券・宿泊・大会関連の基本費用（パッケージ内）"]
        },
        {
          title: "② 別途必要経費（目安：1人 約10万円前後）",
          body: "円安・燃油等の変動も見込み、出場に必要な費用へ充当します。",
          examples: ["燃油サーチャージ等諸費用", "ESTA", "海外旅行保険 など"]
        },
        {
          title: "③ 出場に必要な不足分・備品等（状況に応じて）",
          body: "不足が出た場合は各家庭負担・協賛等でも補いながら、出場を最優先で準備します。",
          examples: ["現地移動・備品等"]
        }
      ]
    },

    support: {
      title: "応援の方法",
      individual: {
        title: "個人で応援（CAMPFIRE）",
        body: "CAMPFIREのプロジェクトページからご支援いただけます。All-In方式（目標未達でも実施）です。",
        ctaLabel: "CAMPFIREで支援する"
      },
      corporate: {
        title: "企業・団体として応援（協賛）",
        body: "協賛のご相談を承ります（広告協賛／物品提供／応援出演など）。まずはメールでご連絡ください。",
        ctaLabel: "協賛の相談をする（メール）",
        mailSubject: "【協賛のご相談】POM PUPPYS bright World Challenge",
        mailBody:
          "協賛のご相談です。\n\n【企業・団体名】\n【ご担当者名】\n【ご連絡先】\n【ご検討内容】（協賛/物品提供/応援出演など）\n【備考】\n\nどうぞよろしくお願いいたします。",
        menu: [
          { title: "ロゴ掲載（公式サイト／特設ページ）", body: "支援企業としてご紹介します（掲載可否・仕様は相談）。" },
          { title: "応援メッセージ掲載", body: "企業・団体からのメッセージを掲載します（任意）。" },
          { title: "物品提供・サービス提供", body: "備品提供、告知協力など（内容は相談）。" }
        ]
      }
    },

    itinerary: [
      { label: "Day 1（4/28）", title: "日本出発〜現地到着", body: "移動・入国手続き・ホテルへ", meals: "朝— / 昼 機内 / 夜 機内", hidden: false },
      { label: "Day 2（4/29）", title: "調整日", body: "コンディション調整・準備", meals: "朝 ○ / 昼 弁当 / 夜 ○", hidden: false },
      { label: "Day 3（4/30）", title: "練習（予定）", body: "ダンススタジオ等で練習", meals: "朝 ○ / 昼 弁当 / 夜 ○", hidden: false },
      { label: "Day 4（5/1）", title: "The Dance Summit 予選ラウンド", body: "", meals: "朝 ○ / 昼 弁当 / 夜 ○", hidden: false },
      { label: "Day 5（5/2）", title: "The Dance Summit 決勝ラウンド", body: "", meals: "朝 ○ / 昼 弁当 / 夜 ○", hidden: false },
      { label: "Day 6（5/3）", title: "（非表示）", body: "", meals: "", hidden: true },
      { label: "Day 7（5/4）", title: "現地出発〜帰国の途へ", body: "空路移動・乗継", meals: "朝 各自 / 昼 各自 / 夜 機内", hidden: false },
      { label: "Day 8（5/5）", title: "日本到着・解散", body: "", meals: "朝 機内 / 昼— / 夜—", hidden: false }
    ]
  }
};
