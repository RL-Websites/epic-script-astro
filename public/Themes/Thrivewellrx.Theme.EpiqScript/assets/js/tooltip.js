$(document).ready(function () {
	$(".statusTooltipBtn").tooltip({
		trigger: "manual",
		placement: "bottom",
		html: true,
		container: "body",
		template:
			'<div class="tooltip status-tooltip-wrapper" role="tooltip">' +
			'<div class="tooltip-arrow"></div>' +
			'<div class="tooltip-inner"></div>' +
			"</div>",
	});

	// Toggle tooltip on button click
	$(document).on("click", ".statusTooltipBtn", function (e) {
		e.stopPropagation();

		var $this = $(this);

		// Close others
		$(".statusTooltipBtn").not($this).tooltip("hide");

		$this.tooltip("toggle");
	});

	// Allow interaction inside tooltip
	$(document).on("click", ".status-tooltip-wrapper", function (e) {
		e.stopPropagation();
	});

	// Close when clicking outside
	$(document).on("click", function () {
		$(".statusTooltipBtn").tooltip("hide");
	});

	// product card tooltip
	$(".productTooltipBtn").tooltip({
		trigger: "manual",
		placement: "right",
		offset: [0, 10], // ✅ adds gap from the trigger element

		html: true,
		container: "body",
		template:
			'<div class="tooltip product-tooltip-wrapper" role="tooltip">' +
			'<div class="tooltip-arrow"></div>' +
			'<div class="tooltip-inner"></div>' +
			"</div>",
	});

	// Toggle tooltip on button click
	$(document).on("click", ".productTooltipBtn", function (e) {
		e.stopPropagation();

		var $this = $(this);

		// Close others
		$(".productTooltipBtn").not($this).tooltip("hide");

		$this.tooltip("toggle");
	});

	// Allow interaction inside tooltip
	$(document).on("click", ".product-tooltip-wrapper", function (e) {
		e.stopPropagation();
	});

	// Close when clicking outside
	$(document).on("click", function () {
		$(".productTooltipBtn").tooltip("hide");
	});
});
