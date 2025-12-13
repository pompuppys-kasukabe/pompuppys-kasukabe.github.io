<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>POM PUPPYS ★bright | World Challenge Project</title>
  <meta name="description" content="POM PUPPYS bright の The Dance Summit 2026 への挑戦。背景・活動報告・進捗と導線をまとめた特設ページ。">

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="./config.js"></script>

  <style>
    html { scroll-behavior: smooth; }
    .bg-glow {
      position: absolute; inset: -22%;
      filter: blur(70px); opacity: .55;
      background:
        radial-gradient(circle at 18% 22%, rgba(255, 56, 160, 0.55), transparent 45%),
        radial-gradient(circle at 72% 26%, rgba(255, 214, 102, 0.42), transparent 50%),
        radial-gradient(circle at 58% 78%, rgba(35, 62, 125, 0.75), transparent 55%);
      animation: floatGlow 12s ease-in-out infinite;
      will-change: transform;
    }
    @keyframes floatGlow {
      0%,100% { transform: translate3d(0,0,0) scale(1); }
      50% { transform: translate3d(2%, -2%, 0) scale(1.06); }
    }
    .diag-lines {
      background-image:
        linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.10) 12%, transparent 12%, transparent 20%),
        linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.06) 8%, transparent 8%, transparent 16%);
      background-size: 56px 56px, 86px 86px;
      mask-image: radial-gradient(circle at 30% 30%, rgba(0,0,0,1), rgba(0,0,0,.25) 55%, rgba(0,0,0,0) 78%);
    }
    .reveal { opacity: 0; transform: translateY(14px); transition: opacity .7s ease, transform .7s ease; }
    .reveal.is-in { opacity: 1; transform: translateY(0); }
    .shrink { padding-top: .55rem; padding-bottom: .55rem; backdrop-filter: blur(10px); }
  </style>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { navy: "#0B1B3A", pink: "#FF38A0", gold: "#FFD666" },
          boxShadow: { soft: "0 14px 50px rgba(0,0,0,0.25)" }
        }
      }
    }
  </script>
</head>

<body class="bg-navy text-white selection:bg-pink/30 selection:text-white">
  <header id="header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="mt-4 rounded-2xl border border-white/10 bg-navy/70 px-4 py-3 shadow-soft">
        <div class="flex items-center justify-between gap-3">
          <a id="homeLink" href="./index.html#top" class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-xl bg-white/10 border border-white/10 grid place-items-center">
              <span class="text-gold font-black">★</span>
            </div>
            <div class="leading-tight">
              <div id="brandLine" class="font-extrabold tracking-wide">POM PUPPYS <span class="text-gold">★</span>bright</div>
              <div class="text-xs text-white/70">World Challenge Project</div>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-5 text-sm text-white/80">
            <a class="hover:text-white" href="#progress">PROGRESS</a>
            <a class="hover:text-white" href="#plan">PLAN</a>
            <a class="hover:text-white" href="#updates">UPDATES</a>
            <a class="hover:text-white" href="#faq">FAQ</a>
            <a class="hover:text-white" href="#cta">CTA</a>
            <a class="hover:text-white" href="#contact">CONTACT</a>
          </nav>

          <div class="flex items-center gap-2">
            <a id="backToHome" href="./index.html#about" class="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
              公式サイトへ
              <span class="text-white/70">→</span>
            </a>
            <button id="menuBtn" class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10" aria-label="メニュー">
              ☰
            </button>
          </div>
        </div>

        <div id="mobileMenu" class="md:hidden hidden pt-3">
          <div class="grid gap-2 text-sm text-white/85">
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#progress">PROGRESS</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#plan">PLAN</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#updates">UPDATES</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#faq">FAQ</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#cta">CTA</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="#contact">CONTACT</a>
            <a class="rounded-xl px-3 py-2 hover:bg-white/10" href="./index.html#top">公式サイトへ</a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="top" class="pt-28 md:pt-32">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="bg-glow"></div>
        <div class="absolute inset-0 diag-lines opacity-60"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div class="grid gap-10 md:grid-cols-12 items-center">
          <div class="md:col-span-7 reveal">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85">
              <span class="text-gold">●</span> Challenge Project
              <span class="mx-1 text-white/30">/</span>
              <span class="text-white/80">The Dance Summit 2026</span>
            </div>

            <h1 class="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              “挑戦”を、つないでいく
            </h1>

            <p class="mt-4 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
              <span class="font-semibold text-white">POM PUPPYS bright</span> の The Dance Summit 2026 への挑戦に向けた特設ページです。
              <span class="font-semibold text-white">公式サイト（チーム紹介）を主役</span>にしたまま、必要な方へだけ分かりやすく情報をまとめています。
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#progress" class="inline-flex items-center justify-center rounded-2xl bg-pink px-6 py-3 font-extrabold shadow-soft hover:bg-pink/90">
                進捗を見る
              </a>
              <a id="toAbout" href="./index.html#about" class="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-extrabold hover:bg-white/10">
                チーム紹介へ戻る
              </a>
            </div>

            <div class="mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
              <div class="font-extrabold text-white">表記ルール</div>
              ふじみ野と併記する場合のみ <span class="font-semibold text-white">「春日部／ふじみ野」</span>（POM PUPPYS省略）で記載しています。
            </div>
          </div>

          <div class="md:col-span-5 reveal">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-soft">
              <div class="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0">
                <div class="h-full w-full grid place-items-center text-center px-6">
                  <div>
                    <div class="text-sm text-white/70">Project Visual Placeholder</div>
                    <div class="mt-2 text-lg font-extrabold">挑戦の象徴になる1枚</div>
                    <div class="mt-3 text-xs text-white/60">（後で差し替え）</div>
                  </div>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div class="text-xs text-white/60">Focus</div>
                  <div class="mt-1 font-bold">Story</div>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div class="text-xs text-white/60">Focus</div>
                  <div class="mt-1 font-bold">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-10 sm:h-14"></div>
      </div>
    </section>

    <!-- PROGRESS -->
    <section id="progress" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">PROGRESS</h2>
          <div class="text-sm text-white/70">自動計算で表示</div>
        </div>

        <div class="mt-6 grid gap-5 lg:grid-cols-12">
          <div class="lg:col-span-7 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-soft">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm text-white/70">目標</div>
                <div class="mt-1 text-2xl sm:text-3xl font-black" id="goalText">¥0</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-white/70">現在</div>
                <div class="mt-1 text-2xl sm:text-3xl font-black" id="currentText">¥0</div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-center justify-between text-sm text-white/70">
                <div>達成率</div>
                <div><span class="font-extrabold text-white" id="percentText">0%</span></div>
              </div>
              <div class="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                <div id="progressBar" class="h-full w-0 rounded-full bg-gradient-to-r from-pink to-gold"></div>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-white/55">
                <div>※金額は config.js の project.currentYen を更新</div>
                <div>残り <span class="font-extrabold text-white" id="daysLeftText">-</span> 日</div>
              </div>
            </div>

            <div class="mt-6 rounded-3xl border border-white/10 bg-navy/40 p-5">
              <div class="text-sm font-extrabold">この特設ページのスタンス</div>
              <p class="mt-2 text-sm text-white/75 leading-relaxed">
                このページは「支援を前面に押し出す」ためではなく、挑戦の背景と進捗を整理し、
                必要な方が迷わず情報に辿り着けるために用意しています。
              </p>
            </div>
          </div>

          <div class="lg:col-span-5 space-y-5">
            <div class="reveal rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <div class="text-sm text-white/70">ワンシーン</div>
              <div class="mt-4 rounded-3xl border border-white/10 bg-navy/40 p-5">
                <div class="text-sm font-extrabold">JAMfest</div>
                <p class="mt-2 text-sm text-white/75 leading-relaxed">
                  <span class="font-semibold text-white">春日部が1位、ふじみ野が2位</span>。姉妹チームが並んで表彰台に立ち、
                  互いの努力が証明された瞬間でした。両チームとも The Dance Summit 2026 に出場予定です。
                </p>
              </div>
            </div>

            <div class="reveal rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <div class="text-sm text-white/70">ポイント</div>
              <ul class="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                <li>未成年チームの挑戦（教育・地域文脈）</li>
                <li>“楽しむ”へ切り替え、演技が変わった</li>
                <li>姉妹チームとの切磋琢磨：<span class="font-semibold text-white">春日部／ふじみ野</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="h-16 sm:h-24"></div>
    </section>

    <!-- PLAN -->
    <section id="plan" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">PLAN</h2>
          <div class="text-sm text-white/70">“なぜ今”を短く</div>
        </div>

        <div class="mt-6 grid gap-5 lg:grid-cols-12">
          <div class="lg:col-span-7 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-soft">
            <div class="text-sm text-white/70">背景</div>
            <h3 class="mt-2 text-xl sm:text-2xl font-extrabold">挑戦を現実にするための、最後のひと押し</h3>
            <p class="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
              最初は参加も難しい状況でしたが、親戚など周囲の協力も得て、なんとか出場が見えてきました。
              ただ、円安や物価高の影響もあり、最終的な準備を整えるために追加の後押しが必要になっています。
            </p>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="rounded-3xl border border-white/10 bg-navy/40 p-5">
                <div class="text-xs text-white/60">方針</div>
                <div class="mt-2 font-extrabold">“不足分のみ”は使わない</div>
                <div class="mt-2 text-sm text-white/70">
                  返金や精算を連想させないよう、<span class="font-semibold text-white">「挑戦の後押し」</span>として表現します。
                </div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-navy/40 p-5">
                <div class="text-xs text-white/60">運用</div>
                <div class="mt-2 font-extrabold">費用内訳は載せない</div>
                <div class="mt-2 text-sm text-white/70">
                  旅行手配は指定会社のパッケージのため、<span class="font-semibold text-white">内訳の公開は行いません</span>。
                </div>
              </div>
            </div>

            <div class="mt-6 rounded-3xl border border-white/10 bg-navy/40 p-5">
              <div class="text-sm font-extrabold">報告の考え方</div>
              <p class="mt-2 text-sm text-white/75 leading-relaxed">
                “お金の精算報告”ではなく、<span class="font-semibold text-white">活動報告（練習・大会・学び）</span>を中心に更新します。
                未成年チームのため、安全面に配慮しながら必要最小限の情報で運用します。
              </p>
            </div>
          </div>

          <div class="lg:col-span-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
            <div class="text-sm text-white/70">スケジュール（抜粋）</div>
            <div class="mt-4 grid gap-3">
              <div class="rounded-2xl border border-white/10 bg-navy/40 p-4">
                <div class="text-xs text-white/60">12/28</div>
                <div class="mt-1 font-extrabold">USA Regionals 埼玉大会</div>
                <div class="mt-2 text-sm text-white/70">出場予定</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-navy/40 p-4">
                <div class="text-xs text-white/60">3/15</div>
                <div class="mt-1 font-extrabold">PUPPYS 発表会（ふじみ野合同）</div>
                <div class="mt-2 text-sm text-white/70">出演予定</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-navy/40 p-4">
                <div class="text-xs text-white/60">2026</div>
                <div class="mt-1 font-extrabold">The Dance Summit 2026</div>
                <div class="mt-2 text-sm text-white/70">日程は記載しません</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-16 sm:h-24"></div>
    </section>

    <!-- UPDATES -->
    <section id="updates" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">UPDATES</h2>
          <div class="text-sm text-white/70">活動報告（活動中心）</div>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-3" id="updatesGrid"></div>

        <div class="mt-5 text-xs text-white/55">
          ※更新は config.js の project.updates[] を編集するだけ
        </div>
      </div>

      <div class="h-16 sm:h-24"></div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">FAQ</h2>
          <div class="text-sm text-white/70">よくある質問</div>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-2">
          <details class="rounded-3xl border border-white/10 bg-white/5 p-6">
            <summary class="cursor-pointer font-extrabold">「不足分だけの募集」ですか？</summary>
            <p class="mt-3 text-sm text-white/75 leading-relaxed">
              「不足分のみ」と限定した表現は、返金や精算を連想させることがあるため、当ページでは用いません。
              このプロジェクトは<span class="font-semibold text-white">挑戦の後押し</span>として、必要な準備を整えるための応援をお願いする形です。
            </p>
          </details>

          <details class="rounded-3xl border border-white/10 bg-white/5 p-6">
            <summary class="cursor-pointer font-extrabold">費用の内訳や総額は公開しますか？</summary>
            <p class="mt-3 text-sm text-white/75 leading-relaxed">
              旅行手配は指定の旅行会社のパッケージのため、内訳が個別に変動しやすく、公開は行いません。
              代わりに、<span class="font-semibold text-white">活動報告（練習・大会・学び）</span>を中心に更新します。
            </p>
          </details>

          <details class="rounded-3xl border border-white/10 bg-white/5 p-6">
            <summary class="cursor-pointer font-extrabold">未成年の情報公開は大丈夫ですか？</summary>
            <p class="mt-3 text-sm text-white/75 leading-relaxed">
              未成年保護を最優先に、氏名・学校名・詳細日程などは必要最小限の掲載にとどめます。
              取材や素材提供は窓口経由で調整します。
            </p>
          </details>

          <details class="rounded-3xl border border-white/10 bg-white/5 p-6">
            <summary class="cursor-pointer font-extrabold">他の応援方法はありますか？</summary>
            <p class="mt-3 text-sm text-white/75 leading-relaxed">
              あります。SNSでのシェア、応援メッセージ、企業・店舗さまの協賛（掲出等）など、
              できる形での応援が大きな力になります。下のCTAをご確認ください。
            </p>
          </details>
        </div>
      </div>

      <div class="h-16 sm:h-24"></div>
    </section>

    <!-- CTA -->
    <section id="cta" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-soft">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="lg:max-w-2xl">
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight">CTA</h2>
              <p class="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                外部ページへの導線はここに集約し、公式サイト側で“支援”が前に出すぎない設計にしています。
              </p>
            </div>

            <div class="w-full lg:max-w-md grid gap-3">
              <a id="crowdLink" href="#" target="_blank" rel="noopener"
                 class="inline-flex items-center justify-center rounded-2xl bg-pink px-6 py-3 font-extrabold hover:bg-pink/90">
                外部ページへ（クラウドファンディング）
              </a>
              <button id="copyLinkBtn" type="button"
                 class="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-extrabold hover:bg-white/10">
                このページのURLをコピー
              </button>
              <a id="mediaBack" href="./index.html#media"
                 class="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-extrabold hover:bg-white/10">
                取材・協賛の相談（公式サイト）
              </a>
            </div>
          </div>

          <div id="toast" class="mt-5 hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
            URLをコピーしました。
          </div>
        </div>
      </div>

      <div class="h-16 sm:h-24"></div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="reveal">
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-soft">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="lg:max-w-2xl">
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight">CONTACT</h2>
              <p class="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                取材・協賛・イベント連携などのご相談はこちらへ。未成年保護の観点で事前に調整いたします。
              </p>
            </div>

            <div class="w-full lg:max-w-md grid gap-3">
              <a id="mailLink" href="mailto:example@example.com"
                 class="inline-flex items-center justify-center rounded-2xl bg-pink px-6 py-3 font-extrabold hover:bg-pink/90">
                メールで問い合わせ
              </a>
              <a id="homeContact" href="./index.html#contact"
                 class="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-extrabold hover:bg-white/10">
                公式サイトの窓口へ
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-10 sm:h-14"></div>
    </section>

    <footer class="border-t border-white/10 bg-navy/80">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div id="footerBrand" class="font-extrabold">POM PUPPYS ★bright</div>
            <div class="mt-1 text-sm text-white/60">World Challenge Project</div>
          </div>
          <div class="grid gap-2 text-sm text-white/70">
            <a class="hover:text-white" href="#progress">PROGRESS</a>
            <a class="hover:text-white" href="#plan">PLAN</a>
            <a class="hover:text-white" href="#cta">CTA</a>
            <a class="hover:text-white" href="./index.html#top">公式サイトへ</a>
          </div>
        </div>
        <div class="mt-8 text-xs text-white/45">© POM PUPPYS ★bright. All rights reserved.</div>
      </div>
    </footer>
  </main>

  <script>
    const CFG = window.PUPPYS_CONFIG || null;

    function escapeHtml(str) {
      return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function yen(n){ return "¥" + Number(n||0).toLocaleString("ja-JP"); }
    function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }

    function isUncertainDate(dateStr) {
      if (!dateStr) return true;
      return String(dateStr).includes("_");
    }
    function formatDateLabel(dateStr) {
      if (!dateStr || isUncertainDate(dateStr)) return "";
      const s = String(dateStr).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.replaceAll("-", ".");
      if (/^\d{4}-\d{2}$/.test(s)) return s.replace("-", ".");
      if (/^\d{4}$/.test(s)) return s;
      return s;
    }

    function daysLeft(endDateStr){
      if (!endDateStr) return "-";
      const end = new Date(endDateStr + "T23:59:59");
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      return String(Math.max(0, Math.ceil(diff / (1000*60*60*24))));
    }

    function renderProgress(){
      const p = CFG?.project;
      const goal = p?.goalYen ?? 0;
      const cur  = p?.currentYen ?? 0;

      const pct = goal > 0 ? (cur / goal) * 100 : 0;
      const pctClamped = clamp(pct, 0, 100);

      document.getElementById("goalText").textContent = yen(goal);
      document.getElementById("currentText").textContent = yen(cur);
      document.getElementById("percentText").textContent = Math.floor(pctClamped) + "%";
      document.getElementById("progressBar").style.width = pctClamped + "%";
      document.getElementById("daysLeftText").textContent = daysLeft(p?.endDate);
    }

    function renderUpdates(){
      const grid = document.getElementById("updatesGrid");
      grid.innerHTML = "";

      const items = CFG?.project?.updates || [];
      items.forEach(u=>{
        const label = formatDateLabel(u.date);
        const dateHtml = label ? `<div class="text-xs text-white/60">${escapeHtml(label)}</div>` : `<div class="text-xs text-white/60"></div>`;

        const card = document.createElement("article");
        card.className = "rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition";
        card.innerHTML = `
          <div class="flex items-center justify-between gap-3">
            ${dateHtml}
            <div class="text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/80">
              ${escapeHtml(u.tag)}
            </div>
          </div>
          <div class="mt-3 text-lg font-extrabold">${escapeHtml(u.title)}</div>
          <p class="mt-2 text-sm text-white/70 leading-relaxed">${escapeHtml(u.body)}</p>
        `;
        grid.appendChild(card);
      });
    }

    function setupReveal() {
      const els = document.querySelectorAll(".reveal");
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add("is-in");
      }, { threshold: 0.12 });
      els.forEach(el => io.observe(el));
    }

    function setupHeader() {
      const header = document.getElementById("header");
      const onScroll = () => {
        const box = header.querySelector(".rounded-2xl");
        if (window.scrollY > 30) box.classList.add("shrink");
        else box.classList.remove("shrink");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    function setupMenu() {
      const btn = document.getElementById("menuBtn");
      const menu = document.getElementById("mobileMenu");
      btn.addEventListener("click", () => menu.classList.toggle("hidden"));
      menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.add("hidden")));
    }

    function wireConfigLinks(){
      if (!CFG) return;

      const home = CFG.pages?.home || "./index.html";
      const project = CFG.pages?.project || "./project-world-challenge.html";

      document.getElementById("homeLink").href = home + "#top";
      document.getElementById("backToHome").href = home + "#about";
      document.getElementById("toAbout").href = home + "#about";
      document.getElementById("mediaBack").href = home + "#media";
      document.getElementById("homeContact").href = home + "#contact";

      const email = CFG.contact?.email || "example@example.com";
      document.getElementById("mailLink").href = "mailto:" + email;

      const crowd = CFG.project?.crowdfundingUrl || "#";
      document.getElementById("crowdLink").href = crowd;

      const b = CFG.brand;
      const brandText = `${b?.nameMain || "POM PUPPYS"} ${b?.star || "★"}${b?.nameSub || "bright"}`;
      document.getElementById("brandLine").innerHTML =
        `${escapeHtml(b?.nameMain || "POM PUPPYS")} <span class="text-gold">${escapeHtml(b?.star || "★")}</span>${escapeHtml(b?.nameSub || "bright")}`;
      document.getElementById("footerBrand").textContent = brandText;
      document.title = `${brandText} | World Challenge Project`;
    }

    function setupCopy(){
      const btn = document.getElementById("copyLinkBtn");
      const toast = document.getElementById("toast");
      btn.addEventListener("click", async ()=>{
        try{
          await navigator.clipboard.writeText(location.href);
          toast.classList.remove("hidden");
          setTimeout(()=>toast.classList.add("hidden"), 2200);
        }catch(e){
          alert("コピーに失敗しました。URLを手動でコピーしてください。");
        }
      });
    }

    renderProgress();
    renderUpdates();
    wireConfigLinks();
    setupReveal();
    setupHeader();
    setupMenu();
    setupCopy();
  </script>
</body>
</html>
