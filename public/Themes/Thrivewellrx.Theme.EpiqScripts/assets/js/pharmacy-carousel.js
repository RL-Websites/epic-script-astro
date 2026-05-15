function initBrandingCarousel() {
	const carousel = document.getElementById('brandingCarousel');
	if (!carousel) return;

	const images = carousel.querySelectorAll('.carousel-image');
	if (images.length <= 1) return;

	let currentIndex = 0;
	const totalImages = images.length;
	const rotationInterval = 2000; // 2 seconds

	setInterval(() => {
		const previousIndex = currentIndex;
		currentIndex = (currentIndex + 1) % totalImages;

		const previousImg = images[previousIndex];
		const currentImg = images[currentIndex];

		// Remove active class from previous and add animation
		previousImg.classList.remove('active');
		previousImg.classList.add('exit-animation');

		// Add active class to current with animation
		currentImg.classList.add('active');
		currentImg.classList.add('enter-animation');

		// Remove animation classes after animation completes
		setTimeout(() => {
			previousImg.classList.remove('exit-animation');
		}, 3000);

		setTimeout(() => {
			currentImg.classList.remove('enter-animation');
		}, 3000);
	}, rotationInterval);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initBrandingCarousel);
} else {
	initBrandingCarousel();
}