// init Swiper:
const swiper = new Swiper(".swiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  zoom: {
    maxRatio: 3,
  },
});

const collectionSwipers = document.querySelectorAll(".swiper-collection");

collectionSwipers.forEach((swiper) => {
  const collectionSwiper = new Swiper(swiper, {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    centeredSlides: true,
    freeMode: true,
  });
});
