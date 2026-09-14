document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-list");
  const navigationLinks = document.querySelectorAll(".nav-list a");

  if (!menuToggle || !navigation) {
    console.warn("No se encontró la estructura del menú móvil.");
    return;
  }

  function setMenuState(isOpen) {
    menuToggle.classList.toggle("is-active", isOpen);
    navigation.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );

    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu =
      navigation.contains(event.target) || menuToggle.contains(event.target);

    if (!clickedInsideMenu) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });
});