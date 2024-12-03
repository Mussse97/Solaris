
const apiKeyUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys";
const apiKey = "solaris-2ngXkR6S02ijFrTP";
let planets_list = []; // Array för API-data
let currentPlanet = null; // Håll reda på den nuvarande planetens data
let currentPlanetElement = null; // Håll reda på det DOM-element som representerar den nuvarande planeten

// Hämtar element från HTML
const inputField = document.querySelector('.command-input');
const box = document.getElementById('retro-computer');
const planetTitle = document.getElementById("planet-title");
const planetDesc = document.getElementById("planet-desc");
const toggleInfoBtn = document.getElementById('toggle-info-btn');
const fire = document.querySelector('.fire'); // Element för raketeld

let showDetailedInfo = false; // Hanterar visningstillstånd för information



// Funktion för att hämta data från API
// async function fetchPlanetData() {
//     try {
//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: { "x-zocom": apiKey }
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         planets_list = data.bodies.filter(body => body.type === "planet" || body.type === "star");
//         console.log(planets_list);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }
async function fetchApiKey() {
    try {
        const response = await fetch(apiKeyUrl, {
            method: "POST", // POST för att hämta nyckeln
            headers: {
                "Content-Type": "application/json", // Specificera JSON-format
            },
            body: JSON.stringify({
                clientId: "your-client-id", // Eventuella credentials
                clientSecret: "your-client-secret",
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        apiKey = data.apiKey; // Hämta nyckeln från API:et
        console.log("API Key retrieved:", apiKey);
    } catch (error) {
        console.error("Error fetching API Key:", error);
    }
}

// Anropar datainsamling vid start
fetchPlanetData();
fetchApiKey();

// Funktion för att flyga till planet
async function flyToPlanet(newBody) {
    if (currentPlanetElement) {
        await flyOutPlanet(currentPlanetElement); // Flytta ut befintlig planet
        currentPlanetElement = null;
    }
    resetPlanetStyle(newBody);
    currentPlanetElement = newBody; // Uppdatera nuvarande planet-element
    

    newBody.style.position = "fixed";
    newBody.style.right = "-100px";
    newBody.style.top = "55%";
    newBody.style.opacity = 1;
    box.style.display = "flex";

    setTimeout(() => {
        newBody.style.transition = "transform 2s ease-in-out, right 2s ease-in-out";
        newBody.style.right = "25%";
        newBody.style.transform = "translateY(-50%) scale(6.5)";
    }, 100);
}

// Funktion för att återställa stil på planet
function resetPlanetStyle(body) {
    body.style.left = "";
    body.style.opacity = 0;
}

// Funktion för att flytta ut en planet
function flyOutPlanet(planet) {
    return new Promise((resolve) => {
        planet.style.transition = "transform 2s ease-in-out, left 2s ease-in-out";
        planet.style.left = "-100%";
        planet.style.transform = "translateY(-50%) scale(0.5)";
        setTimeout(() => {
            planet.style.opacity = 0;
            resolve();
        }, 2000);
    });
}

// Funktion för att uppdatera retro-skärmen
function updateRetroScreen(body) {
    currentPlanet = body; // Uppdatera nuvarande planet
    planetTitle.textContent = "Laddar planet information .......";
    planetDesc.textContent = "";

    setTimeout(() => {
        planetTitle.textContent = `${body.name} / ${body.latinName || "N/A"}`;
        planetDesc.textContent = body.desc;
    }, 2000);
}

// Event för knappen som växlar information
toggleInfoBtn.addEventListener('click', () => {
    if (!currentPlanet) {
        console.error("Ingen planet vald!");
        return;
    }

    if (showDetailedInfo) {
        planetDesc.textContent = currentPlanet.desc;
        toggleInfoBtn.textContent = "Visa mer info";
    } else {
        planetDesc.innerHTML = `
            <strong>Omkrets:</strong> ${currentPlanet.circumference || "N/A"} km<br>
            <strong>Avstånd från solen:</strong> ${currentPlanet.distance || "N/A"} km<br>
            <strong>Antal månar:</strong> ${currentPlanet.moons || 0}
        `;
        toggleInfoBtn.textContent = "Visa beskrivning";
    }
    showDetailedInfo = !showDetailedInfo;
});

// Event för att lyssna på Enter-tangenten
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const userInput = inputField.value.trim().toLowerCase();
        const matchedBody = planets_list.find(body => body.name.toLowerCase() === userInput);

        if (matchedBody) {
            const bodyElement = document.querySelector(`.${matchedBody.name.toLowerCase()}`);
            updateRetroScreen(matchedBody);
            if (bodyElement) {
                flyToPlanet(bodyElement);
            } else {
                console.error("Kroppens element kunde inte hittas i DOM.");
            }
        } else {
            planetTitle.textContent = "Fel...";
            planetDesc.textContent = "Ingen himlakropp matchar det här namnet!";
            box.style.display = "flex";
        }
    }
});
