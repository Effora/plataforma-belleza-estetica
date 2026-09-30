(() => {
  const body = document.body;
  const stageA = document.getElementById("stage-a");
  const stageB = document.getElementById("stage-b");
  const hint = document.getElementById("hint-text");
  const swipeToast = null;
  const versionButtons = document.querySelectorAll("[data-version]");
  const deviceButtons = document.querySelectorAll("[data-device]");
  const langButtons = document.querySelectorAll("[data-lang]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactScrollThreshold = 12;
  const stampLike = "Like";
  const stampPass = "Pass";

  const copy = {
    es: {
      docTag: "Demo UX · Glowgo",
      docTitle: "Dos formas de descubrir belleza",
      docSub: "Paleta neurociencia unisex. A = Airbnb. B = Reels + Like / Pass. App internacional · ES · EN · PT.",
      labelLang: "Idioma",
      labelVersion: "Versión",
      labelDevice: "Dispositivo",
      hintA: "Scrolleá: los iconos empiezan grandes y se achican. Tocá una tarjeta o el corazón.",
      hintB: "En B: Pass (X), Like (✓) o deslizá. El corazón del costado también suma Like.",
      hintLike: "Like · seguí con Pass o tocá Reservar / i para el detalle.",
      hintPass: "Pass · viene la siguiente promo.",
      hintChat: "Mensaje listo: en mobile se abre el chat del comercio.",
      hello: "Hola, Carolina",
      homeTitle: "¿Qué te hacés hoy?",
      searchMain: "Corte, color, uñas…",
      searchSub: "Cerca · Cualquier día · Filtros",
      searchAria: "Buscar servicio cerca",
      chipPromos: "Promos",
      chipPrice: "Hasta USD 20",
      chipNow: "Ahora",
      catCut: "Corte",
      catNails: "Uñas",
      catColor: "Color",
      catSkin: "Piel",
      catBeard: "Barba",
      nearYou: "Cerca tuyo",
      book: "Reservar",
      bookSlot: "Reservar turno",
      bookDiscount: "Reservar con descuento",
      bookNow: "Reservar ahora",
      forYou: "Para vos",
      nearby: "Cerca",
      nextStep: "Próximo paso"
    },
    en: {
      docTag: "UX Demo · Glowgo",
      docTitle: "Two ways to discover beauty",
      docSub: "Unisex neuroscience palette. A = Airbnb flow. B = Reels + Like / Pass. International app · ES · EN · PT.",
      labelLang: "Language",
      labelVersion: "Version",
      labelDevice: "Device",
      hintA: "Scroll: icons start large and shrink. Tap a card or the heart.",
      hintB: "In B: Pass (X), Like (✓) or swipe. The side heart also adds a Like.",
      hintLike: "Like · keep going with Pass, or tap Book / i for details.",
      hintPass: "Pass · next promo coming up.",
      hintChat: "Message ready: on mobile this opens the salon chat.",
      hello: "Hi, Carolina",
      homeTitle: "What are you getting today?",
      searchMain: "Cut, color, nails…",
      searchSub: "Nearby · Any day · Filters",
      searchAria: "Search nearby services",
      chipPromos: "Deals",
      chipPrice: "Up to USD 20",
      chipNow: "Now",
      catCut: "Cut",
      catNails: "Nails",
      catColor: "Color",
      catSkin: "Skin",
      catBeard: "Beard",
      nearYou: "Near you",
      book: "Book",
      bookSlot: "Book appointment",
      bookDiscount: "Book with discount",
      bookNow: "Book now",
      forYou: "For you",
      nearby: "Nearby",
      nextStep: "Next step"
    },
    pt: {
      docTag: "Demo UX · Glowgo",
      docTitle: "Duas formas de descobrir beleza",
      docSub: "Paleta de neurociência unissex. A = Airbnb. B = Reels + Like / Pass. App internacional · ES · EN · PT.",
      labelLang: "Idioma",
      labelVersion: "Versão",
      labelDevice: "Dispositivo",
      hintA: "Role: os ícones começam grandes e diminuem. Toque em um card ou no coração.",
      hintB: "Em B: Pass (X), Like (✓) ou deslize. O coração ao lado também soma Like.",
      hintLike: "Like · continue com Pass ou toque em Reservar / i para o detalhe.",
      hintPass: "Pass · vem a próxima promo.",
      hintChat: "Mensagem pronta: no mobile abre o chat do salão.",
      hello: "Olá, Carolina",
      homeTitle: "O que você vai fazer hoje?",
      searchMain: "Corte, coloração, unhas…",
      searchSub: "Perto · Qualquer dia · Filtros",
      searchAria: "Buscar serviço perto",
      chipPromos: "Promos",
      chipPrice: "Até USD 20",
      chipNow: "Agora",
      catCut: "Corte",
      catNails: "Unhas",
      catColor: "Cor",
      catSkin: "Pele",
      catBeard: "Barba",
      nearYou: "Perto de você",
      book: "Reservar",
      bookSlot: "Reservar horário",
      bookDiscount: "Reservar com desconto",
      bookNow: "Reservar agora",
      forYou: "Para você",
      nearby: "Perto",
      nextStep: "Próximo passo"
    }
  };

  let currentLang = "es";
  let currentVersion = "a";

  const getText = (key) => {
    const pack = copy[currentLang] || copy.es;
    return pack[key] || copy.es[key] || key;
  };

  const applyLanguage = (lang) => {
    if (!copy[lang]) {
      return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;

    langButtons.forEach((button) => {
      const on = button.getAttribute("data-lang") === lang;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (!key) {
        return;
      }
      node.textContent = getText(key);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const key = node.getAttribute("data-i18n-aria");
      if (!key) {
        return;
      }
      node.setAttribute("aria-label", getText(key));
    });

    updateHint();
  };

  const updateHint = () => {
    if (!hint) {
      return;
    }
    hint.textContent = currentVersion === "a" ? getText("hintA") : getText("hintB");
  };

  const setVersion = (version) => {
    currentVersion = version;
    const isA = version === "a";
    stageA.classList.toggle("is-active", isA);
    stageB.classList.toggle("is-active", !isA);
    stageA.hidden = !isA;
    stageB.hidden = isA;

    versionButtons.forEach((button) => {
      const on = button.getAttribute("data-version") === version;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    updateHint();
  };

  const setDevice = (device) => {
    body.classList.toggle("is-desktop", device === "desktop");
    deviceButtons.forEach((button) => {
      const on = button.getAttribute("data-device") === device;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.getAttribute("data-lang"));
    });
  });

  versionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setVersion(button.getAttribute("data-version"));
    });
  });

  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setDevice(button.getAttribute("data-device"));
    });
  });

  const showScreen = (phoneScreenRoot, screenName) => {
    if (!phoneScreenRoot) {
      return;
    }
    phoneScreenRoot.querySelectorAll(".screen").forEach((screen) => {
      const on = screen.getAttribute("data-screen") === screenName;
      screen.classList.toggle("is-on", on);
    });
  };

  document.querySelectorAll("[data-open-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const target = button.getAttribute("data-open-detail");
      if (target === "a") {
        showScreen(button.closest(".phone__screen"), "a-detail");
        return;
      }
      if (target === "b") {
        showScreen(button.closest(".phone__screen"), "b-detail");
        return;
      }
      if (target === "a-desk" || target === "b-desk") {
        const wrap = document.getElementById("a-desk-detail-wrap");
        if (wrap) {
          wrap.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
      }
    });
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-back");
      const phone = button.closest(".phone__screen");
      if (target === "a") {
        showScreen(phone, "a-home");
        return;
      }
      if (target === "b") {
        showScreen(phone, "b-home");
      }
    });
  });

  document.querySelectorAll("[data-like]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const on = !button.classList.contains("is-on");
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && button.closest(".app-b")) {
        showSwipeToast("like", stampLike);
      }
    });
  });

  document.querySelectorAll("[data-message]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const phone = button.closest(".phone__screen");
      if (phone) {
        showScreen(phone, "b-chat");
        return;
      }
      if (hint) {
        hint.textContent = getText("hintChat");
      }
    });
  });

  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-on");
    });
  });

  document.querySelectorAll(".cat").forEach((button) => {
    button.addEventListener("click", () => {
      const list = button.closest(".cats");
      if (!list) {
        return;
      }
      list.querySelectorAll(".cat").forEach((item) => {
        item.classList.remove("is-on");
      });
      button.classList.add("is-on");
    });
  });

  const bindAirbnbScrollShrink = () => {
    const bindScrollRoot = (scrollRoot, appNode, catsBar) => {
      if (!scrollRoot) {
        return;
      }
      const updateCompactState = () => {
        const compact = scrollRoot.scrollTop > compactScrollThreshold;
        if (appNode) {
          appNode.classList.toggle("is-scrolled", compact);
        }
        if (catsBar) {
          catsBar.classList.toggle("is-compact", compact);
        }
      };
      scrollRoot.addEventListener("scroll", updateCompactState, { passive: true });
      updateCompactState();
    };

    document.querySelectorAll(".app-a__scroll").forEach((scrollRoot) => {
      bindScrollRoot(
        scrollRoot,
        scrollRoot.closest(".app-a"),
        scrollRoot.querySelector(".cats-bar")
      );
    });

    document.querySelectorAll(".desk-a__main").forEach((scrollRoot) => {
      bindScrollRoot(
        scrollRoot,
        scrollRoot.closest(".desk-a"),
        scrollRoot.querySelector(".cats-bar")
      );
    });
  };

  let reelIndex = 0;
  let swipeBusy = false;
  const reels = Array.from(document.querySelectorAll("#reel-stack > .reel[data-reel]"));

  const showReel = (index) => {
    reels.forEach((reel, reelPosition) => {
      const on = reelPosition === index;
      reel.classList.toggle("hidden", !on);
      reel.classList.remove("is-out-left", "is-out-right", "is-like", "is-pass");
    });
  };

  const showSwipeToast = () => {
    /* Un solo cartel: el stamp grande del reel. */
  };

  const pulseSwipeButton = (direction) => {
    const button = document.querySelector(`[data-swipe="${direction}"]`);
    if (!button) {
      return;
    }
    button.classList.remove("is-pulse");
    void button.offsetWidth;
    button.classList.add("is-pulse");
  };

  const swipeReel = (direction) => {
    if (swipeBusy || reels.length === 0) {
      return;
    }
    const current = reels[reelIndex];
    if (!current) {
      return;
    }

    swipeBusy = true;
    const isLike = direction === "like";
    pulseSwipeButton(direction);
    showSwipeToast(isLike ? "like" : "pass", isLike ? stampLike : stampPass);
    current.classList.add(isLike ? "is-like" : "is-pass");

    const stampDelay = prefersReducedMotion ? 0 : 180;
    const exitDelay = prefersReducedMotion ? 0 : 300;

    window.setTimeout(() => {
      current.classList.add(isLike ? "is-out-right" : "is-out-left");
      window.setTimeout(() => {
        reelIndex = (reelIndex + 1) % reels.length;
        showReel(reelIndex);
        swipeBusy = false;
        if (hint) {
          hint.textContent = isLike ? getText("hintLike") : getText("hintPass");
        }
      }, exitDelay);
    }, stampDelay);
  };

  document.querySelectorAll("[data-swipe]").forEach((button) => {
    button.addEventListener("click", () => {
      swipeReel(button.getAttribute("data-swipe"));
    });
  });

  const reelStack = document.getElementById("reel-stack");
  if (reelStack) {
    let startX = 0;
    let tracking = false;

    const beginTrack = (clientX) => {
      tracking = true;
      startX = clientX;
    };

    const endTrack = (clientX) => {
      if (!tracking) {
        return;
      }
      tracking = false;
      const deltaX = clientX - startX;
      if (Math.abs(deltaX) < 56) {
        return;
      }
      swipeReel(deltaX > 0 ? "like" : "pass");
    };

    reelStack.addEventListener("touchstart", (event) => {
      if (!event.changedTouches[0]) {
        return;
      }
      beginTrack(event.changedTouches[0].clientX);
    }, { passive: true });

    reelStack.addEventListener("touchend", (event) => {
      if (!event.changedTouches[0]) {
        return;
      }
      endTrack(event.changedTouches[0].clientX);
    }, { passive: true });

    reelStack.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      if (event.target.closest("button")) {
        return;
      }
      beginTrack(event.clientX);
      reelStack.setPointerCapture(event.pointerId);
    });

    reelStack.addEventListener("pointerup", (event) => {
      if (event.pointerType === "touch") {
        return;
      }
      endTrack(event.clientX);
    });
  }

  bindAirbnbScrollShrink();
  showReel(0);
  applyLanguage("es");
  setVersion("a");
  setDevice("mobile");
})();
