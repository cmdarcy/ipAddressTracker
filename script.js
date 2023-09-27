async function getData(url) {
	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();
			console.log("Success", data);
			return data;
		} else {
			console.log(`Server Error: `, response.statusText);
		}
	} catch (error) {
		console.log("Fetch Error: ", error);
	}
}

const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

const searchBar = document.querySelector("[data-search]");
const searchBtn = document.querySelector("button");
const ipAddressResult = document.querySelector("[data-ipAddress");
const locationResult = document.querySelector("[data-location");
const timezoneResult = document.querySelector("[data-timezone");
const ispResult = document.querySelector("[data-isp");

const map = L.map("map").setView([0, 0], 2);
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

	if (typeof resultData === "undefined") {
		searchBar.classList.add("invalid");
		alert("Please use a valid domain or ip address!");
		return;
	} else {
		searchBar.classList.remove("invalid");
	}

	const {
		location: { city, region, postalCode, timezone, lat, lng },
		ip,
		isp,
	} = resultData;
	ipAddressResult.innerText = ip;
	locationResult.innerText = city + ", " + region + " " + postalCode;
	timezoneResult.innerText = "UTC" + timezone;
	ispResult.innerText = isp;

	map.setView([lat, lng], 13);
	L.marker([lat, lng], {
		icon: myMarker,
		title: searchPrompt,
	}).addTo(map);
});
