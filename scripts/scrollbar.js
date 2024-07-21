const thumbTrackArrowWidth = 65;
const thumbTrackArrowHeight = 65;

(function (scope) {
  var dragging = false;
  var lastY = 0;

  function dragStart(event) {
    dragging = true;
    this.style.pointerEvents = "none";
    this.style.userSelect = "none";

    lastY =
      event.clientY || event.clientY === 0
        ? event.clientY
        : event.touches[0].clientY;
  }

  function dragMove(event) {
    if (!dragging) return;
    var clientY =
      event.clientY || event.clientY === 0
        ? event.clientY
        : event.touches[0].clientY;
    this.scrollTop += (clientY - lastY) / this.thumb.scaling;
    lastY = clientY;
    event.preventDefault();
  }

  function dragEnd(event) {
    dragging = false;
    this.style.pointerEvents = "initial";
    this.style.userSelect = "initial";
  }

  // The point of this function is to update the thumb's geometry to reflect
  // the amount of overflow.
  function updateSize(scrollable) {
    var thumb = scrollable.thumb;
    var thumbBackground = scrollable.thumbBackground;
    var viewport = scrollable.getBoundingClientRect();
    var scrollHeight = scrollable.scrollHeight;
    var maxScrollTop = scrollHeight - viewport.height;
    var thumbHeight = Math.pow(viewport.height, 2) / scrollHeight;
    var maxTopOffset =
      viewport.height - thumbHeight - 3 * thumbTrackArrowHeight - 5;

    thumb.scaling = maxTopOffset / maxScrollTop;
    thumb.style.height = `${thumbHeight + 1}px`;
    thumb.style.width = `${thumbTrackArrowWidth}px`;

    thumbBackground.scaling = maxTopOffset / maxScrollTop;
    thumbBackground.style.height = `${scrollHeight}px`;
    thumbBackground.style.width = `${thumbTrackArrowWidth}px`;

    if (scrollable.isIOS) {
      thumb.nextElementSibling.style.marginTop = `-${thumbHeight}px`;
      var z = 1 - 1 / (1 + thumb.scaling);
      thumb.style.transform = `
		  translateZ(${z}px)
		  scale(${1 - z})
		  translateY(${thumbTrackArrowHeight}px)
		`;
      thumbBackground.style.transform = `
		  translateZ(${z}px)
		  scale(${1 - z})
	  translateY(-${maxTopOffset}px)
  `;
    } else {
      thumb.style.transform = `
		   scale(${1 / thumb.scaling})
		   matrix3d(
			 1, 0, 0, 0,
			 0, 1, 0, 0,
			 0, 0, 1, 0,
			 0, 0, 0, -1
		   )
		   translateZ(${-2 + 1 - 1 / thumb.scaling}px)
		   translateY(${thumbTrackArrowHeight}px)
		`;
      thumbBackground.style.transform = `
      	   scale(${1 / thumb.scaling})
      	   matrix3d(
      		 1, 0, 0, 0,
      		 0, 1, 0, 0,
      		 0, 0, 1, 0,
      		 0, 0, 0, -1
      	   )
      	   translateZ(${-2 + 1 - 1 / thumb.scaling}px)
		   translateY(-${maxTopOffset}px)
       `;
    }
  }

  function makeCustomScrollbar(scrollable) {
    // Edge requires a transform on the document body and a fixed position element
    // in order for it to properly render the parallax effect as you scroll.
    // See https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5084491/
    if (getComputedStyle(document.body).transform == "none")
      document.body.style.transform = "translateZ(0)";
    var fixedPos = document.createElement("div");
    fixedPos.style.position = "fixed";
    fixedPos.style.top = "0";
    fixedPos.style.width = "1px";
    fixedPos.style.height = "1px";
    fixedPos.style.zIndex = 1;
    document.body.insertBefore(fixedPos, document.body.firstChild);

    scrollable.style.perspectiveOrigin = "top right";
    scrollable.style.transformStyle = "preserve-3d";
    scrollable.style.perspective = "1px";

    var perspectiveCtr = document.createElement("div");
    perspectiveCtr.style.perspectiveOrigin = "top right";
    perspectiveCtr.style.transformStyle = "preserve-3d";
    perspectiveCtr.style.width = "100%";
    perspectiveCtr.style.height = `calc(100% - ${thumbTrackArrowWidth}px)`;

    perspectiveCtr.style.position = "absolute";
    perspectiveCtr.style.pointerEvents = "none";
    perspectiveCtr.classList.add("perspective-ctr");

    while (scrollable.firstChild)
      perspectiveCtr.appendChild(scrollable.firstChild);

    scrollable.insertBefore(perspectiveCtr, scrollable.firstChild);
    var thumb = document.createElement("div");
    thumb.classList.add("vertical-scrollbar-thumb");
    thumb.style.pointerEvents = "initial";
    thumb.style.position = "absolute";
    thumb.style.transformOrigin = "top right";
    thumb.style.top = "0";
    thumb.style.right = "0px";
    perspectiveCtr.insertBefore(thumb, perspectiveCtr.firstChild);
    scrollable.thumb = thumb;

    var thumbBackground = document.createElement("div");
    thumbBackground.classList.add("vertical-scrollbar-thumb-background");
    thumbBackground.style.position = "absolute";
    thumbBackground.style.pointerEvents = "initial";
    thumbBackground.style.transformOrigin = "top right";
    thumbBackground.style.top = "0";
    thumbBackground.style.right = "0px";
    perspectiveCtr.insertBefore(thumbBackground, perspectiveCtr.firstChild);
    scrollable.thumbBackground = thumbBackground;

    scrollable.perspectiveCtr = perspectiveCtr;

    // We are on Safari, where we need to use the sticky trick!
    if (getComputedStyle(scrollable).webkitOverflowScrolling) {
      scrollable.isIOS = true;
      thumb.style.right = "";
      thumb.style.left = "100%";
      thumb.style.position = "-webkit-sticky";
      perspectiveCtr.style.perspective = "1px";
      perspectiveCtr.style.height = "";
      perspectiveCtr.style.width = "";
      perspectiveCtr.style.position = "";
      Array.from(scrollable.children)
        .filter(function (e) {
          return e !== perspectiveCtr;
        })
        .forEach(function (e) {
          perspectiveCtr.appendChild(e);
        });
    }

    scrollable.thumb.addEventListener("mousedown", dragStart.bind(scrollable), {
      passive: true,
    });
    window.addEventListener("mousemove", dragMove.bind(scrollable));
    window.addEventListener("mouseup", dragEnd.bind(scrollable), {
      passive: true,
    });
    scrollable.thumb.addEventListener(
      "touchstart",
      dragStart.bind(scrollable),
      { passive: true }
    );
    window.addEventListener("touchmove", dragMove.bind(scrollable));
    window.addEventListener("touchend", dragEnd.bind(scrollable), {
      passive: true,
    });

    var f = function () {
      updateSize(scrollable);
    };
    requestAnimationFrame(f);
    window.addEventListener("resize", f);
    return f;
  }

  const updateTrackSize = (scrollable) => {
    const horizontalThumbTrack = document.querySelector(
      ".horizontal-scrollbar-track"
    );
    horizontalThumbTrack.style.display = "block";
    horizontalThumbTrack.style.width = `${
      scrollable.clientWidth - thumbTrackArrowHeight
    }px`;
    horizontalThumbTrack.style.height = `${thumbTrackArrowWidth + 5}px`;

    const verticalThumbTrack = document.querySelector(
      ".vertical-scrollbar-track"
    );
    verticalThumbTrack.style.display = "block";
    verticalThumbTrack.style.height = `${
      scrollable.clientHeight - thumbTrackArrowHeight
    }px`;
    verticalThumbTrack.style.width = `${thumbTrackArrowWidth + 5}px`;

    const thumbTrackArrows = document.querySelectorAll(
      ".scrollbar-track-arrow"
    );

    thumbTrackArrows.forEach((arrow) => {
      arrow.style.height = `${thumbTrackArrowHeight}px`;
      arrow.style.width = `${thumbTrackArrowWidth}px`;
    });

    thumbTrackArrows[0].addEventListener("click", () => {
      scrollable.scrollTop -= 50;
    });

    thumbTrackArrows[1].addEventListener("click", () => {
      scrollable.scrollTop += 50;
    });

    const scrollbarCorner = document.querySelector(".scrollbar-corner");
    scrollbarCorner.style.display = "block";
    scrollbarCorner.style.width = `${thumbTrackArrowWidth}px`;
    scrollbarCorner.style.height = `${thumbTrackArrowHeight}px`;
  };

  window.addEventListener("load", function () {
    const scrollable = document.querySelector(".vertical-scrollbar-container");

    makeCustomScrollbar(scrollable);
    updateSize(scrollable);
    updateTrackSize(scrollable);
  });
})(self);
