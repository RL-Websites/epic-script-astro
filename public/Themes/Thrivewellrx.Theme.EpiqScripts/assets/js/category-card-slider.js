(function () {
	function initCategoryCardSliders() {
		if (typeof window.Swiper === "undefined") return;

		const sliders = document.querySelectorAll(".category__product-carousel.swiper");
		sliders.forEach((slider) => {
			if (slider.dataset.swiperInited === "1") return;
			try {
				new Swiper(slider, {
					loop: true,
					slidesPerView: 7,
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
					loopedSlides: 7,
					breakpoints: {
						0: { slidesPerView: 2.5, spaceBetween: 10 },
						576: { slidesPerView: 4.5, spaceBetween: 12 },
						992: { slidesPerView: 7, spaceBetween: 16 },
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
