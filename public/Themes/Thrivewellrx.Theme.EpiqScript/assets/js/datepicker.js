function initDobDatepicker(selector, errorDiv) {
	const inputs = document.querySelectorAll(selector);

	if (!inputs.length) return;

	const today = new Date();
	const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

	inputs.forEach((elem) => {
		if (elem.dataset.bound === "1") return; // prevent double-binding
		elem.dataset.bound = "1";

		// Initialize Datepicker
		const datepicker = new Datepicker(elem, {
			autohide: true,
			maxDate: maxDOB,
		});

		// Mask input: MM/DD/YYYY
		elem.addEventListener("input", (e) => {
			let v = e.target.value.replace(/\D/g, "");

			if (v.length > 2 && v.length <= 4) {
				v = v.slice(0, 2) + "/" + v.slice(2);
			} else if (v.length > 4) {
				v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4, 8);
			}

			e.target.value = v;
		});

		// When user selects date using picker
		elem.addEventListener("changeDate", (event) => {
			const date = event.detail.date;
			if (!date) return;

			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const dd = String(date.getDate()).padStart(2, "0");
			const yy = String(date.getFullYear());
			const formattedDate = `${mm}/${dd}/${yy}`;
			elem.value = formattedDate;

			validateDob(errorDiv, date);
		});

		// When manually typing & leaving input
		elem.addEventListener("blur", () => {
			const date = parseManualDate(elem.value);
			validateDob(errorDiv, date);
		});
	});
}

function parseManualDate(val) {
	const parts = val.split("/");
	if (parts.length !== 3) return null;

	const mm = parseInt(parts[0]);
	const dd = parseInt(parts[1]);
	const yyyy = parseInt(parts[2]);

	const date = new Date(yyyy, mm - 1, dd);
	if (isNaN(date.getTime())) return null;

	return date;
}

function validateDob(elem, date) {
	const errorElem = document.querySelector(elem);
	if (!errorElem) return;

	const today = new Date();
	const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

	console.log(date);
	console.log(maxDOB);

	if (!date) {
		errorElem.innerHTML = "Invalid date format.";
		elem.classList.add("is-invalid");
		return false;
	}

	if (date > maxDOB) {
		errorElem.innerHTML = "You must be at least 18 years old.";
		elem.classList.add("is-invalid");
		return false;
	}

	errorElem.innerHTML = "";
	return true;
}

// const elem = document.querySelector("#dobField");
// const errorDiv = document.getElementById("dobError");
// const today = new Date();
// const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
// const datepicker = new Datepicker(elem, {
// 	autohide: true,
// 	maxDate: maxDOB,
// });

// // ------------------------------
// // VALIDATION FUNCTION
// // ------------------------------
// function validateDOB(value) {
// 	// Expecting masked format: mm/dd/yyyy
// 	const parts = value.split("/");

// 	if (parts.length !== 3) {
// 		return "Invalid date format. Use MM/DD/YYYY.";
// 	}

// 	const [mm, dd, yyyy] = parts.map(Number);

// 	// Basic numeric check
// 	if (!mm || !dd || !yyyy) {
// 		return "Invalid date format.";
// 	}

// 	// Construct a real JS date
// 	const date = new Date(yyyy, mm - 1, dd);

// 	// Invalid or impossible date (e.g., 02/31/2020)
// 	if (date.getFullYear() !== yyyy || date.getMonth() !== mm - 1 || date.getDate() !== dd) {
// 		return "This date does not exist.";
// 	}

// 	// Cannot be in the future
// 	if (date > today) {
// 		return "Date cannot be in the future.";
// 	}

// 	// Must be at least 18 years old
// 	if (date > maxDOB) {
// 		return "You must be at least 18 years old.";
// 	}

// 	return ""; // no errors
// }

// // ------------------------------
// // DATEPICKER CHANGE EVENT
// // ------------------------------
// elem.addEventListener("changeDate", (event) => {
// 	const date = event.detail.date;

// 	// Extract mm/dd/yy display format (your logic)
// 	const mm = String(date.getMonth() + 1).padStart(2, "0");
// 	const dd = String(date.getDate()).padStart(2, "0");
// 	const yy = String(date.getFullYear());

// 	const formattedMMDDYY = `${mm}/${dd}/${yy}`;
// 	console.log("MM-DD-YY:", formattedMMDDYY);

// 	// Validate after selecting date
// 	const fullYearFormat = `${mm}/${dd}/${date.getFullYear()}`; // mm/dd/yyyy
// 	errorDiv.textContent = validateDOB(formattedMMDDYY);
// });

// // ------------------------------
// // INPUT MASK + VALIDATION ON TYPING/BLUR
// // ------------------------------
// elem.addEventListener("input", (e) => {
// 	let v = e.target.value.replace(/\D/g, "");
// 	if (v.length > 2 && v.length <= 4) v = v.slice(0, 2) + "/" + v.slice(2);
// 	else if (v.length > 4) v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4, 8);

// 	e.target.value = v;
// });

// // Validate when leaving the field
// elem.addEventListener("blur", () => {
// 	const value = elem.value.trim();

// 	if (!value) {
// 		errorDiv.textContent = "Please enter your date of birth.";
// 		return;
// 	}

// 	errorDiv.textContent = validateDOB(value);
// });

// $(document).ready(function () {
// 	$("#datetimepicker3").datetimepicker({
// 		format: "MM -- DD -- YYYY",
// 		widgetPositioning: {
// 			vertical: "top",
// 		},
// 	});

// 	$("#datetimepicker3").on("dp.change", function (e) {
// 		console.log(e.date.format("MM, DD, YYYY"));
// 		const month = e.date.format("MM");
// 		const date = e.date.format("DD");
// 		const year = e.date.format("YYYY");
// 		$("#datetimepicker3 #month").text(month);
// 		$("#datetimepicker3 #date").text(date);
// 		$("#datetimepicker3 #year").text(year);
// 	});

// 	$("#timepicker3").datetimepicker({
// 		format: "LT",
// 		widgetPositioning: {
// 			vertical: "top",
// 		},
// 	});

// 	$("#timepicker3").on("dp.change", function (e) {
// 		const hour = e.date.format("hh");
// 		const minute = e.date.format("mm");
// 		$("#timepicker3 #hour").text(hour);
// 		$("#timepicker3 #minute").text(minute);
// 	});

// 	$("#time-picker-1").datetimepicker({
// 		format: "LT",
// 		widgetPositioning: {
// 			vertical: "top",
// 		},
// 	});

// 	$("#time-picker-1").on("dp.change", function (e) {
// 		const hour = e.date.format("hh");
// 		const minute = e.date.format("mm");
// 		$("#time-picker-1 #hour").text(hour);
// 		$("#time-picker-1 #minute").text(minute);
// 	});
// });
