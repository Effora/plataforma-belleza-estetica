(() => {
  const body = document.body;
  const stageA = document.getElementById("stage-a");
  const stageB = document.getElementById("stage-b");
  const hint = document.getElementById("hint-text");
  const swipeToast = document.getElementById("swipe-toast");
  const versionButtons = document.querySelectorAll("[data-version]");
  const deviceButtons = document.querySelectorAll("[data-device]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactScrollThreshold = 28;

  const setVersion = (version) => {
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

    hint.textContent = isA
      ? "Scrolleá: los iconos empiezan grandes y se achican. Tocá una tarjeta o el corazón."
      : "En B: pasá (X), me gusta (✓) o deslizá. El corazón del costado también suma like.";
  };

  const setDevice = (device) => {
    body.classList.toggle("is-desktop", device === "desktop");
    deviceButtons.forEach((button) => {
      const on = button.getAttribute("data-device") === device;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

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
        showSwipeToast("like", "ME GUSTA");
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
      hint.textContent = "Mensaje listo: en mobile se abre el chat del comercio.";
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
    document.querySelectorAll(".app-a__scroll").forEach((scrollRoot) => {
      const app = scrollRoot.closest(".app-a");
      const catsBar = scrollRoot.querySelector(".cats-bar");

      const updateCompactState = () => {
        const compact = scrollRoot.scrollTop > compactScrollThreshold;
        if (app) {
          app.classList.toggle("is-scrolled", compact);
        }
        if (catsBar) {
          catsBar.classList.toggle("is-compact", compact);
        }
      };

      scrollRoot.addEventListener("scroll", updateCompactState, { passive: true });
      updateCompactState();
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

  const showSwipeToast = (kind, label) => {
    if (!swipeToast) {
      return;
    }
    swipeToast.textContent = label;
    swipeToast.className = `swipe-toast swipe-toast--${kind} is-on`;
    window.setTimeout(() => {
      swipeToast.classList.remove("is-on");
    }, prefersReducedMotion ? 400 : 700);
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
    showSwipeToast(isLike ? "like" : "pass", isLike ? "ME GUSTA" : "PASAR");
    current.classList.add(isLike ? "is-like" : "is-pass");

    const stampDelay = prefersReducedMotion ? 0 : 180;
    const exitDelay = prefersReducedMotion ? 0 : 300;

    window.setTimeout(() => {
      current.classList.add(isLike ? "is-out-right" : "is-out-left");
      window.setTimeout(() => {
        reelIndex = (reelIndex + 1) % reels.length;
        showReel(reelIndex);
        swipeBusy = false;
        hint.textContent = isLike
          ? "Me gusta ✓ · seguí pasando o tocá Reservar / i para el detalle."
          : "Pasaste esta promo · viene la siguiente.";
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
  setVersion("a");
  setDevice("mobile");
})();
