const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
const apiKey = "solaris-2ngXkR6S02ijFrTP";
let planets_list = []; // Variabel för att lagra API-data
// Hämta elementen
const inputField = document.querySelector('.command-input');
const box = document.getElementById('retro-computer');

// Retro datorskärm - hämta element för att visa information
const planetTitle = document.getElementById("planet-title");
const planetDesc = document.getElementById("planet-desc");
let currentPlanetElement = null; // Håll reda på den planet som visas just nu

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
            planetTitle.textContent = "Error..";
            planetDesc.textContent = "Finns ingen planet med detta namn!";
            box.style.display= "flex";
        }
    }
});



async function flyToPlanet(newPlanet) {
    if (currentPlanetElement) {
        // Om det redan finns en planet, flytta ut den
        await flyOutPlanet(currentPlanetElement);
        currentPlanetElement = null;
    }
    resetPlanetStyle(newPlanet);
    // Sätt den nya planeten som synlig och starta animationen
    currentPlanetElement = newPlanet;
    newPlanet.style.position = "fixed";
    newPlanet.style.right = "-100px"; // Starta utanför skärmen till höger
    newPlanet.style.top = "50%";
    newPlanet.style.opacity = 1;
    box.style.display = "flex";

    setTimeout(() => {
        newPlanet.style.transition = "transform 2s ease-in-out, right 2s ease-in-out";
        newPlanet.style.right = "35%"; // Flytta planeten till mitten
        newPlanet.style.transform = "translateY(-50%) scale(6.5)"; // Zooma in planeten
    }, 100); // Starta animationen efter en liten fördröjning
}

function resetPlanetStyle(planet) {
    
    planet.style.left = ""; // Återställ position från flyOutPlanet
    planet.style.opacity = 0; // Dölj planeten innan den visas igen
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


function flyOutPlanet(planet) {
    return new Promise((resolve) => {
        planet.style.transition = "transform 2s ease-in-out, left 2s ease-in-out"; // Animera planeten bort
        planet.style.left = "-100%"; // Flytta planeten utanför skärmen till vänster
        planet.style.transform = "translateY(-50%) scale(0.5)"; // Minska planetens storlek under flytten
        setTimeout(() => {
            planet.style.opacity = 0; // Dölj planeten efter animationen
            resolve(); // Fortsätt till nästa steg efter animationen
        }, 2000); // Matcha timeouten med transition-tiden
    });
}


