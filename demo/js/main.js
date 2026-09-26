(() => {
  const body = document.body;
  const stageA = document.getElementById("stage-a");
  const stageB = document.getElementById("stage-b");
  const hint = document.getElementById("hint-text");
  const versionButtons = document.querySelectorAll("[data-version]");
  const deviceButtons = document.querySelectorAll("[data-device]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      ? "Tocá una tarjeta o el corazón para guardar. Flujo tipo Airbnb."
      : "En B: descartá, hacé match, likeá o abrí el mensaje.";
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

  let reelIndex = 0;
  const reels = Array.from(document.querySelectorAll("#reel-stack > .reel[data-reel]"));

  const showReel = (index) => {
    reels.forEach((reel, reelPosition) => {
      const on = reelPosition === index;
      reel.classList.toggle("hidden", !on);
      reel.classList.remove("is-out-left", "is-out-right", "is-like", "is-pass");
    });
  };

  const swipeReel = (direction) => {
    if (reels.length === 0) {
      return;
    }
    const current = reels[reelIndex];
    if (!current) {
      return;
    }
    current.classList.add(direction === "like" ? "is-like" : "is-pass");
    window.setTimeout(() => {
      current.classList.add(direction === "like" ? "is-out-right" : "is-out-left");
      window.setTimeout(() => {
        reelIndex = (reelIndex + 1) % reels.length;
        showReel(reelIndex);
        if (direction === "like") {
          const phone = current.closest(".phone__screen");
          if (phone) {
            showScreen(phone, "b-detail");
          }
        }
      }, prefersReducedMotion ? 0 : 280);
    }, prefersReducedMotion ? 0 : 160);
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

    reelStack.addEventListener("touchstart", (event) => {
      if (!event.changedTouches[0]) {
        return;
      }
      tracking = true;
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    reelStack.addEventListener("touchend", (event) => {
      if (!tracking || !event.changedTouches[0]) {
        return;
      }
      tracking = false;
      const deltaX = event.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) < 60) {
        return;
      }
      swipeReel(deltaX > 0 ? "like" : "pass");
    }, { passive: true });
  }

  showReel(0);
  setVersion("a");
  setDevice("mobile");
})();
