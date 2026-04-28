(function () {
    function initSwiperForElement(el, buildOptions) {
        if (!el) return;

        // Prevent double init
        if (el.dataset.swiperInited === "1") return;

        // If Swiper not loaded yet
        if (typeof window.Swiper === "undefined") return;

        const opts = buildOptions(el);

        try {
            // If a swiper instance somehow exists, destroy it
            if (el.swiper && typeof el.swiper.destroy === "function") {
                el.swiper.destroy(true, true);
            }

            new Swiper(el, opts);
            el.dataset.swiperInited = "1";
        } catch (e) {
            console.warn("Swiper init failed:", el, e);
        }
    }

    function initAllSwipers() {
        initSwiperForElement(document.querySelector(".product__wrapper"), (el) => ({
            loop: true,
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".next-arrow") || el.querySelector(".next-arrow"),
                prevEl: el.closest(".swiper")?.querySelector(".prev-arrow") || el.querySelector(".prev-arrow"),
            },
            autoplay: { delay: 3000 },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 15 },
                768: { slidesPerView: 2, spaceBetween: 15, grid: { rows: 1, fill: "row" } },
                992: { slidesPerView: 2, spaceBetween: 35, grid: { rows: 2, fill: "row" } },
            },
        }));

        initSwiperForElement(document.querySelector(".client__feedbacks"), (el) => ({
            loop: true,
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".next-arrow") || el.querySelector(".next-arrow"),
                prevEl: el.closest(".swiper")?.querySelector(".prev-arrow") || el.querySelector(".prev-arrow"),
            },
            breakpoints: {
                0: { slidesPerView: 1.3, spaceBetween: 15 },
                768: { slidesPerView: 1.8, spaceBetween: 15 },
                992: { slidesPerView: 2.5, spaceBetween: 35 },
            },
        }));

        initSwiperForElement(document.querySelector(".related_product_slider"), (el) => ({
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".product__arrow--left") || el.querySelector(".product__arrow--left"),
                prevEl: el.closest(".swiper")?.querySelector(".product__arrow--right") || el.querySelector(".product__arrow--right"),
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
            },
        }));

        initSwiperForElement(document.querySelector(".products__filter-btns"), (el) => ({
            spaceBetween: 12,
            loop: false,
            slidesPerView: "auto",
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".products__filter-right") || el.querySelector(".products__filter-right"),
                prevEl: el.closest(".swiper")?.querySelector(".products__filter-left") || el.querySelector(".products__filter-left"),
            },
        }));

        initSwiperForElement(document.querySelector(".feedback__slider"), (el) => ({
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: el.closest(".swiper")?.querySelector(".swiper-pagination") || el.querySelector(".swiper-pagination"),
                clickable: true,
            },
            breakpoints: {
                0: { slidesPerView: 1.2, spaceBetween: 15, centerInsufficientSlides: true },
                768: { slidesPerView: 2, centerInsufficientSlides: true },
                992: { slidesPerView: 3, centerInsufficientSlides: true },
            },
        }));

        initSwiperForElement(document.querySelector(".mySwiper"), (el) => ({
            slidesPerView: 3,
            spaceBetween: 30,
            pagination: {
                el: el.closest(".swiper")?.querySelector(".swiper-pagination") || el.querySelector(".swiper-pagination"),
                clickable: true,
            },
        }));

        initSwiperForElement(document.querySelector(".home-product-slider"), (el) => ({
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".product__arrow--right") || el.querySelector(".product__arrow--right"),
                prevEl: el.closest(".swiper")?.querySelector(".product__arrow--left") || el.querySelector(".product__arrow--left"),
            },
            breakpoints: {
                0: { slidesPerView: 1.3, centerInsufficientSlides: true },
                576: { slidesPerView: 2, centerInsufficientSlides: true },
                992: { slidesPerView: 3, centerInsufficientSlides: true },
            },
        }));

        initSwiperForElement(document.querySelector(".product__items--alt"), (el) => ({
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: el.closest(".swiper")?.querySelector(".next-arrow") || el.querySelector(".next-arrow"),
                prevEl: el.closest(".swiper")?.querySelector(".prev-arrow") || el.querySelector(".prev-arrow"),
            },
            pagination: {
                el: el.closest(".swiper")?.querySelector(".swiper-pagination") || el.querySelector(".swiper-pagination"),
                clickable: true,
            },
            breakpoints: {
                0: { slidesPerView: 1.3, spaceBetween: 15, centerInsufficientSlides: true },
                768: { slidesPerView: 2.2, centerInsufficientSlides: true },
                992: { slidesPerView: 2.2, centerInsufficientSlides: true },
            },
        }));
    }

    // Run once on first load
    document.addEventListener("DOMContentLoaded", initAllSwipers);

    // MutationObserver: re-init when Oqtane injects new page/module DOM
    const observer = new MutationObserver(() => {
        initAllSwipers();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Extra safety for delayed renders
    setTimeout(initAllSwipers, 300);
    setTimeout(initAllSwipers, 1000);
})();
