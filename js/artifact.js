document.addEventListener("DOMContentLoaded", () => {
  const energyPiece = document.querySelector(".loader");
  const heroContent = document.querySelector(".hero-content");

  if (!energyPiece) {
    return;
  }

  const mobileMediaQuery = window.matchMedia("(max-width: 900px)");
  const reducedMotionMediaQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const BASE_TIME = 5000;
  const ADD_TIME = 5000;
  const MAX_TIME = 30000;

  let energyTimer = null;
  let currentDuration = BASE_TIME;

  function clearEnergyTimers() {
    window.clearTimeout(energyTimer);
    energyTimer = null;
  }

  function deactivateEnergy() {
    clearEnergyTimers();
    energyPiece.classList.remove("is-active");
    heroContent?.classList.remove("energy-glow");
  }

  function startEnergySystem() {
    if (mobileMediaQuery.matches || reducedMotionMediaQuery.matches) {
      deactivateEnergy();
      return;
    }

    clearEnergyTimers();

    energyPiece.classList.add("is-active");
    heroContent?.classList.add("energy-glow");

    energyTimer = window.setTimeout(() => {
      deactivateEnergy();
    }, currentDuration);
  }

  energyPiece.addEventListener("mouseenter", () => {
    if (mobileMediaQuery.matches || reducedMotionMediaQuery.matches) {
      return;
    }

    clearEnergyTimers();
    energyPiece.classList.add("is-active");
    heroContent?.classList.add("energy-glow");
  });

  energyPiece.addEventListener("mouseleave", () => {
    if (mobileMediaQuery.matches || reducedMotionMediaQuery.matches) {
      return;
    }

    currentDuration = Math.min(currentDuration + ADD_TIME, MAX_TIME);
    startEnergySystem();
  });

  function handleMotionPreferenceChange() {
    if (mobileMediaQuery.matches || reducedMotionMediaQuery.matches) {
      currentDuration = BASE_TIME;
      deactivateEnergy();
      return;
    }
    startEnergySystem();
  }

  mobileMediaQuery.addEventListener("change", handleMotionPreferenceChange);
  reducedMotionMediaQuery.addEventListener("change", handleMotionPreferenceChange);

  startEnergySystem();
});