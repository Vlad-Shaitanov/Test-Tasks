"use strict";

const urlDataBase = "https://randomuser.me/api/?results=15";
const spinner = document.querySelector(".spinner-wrap");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const tableUsers = document.querySelector(".table-users");


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
		showSpinner();
		throw new Error(
			`Произошла ошибка получения данных по адресу ${urlDataBase}`);
	}
}



function createNewUser() {
	getUsers()
		.then(data => {
			users.push(...data.results);
			// users.forEach(
			// 	({ name: { first, last },
			// 		picture: { thumbnail },
			// 		location: { state, city }, email, phone,
			// 		registered: { date } }) => {
			// 		let regDate = new Date(Date.parse(date)).toLocaleDateString();
			// 		return tableUsers.insertAdjacentHTML("beforeend", `
			// 		<tr>
			// 			<td>${first} ${last}</td>
			// 			<td class="tooltip-src"><img src="${thumbnail}"></td>
			// 			<td>${state} ${city}</td>
			// 			<td>${email}</td>
			// 			<td>${phone}</td>
			// 			<td>${regDate}</td>
			// 		</tr>
			// 	`);
			// 	});
			showUsers();
		})
		.catch((error) => {
			showSpinner();
			throw new Error(`Произошла ошибка: ${error.name}`);
		});
	console.log(users);
}

function clearInput() {
	if (searchInput.value) {
		searchInput.value = "";
		tableUsers.removeChild(tableUsers.querySelector("tr"));//Срабатывает только при одном совпадении
		//На всякий случай для нескольких совпадений
		// users.forEach(() => {
		// 	tableUsers.removeChild(tableUsers.querySelector("tr"));
		// });
		showUsers();
	}
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

let hideUsers = () => {
	users.forEach((item) => {
		// console.log(item);
		tableUsers.removeChild(tableUsers.querySelector("tr"));
	});

	// hideUsers = function () { };
};

function filterUsers() {
	let userName = searchInput.value.trim();
	let regPhrase = new RegExp(userName, "gi");
	hideUsers();
	// const resultSearch = users.filter((item) => {
	// 	const name = item.first;
	// 	console.log(name);
	// });

	// resultSearch.forEach(
	// 	({ name: { first, last },
	// 		picture: { thumbnail },
	// 		location: { state, city }, email, phone,
	// 		registered: { date } }) => {
	// 		let regDate = new Date(Date.parse(date)).toLocaleDateString();

	// 		console.log("if is done");
	// 		return tableUsers.insertAdjacentHTML("beforeend", `
	// 				<tr>
	// 					<td>${first} ${last}</td>
	// 					<td><img src="${thumbnail}"></td>
	// 					<td>${state} ${city}</td>
	// 					<td>${email}</td>
	// 					<td>${phone}</td>
	// 					<td>${regDate}</td>
	// 				</tr>
	// 			`);

	// 	});

	// for (let i = 0; i < userName.length; i++) {
	users.forEach(
		({ name: { first, last },
			picture: { thumbnail, large },
			location: { state, city }, email, phone,
			registered: { date } }) => {
			const regDate = new Date(Date.parse(date)).toLocaleDateString();
			// const match = regPhrase.test(first);
			let matching = first.match(regPhrase);
			console.log(matching);

			// tableUsers.removeChild(tableUsers.querySelector("tr"));
			if (matching !== null) {
				if (matching === first) {
					filterUsers();
				}
				console.log("if is done");
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
			}
		});
	// }

	console.log(`Имя пользователя: ${userName}`);
}


// window.addEventListener("DOMContentLoaded", createTooltip);
searchBtn.addEventListener("click", clearInput);
searchInput.addEventListener("input", (event) => {
	let target = event.target.value;
	console.log(target);
	// let word = new RegExp(target, "gi");
	if (target) {
		filterUsers();
	}

	// if (event.charCode === 13) {
	// 	const value = event.target.value.trim();
	// 	if (!value) {
	// 		event.target.style.backgroundColor = "#ff0000";
	// 		event.target.value = "";
	// 		setTimeout(function () {
	// 			event.target.style.backgroundColor = "";
	// 		}, 1500);
	// 		return;
	// 	}
	// }

});


function init() {
	showSpinner();
	setTimeout(createNewUser, 3000);
	setTimeout(hideSpinner, 3000);

	if (searchInput.value) {
		tableUsers.remove();
		console.log(searchInput.value);
	}
}
init();


// function filterUsers() {
// 	let userName = searchInput.value.trim();
// 	let regPhrase = new RegExp(userName, "gi");
// 	hideUsers();


// 	users.forEach(
// 		({ name: { first, last },
// 			picture: { thumbnail, large },
// 			location: { state, city }, email, phone,
// 			registered: { date } }) => {
// 			const regDate = new Date(Date.parse(date)).toLocaleDateString();
// 			// const match = regPhrase.test(first);
// 			const matching = first.match(regPhrase) || [];
// 			console.log(matching);
// 			// if () {
// 			// 	console.log("if is done");
// 			// 	return tableUsers.insertAdjacentHTML("beforeend", `
// 			// 		<tr>
// 			// 			<td>${first} ${last}</td>
// 			// 			<td class="tooltip-src"><span><img src="${large}"></span><img src="${thumbnail}"></td>
// 			// 			<td>${state} ${city}</td>
// 			// 			<td>${email}</td>
// 			// 			<td>${phone}</td>
// 			// 			<td>${regDate}</td>
// 			// 		</tr>
// 			// 	`);
// 			// }
// 			// else if (!match) {
// 			// 	showUsers();
// 			// }
// 		});


// 	console.log(`Имя пользователя: ${userName}`);
// }