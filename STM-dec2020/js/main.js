"use strict";

const urlDataBase = "https://randomuser.me/api/?results=15";
const spinner = document.querySelector(".spinner-wrap");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const tableUsers = document.querySelector(".table-users");
const bottomMessage = document.querySelector(".bottom-message");
const errorMessage = document.querySelector(".error-message");


//Создаем спиннер загрузки
function showSpinner() {
	spinner.insertAdjacentHTML("afterbegin", `
	<div id="spinner-group">
		<div class="spinner-elem" id="rotateSE_01"></div>
		<div class="spinner-elem" id="rotateSE_02"></div>
		<div class="spinner-elem" id="rotateSE_03"></div>
		<div class="spinner-elem" id="rotateSE_04"></div>
		<div class="spinner-elem" id="rotateSE_05"></div>
		<div class="spinner-elem" id="rotateSE_06"></div>
		<div class="spinner-elem" id="rotateSE_07"></div>
		<div class="spinner-elem" id="rotateSE_08"></div>
	</div>
	<div class="spinner-message">Please wait</div>
	`);
}

//Функция скрывает спиннер со страницы
const hideSpinner = () => spinner.remove();

//Переменная-хранилище информации о пользователях
let users = [];

//Функция, запрашивающая с сервера 15 случайных пользователей
async function getUsers() {
	try {
		let response = await fetch(urlDataBase);
		if (response.ok) {
			let data = await response.json();
			return data;
		}
	} catch (error) {

		throw new Error(
			`Произошла ошибка получения данных по адресу ${urlDataBase}`);
	}
}

//Создаем таблицу пользователей на основе запроса с сервера
function createNewUser() {
	getUsers()
		.then(data => {
			users.push(...data.results);

			showUsers();
		})
		.catch((error) => {

			throw new Error(`Произошла ошибка: ${error.name}`);
		});
}

//Удаление содержимого строки поиска
function clearInput() {
	if (searchInput.value) {
		searchInput.value = "";

		users.forEach(() => {
			tableUsers.removeChild(tableUsers.querySelector("tr"));
		});
		showUsers();
		deleteMessage();
	}
}

//Удаление сообщения о несоответствии контента таблицы пользовательскому вводу
function deleteMessage() {
	bottomMessage.classList.remove("show");
	bottomMessage.classList.add("hide");
}

//На основе данных о пользователях, полученных с сервера, отрисовываем таблицу
function showUsers() {
	users.forEach(
		({ name: { first, last },
			picture: { thumbnail, large },
			location: { state, city }, email, phone,
			registered: { date } }) => {
			let regDate = new Date(Date.parse(date)).toLocaleDateString();
			return tableUsers.insertAdjacentHTML("beforeend", `
					<tr>
						<td>${first} ${last}</td>
						<td class="tooltip-src"><span><img src="${large}"></span><img src="${thumbnail}"></td>
						<td>${state} ${city}</td>
						<td>${email}</td>
						<td>${phone}</td>
						<td>${regDate}</td>
					</tr>
				`);
		});
}

//Производим фильтрацию таблицы на основе пользовательского ввода
function filterUsers() {
	const userName = searchInput.value.trim();
	const regPhrase = new RegExp(userName, "gi");

	let flag = false;
	let count = 0;
	for (let i = 0; i < tableUsers.rows.length; i++) {
		flag = false;
		for (let j = tableUsers.rows[i].cells.length - 1; j >= 0; j--) {
			flag = (tableUsers.rows[i].cells[j].innerHTML).match(regPhrase);
			if (flag) {
				break;
			}
		}//inner for
		if (flag) {
			tableUsers.rows[i].style.display = "";
			count++;

		} else {
			tableUsers.rows[i].style.display = "none";
		}

	}//outer for

	if (count == 0) {
		bottomMessage.classList.remove("hide");
		bottomMessage.classList.add("show");
	} else {
		deleteMessage();
	}
}

//Декоратор для вызова функции-фильтра
function debounce(func, wait, immediate) {
	let timeout;

	return function debouncedFilter() {
		//Сохраняем контекст и параметры, переданные в функцию
		const context = this;
		const args = arguments;

		const later = function () {
			// Нулевой timeout, чтобы указать, что debounce закончилась.
			timeout = null;

			// Вызываем функцию, если immediate !== true,
			// то есть, мы вызываем функцию в конце, после wait времени.
			if (!immediate) {
				func.apply(context, args);
			}
		};

		//Определяем, нужно ли вызвать функцию в самом начале
		const callNow = immediate && !timeout;

		clearTimeout(timeout);

		//Перезапуск таймера
		timeout = setTimeout(later, wait);

		// Вызываем функцию в начале, если immediate === true
		if (callNow) {
			func.apply(context, args);
		}
	};
}

searchBtn.addEventListener("click", clearInput);
searchInput.addEventListener("keyup", debounce(filterUsers, 450, true));

//Функция, инициализирующая работу программы
function init() {
	showSpinner();
	setTimeout(createNewUser, 3000);
	setTimeout(hideSpinner, 3000);

}
init();
