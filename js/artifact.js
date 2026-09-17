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
  let particleInterval = null;
  let currentDuration = BASE_TIME;

  function clearEnergyTimers() {
    window.clearTimeout(energyTimer);
    window.clearInterval(particleInterval);

    energyTimer = null;
    particleInterval = null;
  }

  function deactivateEnergy() {
    clearEnergyTimers();

    energyPiece.classList.remove("is-active");
    heroContent?.classList.remove("energy-glow");

    document
      .querySelectorAll(".energy-particle")
      .forEach((particle) => particle.remove());
  }

  function startEnergySystem() {
    if (mobileMediaQuery.matches || reducedMotionMediaQuery.matches) {
      deactivateEnergy();
      return;
    }

    clearEnergyTimers();

    energyPiece.classList.add("is-active");
    heroContent?.classList.add("energy-glow");

    spawnEnergyParticles();

    particleInterval = window.setInterval(() => {
      if (energyPiece.classList.contains("is-active")) {
        spawnEnergyParticles();
      }
    }, 2200);

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
  reducedMotionMediaQuery.addEventListener(
    "change",
    handleMotionPreferenceChange
  );

  startEnergySystem();
});

function spawnEnergyParticles() {
  const loader = document.querySelector(".loader");

  if (!loader || !loader.classList.contains("is-active")) {
    return;
  }

  for (let index = 0; index < 8; index += 1) {
    window.setTimeout(() => {
      if (!loader.classList.contains("is-active")) {
        return;
      }

      const particle = document.createElement("span");
      particle.className = "energy-particle";

      const randomY = (Math.random() - 0.5) * 120;
      particle.style.setProperty("--y-spread", `${randomY}px`);

      loader.appendChild(particle);

      particle.addEventListener("animationend", () => {
        particle.remove();
      });
    }, index * 90);
  }
}