const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === null || targetId === "#") {
      return;
    }
    const target = document.querySelector(targetId);
    if (target === null) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});
