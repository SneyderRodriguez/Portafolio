document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".project-carousel");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const previousButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const projectLinks = document.querySelectorAll(".project-links");

  if (!carousel || cards.length === 0) {
    console.warn("No se encontró la estructura del carrusel.");
    return;
  }

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let theta = 0;
  let radius = getRadius();

  function getRadius() {
    if (window.innerWidth <= 576) {
      return 210;
    }

    if (window.innerWidth <= 768) {
      return 245;
    }

    if (window.innerWidth <= 900) {
      return 275;
    }

    return 300;
  }

  function arrangeCards() {
    const angle = 360 / cards.length;

    cards.forEach((card, index) => {
      const cardAngle = angle * index;

      card.style.transform =
        `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

      card.dataset.index = String(index);
    });
  }

  function rotateCarousel() {
    carousel.style.transform = `rotateY(${theta}deg)`;

    const anglePerCard = 360 / cards.length;
    let calculatedIndex = Math.round(-theta / anglePerCard) % cards.length;

    if (calculatedIndex < 0) {
      calculatedIndex += cards.length;
    }

    currentIndex = calculatedIndex;
  }

  function goToNextCard() {
    theta -= 360 / cards.length;
    rotateCarousel();
  }

  function goToPreviousCard() {
    theta += 360 / cards.length;
    rotateCarousel();
  }

  function toggleCurrentCard(card) {
    const cardIndex = Number.parseInt(card.dataset.index, 10);

    if (cardIndex === currentIndex) {
      card.classList.toggle("flipped");
    }
  }

  function getPointerX(event) {
    if (event.touches?.length > 0) {
      return event.touches[0].pageX;
    }

    if (event.changedTouches?.length > 0) {
      return event.changedTouches[0].pageX;
    }

    return event.pageX;
  }

  function handleDragStart(event) {
    const pointerX = getPointerX(event);

    if (typeof pointerX !== "number") {
      return;
    }

    isDragging = true;
    startX = pointerX;

    carousel.classList.add("is-dragging");
  }

  function handleDrag(event) {
    if (!isDragging) {
      return;
    }

    const currentX = getPointerX(event);

    if (typeof currentX !== "number") {
      return;
    }

    const differenceX = currentX - startX;
    const sensitivity = 0.5;
    const temporaryTheta = theta + differenceX * sensitivity;

    carousel.style.transform = `rotateY(${temporaryTheta}deg)`;

    if (event.cancelable) {
      event.preventDefault();
    }
  }

  function handleDragEnd(event) {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    carousel.classList.remove("is-dragging");

    const currentX = getPointerX(event) ?? startX;
    const differenceX = currentX - startX;

    if (Math.abs(differenceX) > 20) {
      if (differenceX > 0) {
        goToPreviousCard();
      } else {
        goToNextCard();
      }

      return;
    }

    const anglePerCard = 360 / cards.length;
    theta = Math.round(theta / anglePerCard) * anglePerCard;

    rotateCarousel();
  }

  function handleKeyboard(event) {
    if (event.key === "ArrowLeft") {
      goToNextCard();
      return;
    }

    if (event.key === "ArrowRight") {
      goToPreviousCard();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      const currentCard = cards.find(
        (card) => Number.parseInt(card.dataset.index, 10) === currentIndex
      );

      if (currentCard) {
        event.preventDefault();
        toggleCurrentCard(currentCard);
      }
    }
  }

  previousButton?.addEventListener("click", goToPreviousCard);
  nextButton?.addEventListener("click", goToNextCard);

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      toggleCurrentCard(card);
    });
  });

  projectLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  carousel.addEventListener("mousedown", handleDragStart);
  carousel.addEventListener("touchstart", handleDragStart, {
    passive: true
  });

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("touchmove", handleDrag, {
    passive: false
  });

  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);
  document.addEventListener("keydown", handleKeyboard);

  window.addEventListener("resize", () => {
    radius = getRadius();
    arrangeCards();
    rotateCarousel();
  });

  arrangeCards();
  rotateCarousel();
});