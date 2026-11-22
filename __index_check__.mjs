
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
    import {
      getDatabase,
      ref,
      get,
      set,
      remove,
      runTransaction
    } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
    import {
      getAuth,
      GoogleAuthProvider,
      signInWithPopup,
      signInWithRedirect,
      getRedirectResult,
      onAuthStateChanged,
      signOut
    } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const googleBtn = document.getElementById("googleBtn");
    const playBtn = document.getElementById("playBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const statusEl = document.getElementById("status");
    const userBox = document.getElementById("userBox");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const avatar = document.getElementById("avatar");
    const nameWrap = document.getElementById("nameWrap");
    const firstNameInput = document.getElementById("firstNameInput");
    const saveNameBtn = document.getElementById("saveNameBtn");
    let currentUser = null;

    function nameKeyForUid(uid) {
      return `tennis_username_${uid}`;
    }

    function getSavedFirstName(uid) {
      if (!uid) return "";
      const username = (localStorage.getItem(nameKeyForUid(uid)) || "").trim();
      if (username) return username;
      return (localStorage.getItem(`tennis_first_name_${uid}`) || "").trim();
    }

    function saveFirstName(uid, firstName) {
      localStorage.setItem(nameKeyForUid(uid), firstName);
      localStorage.setItem("tennis_active_player_name", firstName);
    }

    function normalizeUsername(input) {
      return input.replace(/\s+/g, " ").trim();
    }

    function usernameCanonical(input) {
      return normalizeUsername(input).toLowerCase();
    }

    function emailKey(email) {
      const normalized = String(email || "").toLowerCase().trim();
      // Firebase RTDB keys cannot contain . # $ / [ ]
      // Convert to a compact base64url key to keep it path-safe.
      const utf8 = unescape(encodeURIComponent(normalized));
      const b64 = btoa(utf8);
      return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    }

    async function upsertUsernameForUser(user, usernameDisplay) {
      const email = user?.email || "";
      if (!email) return { ok: false, reason: "missing-email" };

      const display = normalizeUsername(usernameDisplay);
      const canonical = usernameCanonical(display);
      const eKey = emailKey(email);
      const userRef = ref(db, `usersByEmail/${eKey}`);
      const userSnap = await get(userRef);
      const oldCanonical = userSnap.exists() ? (userSnap.val().usernameCanonical || "") : "";

      const usernameRef = ref(db, `usernames/${canonical}`);
      const tx = await runTransaction(usernameRef, (current) => {
        if (current === null || current.emailKey === eKey) {
          return {
            emailKey: eKey,
            usernameDisplay: display,
            updatedAt: Date.now()
          };
        }
        return;
      });

      if (!tx.committed) {
        return { ok: false, reason: "taken" };
      }

      if (oldCanonical && oldCanonical !== canonical) {
        const oldRef = ref(db, `usernames/${oldCanonical}`);
        const oldSnap = await get(oldRef);
        if (oldSnap.exists() && oldSnap.val()?.emailKey === eKey) {
          await remove(oldRef);
        }
      }

      await set(userRef, {
        uid: user.uid || "",
        email,
        usernameDisplay: display,
        usernameCanonical: canonical,
        updatedAt: Date.now()
      });

      return { ok: true, usernameDisplay: display };
    }

    async function loadUsernameFromDb(user) {
      const email = user?.email || "";
      if (!email) return "";
      const eKey = emailKey(email);
      const snap = await get(ref(db, `usersByEmail/${eKey}`));
      if (!snap.exists()) return "";
      const v = snap.val() || {};
      return (v.usernameDisplay || "").trim();
    }

    function toMain() {
      window.location.href = "./main.html";
    }

    function setStatus(message, type = "") {
      statusEl.textContent = message;
      statusEl.className = `status ${type}`.trim();
    }

    function setSignedOutUI() {
      googleBtn.style.display = "block";
      playBtn.style.display = "none";
      logoutBtn.style.display = "none";
      nameWrap.style.display = "none";
      userBox.style.display = "none";
      firstNameInput.value = "";
    }

    function setSignedInUI(user, firstName) {
      googleBtn.style.display = "none";
      playBtn.style.display = "block";
      logoutBtn.style.display = "block";
      nameWrap.style.display = firstName ? "none" : "flex";
      userBox.style.display = "flex";
      userName.textContent = firstName || user.displayName || "Player";
      userEmail.textContent = user.email || "";
      avatar.src = user.photoURL || "";
      playBtn.textContent = firstName ? "Continue to Main" : "Save your username first";
      playBtn.disabled = !firstName;
    }

    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      setStatus("Opening Google sign-in...", "");
      try {
        await signInWithPopup(auth, provider);
        setStatus("Signed in successfully.", "ok");
      } catch (err) {
        const code = err?.code || "";
        if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request" || code === "auth/popup-closed-by-user") {
          setStatus("Popup blocked. Switching to redirect sign-in...", "");
          await signInWithRedirect(auth, provider);
          return;
        }
        setStatus(err?.message || "Google sign-in failed.", "error");
      } finally {
        googleBtn.disabled = false;
      }
    });

    playBtn.addEventListener("click", () => {
      if (!currentUser) return;
      const firstName = getSavedFirstName(currentUser.uid);
      if (!firstName) {
        nameWrap.style.display = "flex";
        setStatus("Choose your username / character name before continuing.", "error");
        return;
      }
      playBtn.disabled = true;
      setStatus("Saving profile...", "");
      upsertUsernameForUser(currentUser, firstName)
        .then((res) => {
          if (!res.ok) {
            if (res.reason === "taken") {
              setStatus("That username is already taken. Pick another one.", "error");
              nameWrap.style.display = "flex";
            } else {
              setStatus("Could not save profile. Try again.", "error");
            }
            return;
          }
          setStatus("Profile saved. Entering main...", "ok");
          toMain();
        })
        .finally(() => {
          playBtn.disabled = false;
        });
    });

    saveNameBtn.addEventListener("click", async () => {
      if (!currentUser) return;
      const raw = firstNameInput.value.trim();
      if (!/^[A-Za-z0-9_ -]{3,24}$/.test(raw)) {
        setStatus("Use 3-24 chars: letters, numbers, spaces, _ or -.", "error");
        return;
      }
      const firstName = normalizeUsername(raw);
      saveNameBtn.disabled = true;
      setStatus("Checking username availability...", "");
      try {
        const res = await upsertUsernameForUser(currentUser, firstName);
        if (!res.ok) {
          if (res.reason === "taken") {
            setStatus("Username already taken. Please choose another.", "error");
          } else if (res.reason === "missing-email") {
            setStatus("Your account has no email; cannot create username.", "error");
          } else {
            setStatus("Could not save username. Try again.", "error");
          }
          return;
        }
        saveFirstName(currentUser.uid, res.usernameDisplay);
        setSignedInUI(currentUser, res.usernameDisplay);
        setStatus(`Username saved: ${res.usernameDisplay}. Click Continue.`, "ok");
      } catch (err) {
        setStatus(err?.message || "Username save failed.", "error");
      } finally {
        saveNameBtn.disabled = false;
      }
    });

    firstNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveNameBtn.click();
    });

    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        setStatus("Signed out.", "");
      } catch (err) {
        setStatus(err?.message || "Sign out failed.", "error");
      }
    });

    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      if (user) {
        try {
          let firstName = getSavedFirstName(user.uid);
          if (!firstName) {
            firstName = await loadUsernameFromDb(user);
            if (firstName) saveFirstName(user.uid, firstName);
          }
          setSignedInUI(user, firstName);
          if (firstName) {
            setStatus(`Welcome back, ${firstName}.`, "ok");
          } else {
            setStatus("Set your character name / username to continue.", "");
            firstNameInput.focus();
          }
        } catch (err) {
          setSignedInUI(user, "");
          setStatus(err?.message || "Could not load profile from database.", "error");
        }
      } else {
        setSignedOutUI();
        setStatus("Sign in with Google to continue.", "");
      }
    });

    getRedirectResult(auth).catch((err) => {
      setStatus(err?.message || "Google redirect sign-in failed.", "error");
    });
  