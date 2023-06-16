const collectionSwipers = document.querySelectorAll(".swiper-collection");

collectionSwipers.forEach((swiper) => {
  const swiperWithoutLoop = swiper.classList.contains("noLoop");
  const collectionSwiper = new Swiper(swiper, {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: !swiperWithoutLoop ? false : true,
    centeredSlides: swiperWithoutLoop ? false : true,
    freeMode: swiperWithoutLoop ? false : true,
    zoom: {
      maxRatio: swiperWithoutLoop ? 3 : 1,
    },
  });
});
