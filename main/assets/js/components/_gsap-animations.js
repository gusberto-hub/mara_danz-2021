const container = document.querySelector("body");
const sections = document.querySelectorAll("section");
const collections = document.querySelectorAll("#collections article");
const navigation = document.querySelector(".navigation");
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

ScrollTrigger.defaults({
  markers: false,
});

ScrollTrigger.saveStyles(collections);

ScrollTrigger.matchMedia({
  "(min-width: 48rem)": function () {
    for (let [index, collection] of collections.entries()) {
      const imageContainer = collection.querySelector(".image-slider");

      gsap.to(imageContainer, {
        xPercent: () => `-=100`,
        ease: "none",
        scrollTrigger: {
          trigger: imageContainer,
          start: () => `+=${220} center`,
          // start: () =>
          //   `+=${imageContainer.parentNode.offsetHeight - 670} center`,
          end: () => `+=${imageContainer.offsetWidth * 2}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: 0.1,
        },
      });
    }

    let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(
        "#collections .image-collection",
        "rotate",
        "deg"
      ), // fast
      clamp = gsap.utils.clamp(-1, 1); // don't let the skew go beyond 20 degrees.

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -1000);
        // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.1,
            ease: "sine",
            overwrite: true,
            onUpdate: () => {
              skewSetter(proxy.skew);
            },
          });
        }
      },
    });
  },
});

window.onload = () => {
  const flowImages = document.querySelectorAll(".flow-image");
  for (let [index, flowImage] of flowImages.entries()) {
    const section = flowImage.parentElement;
    const staticImage = flowImage.querySelector(".static-image");

    gsap.to(flowImages[0], {
      x: () => `-=${window.innerWidth * 1.6}`,
      y: () => `+=${section.offsetHeight * 0.8}`,
      rotate: Math.random() * -90,
      ease: "none",
      scrollTrigger: {
        trigger: staticImage,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    });
    gsap.to(flowImages[1], {
      x: () => `+=${window.innerWidth * 0.3}`,
      y: () => `+=${section.offsetHeight * 0.4}`,
      scale: 1.5,
      rotate: Math.random() * 30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });
  }
};
