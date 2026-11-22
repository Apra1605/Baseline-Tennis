
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
    import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
    import * as THREE from "three";
    import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
    import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDRT4cwQDS81HqAQEFOQUce7AY7jiqeTVQ",
      authDomain: "picknick-backpack-18839.firebaseapp.com",
      databaseURL: "https://picknick-backpack-18839-default-rtdb.firebaseio.com",
      projectId: "picknick-backpack-18839",
      storageBucket: "picknick-backpack-18839.firebasestorage.app",
      messagingSenderId: "415009432712",
      appId: "1:415009432712:web:a10cd8ea71da7cfe51ab3d"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const mainMusicTracks = [
      "./audio/FLOTE%2C%20Fendy%20Cisneros%2C%20Luxtides%20-%20Deep%20End%20%5BNCS%20Release%5D.mp3",
      "./audio/NIVIRO%20-%20Uncharted%20%5BNCS%20Release%5D.mp3",
      "./audio/voiceofruthie-inner-world-1-original-lyrics-335827.mp3"
    ];
    const mainMusic = new Audio(mainMusicTracks[Math.floor(Math.random() * mainMusicTracks.length)]);
    mainMusic.loop = true;
    mainMusic.volume = 0.42;
    mainMusic.preload = "auto";
    mainMusic.autoplay = true;
    mainMusic.playsInline = true;
    mainMusic.muted = false;

    let musicStarted = false;
    async function startMainMusic() {
      if (musicStarted) return;
      try {
        mainMusic.muted = false;
        mainMusic.volume = 0.42;
        await mainMusic.play();
        musicStarted = true;
      } catch (_) {
        // Autoplay may be blocked until gesture.
      }
    }

    async function startMainMusicFromGesture() {
      mainMusic.muted = false;
      mainMusic.volume = 0.42;
      try {
        await mainMusic.play();
        musicStarted = true;
      } catch (err) {
        console.warn("Main music failed to start on gesture.", err);
      }
    }

    window.addEventListener("pointerdown", () => { startMainMusicFromGesture(); }, { passive: true });
    window.addEventListener("keydown", () => { startMainMusicFromGesture(); });
    window.addEventListener("touchstart", () => { startMainMusicFromGesture(); }, { passive: true });
    window.addEventListener("load", () => { startMainMusic(); });

    const playerNameEl = document.getElementById("playerName");
    const playerOvrEl = document.getElementById("playerOvr");
    const playerUpEl = document.getElementById("playerUp");
    const leftPanel = document.getElementById("leftPanel");
    const canvas = document.getElementById("idleCanvas");
    const tabBtns = Array.from(document.querySelectorAll(".tabBtn"));
    const tabBodies = {
      upgrade: document.getElementById("tab-upgrade"),
      training: document.getElementById("tab-training"),
      career: document.getElementById("tab-career"),
      "quick-match": document.getElementById("tab-quick-match"),
      multiplayer: document.getElementById("tab-multiplayer")
    };
    const tabOrder = ["upgrade", "training", "career", "quick-match", "multiplayer"];
    let activeTabKey = "upgrade";
    const selectedIndexByTab = {
      upgrade: 0,
      training: 0,
      career: 0,
      "quick-match": 0,
      multiplayer: 0
    };
    const quickMatchBtn = document.getElementById("quickMatchBtn");
    const maxMatchBtn = document.getElementById("maxMatchBtn");
    const localMultiplayerBtn = document.getElementById("localMultiplayerBtn");
    const localMaxMultiplayerBtn = document.getElementById("localMaxMultiplayerBtn");
    const surfaceBtns = Array.from(document.querySelectorAll(".surfaceCard[data-surface]"));
    const careerGrid = document.getElementById("careerGrid");
    const careerBracketModal = document.getElementById("careerBracketModal");
    const careerModalBackdrop = document.getElementById("careerModalBackdrop");
    const careerModalCloseBtn = document.getElementById("careerModalCloseBtn");
    const careerPlayBtnModal = document.getElementById("careerPlayBtnModal");
    const careerRecommendedOvr = document.getElementById("careerRecommendedOvr");
    const careerBracketTitle = document.getElementById("careerBracketTitle");
    const careerBracketSubtitle = document.getElementById("careerBracketSubtitle");
    const careerBracketBoard = document.getElementById("careerBracketBoard");
    const careerResetBtn = document.getElementById("careerResetBtn");
    const careerResultHud = document.getElementById("careerResultHud");
    const careerResultTitle = document.getElementById("careerResultTitle");
    const careerResultSub = document.getElementById("careerResultSub");
    const careerResultUp = document.getElementById("careerResultUp");
    const careerResultMeta = document.getElementById("careerResultMeta");
    const careerResultContinueBtn = document.getElementById("careerResultContinueBtn");
    const resetProgressBtn = document.getElementById("resetProgressBtn");
    const upgradeBtns = Array.from(document.querySelectorAll("#tab-upgrade .upgradeBtn[data-stat]"));
    const leftTierBadgeEl = document.getElementById("leftTierBadge");
    const musicChipEl = document.getElementById("musicChip");
    const footerSurfaceBadgeEl = document.getElementById("footerSurfaceBadge");
    const leftPlayerNameEl = document.getElementById("leftPlayerName");
    const leftPlayerMetaEl = document.getElementById("leftPlayerMeta");
    const bestStatTextEl = document.getElementById("bestStatText");
    const tierCapTextEl = document.getElementById("tierCapText");
    const heroTierBadgeEl = document.getElementById("heroTierBadge");
    const heroSurfaceBadgeEl = document.getElementById("heroSurfaceBadge");
    const heroOvrFrontEl = document.getElementById("heroOvr");
    const heroCareerWinsEl = document.getElementById("heroCareerWins");
    const heroTierCapEl = document.getElementById("heroTierCap");
    const heroPlaystyleEl = document.getElementById("heroPlaystyle");
    const menuHeroSubEl = document.getElementById("menuHeroSub");
    const surfaceSpotlightTitleEl = document.getElementById("surfaceSpotlightTitle");
    const surfaceSpotlightMetaEl = document.getElementById("surfaceSpotlightMeta");
    const surfaceTagOneEl = document.getElementById("surfaceTagOne");
    const surfaceTagTwoEl = document.getElementById("surfaceTagTwo");
    const surfaceTagThreeEl = document.getElementById("surfaceTagThree");
    const tipTickerEl = document.getElementById("tipTicker");
    const trainingJumpBtns = Array.from(document.querySelectorAll(".trainingActionBtn[data-target-tab]"));
    const openAnimationPreviewBtn = document.getElementById("openAnimationPreviewBtn");
    requestAnimationFrame(() => {
      document.body.classList.add("menu-ready");
    });
    const progressEls = {
      speed: { pct: document.getElementById("pct-speed"), fill: document.getElementById("fill-speed") },
      stamina: { pct: document.getElementById("pct-stamina"), fill: document.getElementById("fill-stamina") },
      power: { pct: document.getElementById("pct-power"), fill: document.getElementById("fill-power") },
      accuracy: { pct: document.getElementById("pct-accuracy"), fill: document.getElementById("fill-accuracy") }
    };
    const DEFAULT_PROGRESS = { speed: 55, stamina: 60, power: 65, accuracy: 50 };
    const DEFAULT_UP = 0;
    const POWER_BASE_MIN = 65;
    const SURFACE_PRESENTATION = Object.freeze({
      hard: {
        name: "Hard Court",
        meta: "Neutral bounce, balanced pace, and the cleanest read on your current build.",
        tags: ["Balanced Pace", "Predictable Bounce", "All-Court Friendly"]
      },
      grass: {
        name: "Grass Court",
        meta: "Low skids, quick strikes, and shorter reaction windows that reward first-strike tennis.",
        tags: ["Low Bounce", "Fast Finish", "Serve Friendly"]
      },
      clay: {
        name: "Clay Court",
        meta: "Longer rallies, heavier movement, and extra time to defend, build, and outlast.",
        tags: ["Long Rallies", "High Bounce", "Defense Heavy"]
      }
    });
    const CAREER_PERSONALITY_LABELS = Object.freeze({
      all_court: "All-Court",
      baseliner: "Baseliner",
      server: "Big Server",
      counterpuncher: "Counterpuncher",
      net_rusher: "Net Rusher",
      risky_hitter: "Risky Hitter"
    });
    const CAREER_TIME_POOLS_BY_SURFACE = Object.freeze({
      hard: Object.freeze(["morning", "afternoon", "golden-hour", "sunset", "night"]),
      grass: Object.freeze(["morning", "afternoon", "golden-hour", "sunset"]),
      clay: Object.freeze(["morning", "afternoon", "golden-hour", "sunset"])
    });
    const CAREER_VENUE_KEYS = Object.freeze([
      "sunset-palm",
      "emerald-garden",
      "crimson-forum",
      "midnight-steel",
      "pinecrest-lawn",
      "harbor-forge",
      "juniper-redcourt",
      "kingspray-lawn",
      "obsidian-rail",
      "dustspire-clay",
      "cobalt-ridge",
      "whitecap-lawn",
      "summit-wire",
      "cathedral-clay",
      "mercury-lawn",
      "velour-arena",
      "red-basilica",
      "circuit-break",
      "violet-night",
      "saffron-clay",
      "imperial-glass",
      "azure-crown",
      "verdant-major",
      "empire-clay",
      "midnight-plex",
      "ivory-lawn",
      "firedust-major",
      "titanium-slam",
      "last-light"
    ]);
    const TIER_PRESENTATION = Object.freeze({
      amateur: "Amateur Circuit",
      challenger: "Challenger Circuit",
      pro: "Pro Circuit",
      grand_slam: "Grand Slam Circuit"
    });
    let tipRotationIndex = 0;
    const TIER_STAT_CAPS = Object.freeze({
      amateur: 75,
      challenger: 88,
      pro: 96,
      grand_slam: 100
    });
    const TIER_RANK = Object.freeze({ amateur: 1, challenger: 2, pro: 3, grand_slam: 4 });
    const DEFAULT_TIER_KEY = "amateur";
    const currentProgress = { ...DEFAULT_PROGRESS };
    let currentUp = DEFAULT_UP;
    let currentTierKey = DEFAULT_TIER_KEY;
    let selectedSurfaceKey = "hard";
    let tutorialAmateurT1R16Complete = false;
    let pendingTutorialCompletionFromResult = false;
    const CAREER_ROUND_ORDER = ["r16", "qf", "sf", "f"];
    const CAREER_ROUND_LABELS = {
      r16: "Round of 16",
      qf: "Quarterfinal",
      sf: "Semifinal",
      f: "Final"
    };
    const CAREER_NEXT_ROUND = {
      r16: "qf",
      qf: "sf",
      sf: "f",
      f: null
    };
    function createCareerTournament(code, tierKey, name, description, aiOvr, roundAwards, options = {}) {
      const tierLabels = {
        amateur: "Amateur",
        challenger: "Challenger",
        pro: "Pro",
        grand_slam: "Grand Slam"
      };
      const surfaceKey = normalizeSurfaceKey(options.surfaceKey || "hard");
      const personalityKey = String(options.personalityKey || "all_court").trim().toLowerCase() || "all_court";
      const requestedVenueKey = String(options.venueKey || "").trim().toLowerCase();
      const venueKey = CAREER_VENUE_KEYS.includes(requestedVenueKey) ? requestedVenueKey : CAREER_VENUE_KEYS[0];
      const rawTimeOptions = Array.isArray(options.timeOptions) && options.timeOptions.length
        ? options.timeOptions
        : (options.timeOfDay ? [options.timeOfDay] : (Array.isArray(options.timePool) ? options.timePool : []));
      const timePool = rawTimeOptions.length
        ? rawTimeOptions.map((entry) => String(entry || "").trim().toLowerCase()).filter(Boolean)
        : (CAREER_TIME_POOLS_BY_SURFACE[surfaceKey] || CAREER_TIME_POOLS_BY_SURFACE.hard).slice();
      return {
        code,
        tierKey,
        tierLabel: tierLabels[tierKey] || "Career",
        name,
        description,
        aiOvr,
        roundAwards,
        championBonus: 1,
        surfaceKey,
        personalityKey,
        personalityLabel: CAREER_PERSONALITY_LABELS[personalityKey] || "All-Court",
        specialRule: String(options.specialRule || "").trim(),
        venueKey,
        venueTag: String(options.venueTag || "").trim(),
        timePool
      };
    }

    function chooseTournamentTimeOfDay(def) {
      const pool = Array.isArray(def?.timePool) && def.timePool.length
        ? def.timePool
        : (CAREER_TIME_POOLS_BY_SURFACE[normalizeSurfaceKey(def?.surfaceKey || "hard")] || CAREER_TIME_POOLS_BY_SURFACE.hard);
      return pool[Math.floor(Math.random() * pool.length)] || "afternoon";
    }

    function getRawUpgradeCostForValue(statValue, tierCap) {
      const v = Math.max(0, Math.min(100, Math.round(Number(statValue) || 0)));
      if (v >= tierCap) return Number.POSITIVE_INFINITY;
      if (v < 70) return 1;
      if (v < 85) return 2;
      if (v < 95) return 3;
      return 6;
    }

    function simulateGreedySpend(progress, availableUp, tierCap) {
      let up = Math.max(0, Math.round(Number(availableUp) || 0));
      let guard = 0;
      while (up > 0 && guard < 500) {
        const candidates = Object.keys(progress)
          .map((stat) => ({
            stat,
            value: Math.max(0, Math.min(100, Math.round(Number(progress[stat]) || 0))),
            cost: getRawUpgradeCostForValue(progress[stat], tierCap)
          }))
          .filter((c) => Number.isFinite(c.cost) && up >= c.cost)
          .sort((a, b) => (a.cost - b.cost) || (a.value - b.value) || a.stat.localeCompare(b.stat));
        if (!candidates.length) break;
        const best = candidates[0];
        up -= best.cost;
        progress[best.stat] = Math.min(tierCap, Math.max(best.stat === "power" ? POWER_BASE_MIN : 0, progress[best.stat] + 1));
        guard++;
      }
      return up;
    }

    function tournamentMaxUpFromDefinition(def) {
      return CAREER_ROUND_ORDER.reduce((sum, key) => sum + Math.max(0, Math.round(Number(def?.roundAwards?.[key]) || 0)), 0) +
        Math.max(0, Math.round(Number(def?.championBonus) || 0));
    }

    function balanceCareerTournamentOvrs(definitions) {
      const progress = { ...DEFAULT_PROGRESS };
      let availableUp = DEFAULT_UP;
      let tierKey = DEFAULT_TIER_KEY;
      const tierOffsets = { amateur: -2, challenger: -1, pro: 0, grand_slam: 1 };
      return definitions.map((def) => {
        const nextRank = TIER_RANK[def.tierKey] || 0;
        const currentRank = TIER_RANK[tierKey] || 0;
        if (nextRank > currentRank) tierKey = def.tierKey;
        const cap = TIER_STAT_CAPS[tierKey] || 100;
        for (const stat of Object.keys(progress)) {
          progress[stat] = Math.min(cap, Math.max(stat === "power" ? POWER_BASE_MIN : 0, Math.round(progress[stat])));
        }
        availableUp = simulateGreedySpend(progress, availableUp, cap);
        const predictedPlayerOvr = Math.round((progress.speed + progress.stamina + progress.power + progress.accuracy) / 4);
        const balancedOvr = Math.max(def.aiOvr, Math.max(50, Math.min(cap, predictedPlayerOvr + (tierOffsets[def.tierKey] ?? -1))));
        const out = { ...def, predictedPlayerOvr, aiOvr: balancedOvr };
        availableUp += tournamentMaxUpFromDefinition(def);
        availableUp = simulateGreedySpend(progress, availableUp, cap);
        return out;
      });
    }

    const CAREER_TOURNAMENTS = Object.freeze(balanceCareerTournamentOvrs([
      createCareerTournament("A1", "amateur", "Community Classic", "A bright hard-court opener built for clean contact and simple point construction.", 52, { r16: 1, qf: 1, sf: 1, f: 1 }, { surfaceKey: "hard", venueKey: "sunset-palm", personalityKey: "baseliner", specialRule: "Very steady baseliners and forgiving pace.", venueTag: "Club Hard" }),
      createCareerTournament("A2", "amateur", "Riverside Cup", "Your first grass stop: low skids, rushed reactions, and short first-strike exchanges.", 54, { r16: 1, qf: 1, sf: 1, f: 1 }, { surfaceKey: "grass", venueKey: "emerald-garden", personalityKey: "server", specialRule: "Serve-friendly grass with shorter rallies.", venueTag: "Riverside Grass" }),
      createCareerTournament("A3", "amateur", "Heritage Open", "A beginner clay event where patience matters more than raw pace.", 56, { r16: 1, qf: 1, sf: 1, f: 1 }, { surfaceKey: "clay", venueKey: "crimson-forum", personalityKey: "counterpuncher", specialRule: "Longer clay points and extra defensive pressure.", venueTag: "Heritage Clay" }),
      createCareerTournament("A4", "amateur", "Metro Cup", "Compact hard courts reward flat timing and early control from the baseline.", 58, { r16: 1, qf: 1, sf: 1, f: 1 }, { surfaceKey: "hard", venueKey: "midnight-steel", personalityKey: "all_court", specialRule: "Balanced field with cleaner all-court patterns.", venueTag: "Metro Hard" }),
      createCareerTournament("A5", "amateur", "Rising Stars Championship", "An old-school grass venue where the ball stays low and the crowd loves attacking tennis.", 60, { r16: 1, qf: 1, sf: 1, f: 1 }, { surfaceKey: "grass", venueKey: "pinecrest-lawn", personalityKey: "server", specialRule: "Big first-strike serving to finish the Amateur tier.", venueTag: "Rising Grass" }),
      createCareerTournament("C1", "challenger", "Pacific Open", "A hard-court jump in quality with heavier pace and smarter depth control.", 72, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "hard", venueKey: "harbor-forge", personalityKey: "baseliner", specialRule: "Relentless baseline depth from both corners.", venueTag: "Pacific Hard" }),
      createCareerTournament("C2", "challenger", "Desert Crown", "Slow clay exchanges punish rushed shot selection and reward measured rally building.", 74, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "clay", venueKey: "juniper-redcourt", personalityKey: "counterpuncher", specialRule: "Counterpunchers grind every service game.", venueTag: "Desert Clay" }),
      createCareerTournament("C3", "challenger", "Alpine Masters", "A slick grass draw where the first clean strike often decides the point.", 76, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "grass", venueKey: "kingspray-lawn", personalityKey: "server", specialRule: "Aggressive serving with skidding returns.", venueTag: "Alpine Grass" }),
      createCareerTournament("C4", "challenger", "Emerald Championship", "Quick hard courts with compact rallies make this a pressure test for footwork.", 78, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "hard", venueKey: "obsidian-rail", personalityKey: "risky_hitter", specialRule: "Risky hitters attack early and often.", venueTag: "Emerald Hard" }),
      createCareerTournament("C5", "challenger", "Capital Open", "Heavy clay bounce gives defenders time to extend rallies deep into every game.", 80, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "clay", venueKey: "dustspire-clay", personalityKey: "counterpuncher", specialRule: "High-bounce clay and stubborn coverage.", venueTag: "Capital Clay" }),
      createCareerTournament("C6", "challenger", "Golden Bay Masters", "Neutral hard courts, louder crowds, and the first truly complete all-court opponents.", 82, { r16: 1, qf: 2, sf: 2, f: 3 }, { surfaceKey: "hard", venueKey: "cobalt-ridge", personalityKey: "all_court", specialRule: "All-court AI with sharper transitions.", venueTag: "Golden Bay Hard" }),
      createCareerTournament("C7", "challenger", "Challenger Finals", "The final Challenger stop is pure grass stress: low skid, quick points, and constant serve pressure.", 84, { r16: 1, qf: 2, sf: 2, f: 2 }, { surfaceKey: "grass", venueKey: "whitecap-lawn", personalityKey: "net_rusher", specialRule: "Frequent net attacks and rushing returns.", venueTag: "Finals Grass" }),
      createCareerTournament("P1", "pro", "Coastal International", "The pro circuit opens on hard courts with disciplined rally patterns and heavier ball striking.", 89, { r16: 1, qf: 3, sf: 4, f: 4 }, { surfaceKey: "hard", venueKey: "summit-wire", personalityKey: "all_court", specialRule: "Well-rounded pros with no easy holes.", venueTag: "Coastal Hard" }),
      createCareerTournament("P2", "pro", "Monte Vista Masters", "Long clay exchanges meet elite spacing, forcing precision over impatience.", 90, { r16: 1, qf: 3, sf: 3, f: 4 }, { surfaceKey: "clay", venueKey: "cathedral-clay", personalityKey: "baseliner", specialRule: "Baseline pressure ramps up every round.", venueTag: "Monte Vista Clay" }),
      createCareerTournament("P3", "pro", "Crown of Madrid", "A fast grass tournament where return games are scarce and placement under pressure matters most.", 91, { r16: 1, qf: 3, sf: 3, f: 4 }, { surfaceKey: "grass", venueKey: "mercury-lawn", personalityKey: "server", specialRule: "Serve-heavy draw with low-bounce chaos.", venueTag: "Madrid Grass" }),
      createCareerTournament("P4", "pro", "Roman International", "Clean hard courts and slick movement create a premium all-court battle.", 92, { r16: 1, qf: 3, sf: 3, f: 4 }, { surfaceKey: "hard", venueKey: "velour-arena", personalityKey: "all_court", specialRule: "Balanced pros who adjust mid-rally.", venueTag: "Roman Hard" }),
      createCareerTournament("P5", "pro", "Paris Masters", "This clay week is all about depth, margin, and surviving the rally that should have ended twice already.", 93, { r16: 1, qf: 3, sf: 3, f: 4 }, { surfaceKey: "clay", venueKey: "red-basilica", personalityKey: "counterpuncher", specialRule: "Extended rallies and higher defensive IQ.", venueTag: "Paris Clay" }),
      createCareerTournament("P6", "pro", "London Championship", "A dangerous grass bracket where net-rushers punish any return left floating.", 94, { r16: 1, qf: 3, sf: 3, f: 4 }, { surfaceKey: "grass", venueKey: "circuit-break", personalityKey: "net_rusher", specialRule: "Net rushers close in aggressively behind strong serves.", venueTag: "London Grass" }),
      createCareerTournament("P7", "pro", "New York Masters", "Under lights on hard court, risky first-strike hitters test your reactions from the opening ball.", 95, { r16: 1, qf: 3, sf: 3, f: 3 }, { surfaceKey: "hard", venueKey: "violet-night", personalityKey: "risky_hitter", specialRule: "High-risk offense and sharper winners attempts.", venueTag: "New York Hard" }),
      createCareerTournament("P8", "pro", "Tokyo International", "A prestige clay stop where points stretch, legs burn, and pattern discipline decides titles.", 96, { r16: 1, qf: 3, sf: 3, f: 3 }, { surfaceKey: "clay", venueKey: "saffron-clay", personalityKey: "baseliner", specialRule: "Heavy topspin patterns and deeper recovery positioning.", venueTag: "Tokyo Clay" }),
      createCareerTournament("P9", "pro", "World Tour Finals", "The last pro event returns to hard court with elite all-court players and almost no free points.", 96, { r16: 1, qf: 3, sf: 3, f: 3 }, { surfaceKey: "hard", venueKey: "imperial-glass", personalityKey: "all_court", specialRule: "Complete opponents before the Slam stage.", venueTag: "Finals Hard" }),

      createCareerTournament("G1", "grand_slam", "Grand Harbor Championship", "A major hard-court opener with championship pace and ruthless return depth.", 97, { r16: 2, qf: 5, sf: 6, f: 7 }, { surfaceKey: "hard", venueKey: "azure-crown", personalityKey: "all_court", specialRule: "Major-stage all-court pressure from round one.", venueTag: "Harbor Hard" }),
      createCareerTournament("G2", "grand_slam", "Royal Grass Championship", "The biggest grass stage on the calendar rewards fearless serving and instinctive net play.", 97, { r16: 2, qf: 5, sf: 6, f: 7 }, { surfaceKey: "grass", venueKey: "verdant-major", personalityKey: "net_rusher", specialRule: "Major grass with aggressive forward movement.", venueTag: "Royal Grass" }),
      createCareerTournament("G3", "grand_slam", "Royal Clay Championship", "A punishing clay major where counterpunchers can drag any rally into a war of patience.", 98, { r16: 2, qf: 5, sf: 6, f: 7 }, { surfaceKey: "clay", venueKey: "empire-clay", personalityKey: "counterpuncher", specialRule: "Elite clay defense and long baseline patterns.", venueTag: "Royal Clay" }),
      createCareerTournament("G4", "grand_slam", "Metropolitan Grand", "Fast hard-court night sessions magnify every rushed decision and every loose second serve.", 98, { r16: 2, qf: 5, sf: 6, f: 7 }, { surfaceKey: "hard", venueKey: "midnight-plex", personalityKey: "risky_hitter", specialRule: "Attack-minded elite hitters under the lights.", venueTag: "Metro Grand" }),
      createCareerTournament("G5", "grand_slam", "Pacific Grand", "Ultra-clean grass rewards brave return positioning and perfect first-strike timing.", 99, { r16: 2, qf: 5, sf: 6, f: 7 }, { surfaceKey: "grass", venueKey: "ivory-lawn", personalityKey: "server", specialRule: "Big-serving champions on the quickest stage left.", venueTag: "Pacific Grass" }),
      createCareerTournament("G6", "grand_slam", "Desert World Championship", "The heaviest clay draw of the career path, where point construction must stay calm under pressure.", 99, { r16: 2, qf: 5, sf: 7, f: 7 }, { surfaceKey: "clay", venueKey: "firedust-major", personalityKey: "baseliner", specialRule: "Massive clay rallies with elite depth and spin.", venueTag: "Desert Clay" }),
      createCareerTournament("G7", "grand_slam", "Imperial Grand", "A brutal hard-court major packed with all-court stars who can punish any predictable pattern.", 100, { r16: 2, qf: 5, sf: 7, f: 7 }, { surfaceKey: "hard", venueKey: "titanium-slam", personalityKey: "all_court", specialRule: "Near-perfect tactical balance across the draw.", venueTag: "Imperial Hard" }),
      createCareerTournament("G8", "grand_slam", "Baseline World Championship", "The final mountain: a showcase major where the opponent identity is pure elite pressure, regardless of scoreline.", 100, { r16: 2, qf: 5, sf: 7, f: 7 }, { surfaceKey: "hard", venueKey: "last-light", personalityKey: "risky_hitter", specialRule: "Championship pace, fearless offense, and no soft points.", venueTag: "World Final" })
    ]));
    const CAREER_TOURNAMENT_COUNT = CAREER_TOURNAMENTS.length;
    const tournamentSubtitles = CAREER_TOURNAMENTS.map((t) => t.name);
    const tournamentDescriptions = CAREER_TOURNAMENTS.map((t) => t.description);
    const nameFirst = [
      "Alex", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Avery", "Parker", "Rowan", "Reese",
      "Logan", "Blake", "Drew", "Quinn", "Skyler", "Cameron", "Hayden", "Elliot", "Jamie", "Kendall",
      "Micah", "Nico", "Noel", "Sage", "Harper", "Kieran", "Eden", "Emery", "Kai", "Zion",
      "Aria", "Mila", "Luca", "Elena", "Mason", "Nina", "Leo", "Iris", "Owen", "Ruby"
    ];
    const nameLast = [
      "Stone", "Miller", "Woods", "Grant", "Cruz", "Perry", "Walsh", "Frost", "Flynn", "Reed",
      "Brooks", "Shaw", "Meyer", "Hayes", "Cole", "Pike", "Lane", "Pace", "West", "Hart",
      "Boyd", "Fox", "Nash", "Bennett", "Diaz", "Khan", "Patel", "Kim", "Ibrahim", "Rossi",
      "Silva", "Santos", "Laurent", "Dubois", "Novak", "Ishikawa", "Tanaka", "Yamada", "Singh", "Park"
    ];
    let currentUser = null;
    let currentUsername = "";
    let currentUsernameCanonical = "";
    let activeTournamentIndex = 0;
    let careerStates = [];
    let careerOwnerKey = "";
    let careerWins = 0;
    let careerDbSaveTimer = null;

    function clampPct(v) {
      return Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
    }

    function clampUp(v) {
      return Math.max(0, Math.round(Number(v) || 0));
    }

    function normalizeTierKey(v) {
      const key = String(v || "").trim().toLowerCase();
      if (key in TIER_STAT_CAPS) return key;
      return DEFAULT_TIER_KEY;
    }

    function getCurrentTierCap() {
      return TIER_STAT_CAPS[normalizeTierKey(currentTierKey)] ?? 100;
    }

    function getTournamentDefinition(index) {
      const i = clamp(Number(index) || 0, 0, CAREER_TOURNAMENT_COUNT - 1);
      return CAREER_TOURNAMENTS[Math.floor(i)] || CAREER_TOURNAMENTS[0];
    }

    function promoteTierForTournament(index) {
      const def = getTournamentDefinition(index);
      const nextTier = normalizeTierKey(def?.tierKey);
      const currentRank = TIER_RANK[normalizeTierKey(currentTierKey)] || 0;
      const nextRank = TIER_RANK[nextTier] || 0;
      if (nextRank > currentRank) currentTierKey = nextTier;
    }

    function clampStatToTierCap(statKey, value) {
      const cap = getCurrentTierCap();
      const pct = clampPct(value);
      if (statKey === "power") {
        return Math.min(cap, Math.max(POWER_BASE_MIN, pct));
      }
      return Math.min(cap, pct);
    }

    // Cost to increase one stat point based on current value before upgrade.
    function getUpgradeCostForValue(statValue) {
      const v = clampPct(statValue);
      const cap = getCurrentTierCap();
      if (v >= cap) return Number.POSITIVE_INFINITY;
      if (v < 70) return 1;   // 50 -> 70
      if (v < 85) return 2;   // 70 -> 85
      if (v < 95) return 3;   // 85 -> 95
      return 6;               // 95 -> 100
    }

    function greedySpendAvailableUp() {
      const upgrades = [];
      let spent = 0;
      let guard = 0;
      while (currentUp > 0 && guard < 500) {
        const candidates = Object.keys(currentProgress)
          .map((stat) => ({
            stat,
            value: clampPct(currentProgress[stat]),
            cost: getUpgradeCostForValue(currentProgress[stat])
          }))
          .filter((c) => Number.isFinite(c.cost) && currentUp >= c.cost)
          .sort((a, b) => (a.cost - b.cost) || (a.value - b.value) || a.stat.localeCompare(b.stat));
        if (!candidates.length) break;
        const best = candidates[0];
        currentUp = clampUp(currentUp - best.cost);
        currentProgress[best.stat] = clampStatToTierCap(best.stat, currentProgress[best.stat] + 1);
        spent += best.cost;
        upgrades.push(best.stat);
        guard++;
      }
      return { spent, upgrades };
    }

    function getUpgradeLabelForStat(statKey) {
      if (!statKey || !(statKey in currentProgress)) return "Upgrade";
      const cost = getUpgradeCostForValue(currentProgress[statKey]);
      if (!Number.isFinite(cost)) return "Tier max reached!";
      return `Upgrade (${cost} UP)`;
    }

    function updateUpgradeButtonLabels() {
      for (const btn of upgradeBtns) {
        const stat = btn.dataset.stat;
        if (!stat || !(stat in currentProgress)) continue;
        // Preserve temporary button messages while the upgrade action is running.
        if (btn.disabled && btn.textContent === "Saving...") continue;
        btn.textContent = getUpgradeLabelForStat(stat);
      }
    }

    function computeOvrFromProgress() {
      const s = clampPct(currentProgress.speed);
      const st = clampPct(currentProgress.stamina);
      const p = clampPct(currentProgress.power);
      const a = clampPct(currentProgress.accuracy);
      return Math.round((s + st + p + a) / 4);
    }

    function updateHudOvr() {
      if (!playerOvrEl) return;
      playerOvrEl.textContent = String(computeOvrFromProgress());
      if (playerUpEl) playerUpEl.textContent = String(clampUp(currentUp));
      updateMenuFrontEnd();
    }

    function normalizeUsername(v) {
      return String(v || "").replace(/\s+/g, " ").trim();
    }

    function usernameCanonical(v) {
      return normalizeUsername(v).toLowerCase();
    }

    function progressRefPath(canonicalName) {
      return `progressByUsername/${canonicalName}`;
    }
    function careerRefPath(canonicalName) {
      return `careerByUsername/${canonicalName}`;
    }

    function careerStorageKey() {
      return `tennis_career_brackets_${currentUsernameCanonical || "guest"}`;
    }

    function clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v));
    }

    function normalizeSurfaceKey(v) {
      const key = String(v || "").trim().toLowerCase();
      return ["hard", "grass", "clay"].includes(key) ? key : "hard";
    }

    function getTournamentSurfaceName(surfaceKey) {
      return SURFACE_PRESENTATION[normalizeSurfaceKey(surfaceKey)]?.name || "Hard Court";
    }

    function formatStatName(statKey) {
      const raw = String(statKey || "").trim().toLowerCase();
      if (!raw) return "Stat";
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    function getTierPresentationLabel(tierKey) {
      return TIER_PRESENTATION[normalizeTierKey(tierKey)] || "Amateur Circuit";
    }

    function getCurrentMusicLabel() {
      const src = decodeURIComponent(String(mainMusic.currentSrc || mainMusic.src || ""));
      const file = src.split("/").pop() || "";
      if (/deep end/i.test(file)) return "♪ Deep End";
      if (/uncharted/i.test(file)) return "♪ Uncharted";
      if (/inner-world/i.test(file)) return "♪ Inner World";
      return `♪ ${file.replace(/\.mp3$/i, "").replace(/[-_]+/g, " ").trim() || "Main Theme"}`;
    }

    function getBestStatEntry() {
      return Object.keys(currentProgress)
        .map((key) => ({ key, value: clampPct(currentProgress[key]) }))
        .sort((a, b) => (b.value - a.value) || a.key.localeCompare(b.key))[0] || { key: "power", value: 0 };
    }

    function getPlayerPlaystyle() {
      const speed = clampPct(currentProgress.speed);
      const stamina = clampPct(currentProgress.stamina);
      const power = clampPct(currentProgress.power);
      const accuracy = clampPct(currentProgress.accuracy);
      if (power >= accuracy + 6 && power >= speed + 4) return "First-Strike Power";
      if (accuracy >= power + 4 && accuracy >= stamina) return "Precision Builder";
      if (speed >= power && stamina >= accuracy) return "Counterpuncher";
      if (speed >= 70 && power >= 70) return "Aggressive All-Courter";
      return "Balanced All-Courter";
    }

    function getPlayerMetaLine() {
      const best = getBestStatEntry();
      const style = getPlayerPlaystyle();
      return `${style} with ${formatStatName(best.key).toLowerCase()} leading the build at ${best.value}%.`;
    }

    function getTipsForCurrentView() {
      const surface = SURFACE_PRESENTATION[selectedSurfaceKey] || SURFACE_PRESENTATION.hard;
      const tipSets = {
        upgrade: [
          `Spend UP on your weakest stat first if you want the biggest OVR jump.`,
          `${surface.name} is a great place to test whether your build still feels balanced.`,
          `Power and accuracy together shape your most noticeable match feel on serve and attack.`
        ],
        training: [
          `Use Animation Preview when you want faster feedback than loading a full match.`,
          `Quick Match is the fastest route to test how a surface changes timing and bounce feel.`,
          `Career gives you the clearest read on whether your build scales under pressure.`
        ],
        career: [
          `Amateur events stay forgiving, but Challenger starts punishing weak stat balance fast.`,
          `If a bracket looks tough, build a cleaner all-court profile before rushing ahead.`,
          `Higher circuits lift the tier cap, so UP becomes more valuable deeper into the run.`
        ],
        "quick-match": [
          `${surface.name} currently rewards ${surface.tags[0].toLowerCase()} and ${surface.tags[1].toLowerCase()}.`,
          `Use Quick Match to compare rally tempo across surfaces without risking career progress.`,
          `Max Match is useful when you want to feel the surface itself without stat limitations.`
        ],
        multiplayer: [
          `Use the same selected surface to keep local matches consistent with solo tuning.`,
          `Max Match Multiplayer is the cleanest way to test pure skill without build differences.`,
          `If both players want faster points, try grass; if you want longer chess-like rallies, go clay.`
        ]
      };
      return tipSets[activeTabKey] || tipSets.upgrade;
    }

    function updateTipTicker(resetIndex = false) {
      if (!tipTickerEl) return;
      const tips = getTipsForCurrentView();
      if (!tips.length) return;
      if (resetIndex) tipRotationIndex = 0;
      tipTickerEl.textContent = `Tip: ${tips[tipRotationIndex % tips.length]}`;
    }

    function updateMenuFrontEnd() {
      const best = getBestStatEntry();
      const surface = SURFACE_PRESENTATION[selectedSurfaceKey] || SURFACE_PRESENTATION.hard;
      const tierLabel = getTierPresentationLabel(currentTierKey);
      const ovr = computeOvrFromProgress();
      const cap = getCurrentTierCap();
      const style = getPlayerPlaystyle();
      const playerLabel = currentUsername || "Player";
      if (leftTierBadgeEl) leftTierBadgeEl.textContent = tierLabel;
      if (heroTierBadgeEl) heroTierBadgeEl.textContent = tierLabel;
      if (heroSurfaceBadgeEl) heroSurfaceBadgeEl.textContent = `${surface.name} Selected`;
      if (footerSurfaceBadgeEl) footerSurfaceBadgeEl.textContent = surface.name;
      if (musicChipEl) musicChipEl.textContent = getCurrentMusicLabel();
      if (leftPlayerNameEl) leftPlayerNameEl.textContent = playerLabel;
      if (leftPlayerMetaEl) leftPlayerMetaEl.textContent = getPlayerMetaLine();
      if (bestStatTextEl) bestStatTextEl.textContent = `${formatStatName(best.key)} - ${best.value}%`;
      if (tierCapTextEl) tierCapTextEl.textContent = `${cap} max this tier`;
      if (heroOvrFrontEl) heroOvrFrontEl.textContent = String(ovr);
      if (heroCareerWinsEl) heroCareerWinsEl.textContent = String(clampUp(careerWins));
      if (heroTierCapEl) heroTierCapEl.textContent = String(cap);
      if (heroPlaystyleEl) heroPlaystyleEl.textContent = style;
      if (menuHeroSubEl) menuHeroSubEl.textContent = `${playerLabel} is currently in the ${tierLabel.toLowerCase()} with ${clampUp(currentUp)} UP available and a ${ovr} OVR build ready for the next match.`;
      if (surfaceSpotlightTitleEl) surfaceSpotlightTitleEl.textContent = surface.name;
      if (surfaceSpotlightMetaEl) surfaceSpotlightMetaEl.textContent = surface.meta;
      if (surfaceTagOneEl) surfaceTagOneEl.textContent = surface.tags[0] || "";
      if (surfaceTagTwoEl) surfaceTagTwoEl.textContent = surface.tags[1] || "";
      if (surfaceTagThreeEl) surfaceTagThreeEl.textContent = surface.tags[2] || "";
    }

    function setSelectedSurface(key) {
      selectedSurfaceKey = normalizeSurfaceKey(key);
      localStorage.setItem("tennis_quick_surface", selectedSurfaceKey);
      const quickSurfaceBtns = getSurfaceButtonsForTab("quick-match");
      const multiplayerSurfaceBtns = getSurfaceButtonsForTab("multiplayer");
      const selectedQuickSurfaceIndex = quickSurfaceBtns.findIndex((btn) => btn.dataset.surface === selectedSurfaceKey);
      const selectedMultiplayerSurfaceIndex = multiplayerSurfaceBtns.findIndex((btn) => btn.dataset.surface === selectedSurfaceKey);
      if (selectedQuickSurfaceIndex >= 0) selectedIndexByTab["quick-match"] = selectedQuickSurfaceIndex;
      if (selectedMultiplayerSurfaceIndex >= 0) selectedIndexByTab.multiplayer = selectedMultiplayerSurfaceIndex;
      surfaceBtns.forEach((btn) => {
        btn.classList.toggle("selected", btn.dataset.surface === selectedSurfaceKey);
      });
      updateMenuFrontEnd();
      updateTipTicker(true);
    }

    function getSurfaceButtonsForTab(tabKey) {
      const tab = tabBodies[tabKey];
      return tab ? Array.from(tab.querySelectorAll(".surfaceCard[data-surface]")) : [];
    }

    function getCareerAiOvrForTournament(index) {
      return clampPct(getTournamentDefinition(index)?.aiOvr ?? 52);
    }

    function getCareerAiSmartnessForTournament(index) {
      const def = getTournamentDefinition(index);
      const tier = def?.tierKey || "amateur";
      const tierEvents = CAREER_TOURNAMENTS.filter((t) => t.tierKey === tier);
      const currentCode = def?.code ?? null;
      const tIdx = THREE.MathUtils.clamp(
        Math.max(0, tierEvents.findIndex((t) => t.code === currentCode)),
        0,
        Math.max(0, tierEvents.length - 1)
      );
      const smartnessMap = {
        amateur: [0.06, 0.10, 0.14, 0.18, 0.22],
        challenger: [0.42, 0.50, 0.58, 0.64, 0.70, 0.76, 0.82],
        pro: [0.86, 0.89, 0.92, 0.94, 0.96, 0.97, 0.98, 0.99, 1.00],
        grand_slam: [1.00, 1.00, 1.00, 1.00]
      };
      return smartnessMap[tier]?.[tIdx] ?? 0.5;
    }

    function getCareerTierDividerHint(tierKey) {
      if (tierKey === "amateur") return "No AI dropshots - very low AI IQ";
      if (tierKey === "challenger") return "Dropshots unlock - smarter AI";
      if (tierKey === "pro") return "Advanced tactics - high-level AI";
      if (tierKey === "grand_slam") return "Elite Champion-level AI";
      return "";
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.max(1, max));
    }

    function createRandomOpponentName(used) {
      let candidate = "";
      for (let i = 0; i < 200; i++) {
        const first = nameFirst[getRandomInt(nameFirst.length)];
        const last = nameLast[getRandomInt(nameLast.length)];
        candidate = `${first} ${last}`.trim();
        const canon = candidate.toLowerCase();
        if (!used.has(canon)) {
          used.add(canon);
          return candidate;
        }
      }
      let suffix = 1;
      while (used.has(`opponent ${suffix}`)) suffix++;
      candidate = `Opponent ${suffix}`;
      used.add(candidate.toLowerCase());
      return candidate;
    }

    function createEmptyMatch() {
      return { a: "", b: "", winner: "" };
    }

    function createTournamentState(index) {
      const playerName = currentUsername || "Player";
      const used = new Set([playerName.toLowerCase()]);
      const entrants = [];
      for (let i = 0; i < 15; i++) entrants.push(createRandomOpponentName(used));
      const playerSlot = getRandomInt(16);
      entrants.splice(playerSlot, 0, playerName);

      const rounds = {
        r16: Array.from({ length: 8 }, () => createEmptyMatch()),
        qf: Array.from({ length: 4 }, () => createEmptyMatch()),
        sf: Array.from({ length: 2 }, () => createEmptyMatch()),
        f: Array.from({ length: 1 }, () => createEmptyMatch())
      };

      for (let i = 0; i < 8; i++) {
        rounds.r16[i].a = entrants[i * 2];
        rounds.r16[i].b = entrants[i * 2 + 1];
      }

      const state = {
        schemaVersion: 2,
        index,
        subtitle: tournamentSubtitles[index] || `Tournament ${index + 1}`,
        playerName,
        playerEliminated: false,
        redoPending: false,
        redoRound: "",
        redoMatchIndex: -1,
        completed: false,
        champion: "",
        rounds,
        updatedAt: Date.now()
      };
      return state;
    }

    function createCareerStateList() {
      const list = [];
      for (let i = 0; i < CAREER_TOURNAMENT_COUNT; i++) {
        list.push(createTournamentState(i));
      }
      return list;
    }

    function queueCareerDbSave() {
      if (!currentUsernameCanonical) return;
      if (careerDbSaveTimer) clearTimeout(careerDbSaveTimer);
      careerDbSaveTimer = setTimeout(async () => {
        careerDbSaveTimer = null;
        try {
          await set(ref(db, careerRefPath(currentUsernameCanonical)), {
            usernameDisplay: currentUsername,
            usernameCanonical: currentUsernameCanonical,
            uid: currentUser?.uid || "",
            wins: clampUp(careerWins),
            states: Array.isArray(careerStates) ? careerStates : [],
            updatedAt: Date.now()
          });
        } catch (err) {
          console.error("Career DB save failed:", err);
        }
      }, 80);
    }

    function saveCareerStates() {
      if (!Array.isArray(careerStates) || !careerStates.length) return;
      localStorage.setItem(careerStorageKey(), JSON.stringify({
        owner: currentUsernameCanonical || "guest",
        wins: clampUp(careerWins),
        states: careerStates
      }));
      careerOwnerKey = careerStorageKey();
      queueCareerDbSave();
    }

    function loadCareerStates() {
      let parsed = null;
      try {
        parsed = JSON.parse(localStorage.getItem(careerStorageKey()) || "null");
      } catch (_) {
        parsed = null;
      }
      const states = parsed?.states;
      if (!Array.isArray(states) || states.length !== CAREER_TOURNAMENT_COUNT) return null;
      if (!states.every((s) => s && typeof s === "object")) return null;
      return {
        states,
        wins: clampUp(parsed?.wins ?? 0)
      };
    }

    function normalizeCareerState(state, index) {
      if (!state || typeof state !== "object") return createTournamentState(index);
      state.schemaVersion = 2;
      state.index = index;
      state.subtitle = tournamentSubtitles[index] || `Tournament ${index + 1}`;
      if (!state.playerName) state.playerName = currentUsername || "Player";
      // Career rule: losses do not eliminate the player.
      state.playerEliminated = false;
      if (typeof state.redoPending !== "boolean") state.redoPending = false;
      if (typeof state.redoRound !== "string") state.redoRound = "";
      if (!Number.isFinite(Number(state.redoMatchIndex))) state.redoMatchIndex = -1;
      return state;
    }

    function initializeCareerDataForUser(forceRebuild = false) {
      const key = careerStorageKey();
      if (!forceRebuild && careerOwnerKey === key && careerStates.length === CAREER_TOURNAMENT_COUNT) return;
      const loaded = forceRebuild ? null : loadCareerStates();
      const source = loaded?.states || createCareerStateList();
      careerStates = source.map((s, i) => normalizeCareerState(s, i));
      careerWins = clampUp(loaded?.wins ?? careerWins);
      careerOwnerKey = key;
      saveCareerStates();
    }

    async function hydrateCareerFromDb() {
      if (!currentUsernameCanonical) return;
      let dbPayload = null;
      try {
        const snap = await get(ref(db, careerRefPath(currentUsernameCanonical)));
        if (snap.exists()) dbPayload = snap.val() || null;
      } catch (err) {
        console.error("Career DB read failed:", err);
      }
      const dbStates = dbPayload?.states;
      const hasDbStates = Array.isArray(dbStates) && dbStates.length === CAREER_TOURNAMENT_COUNT;
      if (hasDbStates) {
        careerStates = dbStates.map((s, i) => normalizeCareerState(s, i));
        careerWins = clampUp(dbPayload?.wins ?? 0);
      } else {
        const loadedLocal = loadCareerStates();
        const source = loadedLocal?.states || createCareerStateList();
        careerStates = source.map((s, i) => normalizeCareerState(s, i));
        careerWins = clampUp(loadedLocal?.wins ?? 0);
      }
      careerOwnerKey = careerStorageKey();
      saveCareerStates();
    }

    function getRoundAwardForTournament(tournamentIndex, roundKey) {
      const def = getTournamentDefinition(tournamentIndex);
      return clampUp(def?.roundAwards?.[roundKey] ?? 0);
    }

    function getChampionBonusForTournament(tournamentIndex) {
      return clampUp(getTournamentDefinition(tournamentIndex)?.championBonus ?? 0);
    }

    function getTournamentMaxUp(tournamentIndex) {
      const def = getTournamentDefinition(tournamentIndex);
      const roundTotal = CAREER_ROUND_ORDER.reduce((sum, key) => sum + clampUp(def?.roundAwards?.[key] ?? 0), 0);
      return roundTotal + clampUp(def?.championBonus ?? 0);
    }

    function showCareerResultHud({ playerWon, roundKey, tournamentIndex, upAward, championBonus }) {
      if (!careerResultHud || !careerResultContinueBtn) return Promise.resolve();
      const roundLabel = CAREER_ROUND_LABELS[String(roundKey) || ""] || "Match";
      const tNum = clamp(Number(tournamentIndex) || 0, 0, CAREER_TOURNAMENT_COUNT - 1) + 1;
      const totalAward = clampUp(upAward);
      const bonusTxt = championBonus > 0 ? ` (includes +${championBonus} champion bonus)` : "";

      careerResultTitle.textContent = playerWon ? "Victory" : "Defeat - Redo Required";
      const eventName = tournamentSubtitles[tNum - 1] || `Tournament ${tNum}`;
      careerResultSub.textContent = `${eventName} - ${roundLabel}`;
      careerResultUp.textContent = `+${totalAward} UP`;
      careerResultMeta.textContent = playerWon
        ? `Round reward applied${bonusTxt}. UP added to your pool; spend it in the Upgrade tab. Career wins: ${careerWins}`
        : "No UP awarded on this loss. Tournament progress stays at this match.";
      careerResultHud.classList.add("open");
      careerResultHud.setAttribute("aria-hidden", "false");

      return new Promise((resolve) => {
        const done = () => {
          careerResultHud.classList.remove("open");
          careerResultHud.setAttribute("aria-hidden", "true");
          careerResultContinueBtn.removeEventListener("click", done);
          window.removeEventListener("keydown", onKey);
          resolve();
        };
        const onKey = (e) => {
          if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
            e.preventDefault();
            done();
          }
        };
        careerResultContinueBtn.addEventListener("click", done);
        window.addEventListener("keydown", onKey);
      });
    }

    function matchHasPlayer(state, match) {
      if (!state || !match) return false;
      const p = state.playerName;
      return match.a === p || match.b === p;
    }

    function chooseRandomWinner(nameA, nameB) {
      if (!nameA && !nameB) return "";
      if (!nameA) return nameB;
      if (!nameB) return nameA;
      return Math.random() < 0.5 ? nameA : nameB;
    }

    function applyCareerWinner(state, roundKey, matchIndex, winnerName) {
      if (!state || !winnerName) return;
      const match = state.rounds?.[roundKey]?.[matchIndex];
      if (!match || match.winner) return;
      match.winner = winnerName;
      state.playerEliminated = false;
      state.redoPending = false;
      state.redoRound = "";
      state.redoMatchIndex = -1;

      const nextRoundKey = CAREER_NEXT_ROUND[roundKey];
      if (!nextRoundKey) {
        state.completed = true;
        state.champion = winnerName;
        state.updatedAt = Date.now();
        return;
      }

      const nextMatchIndex = Math.floor(matchIndex / 2);
      const slot = matchIndex % 2 === 0 ? "a" : "b";
      const nextMatch = state.rounds[nextRoundKey][nextMatchIndex];
      if (nextMatch) nextMatch[slot] = winnerName;
      state.updatedAt = Date.now();
    }

    function resolveNonPlayerMatchesInRound(state, roundKey) {
      const matches = state?.rounds?.[roundKey] || [];
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        if (!match || match.winner || !match.a || !match.b) continue;
        if (matchHasPlayer(state, match)) continue;
        applyCareerWinner(state, roundKey, i, chooseRandomWinner(match.a, match.b));
      }
    }

    function findPlayerPendingMatch(state) {
      if (!state || state.completed) return null;
      for (const roundKey of CAREER_ROUND_ORDER) {
        const matches = state.rounds?.[roundKey] || [];
        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];
          if (!match || match.winner) continue;
          if (!matchHasPlayer(state, match)) continue;
          if (!match.a || !match.b) continue;
          return { roundKey, matchIndex: i, match };
        }
      }
      return null;
    }

    function resolveAllRemainingCareerMatches(state) {
      if (!state) return;
      let progressed = true;
      while (progressed && !state.completed) {
        progressed = false;
        for (const roundKey of CAREER_ROUND_ORDER) {
          const matches = state.rounds?.[roundKey] || [];
          for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            if (!match || match.winner || !match.a || !match.b) continue;
            applyCareerWinner(state, roundKey, i, chooseRandomWinner(match.a, match.b));
            progressed = true;
          }
        }
      }
    }

    function settleCareerAutoMatches(state) {
      if (!state || state.completed) return;
      for (const roundKey of CAREER_ROUND_ORDER) {
        resolveNonPlayerMatchesInRound(state, roundKey);
        if (findPlayerPendingMatch(state)) break;
      }
    }

    function getCareerGridColumns() {
      if (!careerGrid) return 4;
      const tpl = getComputedStyle(careerGrid).gridTemplateColumns || "";
      const cols = tpl.split(" ").filter(Boolean).length;
      return Math.max(1, cols || 4);
    }

    function moveCareerSelection(dx, dy) {
      const items = getSelectableForTab("career");
      if (!items.length) return;
      clampSelection("career");
      const cur = selectedIndexByTab.career || 0;
      const direction = dx !== 0 ? Math.sign(dx) : Math.sign(dy);
      if (direction === 0) return;
      const nextIndex = clamp(cur + direction, 0, items.length - 1);
      selectedIndexByTab.career = nextIndex;
      paintSelection();
      updateCareerBracket(nextIndex);
      const selected = items[nextIndex];
      if (selected) selected.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    function isCareerModalOpen() {
      return !!careerBracketModal && careerBracketModal.classList.contains("open");
    }
    function isCareerResultHudOpen() {
      return !!careerResultHud && careerResultHud.classList.contains("open");
    }

    function openCareerBracketModal() {
      if (!careerBracketModal) return;
      careerBracketModal.classList.add("open");
      careerBracketModal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        updateCareerBracket(selectedIndexByTab.career || 0);
      });
    }

    function closeCareerBracketModal() {
      if (!careerBracketModal) return;
      careerBracketModal.classList.remove("open");
      careerBracketModal.setAttribute("aria-hidden", "true");
    }

    function renderCareerBracket(state) {
      if (!careerBracketBoard) return;
      careerBracketBoard.innerHTML = "";
      if (!state) return;

      const CANVAS_W = 1320;
      const CANVAS_H = 420;
      const NODE_W = 132;
      const NODE_H = 44;
      const FINAL_W = 150;
      const FINAL_H = 48;
      const X = { l1: 16, l2: 213, l3: 410, c: 575, r3: 739, r2: 936, r1: 1133 };
      const Y = {
        l1: [49, 135, 222, 308],
        l2: [92, 265],
        l3: [178],
        f: [176],
        r3: [178],
        r2: [92, 265],
        r1: [49, 135, 222, 308]
      };

      const canvas = document.createElement("div");
      canvas.className = "bracketTreeCanvas";
      const availableWidth = Math.max(260, careerBracketBoard.clientWidth - 10);
      const availableHeight = Math.max(120, careerBracketBoard.clientHeight - 10);
      const bracketScale = Math.min(1, availableWidth / CANVAS_W, availableHeight / CANVAS_H);
      const scaledWidth = Math.max(180, Math.round(CANVAS_W * bracketScale));
      const scaledHeight = Math.max(80, Math.round(CANVAS_H * bracketScale));
      const scaleWrap = document.createElement("div");
      scaleWrap.className = "bracketScaleWrap";
      scaleWrap.style.width = `${scaledWidth}px`;
      scaleWrap.style.height = `${scaledHeight}px`;
      canvas.style.transformOrigin = "top left";
      canvas.style.transform = `scale(${bracketScale})`;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("bracketSvg");
      svg.setAttribute("viewBox", `0 0 ${CANVAS_W} ${CANVAS_H}`);
      canvas.appendChild(svg);
      scaleWrap.appendChild(canvas);
      careerBracketBoard.appendChild(scaleWrap);

      function addLabel(text, x) {
        const label = document.createElement("div");
        label.className = "bracketColLabel";
        label.style.left = `${x}px`;
        label.textContent = text;
        canvas.appendChild(label);
      }

      function addWire(points) {
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        poly.setAttribute("class", "bracketWire");
        poly.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "));
        svg.appendChild(poly);
      }

      function connectLeftToRight(from, to) {
        const sx = from.x + from.w;
        const sy = from.y + from.h * 0.5;
        const ex = to.x;
        const ey = to.y + to.h * 0.5;
        const mx = (sx + ex) * 0.5;
        addWire([{ x: sx, y: sy }, { x: mx, y: sy }, { x: mx, y: ey }, { x: ex, y: ey }]);
      }

      function connectRightToLeft(from, to) {
        const sx = from.x;
        const sy = from.y + from.h * 0.5;
        const ex = to.x + to.w;
        const ey = to.y + to.h * 0.5;
        const mx = (sx + ex) * 0.5;
        addWire([{ x: sx, y: sy }, { x: mx, y: sy }, { x: mx, y: ey }, { x: ex, y: ey }]);
      }

      function createNode(match, x, y, isFinal = false) {
        const node = document.createElement("div");
        node.className = `bracketNode${isFinal ? " final" : ""}`;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        const names = [match?.a || "TBD", match?.b || "TBD"];
        for (const name of names) {
          const line = document.createElement("div");
          line.className = "bracketPlayer";
          line.textContent = name;
          if (name === "TBD") line.classList.add("pending");
          if (name === state.playerName) line.classList.add("player");
          if (match?.winner && name === match.winner) line.classList.add("winner");
          node.appendChild(line);
        }
        canvas.appendChild(node);
        return { x, y, w: isFinal ? FINAL_W : NODE_W, h: isFinal ? FINAL_H : NODE_H };
      }

      addLabel("Round of 16", X.l1 + NODE_W * 0.5);
      addLabel("Quarterfinal", X.l2 + NODE_W * 0.5);
      addLabel("Semifinal", X.l3 + NODE_W * 0.5);
      addLabel("Final", X.c + FINAL_W * 0.5);
      addLabel("Semifinal", X.r3 + NODE_W * 0.5);
      addLabel("Quarterfinal", X.r2 + NODE_W * 0.5);
      addLabel("Round of 16", X.r1 + NODE_W * 0.5);

      const r16 = state.rounds?.r16 || [];
      const qf = state.rounds?.qf || [];
      const sf = state.rounds?.sf || [];
      const final = state.rounds?.f || [];

      const leftR16 = [0, 1, 2, 3].map((i) => createNode(r16[i], X.l1, Y.l1[i]));
      const leftQf = [0, 1].map((i) => createNode(qf[i], X.l2, Y.l2[i]));
      const leftSf = createNode(sf[0], X.l3, Y.l3[0]);
      const centerFinal = createNode(final[0], X.c, Y.f[0], true);
      const rightSf = createNode(sf[1], X.r3, Y.r3[0]);
      const rightQf = [2, 3].map((i, localIndex) => createNode(qf[i], X.r2, Y.r2[localIndex]));
      const rightR16 = [4, 5, 6, 7].map((i, localIndex) => createNode(r16[i], X.r1, Y.r1[localIndex]));

      for (let i = 0; i < leftR16.length; i++) {
        connectLeftToRight(leftR16[i], leftQf[Math.floor(i / 2)]);
      }
      for (let i = 0; i < leftQf.length; i++) {
        connectLeftToRight(leftQf[i], leftSf);
      }
      connectLeftToRight(leftSf, centerFinal);

      for (let i = 0; i < rightR16.length; i++) {
        connectRightToLeft(rightR16[i], rightQf[Math.floor(i / 2)]);
      }
      for (let i = 0; i < rightQf.length; i++) {
        connectRightToLeft(rightQf[i], rightSf);
      }
      connectRightToLeft(rightSf, centerFinal);

      const pending = findPlayerPendingMatch(state);
      const canPlay = !!pending && !state.completed;
      const isRedo = canPlay &&
        !!state.redoPending &&
        state.redoRound === pending.roundKey &&
        Number(state.redoMatchIndex) === Number(pending.matchIndex);
      const opponentOvr = getCareerAiOvrForTournament(activeTournamentIndex);
      if (careerPlayBtnModal) {
        careerPlayBtnModal.disabled = !canPlay;
        careerPlayBtnModal.textContent = isRedo ? "Redo Match" : "Play Match";
      }
      if (careerRecommendedOvr) {
        if (canPlay) {
          careerRecommendedOvr.textContent = `Recommended OVR > ${opponentOvr}`;
          careerRecommendedOvr.style.opacity = "0.92";
        } else {
          careerRecommendedOvr.textContent = "";
          careerRecommendedOvr.style.opacity = "0";
        }
      }
    }

    function recordCareerResult(playerWon) {
      const state = careerStates[activeTournamentIndex];
      if (!state || state.completed) return;
      const pending = findPlayerPendingMatch(state);
      if (!pending) {
        renderCareerBracket(state);
        saveCareerStates();
        return;
      }
      if (playerWon) {
        applyCareerWinner(state, pending.roundKey, pending.matchIndex, state.playerName);
        settleCareerAutoMatches(state);
      } else {
        state.playerEliminated = false;
        state.redoPending = true;
        state.redoRound = pending.roundKey;
        state.redoMatchIndex = pending.matchIndex;
        state.updatedAt = Date.now();
      }
      saveCareerStates();
      renderCareerBracket(state);
    }

    async function consumeCareerResultFromGame() {
      let payload = null;
      try {
        payload = JSON.parse(localStorage.getItem("tennis_career_result") || "null");
      } catch (_) {
        payload = null;
      }
      if (!payload || typeof payload !== "object") return;

      localStorage.removeItem("tennis_career_result");
      localStorage.removeItem("tennis_career_match");

      const payloadUser = String(payload.usernameCanonical || "").trim().toLowerCase();
      if (payloadUser && currentUsernameCanonical && payloadUser !== currentUsernameCanonical) return;

      const idx = clamp(Number(payload.tournamentIndex), 0, CAREER_TOURNAMENT_COUNT - 1);
      const state = careerStates[idx];
      if (!state || state.completed) return;
      const pending = findPlayerPendingMatch(state);
      if (!pending) return;

      const sameMatch =
        pending.roundKey === String(payload.round || "") &&
        Number(pending.matchIndex) === Number(payload.matchIndex);
      if (!sameMatch) return;

      const playerWon = !!payload.playerWon;
      if (payload.tutorialCompleted === true) {
        pendingTutorialCompletionFromResult = true;
      }
      let upAward = 0;
      let championBonus = 0;
      if (playerWon) {
        promoteTierForTournament(idx);
        upAward += getRoundAwardForTournament(idx, pending.roundKey);
        applyCareerWinner(state, pending.roundKey, pending.matchIndex, state.playerName);
        settleCareerAutoMatches(state);
        if (pending.roundKey === "f" && state.completed && state.champion === state.playerName) {
          championBonus = getChampionBonusForTournament(idx);
          upAward += championBonus;
        }
        careerWins = clampUp(careerWins + 1);
        currentUp = clampUp(currentUp + upAward);
      } else {
        state.playerEliminated = false;
        state.redoPending = true;
        state.redoRound = pending.roundKey;
        state.redoMatchIndex = pending.matchIndex;
        state.updatedAt = Date.now();
      }

      selectedIndexByTab.career = idx;
      activeTournamentIndex = idx;
      saveCareerStates();
      try {
        await saveProgressToDb();
      } catch (err) {
        console.error("Failed saving post-match progress:", err);
      }
      updateHudOvr();
      applyProgressToUi(false);
      if (playerWon) {
        await showCareerResultHud({
          playerWon,
          roundKey: pending.roundKey,
          tournamentIndex: idx,
          upAward,
          championBonus
        });
      } else {
        setActiveTab("career");
        openCareerBracketModal();
      }
    }

    function applyProgressToUi(updateButtonLabels = true) {
      for (const key of Object.keys(progressEls)) {
        const pct = clampStatToTierCap(key, currentProgress[key]);
        currentProgress[key] = pct;
        progressEls[key].pct.textContent = `${pct}%`;
        progressEls[key].fill.style.width = `${pct}%`;
      }
      updateHudOvr();
      if (updateButtonLabels) updateUpgradeButtonLabels();
    }

    async function loadProgressFromDb(canonicalName) {
      if (!canonicalName) return;
      const snap = await get(ref(db, progressRefPath(canonicalName)));
      if (!snap.exists()) {
        tutorialAmateurT1R16Complete = false;
        applyProgressToUi();
        await saveProgressToDb();
        return;
      }
      const raw = snap.val() || {};
      currentTierKey = normalizeTierKey(raw.tierKey ?? DEFAULT_TIER_KEY);
      for (const key of Object.keys(DEFAULT_PROGRESS)) {
        currentProgress[key] = clampStatToTierCap(key, raw[key] ?? DEFAULT_PROGRESS[key]);
      }
      currentUp = clampUp(raw.up ?? DEFAULT_UP);
      careerWins = clampUp(raw.careerWins ?? careerWins);
      tutorialAmateurT1R16Complete = !!raw.tutorialAmateurT1R16Complete;
      applyProgressToUi();
    }

    async function saveProgressToDb() {
      if (!currentUsernameCanonical) return;
      const payload = {
        usernameDisplay: currentUsername,
        usernameCanonical: currentUsernameCanonical,
        uid: currentUser?.uid || "",
        email: currentUser?.email || "",
        speed: clampPct(currentProgress.speed),
        stamina: clampPct(currentProgress.stamina),
        power: clampPct(currentProgress.power),
        accuracy: clampPct(currentProgress.accuracy),
        tierKey: normalizeTierKey(currentTierKey),
        tierCap: getCurrentTierCap(),
        up: clampUp(currentUp),
        careerWins: clampUp(careerWins),
        tutorialAmateurT1R16Complete: !!tutorialAmateurT1R16Complete,
        ovr: computeOvrFromProgress(),
        updatedAt: Date.now()
      };
      await set(ref(db, progressRefPath(currentUsernameCanonical)), payload);
    }

    function storeProgressForGame(courtSurfaceOverride = selectedSurfaceKey) {
      localStorage.setItem("tennis_progress_profile", JSON.stringify({
        username: currentUsername,
        usernameCanonical: currentUsernameCanonical,
        speed: clampPct(currentProgress.speed),
        stamina: clampPct(currentProgress.stamina),
        power: clampPct(currentProgress.power),
        accuracy: clampPct(currentProgress.accuracy),
        tierKey: normalizeTierKey(currentTierKey),
        tierCap: getCurrentTierCap(),
        up: clampUp(currentUp),
        courtSurface: normalizeSurfaceKey(courtSurfaceOverride),
        updatedAt: Date.now()
      }));
    }

    async function resetProgressToDefaults() {
      if (!currentUsernameCanonical || !resetProgressBtn) return;

      const prevProgress = { ...currentProgress };
      const prevUp = currentUp;
      resetProgressBtn.disabled = true;
      resetProgressBtn.textContent = "Saving...";

      try {
        for (const key of Object.keys(DEFAULT_PROGRESS)) {
          currentProgress[key] = clampStatToTierCap(key, DEFAULT_PROGRESS[key]);
        }
        currentTierKey = DEFAULT_TIER_KEY;
        currentUp = DEFAULT_UP;

        applyProgressToUi();
        await saveProgressToDb();
        storeProgressForGame();

        resetProgressBtn.textContent = "Reset Complete";
        setTimeout(() => {
          if (resetProgressBtn) resetProgressBtn.textContent = "Reset Stats";
        }, 700);
      } catch (err) {
        console.error("Reset progress failed:", err);
        for (const key of Object.keys(prevProgress)) {
          currentProgress[key] = prevProgress[key];
        }
        currentUp = prevUp;
        applyProgressToUi();
        resetProgressBtn.textContent = "Reset Failed";
        setTimeout(() => {
          if (resetProgressBtn) resetProgressBtn.textContent = "Reset Stats";
        }, 900);
      } finally {
        resetProgressBtn.disabled = false;
      }
    }

    async function resetCareerProgressForTesting() {
      if (!careerResetBtn) return;
      const prevStates = careerStates.map((s) => JSON.parse(JSON.stringify(s)));
      const prevWins = careerWins;
      const prevIndex = activeTournamentIndex;
      const prevSelected = selectedIndexByTab.career || 0;
      careerResetBtn.disabled = true;
      careerResetBtn.textContent = "Resetting...";
      try {
        careerStates = createCareerStateList().map((s, i) => normalizeCareerState(s, i));
        careerWins = 0;
        tutorialAmateurT1R16Complete = false;
        pendingTutorialCompletionFromResult = false;
        activeTournamentIndex = 0;
        selectedIndexByTab.career = 0;
        localStorage.removeItem("tennis_career_match");
        localStorage.removeItem("tennis_career_result");
        saveCareerStates();
        await saveProgressToDb();
        renderCareerCards();
        updateCareerBracket(0);
        paintSelection();
        careerResetBtn.textContent = "Career Reset";
      } catch (err) {
        console.error("Career reset failed:", err);
        careerStates = prevStates;
        careerWins = prevWins;
        activeTournamentIndex = prevIndex;
        selectedIndexByTab.career = prevSelected;
        renderCareerCards();
        updateCareerBracket(selectedIndexByTab.career || 0);
        careerResetBtn.textContent = "Reset Failed";
      } finally {
        setTimeout(() => {
          if (careerResetBtn) careerResetBtn.textContent = "Reset Career";
        }, 800);
        careerResetBtn.disabled = false;
      }
    }

    function updateCareerBracket(index) {
      const bounded = Math.max(0, Math.min(CAREER_TOURNAMENT_COUNT - 1, Number(index) || 0));
      activeTournamentIndex = bounded;
      const tourneyNum = bounded + 1;
      const def = getTournamentDefinition(bounded);
      const title = def?.name || `Tournament ${tourneyNum}`;
      const surfaceName = getTournamentSurfaceName(def?.surfaceKey);
      const personalityLabel = def?.personalityLabel || "All-Court";
      const specialRule = def?.specialRule ? ` ${def.specialRule}` : "";
      careerBracketTitle.textContent = `\u{1F4CB} ${title}`;
      careerBracketSubtitle.textContent = `${def?.tierLabel || "Career"} Circuit - ${surfaceName} - ${personalityLabel} - Max ${getTournamentMaxUp(bounded)} UP - AI OVR ${def?.aiOvr}.${specialRule} ${def?.description || "4 matches to win the title."}`.trim();
      const cards = Array.from(document.querySelectorAll("#tab-career .careerCard"));
      cards.forEach((card, i) => {
        card.classList.toggle("careerCardActive", i === bounded);
      });
      const state = careerStates[bounded];
      renderCareerBracket(state);
    }

    function initCareerTournaments() {
      if (!careerGrid) return;
      initializeCareerDataForUser();
      careerGrid.innerHTML = "";
      let lastTierKey = "";
      for (let i = 0; i < CAREER_TOURNAMENT_COUNT; i++) {
        const def = getTournamentDefinition(i);
        if (def.tierKey !== lastTierKey) {
          const tierEvents = CAREER_TOURNAMENTS.filter((t) => t.tierKey === def.tierKey);
          const tierTotalUp = tierEvents.reduce((sum, t) => sum + tournamentMaxUpFromDefinition(t), 0);
          const divider = document.createElement("div");
          divider.className = "careerTierDivider";
          divider.innerHTML = `
            <span class="careerTierDividerName">${def.tierLabel} Circuit</span>
            <span class="careerTierDividerMeta">${tierEvents.length} events - ${tierTotalUp} total UP - ${getCareerTierDividerHint(def.tierKey)}</span>
          `;
          careerGrid.appendChild(divider);
          lastTierKey = def.tierKey;
        }
        const card = document.createElement("button");
        const number = i + 1;
        card.type = "button";
        card.className = "careerCard";
        card.dataset.index = String(i);
        card.innerHTML = `
          <span class="careerCardNum">Event ${String(number).padStart(2, "0")}</span>
          <span class="careerCardTitle">${def.name}</span>
          <span class="careerCardSub">${def.description}</span>
          <span class="careerCardMeta">${getTournamentSurfaceName(def.surfaceKey)} - ${def.personalityLabel} - ${def.venueTag || "Tour Event"} - Max ${getTournamentMaxUp(i)} UP - AI OVR ${def.aiOvr}</span>
        `;
        card.addEventListener("click", () => {
          selectedIndexByTab.career = i;
          updateCareerBracket(i);
          paintSelection();
          openCareerBracketModal();
        });
        card.addEventListener("mouseenter", () => {
          selectedIndexByTab.career = i;
          updateCareerBracket(i);
          paintSelection();
        });
        card.addEventListener("focus", () => {
          selectedIndexByTab.career = i;
          updateCareerBracket(i);
          paintSelection();
        });
        careerGrid.appendChild(card);
      }
      updateCareerBracket(0);
    }

    function renderCareerCards() {
      initCareerTournaments();
    }

    async function startQuickMatch() {
      if (!currentUsernameCanonical) return;
      localStorage.removeItem("tennis_career_match");
      localStorage.removeItem("tennis_career_result");
      quickMatchBtn.disabled = true;
      quickMatchBtn.textContent = "Saving...";
      try {
        await saveProgressToDb();
        storeProgressForGame();
        window.location.href = "./game.html";
      } catch (err) {
        console.error("Quick Match start failed:", err);
        quickMatchBtn.textContent = "Start Quick Match";
      } finally {
        quickMatchBtn.disabled = false;
      }
    }

    async function startLocalMultiplayer() {
      if (!currentUsernameCanonical) return;
      localStorage.removeItem("tennis_career_match");
      localStorage.removeItem("tennis_career_result");
      localMultiplayerBtn.disabled = true;
      localMultiplayerBtn.textContent = "Saving...";
      try {
        await saveProgressToDb();
        storeProgressForGame();
        window.location.href = "./local-multiplayer.html";
      } catch (err) {
        console.error("Local Multiplayer start failed:", err);
        localMultiplayerBtn.textContent = "Start Local Match";
      } finally {
        localMultiplayerBtn.disabled = false;
      }
    }

    function startMaxMatch() {
      if (!currentUsernameCanonical) return;
      localStorage.removeItem("tennis_career_match");
      localStorage.removeItem("tennis_career_result");
      localStorage.setItem("tennis_progress_profile", JSON.stringify({
        username: currentUsername,
        usernameCanonical: currentUsernameCanonical,
        speed: 100,
        stamina: 100,
        power: 100,
        accuracy: 100,
        courtSurface: normalizeSurfaceKey(selectedSurfaceKey),
        updatedAt: Date.now(),
        mode: "max-match"
      }));
      window.location.href = "./game.html";
    }

    function startLocalMaxMatch() {
      if (!currentUsernameCanonical) return;
      localStorage.removeItem("tennis_career_match");
      localStorage.removeItem("tennis_career_result");
      localStorage.setItem("tennis_progress_profile", JSON.stringify({
        username: currentUsername,
        usernameCanonical: currentUsernameCanonical,
        speed: 100,
        stamina: 100,
        power: 100,
        accuracy: 100,
        courtSurface: normalizeSurfaceKey(selectedSurfaceKey),
        updatedAt: Date.now(),
        mode: "local-max-match"
      }));
      window.location.href = "./local-multiplayer.html";
    }

    function startCareerPendingMatch() {
      const state = careerStates[activeTournamentIndex];
      if (!state || state.completed) return;
      const def = getTournamentDefinition(activeTournamentIndex);
      const pending = findPlayerPendingMatch(state);
      if (!pending) return;
      const aName = String(pending.match.a || "").trim();
      const bName = String(pending.match.b || "").trim();
      const statePlayer = String(state.playerName || "").trim();
      const currentPlayer = String(currentUsername || "").trim();
      const candidates = [aName, bName].filter(Boolean);
      let opponent = candidates.find((n) => n !== statePlayer && n !== currentPlayer) || "";
      if (!opponent) {
        if (aName && aName !== statePlayer) opponent = aName;
        else if (bName && bName !== statePlayer) opponent = bName;
      }
      if (!opponent) opponent = "Opponent";
      const aiOvr = getCareerAiOvrForTournament(activeTournamentIndex);
      const aiSmartness = getCareerAiSmartnessForTournament(activeTournamentIndex);
      const isFirstAmateurR16 = activeTournamentIndex === 0 && pending.roundKey === "r16";
      const tutorialDone = !!tutorialAmateurT1R16Complete;
      const launchTutorial = isFirstAmateurR16 && !tutorialDone;
      const forcedSurfaceKey = normalizeSurfaceKey(def?.surfaceKey || "hard");
      const forcedTimeOfDay = chooseTournamentTimeOfDay(def);
      state.playerEliminated = false;
      storeProgressForGame(forcedSurfaceKey);
      localStorage.setItem("tennis_career_match", JSON.stringify({
        tournamentIndex: activeTournamentIndex,
        tournamentTitle: state.subtitle || `Tournament ${activeTournamentIndex + 1}`,
        round: pending.roundKey,
        matchIndex: pending.matchIndex,
        player: state.playerName,
        opponent,
        opponentName: opponent,
        aiOvr,
        aiSmartness,
        tierKey: normalizeTierKey(def?.tierKey ?? DEFAULT_TIER_KEY),
        tournamentSurface: forcedSurfaceKey,
        forcedVenueKey: String(def?.venueKey || "").trim().toLowerCase(),
        forcedTimeOfDay,
        forcedPersonalityKey: String(def?.personalityKey || "all_court").trim().toLowerCase(),
        venueTag: String(def?.venueTag || "").trim(),
        specialRule: String(def?.specialRule || "").trim(),
        usernameCanonical: currentUsernameCanonical,
        tutorialMatch: launchTutorial,
        startedAt: Date.now()
      }));
      localStorage.removeItem("tennis_career_result");
      window.location.href = launchTutorial ? "./tutorial.html" : "./game.html";
    }

    function getSelectableForTab(tabKey) {
      if (tabKey === "upgrade") {
        return [
          ...Array.from(document.querySelectorAll("#tab-upgrade .upgradeBtn[data-stat]")),
          resetProgressBtn
        ].filter(Boolean);
      }
      if (tabKey === "training") {
        return [
          ...Array.from(document.querySelectorAll("#tab-training .trainingActionBtn"))
        ].filter(Boolean);
      }
      if (tabKey === "career") return Array.from(document.querySelectorAll("#tab-career .careerCard"));
      if (tabKey === "quick-match") {
        return [...getSurfaceButtonsForTab("quick-match"), quickMatchBtn, maxMatchBtn].filter(Boolean);
      }
      if (tabKey === "multiplayer") {
        return [...getSurfaceButtonsForTab("multiplayer"), localMultiplayerBtn, localMaxMultiplayerBtn].filter(Boolean);
      }
      return [];
    }

    function clampSelection(tabKey) {
      const items = getSelectableForTab(tabKey);
      if (!items.length) {
        selectedIndexByTab[tabKey] = 0;
        return;
      }
      const max = items.length - 1;
      selectedIndexByTab[tabKey] = Math.max(0, Math.min(max, selectedIndexByTab[tabKey] || 0));
    }

    function paintSelection() {
      document.querySelectorAll(".gp-selected").forEach((el) => el.classList.remove("gp-selected"));
      const items = getSelectableForTab(activeTabKey);
      if (!items.length) return;
      clampSelection(activeTabKey);
      const selected = items[selectedIndexByTab[activeTabKey]];
      if (!selected) return;
      selected.classList.add("gp-selected");
    }

    function moveSelection(delta) {
      const items = getSelectableForTab(activeTabKey);
      if (!items.length) return;
      clampSelection(activeTabKey);
      const max = items.length - 1;
      selectedIndexByTab[activeTabKey] = Math.max(0, Math.min(max, selectedIndexByTab[activeTabKey] + delta));
      paintSelection();
      if (activeTabKey === "career") {
        updateCareerBracket(selectedIndexByTab.career || 0);
      }
    }

    function activateSelection() {
      const items = getSelectableForTab(activeTabKey);
      if (!items.length) return;
      clampSelection(activeTabKey);
      const selected = items[selectedIndexByTab[activeTabKey]];
      if (selected) selected.click();
    }

    function getSavedName(uid) {
      if (!uid) return "";
      const username = (localStorage.getItem(`tennis_username_${uid}`) || "").trim();
      if (username) return username;
      const active = (localStorage.getItem("tennis_active_player_name") || "").trim();
      if (active) return active;
      return (localStorage.getItem(`tennis_first_name_${uid}`) || "").trim();
    }

    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      if (!user) {
        window.location.href = "./index.html";
        return;
      }
      const first = getSavedName(user.uid) || "Player";
      currentUsername = normalizeUsername(first) || "Player";
      currentUsernameCanonical = usernameCanonical(currentUsername);
      playerNameEl.textContent = currentUsername;
      await hydrateCareerFromDb();
      try {
        await loadProgressFromDb(currentUsernameCanonical);
      } catch (err) {
        console.error("Failed loading progress from DB, using defaults.", err);
        applyProgressToUi();
      }
      await consumeCareerResultFromGame();
      if (pendingTutorialCompletionFromResult && !tutorialAmateurT1R16Complete) {
        tutorialAmateurT1R16Complete = true;
        await saveProgressToDb();
      }
      storeProgressForGame();
      renderCareerCards();
      updateCareerBracket(selectedIndexByTab.career || 0);
    });

    function setActiveTab(tabKey) {
      activeTabKey = tabKey;
      tabBtns.forEach((btn) => {
        const on = btn.dataset.tab === tabKey;
        btn.classList.toggle("active", on);
      });
      Object.entries(tabBodies).forEach(([k, el]) => {
        const on = k === tabKey;
        if (!on) {
          el.classList.remove("tab-enter");
          el.classList.remove("active");
          return;
        }
        el.classList.add("active");
        el.classList.remove("tab-enter");
        void el.offsetWidth;
        el.classList.add("tab-enter");
      });
      updateTipTicker(true);
      paintSelection();
      if (tabKey === "career") {
        requestAnimationFrame(() => {
          updateCareerBracket(selectedIndexByTab.career || 0);
        });
      } else if (isCareerModalOpen()) {
        closeCareerBracketModal();
      }
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
    });

    upgradeBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const stat = btn.dataset.stat;
        if (!stat || !(stat in currentProgress)) return;
        const beforeValue = clampPct(currentProgress[stat]);
        const cost = getUpgradeCostForValue(beforeValue);
        if (!Number.isFinite(cost)) {
          btn.textContent = "Tier max reached!";
          setTimeout(() => { btn.textContent = getUpgradeLabelForStat(stat); }, 450);
          return;
        }
        if (currentUp < cost) {
          btn.textContent = `Need ${cost} UP`;
          setTimeout(() => { btn.textContent = getUpgradeLabelForStat(stat); }, 700);
          return;
        }

        btn.disabled = true;
        btn.textContent = "Saving...";
        const oldValue = currentProgress[stat];
        const oldUp = currentUp;
        try {
          currentProgress[stat] = clampStatToTierCap(stat, currentProgress[stat] + 1);
          currentUp = clampUp(currentUp - cost);
          applyProgressToUi(false);
          await saveProgressToDb();
          storeProgressForGame();
          btn.textContent = `-${cost} UP`;
          setTimeout(() => { updateUpgradeButtonLabels(); }, 450);
        } catch (err) {
          console.error("Upgrade save failed:", err);
          currentProgress[stat] = oldValue;
          currentUp = oldUp;
          applyProgressToUi();
          btn.textContent = getUpgradeLabelForStat(stat);
        } finally {
          btn.disabled = false;
        }
      });
    });

    trainingJumpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.targetTab;
        if (!targetTab || !(targetTab in tabBodies)) return;
        setActiveTab(targetTab);
      });
    });

    if (openAnimationPreviewBtn) {
      openAnimationPreviewBtn.addEventListener("click", () => {
        window.location.href = "./animation-preview.html";
      });
    }

    if (quickMatchBtn) {
      quickMatchBtn.addEventListener("click", () => {
        startQuickMatch();
      });
    }
    if (maxMatchBtn) {
      maxMatchBtn.addEventListener("click", () => {
        startMaxMatch();
      });
    }
    if (localMultiplayerBtn) {
      localMultiplayerBtn.addEventListener("click", () => {
        startLocalMultiplayer();
      });
    }
    if (localMaxMultiplayerBtn) {
      localMaxMultiplayerBtn.addEventListener("click", () => {
        startLocalMaxMatch();
      });
    }
    surfaceBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        setSelectedSurface(btn.dataset.surface);
        paintSelection();
      });
    });
    if (resetProgressBtn) {
      resetProgressBtn.addEventListener("click", () => {
        resetProgressToDefaults();
      });
    }
    setInterval(() => {
      tipRotationIndex++;
      updateTipTicker();
    }, 5200);
    if (careerModalBackdrop) {
      careerModalBackdrop.addEventListener("click", () => {
        closeCareerBracketModal();
      });
    }
    if (careerModalCloseBtn) {
      careerModalCloseBtn.addEventListener("click", () => {
        closeCareerBracketModal();
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isCareerModalOpen()) {
        closeCareerBracketModal();
      }
    });
    if (careerPlayBtnModal) {
      careerPlayBtnModal.addEventListener("click", () => {
        startCareerPendingMatch();
      });
    }
    if (careerResetBtn) {
      careerResetBtn.addEventListener("click", () => {
        resetCareerProgressForTesting();
      });
    }

    // Simple gamepad navigation:
    // LT/RT switch tabs. LS (or d-pad) moves selected item. A activates selection.
    let gamepadIndex = null;
    let prevLt = false;
    let prevRt = false;
    let prevA = false;
    let prevB = false;
    let prevDown = false;
    let prevUp = false;
    let prevLeft = false;
    let prevRight = false;

    window.addEventListener("gamepadconnected", (e) => {
      gamepadIndex = e.gamepad.index;
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      if (gamepadIndex === e.gamepad.index) gamepadIndex = null;
    });

    function getActiveGamepad() {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (gamepadIndex !== null && pads[gamepadIndex] && pads[gamepadIndex].connected) return pads[gamepadIndex];
      for (const gp of pads) {
        if (gp && gp.connected) {
          gamepadIndex = gp.index;
          return gp;
        }
      }
      return null;
    }

    function stepTab(delta) {
      const idx = tabOrder.indexOf(activeTabKey);
      const next = (idx + delta + tabOrder.length) % tabOrder.length;
      setActiveTab(tabOrder[next]);
    }

    function updateGamepadUiInput() {
      const gp = getActiveGamepad();
      if (!gp) return;

      const lt = !!gp.buttons?.[6]?.pressed;
      const rt = !!gp.buttons?.[7]?.pressed;
      const a = !!gp.buttons?.[0]?.pressed;
      const b = !!gp.buttons?.[1]?.pressed;

      if (isCareerResultHudOpen()) {
        if (a && !prevA && careerResultContinueBtn) careerResultContinueBtn.click();
        prevLt = lt;
        prevRt = rt;
        prevA = a;
        prevB = b;
        prevUp = false;
        prevDown = false;
        prevLeft = false;
        prevRight = false;
        return;
      }

      if (isCareerModalOpen()) {
        if (a && !prevA) startCareerPendingMatch();
        if (b && !prevB) closeCareerBracketModal();

        prevLt = lt;
        prevRt = rt;
        prevA = a;
        prevB = b;
        prevUp = false;
        prevDown = false;
        prevLeft = false;
        prevRight = false;
        return;
      }

      if (lt && !prevLt) stepTab(-1);
      if (rt && !prevRt) stepTab(1);

      const axisY = gp.axes && gp.axes.length > 1 ? gp.axes[1] : 0;
      const axisX = gp.axes && gp.axes.length > 0 ? gp.axes[0] : 0;
      const dpadUp = !!gp.buttons?.[12]?.pressed;
      const dpadDown = !!gp.buttons?.[13]?.pressed;
      const dpadLeft = !!gp.buttons?.[14]?.pressed;
      const dpadRight = !!gp.buttons?.[15]?.pressed;
      const up = axisY < -0.55 || dpadUp;
      const down = axisY > 0.55 || dpadDown;
      const left = axisX < -0.55 || dpadLeft;
      const right = axisX > 0.55 || dpadRight;

      if (activeTabKey === "career") {
        if (up && !prevUp) moveCareerSelection(0, -1);
        if (down && !prevDown) moveCareerSelection(0, 1);
        if (left && !prevLeft) moveCareerSelection(-1, 0);
        if (right && !prevRight) moveCareerSelection(1, 0);
      } else if (activeTabKey === "quick-match") {
        if ((up || left) && !(prevUp || prevLeft)) moveSelection(-1);
        if ((down || right) && !(prevDown || prevRight)) moveSelection(1);
      } else {
        if (up && !prevUp) moveSelection(-1);
        if (down && !prevDown) moveSelection(1);
      }

      if (a && !prevA) activateSelection();

      prevLt = lt;
      prevRt = rt;
      prevA = a;
      prevB = b;
      prevUp = up;
      prevDown = down;
      prevLeft = left;
      prevRight = right;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1d2b);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(0, 1.72, 3.15);
    camera.lookAt(0, 1.2, 0);

    const hemi = new THREE.HemisphereLight(0xdff0ff, 0x1b2e3f, 0.95);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.6, 4.2, 2.2);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x8fc6ff, 0.48);
    rim.position.set(-2.8, 2.6, -2.4);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.15, 40),
      new THREE.MeshStandardMaterial({ color: 0x1d3346, roughness: 0.88, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.44, 0.08, 30),
      new THREE.MeshStandardMaterial({ color: 0x32485d, roughness: 0.78, metalness: 0.18 })
    );
    stand.position.y = 0.04;
    scene.add(stand);

    let mixer = null;
    let playerModel = null;
    let racketAttached = false;
    let previewHandBone = null;

    function findRightHandBone(root){
      let handBone = null;
      let wristBone = null;
      let forearmBone = null;
      root.traverse((o)=>{
        if(!o.isBone || !o.name) return;
        const n = o.name.toLowerCase();
        if(/righthand|right_hand|hand_r|r_hand|mixamorigrighthand/.test(n)){
          handBone = o;
          return;
        }
        if(/rightwrist|wrist_r|r_wrist/.test(n)){
          wristBone = o;
          return;
        }
        if(/mixamorigrightforearm|rightforearm|right_forearm|forearm_r/.test(n)){
          forearmBone = o;
        }
      });
      return handBone || wristBone || forearmBone || null;
    }

    function normalizeRacketObj(root){
      const box = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      root.position.sub(center);
      const maxDim = Math.max(0.001, size.x, size.y, size.z);
      const targetLen = 0.86;
      const s = targetLen / maxDim;
      root.scale.setScalar(s);
      root.position.y = 0.46;
      root.traverse((obj)=>{
        if(!obj.isMesh) return;
        obj.material = new THREE.MeshStandardMaterial({
          color: 0x101114,
          roughness: 0.46,
          metalness: 0.26
        });
      });
    }

    function createFallbackRacket(){
      const racket = new THREE.Group();
      const handleMat = new THREE.MeshStandardMaterial({color:0x2f3136, roughness:0.55, metalness:0.15});
      const frameMat = new THREE.MeshStandardMaterial({color:0x111417, roughness:0.35, metalness:0.45});
      const stringsMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.92, metalness:0, transparent:true, opacity:0.9});

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.42, 10), handleMat);
      handle.position.y = -0.32;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.045, 10), handleMat);
      cap.position.y = -0.55;
      const throat = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.028), frameMat);
      throat.position.y = -0.09;
      const head = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 12, 56), frameMat);
      head.position.y = 0.21;
      const strings = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.5, 8, 12), stringsMat);
      strings.position.y = 0.21;
      strings.rotation.y = Math.PI;
      racket.add(handle, cap, throat, head, strings);
      racket.position.y = 0.46;
      return racket;
    }

    function attachRacketToHand(characterRoot, handBone, racketObj = null){
      if(!characterRoot || !handBone) return;
      const prior = handBone.getObjectByName("PreviewRacketPivot");
      if(prior) handBone.remove(prior);

      const pivot = new THREE.Group();
      pivot.name = "PreviewRacketPivot";
      const racket = racketObj || createFallbackRacket();
      pivot.add(racket);

      // Match game attachment alignment (grip in hand, proper orientation).
      pivot.position.set(0.0, 0.0, 0.0);
      pivot.rotation.set(-0.22, Math.PI * 0.44, Math.PI * 0.62);

      // Character is heavily scaled down; compensate so racket stays visible.
      const s = characterRoot.scale?.x || 1;
      const inv = Math.abs(s) > 1e-6 ? (1 / s) : 1;
      // Smaller preview racket than game model so it reads naturally in the menu.
      pivot.scale.setScalar(inv * 0.82);

      // More right and half-macro up.
      racket.position.set(0.05, -0.22, 0.01);
      racket.rotation.set(-0.12, 0.5 + Math.PI, Math.PI * 0.9);

      handBone.add(pivot);
      racketAttached = true;
    }

    function attachPreviewRacket(characterRoot) {
      if (!characterRoot || racketAttached) return;
      const hand = previewHandBone || findRightHandBone(characterRoot);
      if(!hand){
        // Keep visible even if bone lookup fails.
        console.warn("Preview hand bone not found; attaching racket to character root.");
        attachRacketToHand(characterRoot, characterRoot);
        return;
      }

      const objLoader = new OBJLoader();
      objLoader.load("./models/racquet.obj", (obj) => {
        normalizeRacketObj(obj);
        attachRacketToHand(characterRoot, hand, obj);
      }, undefined, (err) => {
        console.warn("Failed to load preview racket OBJ.", err);
        attachRacketToHand(characterRoot, hand);
      });
    }

    function resize() {
      const w = Math.max(1, leftPanel.clientWidth);
      const h = Math.max(1, leftPanel.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (activeTabKey === "career") {
        updateCareerBracket(selectedIndexByTab.career || 0);
      }
    }

    const loader = new FBXLoader();
    loader.load("./models/Offensive%20Idle.fbx", (fbx) => {
      playerModel = fbx;
      playerModel.scale.setScalar(0.01);
      playerModel.position.set(0, 0.02, 0);
      playerModel.rotation.y = 0;
      previewHandBone = findRightHandBone(playerModel);

      playerModel.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = false;
          o.receiveShadow = false;
          if (o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            for (const m of mats) {
              m.side = THREE.DoubleSide;
              m.roughness = typeof m.roughness === "number" ? m.roughness : 0.7;
              m.metalness = typeof m.metalness === "number" ? m.metalness : 0.06;
            }
          }
        }
      });

      scene.add(playerModel);
      attachPreviewRacket(playerModel);

      if (fbx.animations && fbx.animations.length) {
        mixer = new THREE.AnimationMixer(playerModel);
        const action = mixer.clipAction(fbx.animations[0]);
        action.play();
      }
    }, undefined, (err) => {
      console.error("Failed to load idle model for main page.", err);
    });

    const clock = new THREE.Clock();

    function tick() {
      requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.033);
      updateGamepadUiInput();
      if (mixer) mixer.update(dt);
      if (playerModel) playerModel.rotation.y = Math.sin(clock.elapsedTime * 0.7) * 0.06;
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);
    initCareerTournaments();
    applyProgressToUi();
    setSelectedSurface(localStorage.getItem("tennis_quick_surface") || "hard");
    setActiveTab("upgrade");
    resize();
    tick();
  
