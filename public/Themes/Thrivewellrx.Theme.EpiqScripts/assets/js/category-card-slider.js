(function () {
	function updateCategorySliderFade(swiper) {
    swiper.slides.forEach((slide) => {
      slide.classList.remove("slide-edge-soft", "slide-edge-strong");
      if (!slide.classList.contains("swiper-slide-visible")) return;

      const progress = Math.abs(slide.progress);
      if (progress >= 2.5) {
        slide.classList.add("slide-edge-strong");
      } else if (progress >= 1.5) {
        slide.classList.add("slide-edge-soft");
      }
    });
  }

  function initCategoryCardSliders() {
    if (typeof window.Swiper === "undefined") return;

    const sliders = document.querySelectorAll(
      ".category__product-carousel.swiper",
    );
    sliders.forEach((slider) => {
      if (slider.dataset.swiperInited === "1") return;
      try {
        new Swiper(slider, {
          loop: true,
          slidesPerView: 6,
          centeredSlides: true,
          spaceBetween: 16,
          freeMode: true,
          freeModeMomentum: true,
          freeModeMomentumBounce: false,
          freeModeMomentumVelocityRatio: 0.8,
          allowTouchMove: false,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          },
          speed: 7000,
          watchSlidesProgress: true,
          loopedSlides: 6,
          breakpoints: {
            0: { slidesPerView: 2.5, spaceBetween: 10 },
            576: { slidesPerView: 4.5, spaceBetween: 12 },
            992: { slidesPerView: 6, spaceBetween: 16 },
          },
          on: {
            init(swiper) {
              updateCategorySliderFade(swiper);
            },
            setTranslate(swiper) {
              updateCategorySliderFade(swiper);
            },
            slideChange(swiper) {
              updateCategorySliderFade(swiper);
            },
          },
        });
        slider.dataset.swiperInited = "1";
      } catch (error) {
        console.warn("Category card slider init failed:", error);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCategoryCardSliders);
  } else {
    initCategoryCardSliders();
  }
})();
