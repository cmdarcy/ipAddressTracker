async function getData(url) {
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	return data;
}
const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

const searchBtn = document.querySelector("button");
const ipAddressResult = document.querySelector("[data-ipAddress");
const locationResult = document.querySelector("[data-location");
const timezoneResult = document.querySelector("[data-timezone");
const ispResult = document.querySelector("[data-isp");

const map = L.map("map").setView([51.505, -0.09], 13);
const myMarker = L.icon({
	iconUrl: "./images/icon-location.svg",
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

searchBtn.addEventListener("click", async (ev) => {
	ev.preventDefault();
	const searchPrompt = document.querySelector("[data-search]").value;
	console.log(searchPrompt);
	let resultData;
	if (searchPrompt.search(ipRegex) === -1) {
		console.log("This was a domain");
		resultData = await getData(
			`https://geo.ipify.org/api/v2/country,city?apiKey=at_zTwfzUoygaKEGS2xfHWjvQlmfEaOJ&domain=${searchPrompt}`
		);
	} else {
		console.log("This was an ip Address");
		resultData = await getData(
			`https://geo.ipify.org/api/v2/country,city?apiKey=at_zTwfzUoygaKEGS2xfHWjvQlmfEaOJ&ipAddress=${searchPrompt}`
		);
	}
	ipAddressResult.innerText = resultData.ip;
	locationResult.innerText =
		resultData.location.city +
		", " +
		resultData.location.region +
		" " +
		resultData.location.postalCode;
	timezoneResult.innerText = "UTC" + resultData.location.timezone;
	ispResult.innerText = resultData.isp;

	map.setView([resultData.location.lat, resultData.location.lng], 13);
	L.marker([resultData.location.lat, resultData.location.lng], {
		icon: myMarker,
		title: searchPrompt,
	}).addTo(map);
});
