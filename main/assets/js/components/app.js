"use strict";

const carousels = document.querySelectorAll(".main-carousel");
const filterAccordion = document.querySelector(".filter-accordion");
const infoButtons = document.querySelectorAll(".info-button");

// Calculate Viewport height for VH
function resetHeight() {
  let viewportHeight = window.innerHeight + "px";
  let root = document.documentElement;
  document.querySelector("body").style.height = viewportHeight;
  root.style.setProperty("--viewport-height", viewportHeight);
}
window.addEventListener("resize", function () {
  resetHeight();
});
resetHeight();

for (let infoButton of infoButtons) {
  infoButton.onclick = () => {
    document.querySelector(".info-box").classList.toggle("info-box-open");
  };
}

// Flickity Carousels
carousels.forEach((carousel) => {
  const flkty = new Flickity(carousel, {
    lazyLoad: 1,
    pageDots: false,
    wrapAround: true,
    freeScroll: true,
    watchCSS: true,
  });
});

const lookbookCarousel = {
  flkty: new Flickity(document.querySelector(".fullscreen-carousel"), {
    lazyLoad: 1,
    pageDots: false,
    cellSelector: ".carousel-cell",
  }),
  carousel: document.querySelector(".fullscreen-carousel"),
  lookbookImages: document.querySelectorAll(
    "#lookbook .image-container picture"
  ),
  closeButton: document.querySelector(".close-fullscreen"),
  isVisible: false,
};

lookbookCarousel.closeButton?.addEventListener("click", () => {
  lookbookCarousel.carousel.style.visibility = "hidden";
});

for (let i = 0; i < lookbookCarousel.lookbookImages.length; i++) {
  const image = lookbookCarousel.lookbookImages[i];
  image.addEventListener("click", () => {
    console.log(i + 1);
    lookbookCarousel.carousel.style.visibility = "visible";
    lookbookCarousel.flkty.select(i, true, true);
  });
}

const productCarousel = {
  element: document.querySelector(".product-carousel"),
  flkty: !this.element
    ? new Flickity(document.querySelector(".product-carousel"), {
        lazyLoad: 1,
        pageDots: false,
      })
    : null,
};

window.onresize = () => productCarousel.flkty.resize();

//TERMS AND CONDITIONS POP UP
const openTerms = document.querySelector(".open-terms");

if (openTerms) {
  const termsPopup = document.querySelector(".terms-conditions");
  const closeTerms = document.querySelector(" .close-terms");
  openTerms.onclick = () => {
    termsPopup.style.visibility = "visible";
  };
  closeTerms.onclick = () => {
    termsPopup.style.visibility = "hidden";
  };
}

// FIX FOR BETTER SWIPE ON MOBILE DEVICES

(function () {
  var touchingCarousel = false,
    touchStartCoords;

  document.body.addEventListener("touchstart", function (e) {
    if (e.target.closest(".flickity-slider")) {
      touchingCarousel = true;
    } else {
      touchingCarousel = false;
      return;
    }

    touchStartCoords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
  });

  document.body.addEventListener(
    "touchmove",
    function (e) {
      if (!(touchingCarousel && e.cancelable)) {
        return;
      }

      var moveVector = {
        x: e.touches[0].pageX - touchStartCoords.x,
        y: e.touches[0].pageY - touchStartCoords.y,
      };

      if (Math.abs(moveVector.x) > 7) e.preventDefault();
    },
    { passive: false }
  );
})();

// ACCORDION FILTER
filterAccordion?.addEventListener("click", (el) => {
  filterAccordion.classList.toggle("is-open");
  let heightAccordion = filterAccordion.parentNode.style;
  let heightFilterButton = filterAccordion.scrollHeight;
  let heightFilterList =
    filterAccordion.parentNode.querySelector("ul").scrollHeight +
    heightFilterButton;

  filterAccordion.classList.contains("is-open")
    ? (heightAccordion.height = heightFilterList + "px")
    : (heightAccordion.height = heightFilterButton + "px");
});

// ---------------------------------
// Change style of current menu when page scrolls in viewport
// ---------------------------------

(function () {
  var anchorsArray = document.querySelectorAll(".sub-menu a");
  var sections = document.querySelectorAll("article");
  var sectionsArray = [];

  // Collect all sections and push to sectionsArray
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    sectionsArray.push(section);
  }
  changeSubmenuStyle();

  window.onscroll = function () {
    changeSubmenuStyle();
  };
  function changeSubmenuStyle() {
    var scrollPosition = window.scrollY;

    for (var i = 0; i < anchorsArray.length; i++) {
      // Get hrefs from each anchor
      var anchorID = anchorsArray[i].getAttribute("href");
      var sectionHeight = sectionsArray[i].offsetHeight;
      var sectionTop = sectionsArray[i].offsetTop;

      if (anchorID.includes("#")) {
        if (
          scrollPosition + 140 >= sectionTop &&
          scrollPosition + 140 < sectionTop + sectionHeight
        ) {
          document
            .querySelector('.sub-menu a[href="' + anchorID + '"]')
            .classList.add("is-active");
        } else {
          document
            .querySelector('.sub-menu a[href="' + anchorID + '"]')
            .classList.remove("is-active");
        }
      }
    }
  }
})();
