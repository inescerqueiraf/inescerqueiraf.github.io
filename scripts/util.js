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

document.addEventListener("DOMContentLoaded", function () {
  addDarkModeToggle();
});
