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

const createOverlayMediaModal = (modalContent) => {
  let overlay = document.createElement("div");
  overlay.className = "overlay";

  let modal = document.createElement("div");
  modal.className = "overlay-media-modal";

  let modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  let modalCloseButton = document.createElement("div");
  modalCloseButton.className = "modal-close";

  let closeIconPixel1 = document.createElement("div");
  let closeIconPixel2 = document.createElement("div");
  let closeIconPixel3 = document.createElement("div");
  let closeIconPixel4 = document.createElement("div");
  let closeIconPixel5 = document.createElement("div");
  let closeIconPixel6 = document.createElement("div");
  let closeIconPixel7 = document.createElement("div");
  let closeIconPixel8 = document.createElement("div");
  let closeIconPixel9 = document.createElement("div");

  closeIconPixel1.className = "close-icon-pixel";
  closeIconPixel2.className = "close-icon-pixel";
  closeIconPixel3.className = "close-icon-pixel";
  closeIconPixel4.className = "close-icon-pixel";
  closeIconPixel5.className = "close-icon-pixel";
  closeIconPixel6.className = "close-icon-pixel";
  closeIconPixel7.className = "close-icon-pixel";
  closeIconPixel8.className = "close-icon-pixel";
  closeIconPixel9.className = "close-icon-pixel";

  modalCloseButton.appendChild(closeIconPixel1);
  modalCloseButton.appendChild(closeIconPixel2);
  modalCloseButton.appendChild(closeIconPixel3);
  modalCloseButton.appendChild(closeIconPixel4);
  modalCloseButton.appendChild(closeIconPixel5);
  modalCloseButton.appendChild(closeIconPixel6);
  modalCloseButton.appendChild(closeIconPixel7);
  modalCloseButton.appendChild(closeIconPixel8);
  modalCloseButton.appendChild(closeIconPixel9);

  modalHeader.appendChild(modalCloseButton);
  modal.appendChild(modalHeader);
  modal.appendChild(modalContent);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  modal.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  modalCloseButton.addEventListener("click", function () {
    document.body.removeChild(overlay);
  });
};

const addClickableMediaModal = () => {
  clickableImageMedia = document.querySelectorAll("img.clickable-media");

  clickableImageMedia.forEach(function (media) {
    media.addEventListener("click", function () {
      let modalContent = document.createElement("img");
      modalContent.src = this.src.split("?")[0];

      createOverlayMediaModal(modalContent);
    });
  });

  clickableVideoMedia = document.querySelectorAll("video.clickable-media");

  clickableVideoMedia.forEach(function (media) {
    media.addEventListener("click", function () {
      let modalContent = document.createElement("video");
      modalContent.controls = true;
      modalContent.autoplay = true;

      console.log(this.children);

      let source = document.createElement("source");
      source.src = this.firstElementChild.src;
      source.type = this.firstElementChild.type;

      modalContent.appendChild(source);

      createOverlayMediaModal(modalContent);
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  addDarkModeToggle();
  addClickableMediaModal();
});
