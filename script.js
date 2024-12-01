const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
const apiKey = "solaris-2ngXkR6S02ijFrTP";
let planets_list = []; // Variabel för att lagra API-data

// Funktion för att hämta information från API:et
async function fetchPlanetData() {
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {"x-zocom": apiKey,},
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); 
        planets_list = data.bodies.filter(body => body.type === "planet");
        console.log(planets_list)
    } catch (error) {
        console.error("Error fetching planet data:", error);
    }
}

// Anropa funktionen
fetchPlanetData();


// Hämta elementen
const inputField = document.querySelector('.command-input');
const spaceship = document.querySelector('.spaceship');
const planets = document.querySelectorAll('.planet');
const box = document.getElementById('box');

// Lyssna på Enter-knappen
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // const planetName = inputField.value.toLowerCase().trim(); // Hämta och formattera input

        // // Hitta planeten
        // const targetPlanet = Array.from(planets).find(planet => planet.dataset.name === planetName);

        // if (targetPlanet) {
           
        //     flyToPlanet(targetPlanet);
        // } else {
           
        //     alert('Planet not found. Please try again!');
        // }
        const userInput = inputField.value.trim().toLowerCase(); // Hämta användarens inmatning

        // Jämför inmatningen med planetnamnen från API
        const matchedPlanet = planets_list.find(planet => planet.name.toLowerCase() === userInput);

        if (matchedPlanet) {
            console.log(`Match found: ${matchedPlanet.name}`);
            const planetElement = document.querySelector(`.${matchedPlanet.name.toLowerCase()}`);
            if (planetElement) {
                flyToPlanet(planetElement); // Anropa flyToPlanet för matchande planet
            } else {
                console.error("Planet element not found in the DOM");
            }
        } else {
            console.log("No match found. Please enter a valid");}
    }
});

// Funktion för att flyga till planet
function flyToPlanet(planet) {
    console.log("hej");
    // Gör planeten synlig och starta utanför skärmen
    planet.style.position = "fixed";
    planet.style.top = "50%"; // Vertikal position (kan justeras)
    planet.style.opacity = 1;

    // Flytta planeten mot mitten av skärmen
    setTimeout(() => {
        planet.style.right = "35%"; // Flytta planeten till mitten (horisontellt)
        planet.style.transform = "translateY(-50%) scale(1.5)"; // Centrera vertikalt och zooma in
    }, 100); // Starta animationen efter en liten fördröjning

}


