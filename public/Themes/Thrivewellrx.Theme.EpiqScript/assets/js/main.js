// Header, menu, scrolling, toasts, etc.
$(document).ready(function () {
    document.addEventListener("keydown", function (e) {
        const el = e.target;

        if (!el || (el.id !== "expiry" && el.id !== "cvc" && el.id !== "zipCode"))
            return;

        // allow control keys
        if (
            e.key === "Backspace" ||
            e.key === "Delete" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === "Tab"
        ) {
            return;
        }

        // allow digits only
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // ✅ WORKS (JS side)
        }
    });
    // AOS init (guarded)
    if (window.AOS && typeof AOS.init === "function") {
        AOS.init();
    }

    // Tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    // Hamburger menu
    $(document).on("click", ".hamburger-menu", function () {
        $(".site__menu__list").toggleClass("show-menu");
        $(".site__header").toggleClass("menu-open");
        $("body").toggleClass("header-open");

        var icon = $(this).find("i");
        if (icon.hasClass("icon-hamburger-menu")) {
            icon.removeClass("icon-hamburger-menu").addClass("icon-cross");
        } else {
            icon.removeClass("icon-cross").addClass("icon-hamburger-menu");
        }
    });

    // User dropdown toggle
    $(document).on("click", "#user-menu-btn, #user-menu-btn-mob", function () {
        $(this).next(".user-dropdown").toggleClass("show");
    });

    // Close dropdown when clicking outside
    $(document).on("click", function (e) {
        if (
            !$(e.target).closest("#user-menu-btn").length &&
            !$(e.target).closest("#user-dropdown").length
        ) {
            $("#user-dropdown").removeClass("show");
        }
    });

    function updateHeader() {
        const header = document.querySelector(".site__header");
        if (!header) return;

        const logo = header.querySelector(".site__logo--img");
        if (!logo) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop >= 50) {
            header.classList.add("sticky");
            if (logo.dataset.logoSticky) logo.src = logo.dataset.logoSticky;
        } else {
            header.classList.remove("sticky");
            if (logo.dataset.logoDefault) logo.src = logo.dataset.logoDefault;
        }
    }

    // Run on page load
    updateHeader();

    // Run on scroll
    $(window).on("scroll", function () {
        updateHeader();
    });

    // Scroll to top
    $(".scrollToTop").on("click", function () {
        $("html, body").animate(
            {
                scrollTop: 0,
            },
            "slow"
        );
    });

    // Toast
    $("#liveToastBtn").on("click", function () {
        var toastEl = $("#liveToast");
        if (toastEl.length && window.bootstrap && bootstrap.Toast) {
            var toast = new bootstrap.Toast(toastEl[0]);
            toast.show();
        }
    });

    // Get Started / Browse Products (delegated so it works after SPA navigation)
    $(document).on("click", "#browseProducts", function () {
        const productSection = $(".product");

        if (productSection.length) {
            $("html, body").animate(
                {
                    scrollTop: productSection.offset().top - 75,
                },
                "smooth"
            );
        }
    });

    $(document).on("click", "#getStartedBtn", function () {
        const baseUrl = $("#homeUrl").val();
        if (baseUrl) {
            window.location.href = baseUrl + "?loc=product";
        } else {
            window.location.href = "?loc=product";
        }
    });
    // 	// Product Read More
    // 	$(document).on("click", "#readMore", function () {
    // 		const parent = $(this).parents(".product-hero__details");
    // 		parent.toggleClass("show");
    // 		$(this).text(parent.hasClass("show") ? "Read Less" : "Read More");
    // 	});
    // });
    const details = $(".product-hero__details");
    const readMore = $("#readMore");
    const parent = readMore.parents(".product-hero__details");

    // Get the actual text content (excluding the "Read More" div)
    const textContent = details
        .clone()
        .children(".read-more")
        .remove()
        .end()
        .text()
        .trim();

    // If text is less than 50 characters, hide "Read More" and ensure content is fully visible
    if (textContent.length < 640) {
        readMore.hide();
        parent.addClass("show"); // Optionally force full visibility
    } else {
        readMore.show();
    }

    // Existing toggle functionality
    $(document).on("click", "#readMore", function () {
        parent.toggleClass("show");
        $(this).text(parent.hasClass("show") ? "Read Less" : "Read More");
    });
});
// Numeric-only input handlers
$(document).on("input", ".numeric-only", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
});

$(document).on("paste", ".numeric-only", function () {
    var $this = $(this);
    setTimeout(function () {
        $this.val($this.val().replace(/[^0-9]/g, ""));
    }, 10);
});

// DOB datepicker + timeline scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("hello");

    if (typeof initDobDatepicker === "function") {
        try {
            initDobDatepicker("#dobField", "#dobError");
            initDobDatepicker("#myProfileDob", "#myProfileDobError");
        } catch (err) {
            console.warn("initDobDatepicker error:", err);
        }
    }
});

// Desktop timeline helpers
const getSteps = () =>
    document.querySelectorAll(".timeline-step[data-observed]");

// Remove active class from all steps
const deactivateAllSteps = () => {
    const steps = getSteps();
    steps.forEach((step) => {
        const dot = step.querySelector(".timeline-dot");
        const stepNumber = step.querySelector(".step-number");
        const title = step.querySelector(".step-title");

        dot?.classList.remove("active");
        stepNumber?.classList.remove("purple");
        title?.classList.remove("active-title");
    });
};

// Activate a specific step
const activateStep = (step) => {
    const dot = step.querySelector(".timeline-dot");
    const stepNumber = step.querySelector(".step-number");
    const title = step.querySelector(".step-title");

    dot?.classList.add("active");
    stepNumber?.classList.add("purple");
    title?.classList.add("active-title");
};

// Find and activate the most centered step
const updateActiveStep = () => {
    const steps = getSteps();
    if (!steps.length) return;

    let mostCenteredStep = null;
    let minDistance = Infinity;

    // show circular mask and controls once image is ready
    if (modalEl && modalEl.classList) modalEl.classList.add('image-loaded');
    if (controls && controls.classList) controls.classList.remove('d-none');

    const viewportCenter = window.innerHeight / 2;

    steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (distance < minDistance) {
                minDistance = distance;
                mostCenteredStep = step;
            }
        }
    });

    deactivateAllSteps();

    if (mostCenteredStep) {
        activateStep(mostCenteredStep);
    }
};

// Scroll throttling for desktop timeline
let ticking = false;
const handleScroll = () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveStep();
            ticking = false;
        });
        ticking = true;
    }
};

// Initial check
updateActiveStep();

// Listen to scroll events
window.addEventListener("scroll", handleScroll);

// Mobile timeline helpers
const getMobileSteps = () =>
    document.querySelectorAll(".mobile-timeline-step[data-observed]");

// Remove active class from all mobile steps
const deactivateAllMobileSteps = () => {
    const mobileSteps = getMobileSteps();

    mobileSteps.forEach((step) => {
        const dot = step.querySelector(".mobile-dot");
        const stepNumber = step.querySelector(".mobile-step-number");
        const title = step.querySelector(".mobile-step-title");
        const line = step.querySelector(".mobile-dot-line");
        const description = step.querySelector(".mobile-number-description");

        if (dot) dot.classList.remove("active");
        if (stepNumber) stepNumber.classList.remove("purple");
        if (title) title.classList.remove("active-title");
        if (description) description.classList.remove("active-title");
        if (line) {
            line.style.height = "0";
        }
    });
};

// Activate a specific mobile step
const activateMobileStep = (step) => {
    const dot = step.querySelector(".mobile-dot");
    const stepNumber = step.querySelector(".mobile-step-number");
    const title = step.querySelector(".mobile-step-title");
    const line = step.querySelector(".mobile-dot-line");
    const description = step.querySelector(".mobile-number-description");

    if (dot) dot.classList.add("active");
    if (stepNumber) stepNumber.classList.add("purple");
    if (title) title.classList.add("active-title");
    if (description) description.classList.add("active-title");
    if (line) {
        line.style.height = "var(--line-height)";
    }
};

// Find and activate the most centered mobile step
const updateActiveMobileStep = () => {
    const mobileSteps = getMobileSteps();
    if (!mobileSteps.length) return;

    let mostCenteredStep = null;
    let minDistance = Infinity;

    const viewportCenter = window.innerHeight / 2;

    mobileSteps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (distance < minDistance) {
                minDistance = distance;
                mostCenteredStep = step;
            }
        }
    });

    deactivateAllMobileSteps();

    if (mostCenteredStep) {
        activateMobileStep(mostCenteredStep);
    }
};

// Scroll throttling for mobile timeline
let mobileTickingState = false;
const handleMobileScroll = () => {
    if (!mobileTickingState) {
        window.requestAnimationFrame(() => {
            updateActiveMobileStep();
            mobileTickingState = false;
        });
        mobileTickingState = true;
    }
};

// Set CSS custom properties for all mobile steps
getMobileSteps().forEach((step) => {
    step.style.setProperty("--dot-gap", "2rem");
    step.style.setProperty("--line-height", "calc(100% - 14px)");
});

// Initial check for mobile
updateActiveMobileStep();

// Listen to scroll events for mobile
window.addEventListener("scroll", handleMobileScroll);

$(window).on("load", function () {
    setTimeout(function () {
        $("#page-loader").fadeOut(300, function () {
            $(this).remove();
        });
    }, 500); // 0.5s delay
});





// my profile image  js code
(function () {
    console.log('🚀 Avatar Cropper initialized');

    // DOM Elements
    const profileAvatar = document.getElementById("profileAvatar");
    const openBtn = document.getElementById("openAvatarModalBtn");
    const modalEl = document.getElementById("avatarModal");
    const fileInput = document.getElementById("avatarFile");
    const cropperImg = document.getElementById("cropperImage");
    const controls = document.getElementById("cropperControls");
    const saveBtn = document.getElementById("saveAvatarBtn");
    const errorBox = document.getElementById("avatarError");
    const successBox = document.getElementById("avatarSuccess");
    const dropZone = document.getElementById("dropZone");
    const uploadProgress = document.getElementById("uploadProgress");
    const cropPreview = document.getElementById("cropPreview");
    const previewContainer = document.querySelector('.preview-container');
    const previewLabel = previewContainer ? previewContainer.querySelector('label') : null;

    // Bootstrap modal instance
    const bsModal = new bootstrap.Modal(modalEl, { backdrop: "static" });

    let cropper = null;
    let objectUrl = null;

    // Configuration
    const CONFIG = {
        maxSizeMB: 8,
        minDimensions: 150,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        cropSize: 512,
        quality: 0.9
    };

    // ---- Helper Functions ----
    function showError(message) {
        console.error('❌ Error:', message);
        errorBox.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${message}`;
        errorBox.classList.remove("d-none");
        hideSuccess();
    }

    function showSuccess(message) {
        console.log('✅ Success:', message);
        successBox.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
        successBox.classList.remove("d-none");
        hideError();
    }

    function hideError() {
        errorBox.classList.add("d-none");
    }

    function hideSuccess() {
        successBox.classList.add("d-none");
    }

    function clearMessages() {
        hideError();
        hideSuccess();
    }

    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('successToast');
        const toastBody = document.getElementById('successMessage');

        if (toastEl && toastBody) {
            toastBody.textContent = message;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }

    function updateProgressBar(percent) {
        const progressBar = uploadProgress.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = percent + '%';
            progressBar.setAttribute('aria-valuenow', percent);
        }
    }

    function showProgress() {
        uploadProgress.classList.remove('d-none');
        updateProgressBar(0);
    }

    function hideProgress() {
        uploadProgress.classList.add('d-none');
        updateProgressBar(0);
    }

    function updatePreview() {
        if (!cropper || !cropPreview) return;

        try {
            const size = 100;
            const cropped = cropper.getCroppedCanvas({
                width: size,
                height: size,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: "high"
            });

            if (cropped) {
                // Display the cropped image directly (rectangular/square)
                cropPreview.src = cropped.toDataURL('image/png');
                cropPreview.style.display = 'block';
                cropPreview.style.borderRadius = '8px'; // Match profile style
                // Hide the static "Preview:" label when actual preview exists
                if (previewLabel) previewLabel.style.display = 'none';
            }
        } catch (err) {
            console.warn('Preview update failed:', err);
        }
    }

    function cleanupPreview() {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save';
        controls.classList.add("d-none");
        hideProgress();

        // remove loaded-image state so circular mask is hidden
        if (modalEl && modalEl.classList) modalEl.classList.remove('image-loaded');

        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        cropperImg.style.display = "none";
        cropperImg.removeAttribute("src");

        if (cropPreview) {
            cropPreview.style.display = "none";
            cropPreview.removeAttribute("src");
        }

        // Always hide the static preview label when cleaning up
        if (previewLabel) {
            previewLabel.style.display = 'none';
        }

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
        }

        // Reset input
        fileInput.value = "";
        clearMessages();
    }

    function validateFile(file) {
        console.log('🔍 Validating file:', file.name, file.type, file.size);

        if (!CONFIG.allowedTypes.includes(file.type)) {
            throw new Error("Please select a valid image file (JPEG, PNG, or WebP).");
        }

        if (file.size > CONFIG.maxSizeMB * 1024 * 1024) {
            throw new Error(`Image is too large. Please upload an image under ${CONFIG.maxSizeMB}MB.`);
        }

        return true;
    }

    async function validateImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                if (img.width < CONFIG.minDimensions || img.height < CONFIG.minDimensions) {
                    reject(new Error(`Image is too small. Minimum size is ${CONFIG.minDimensions}×${CONFIG.minDimensions} pixels.`));
                } else {
                    console.log('✅ Image dimensions valid:', img.width, 'x', img.height);
                    resolve(true);
                }
            };
            img.onerror = () => reject(new Error("Invalid image file."));
            img.src = URL.createObjectURL(file);
        });
    }

    async function initializeCropper(file) {
        console.log('🔄 Initializing cropper...');

        try {
            await validateImageDimensions(file);
        } catch (err) {
            showError(err.message);
            cleanupPreview();
            return;
        }

        // Cleanup old cropper
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        objectUrl = URL.createObjectURL(file);
        cropperImg.src = objectUrl;
        cropperImg.style.display = "block";

        // Wait for image to load
        cropperImg.onload = function () {
            console.log('🖼️ Image loaded, creating cropper...');

            cropper = new Cropper(cropperImg, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: "move",
                autoCropArea: 0.8,
                responsive: true,
                background: false,
                checkOrientation: true,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,

                ready() {
                    console.log('✅ Cropper ready!');
                    controls.classList.remove("d-none");
                    saveBtn.disabled = false;
                    if (modalEl && modalEl.classList) modalEl.classList.add('image-loaded');
                    updatePreview();
                },

                crop: updatePreview,
                zoom: updatePreview,
                rotate: updatePreview
            });
        };

        cropperImg.onerror = function () {
            showError("Failed to load the selected image.");
            cleanupPreview();
        };
    }

    // Initialize cropper from an existing image URL (e.g., already uploaded avatar)
    async function initializeCropperFromUrl(url) {
        console.log('🔄 Initializing cropper from URL...', url);

        // Cleanup old cropper
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        cropperImg.src = url;
        cropperImg.style.display = "block";

        cropperImg.onload = function () {
            console.log('🖼️ Image (URL) loaded, creating cropper...');

            cropper = new Cropper(cropperImg, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: "move",
                autoCropArea: 0.8,
                responsive: true,
                background: false,
                checkOrientation: true,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,

                ready() {
                    console.log('✅ Cropper (URL) ready!');
                    controls.classList.remove("d-none");
                    saveBtn.disabled = false;
                    if (modalEl && modalEl.classList) modalEl.classList.add('image-loaded');
                    updatePreview();
                },

                crop: updatePreview,
                zoom: updatePreview,
                rotate: updatePreview
            });
        };

        cropperImg.onerror = function () {
            showError("Failed to load the selected image.");
            cleanupPreview();
        };
    }

    // ---- Event Listeners ----

    // Open modal - both button and image click
    let pendingAvatarSrc = null;

    function openModal() {
        console.log('📖 Opening avatar modal...');
        cleanupPreview();

        // Store the src if we need to initialize from existing avatar
        try {
            const src = profileAvatar && profileAvatar.src ? profileAvatar.src : null;
            if (src && !src.includes('default-avatar.png')) {
                pendingAvatarSrc = src;
            } else {
                pendingAvatarSrc = null;
            }
        } catch (err) {
            console.warn('Unable to check avatar src:', err);
            pendingAvatarSrc = null;
        }

        bsModal.show();
    }

    if (openBtn) {
        openBtn.addEventListener("click", openModal);
    }

    if (profileAvatar) {
        profileAvatar.addEventListener("click", openModal);
        profileAvatar.addEventListener("keydown", function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    }

    // Also allow clicking the wrapper (overlay/icon area) to open modal
    const profileWrapper = document.querySelector('.profile-picture-wrapper');
    if (profileWrapper) {
        profileWrapper.style.cursor = 'pointer';
        profileWrapper.setAttribute('tabindex', '0');
        profileWrapper.addEventListener('click', function (e) {
            // if click lands on child controls that shouldn't open, let them handle it
            openModal();
        });
        profileWrapper.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    }

    // On init, mark wrapper as having an image if profileAvatar is not the default avatar
    (function markWrapperIfHasImage() {
        try {
            if (profileAvatar && profileWrapper) {
                const src = profileAvatar.src || '';
                if (src && !src.includes('default-avatar.png')) {
                    profileWrapper.classList.add('has-image');
                }
            }
        } catch (err) {
            console.warn('Error checking existing avatar:', err);
        }
    })();

    // Modal shown event - initialize cropper if pending
    modalEl.addEventListener("shown.bs.modal", function () {
        console.log('👁️ Modal fully shown');
        if (pendingAvatarSrc) {
            console.log('🔄 Initializing pending avatar:', pendingAvatarSrc);
            initializeCropperFromUrl(pendingAvatarSrc);
            pendingAvatarSrc = null; // Clear it
        }
    });

    // Modal cleanup
    modalEl.addEventListener("hidden.bs.modal", function () {
        console.log('🚪 Modal closed, cleaning up...');
        cleanupPreview();
        pendingAvatarSrc = null;
    });

    // File input change
    fileInput.addEventListener("change", async function (e) {
        clearMessages();
        console.log('📁 File input changed...');

        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
            validateFile(file);
            await initializeCropper(file);
        } catch (err) {
            showError(err.message);
            cleanupPreview();
        }
    });

    // Save functionality (minimal): crop -> base64 -> console
    saveBtn.addEventListener("click", async function () {
        clearMessages();
        if (!cropper) return;

        console.log('💾 Saving avatar (minimal)...');

        const originalHTML = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
        showProgress();

        try {
            updateProgressBar(10);

            const size = CONFIG.cropSize;
            const cropped = cropper.getCroppedCanvas({
                width: size,
                height: size,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: "high",
            });

            updateProgressBar(40);

            if (!cropped) throw new Error("Unable to crop the image.");

            // Composite cropped canvas onto a rectangular background and
            // export as JPEG so the avatar on the page appears rectangular.
            const out = document.createElement('canvas');
            out.width = size;
            out.height = size;
            const octx = out.getContext('2d');
            // Fill background (white) to avoid transparency showing as circle
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, size, size);
            // Draw the cropped image (square) over the background
            octx.drawImage(cropped, 0, 0, size, size);

            // Export as JPEG so result is a rectangular image
            const dataUrl = out.toDataURL('image/jpeg', CONFIG.quality);
            const base64 = dataUrl.split(',')[1];

            console.log('🖼️ Cropped rectangular data URL:', dataUrl);

            updateProgressBar(100);

            // Update the avatar on the page (ensure rectangular display)
            if (profileAvatar) {
                profileAvatar.src = dataUrl;
                // enforce rectangular corner radius to match design
                profileAvatar.style.borderRadius = '8px';
            }

            showToast('Cropped image ready (logged to console)');
            showSuccess('Cropped image logged');
            setTimeout(() => bsModal.hide(), 800);

        } catch (err) {
            console.error('❌ Save error:', err);
            showError(err.message || 'Something went wrong.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalHTML;
            hideProgress();
        }
    });

    // No upload functions in minimal mode — cropping + base64 logging only.

    console.log('✅ Avatar Cropper setup complete');
    console.log(cropperImg)

})();
