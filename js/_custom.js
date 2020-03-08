document.addEventListener("DOMContentLoaded", function () {
	//PHOTOSESSION RECLAME BLOCK

	$(".fotosession_reclame_block").on("click", function () {
		$(".fotosession_reclame_block").fadeOut();
	});

	//SLIDER

	const gallery = {
		openedImageEl: null,

		settings: {
			previewSelector: ".mySuperGallery",
			openedImageWrapperClass: "galleryWrapper",
			openedImageClass: "galleryWrapper__image",
			openedImageScreenClass: "galleryWrapper__screen",
			openedImageCloseBtnClass: "galleryWrapper__close",
			openedImageNextBtnClass: "galleryWrapper__next",
			openedImageBackBtnClass: "galleryWrapper__back",
			openedImageCloseBtnSrc: "images/gallery/close1.png",
			openedImageNextBtnSrc: "images/gallery/next.png",
			openedImageBackBtnSrc: "images/gallery/back.png",
			imageNotFoundSrc: "images/min/5.jpg"
		},

		init(userSettings = {}) {
			Object.assign(this.settings, userSettings);

			document
				.querySelector(this.settings.previewSelector)
				.addEventListener("click", event => this.containerClickHandler(event));
		},

		containerClickHandler(event) {
			if (event.target.tagName !== "IMG") {
				return;
			}
			this.openedImageEl = event.target; //Кликаем сам элемент по картинке
			this.openImage(event.target.dataset.full_image_url);
		},

		openImage(src) {
			const openedImageEl = this.getScreenContainer().querySelector(
				`.${this.settings.openedImageClass}`
			);
			const img = new Image();
			img.onload = () => (openedImageEl.src = src);
			img.onerror = () => (openedImageEl.src = this.settings.imageNotFoundSrc);
			img.src = src;
		},

		getScreenContainer() {
			const galleryWrapperElement = document.querySelector(
				`.${this.settings.openedImageWrapperClass}`
			);

			if (galleryWrapperElement) {
				return galleryWrapperElement;
			}

			return this.createScreenContainer();
		},
		createScreenContainer() {
			const galleryWrapperElement = document.createElement("div");
			galleryWrapperElement.classList.add(
				this.settings.openedImageWrapperClass
			);

			const nextBtn = new Image();
			nextBtn.classList.add(this.settings.openedImageNextBtnClass);
			nextBtn.src = this.settings.openedImageNextBtnSrc;
			galleryWrapperElement.appendChild(nextBtn);

			nextBtn.addEventListener("click", () => {
				this.openedImageEl = this.getNextImage();
				this.openImage(this.openedImageEl.dataset.full_image_url);
			});

			const backBtn = new Image();
			backBtn.classList.add(this.settings.openedImageBackBtnClass);
			backBtn.src = this.settings.openedImageBackBtnSrc;
			galleryWrapperElement.appendChild(backBtn);

			backBtn.addEventListener("click", () => {
				this.openedImageEl = this.getPrevImage();
				this.openImage(this.openedImageEl.dataset.full_image_url);
			});

			const galleryScreenElement = document.createElement("div");
			galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
			galleryWrapperElement.appendChild(galleryScreenElement);

			const closeImageElement = new Image();
			closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
			closeImageElement.src = this.settings.openedImageCloseBtnSrc;
			closeImageElement.addEventListener("click", () => this.close());
			galleryWrapperElement.appendChild(closeImageElement);

			const image = new Image();
			image.classList.add(this.settings.openedImageClass);
			galleryWrapperElement.appendChild(image);

			document.body.appendChild(galleryWrapperElement);
			return galleryWrapperElement;
		},

		getNextImage() {
			const nextSibling = this.openedImageEl.nextElementSibling;
			return nextSibling
				? nextSibling
				: this.openedImageEl.parentNode.firstElementChild;
		},

		getPrevImage() {
			const prevSibling = this.openedImageEl.previousElementSibling;
			return prevSibling
				? prevSibling
				: this.openedImageEl.parentNode.lastElementChild;
		},

		close() {
			document
				.querySelector(`.${this.settings.openedImageWrapperClass}`)
				.remove();
		}
	};

	window.onload = () =>
		gallery.init({ previewSelector: ".galleryPreviewsContainer" });
});

// LOOK OTHER PHOTOS

function showOtherPhoto(selector) {
	document.querySelector(".fotosession_show").classList.toggle("show");
}

//FOR READING TEXT PART1

function showAnotherText(selector) {
	document.querySelector(".fotosession_text").classList.toggle("show");
}

//FOR READING TEXT PART2

function showElseText(selector) {
	document.querySelector(".fotosession_text2").classList.toggle("show");
}

// REGISTRATION FORM

let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
	modal.style.display = "block";
};

span.onclick = function () {
	modal.style.display = "none";
};

window.onclick = (function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
})(
	//VALIDATION

	function () {
		"use strict";

		var form = document.getElementById("feedback");
		if (!form) return;

		var elements = form.querySelectorAll(".form-control"),
			btn = document.getElementById("send_mess"),
			patternName = /^[a-яёА-ЯЁ\s]+$/,
			patternMail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
			patternPhone = /^\+(\d{1})\(\d{3}\)\d{3}-\d{4}$/,
			errorMess = [
				"Незаполненное поле ввода", // 0
				"Введите Ваше реальное имя", // 1
				"Укажите Вашу электронную почту", // 2
				"Неверный формат электронной почты", // 3
				"Укажите номер телефона", // 4
				"Введите корректно номер телефона", // 5
				"Напишите текст сообщения", // 6
				"Ваше сообщение похоже на спам, уберите специальные символы." // 7
			],
			iserror = false;

		btn.addEventListener("click", validForm);
		form.addEventListener(
			"focus",
			function () {
				var el = document.activeElement;
				if (el !== btn) cleanError(el);
			},
			true
		);

		function validForm(e) {
			e.preventDefault();
			var formVal = getFormData(form),
				error;

			for (var property in formVal) {
				error = getError(formVal, property);
				if (error.length != 0) {
					iserror = true;
					showError(property, error);
				}
			}

			if (!iserror) {
				sendFormData(formVal);
			}
			return false;
		}

		function getError(formVal, property) {
			var error = "",
				validate = {
					username: function () {
						if (
							formVal.username.length == 0 ||
							patternName.test(formVal.username) == false
						) {
							error = errorMess[1];
						}
					},
					usermail: function () {
						if (formVal.usermail.length == 0) {
							error = errorMess[2];
						} else if (patternMail.test(formVal.usermail) == false) {
							error = errorMess[3];
						}
					},
					userphone: function () {
						if (formVal.userphone.length == 2) {
							error = errorMess[4];
						} else if (patternPhone.test(formVal.userphone) == false) {
							error = errorMess[5];
						}
					},
					textmess: function () {
						if (formVal.textmess.length == 0) {
							error = errorMess[6];
						} else if (patternSpam.test(formVal.textmess) == false) {
							error = errorMess[7];
						}
					}
				};
			validate[property]();
			return error;
		}

		[].forEach.call(elements, function (element) {
			element.addEventListener("blur", function (e) {
				var formElement = e.target,
					property = formElement.getAttribute("name"),
					dataField = {};

				dataField[property] = formElement.value;

				var error = getError(dataField, property);
				if (error.length != 0) {
					showError(property, error);
				}
				return false;
			});
		});

		function showError(property, error) {
			var formElement = form.querySelector("[name=" + property + "]"),
				errorBox = formElement.parentElement.nextElementSibling;

			formElement.classList.add("form-control_error");
			errorBox.innerHTML = error;
			errorBox.style.display = "block";
		}

		function cleanError(el) {
			var errorBox = el.parentElement.nextElementSibling;
			el.classList.remove("form-control_error");
			errorBox.removeAttribute("style");
		}

		function getFormData(form) {
			var controls = {};
			if (!form.elements) return "";
			for (var i = 0, ln = form.elements.length; i < ln; i++) {
				var element = form.elements[i];
				if (element.tagName.toLowerCase() !== "button") {
					controls[element.name] = element.value;
				}
			}
			return controls;
		}

		function sendFormData(formVal) {
			var xhr = new XMLHttpRequest(),
				body =
					"username=" +
					encodeURIComponent(formVal.username) +
					"&usermail=" +
					encodeURIComponent(formVal.usermail) +
					"&userphone=" +
					encodeURIComponent(formVal.userphone) +
					"&textmess=" +
					encodeURIComponent(formVal.textmess);

			xhr.open("POST", "/sendmail.php", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader("Cache-Control", "no-cache");

			xhr.onreadystatechange = function () {
				// callback
			};

			xhr.send(body);
		}
	}
)();
