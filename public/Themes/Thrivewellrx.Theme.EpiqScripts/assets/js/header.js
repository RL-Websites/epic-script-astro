document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site__header");
  let lastScrollTop = 0;
  let isHeaderVisible = true;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Determine scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      if (isHeaderVisible) {
        header?.classList.add("header-hidden");
        header?.classList.remove("header-visible");
        isHeaderVisible = false;
      }
    } else if (scrollTop < lastScrollTop) {
      // Scrolling up - show header
      if (!isHeaderVisible) {
        header?.classList.add("header-visible");
        header?.classList.remove("header-hidden");
        isHeaderVisible = true;
      }
    }

    // Add scrolled class for styling when scrolled
    if (scrollTop > 50) {
      header?.classList.add("header-scrolled");
    } else {
      header?.classList.remove("header-scrolled");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  // Throttle scroll events for better performance
  let scrollTimer;
  window.addEventListener("scroll", function () {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(handleScroll, 10);
  });

  // Initial check
  handleScroll();
});
