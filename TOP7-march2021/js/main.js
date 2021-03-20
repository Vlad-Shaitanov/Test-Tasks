"use strict";

/*===== SLIDER =====*/
let slideIndex = 1;//Текущий слайд
let slides = document.querySelectorAll(".slider-item"),
	dotsWrap = document.querySelector(".slider-dots"),
	dots = document.querySelectorAll(".dot");

function showSlides(n) {
	if (n > slides.length) {
		slideIndex = 1;
	}
	if (n < 1) {
		slideIndex = slides.length;
	}
	slides.forEach(item => { item.style.display = "none"; });
	dots.forEach((item) => {
		item.classList.remove("dot-active");
	});
	slides[slideIndex - 1].style.display = "block";
	dots[slideIndex - 1].classList.add("dot-active");
}
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

dotsWrap.addEventListener("click", function (event) {
	let target = event.target;
	for (let i = 0; i < dots.length + 1; i++) {
		if (target.classList.contains("dot") && target == dots[i - 1]) {
			currentSlide(i);
		}
	}
});

function changeSlides() {
	setInterval(() => {
		plusSlides(1);
	}, 5000);
}
changeSlides();


/*===== ABOUT modal =====*/
const callbackBtn = document.querySelector(".callback-btn");
const callbackModalOverlay = document.querySelector(".modal__callback-overlay");
const callbackModal1 = document.querySelector(".modal-1");
const callbackModal2 = document.querySelector(".modal-2");
const callbackFormBtn = document.querySelector(".callback__form-btn");


callbackBtn.addEventListener("click", () => {
	callbackModal1.style.display = "block";
	callbackModal1.classList.remove("modal--visible");
	callbackModal1.classList.add("modal--visible");
	callbackModal2.classList.remove("modal--visible");
	callbackModal2.classList.add("modal--hidden");

	callbackModalOverlay.classList.add("modal__callback-overlay--visible");
	document.body.style.overflow = "hidden";//Запрет скролла при открытой модалке
});

callbackFormBtn.addEventListener("click", () => {
	callbackModal1.classList.remove('modal--visible');
	callbackModal1.style.display = "none";

	callbackModal2.classList.remove("modal--hidden");
	callbackModal2.classList.add("modal--visible");

	document.body.style.overflow = "hidden";
});

callbackModalOverlay.addEventListener("click", event => {
	//Скрываем модальное окно при клике на оверлей
	if (event.target == callbackModalOverlay) {
		callbackModalOverlay.classList.remove('modal__callback-overlay--visible');
		document.body.style.overflow = "";
	}
});