const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
const apiKey = "solaris-2ngXkR6S02ijFrTP";
let planets_list = []; // Variabel för att lagra API-data

// Funktion för att hämta information från API:et
async function fetchPlanetData() {
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "x-zocom": apiKey },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        planets_list = data.bodies.filter(body => body.type === "planet");
        console.log(data);
    } catch (error) {
        console.error("Error fetching planet data:", error);
    }
}

// Anropa funktionen
fetchPlanetData();

// Hämta elementen
const inputField = document.querySelector('.command-input');
const box = document.getElementById('retro-computer');

// Retro datorskärm - hämta element för att visa information
const planetTitle = document.getElementById("planet-title");
const planetDesc = document.getElementById("planet-desc");

// Lyssna på Enter-knappen
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const userInput = inputField.value.trim().toLowerCase(); // Hämta användarens inmatning

        // Jämför inmatningen med planetnamnen från API
        const matchedPlanet = planets_list.find(planet => planet.name.toLowerCase() === userInput);

        if (matchedPlanet) {
            console.log(`Match found: ${matchedPlanet.name}`);
            const planetElement = document.querySelector(`.${matchedPlanet.name.toLowerCase()}`);
            
            // Uppdatera retro-datorskärmen med planetinformation
            updateRetroScreen(matchedPlanet);

            if (planetElement) {
                flyToPlanet(planetElement); // Anropa flyToPlanet för matchande planet
            } else {
                console.error("Planet element not found in the DOM");
            }
        } else {
            console.log("No match found. Please enter a valid planet name.");
        }
    }
});

// Funktion för att flyga till planet
function flyToPlanet(planet) {
    console.log("Flying to planet...");
    // Gör planeten synlig och starta utanför skärmen
    planet.style.position = "fixed";
    planet.style.top = "50%"; // Vertikal position (kan justeras)
    planet.style.opacity = 1;
    box.style.display = "flex";

    // Flytta planeten mot mitten av skärmen
    setTimeout(() => {
        planet.style.right = "35%"; // Flytta planeten till mitten (horisontellt)
        planet.style.transform = "translateY(-50%) scale(6.5)"; // Centrera vertikalt och zooma in
    }, 100); // Starta animationen efter en liten fördröjning
}

// Funktion för att uppdatera retro-datorskärmen
function updateRetroScreen(planet) {
    // Visa "Laddar planet information ......." omedelbart
    planetTitle.textContent = "Laddar planet information .......";
    planetDesc.textContent = "";

    // Efter en kort fördröjning, uppdatera med planetens riktiga data
    setTimeout(() => {
        planetTitle.textContent = planet.name + " / " + planet.latinName; // Uppdatera titeln
        planetDesc.textContent = planet.desc; // Uppdatera beskrivningen
    }, 2000); // 2 sekunders fördröjning
}
