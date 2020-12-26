"use strict";

const urlDataBase = "https://randomuser.me/api/?results=15";
const spinner = document.querySelector(".spinner-wrap");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const tableUsers = document.querySelector(".table-users");
const bottomMessage = document.querySelector(".bottom-message");
const errorMessage = document.querySelector(".error-message");


//Spinner
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


const hideSpinner = () => spinner.remove();


let users = [];
let filteredUsers = [];

async function getUsers() {//Получаем 15 рандомных юзеров с серва
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

function deleteMessage() {
	bottomMessage.classList.remove("show");
	bottomMessage.classList.add("hide");
}

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


searchBtn.addEventListener("click", clearInput);
searchInput.addEventListener("keyup", (event) => {
	const target = event.target.value;
	console.log(target);

	if (target) {
		filterUsers();
	}
});


function init() {
	showSpinner();
	setTimeout(createNewUser, 3000);
	setTimeout(hideSpinner, 3000);

}
init();
