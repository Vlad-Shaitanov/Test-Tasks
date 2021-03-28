"use strict";

let slideIndex = 1;//Текущий слайд
const slides = document.querySelectorAll(".slider-item"),
	dotsWrap = document.querySelector(".slider-dots"),
	dots = document.querySelectorAll(".dot");

const showSlides = (n) => {
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

const plusSlides = (n) => {
	showSlides(slideIndex += n);
}

const currentSlide = (n) => {
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

const changeSlides = () => {
	setInterval(() => {
		plusSlides(1);
	}, 5000);
}
changeSlides();

