// import { addClickableMediaModal } from "./media-modal";

const THEME_KEY = "THEME";

const addDarkModeToggle = () => {
  const darkModeButton = document.querySelector("#dark-mode-switcher");

  const theme = window.localStorage.getItem(THEME_KEY);
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
  }

  darkModeButton.addEventListener("click", () => {
    const isDarkMode = document.documentElement.classList.toggle("dark-mode");

    window.localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
  });
};

const sizeWelcomeGIF = () => {
  const perspectiveCtr = document.querySelector(".perspective-ctr");
  const welcomeGIF = document.querySelector("#welcome_page_gif");

  if (welcomeGIF && perspectiveCtr) {
    containerHeight = perspectiveCtr.offsetHeight;
    containerWidth = perspectiveCtr.offsetWidth;

    if (containerHeight > containerWidth) {
      welcomeGIF.style.width = `${0.9 * containerWidth}px`;
    } else {
      welcomeGIF.style.marginTop = `${0.05 * containerHeight}px`;
      welcomeGIF.style.height = `${0.9 * containerHeight}px`;
    }
  }
};

const sizeAboutMeMedia = () => {
  const aboutMeBox = document.querySelector("#about-me-box");
  const aboutMeMedia = document.querySelector("#about-me-media");

  if (aboutMeMedia && aboutMeBox) {
    aboutMeMedia.style.height = `${aboutMeBox.offsetHeight}px`;
  }
};

window.addEventListener("load", function () {
  addDarkModeToggle();
  sizeWelcomeGIF();
  sizeAboutMeMedia();
});
