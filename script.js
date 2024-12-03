// const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
// const apiKey = "solaris-2ngXkR6S02ijFrTP";

let celestialBodies = []; // Variabel för att lagra API-data
let currentPlanetElement = null; // Håll reda på den himlakropp som visas just nu

// Hämta elementen
const inputField = document.querySelector('.command-input');
const box = document.getElementById('retro-computer');

// Retro datorskärm - hämta element för att visa information
const planetTitle = document.getElementById("planet-title");
const planetDesc = document.getElementById("planet-desc");
const fire = document.getElementById("fire");
const rocket = document.getElementById("rocket");


let resp = fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
    method: 'POST',
    
})
console.log(resp)

// //Funktion för att hämta information från API:et
// async function fetchCelestialData() {
//     try {
//         const response = await fetch(apiUrl, {
//             method: "GET",
//             headers: { "x-zocom": apiKey },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         celestialBodies = data.bodies.filter(body => body.type === "planet" || body.type === "star"); // Filtrera planeter och solen
//         console.log(celestialBodies); // Debug: visa alla data
//     } catch (error) {
//         console.error("Error fetching celestial data:", error);
//     }
// }

// // Anropa funktionen
// fetchCelestialData();



// const apiKeyUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys"; // Endpoint för att hämta nyckel
// const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";    // Endpoint för att hämta data
// let apiKey = null;                                   // Variabel för att lagra nyckeln

// // Funktion för att hämta API-nyckeln
// async function fetchApiKey() {
//     try {
//         const response = await fetch(apiKeyUrl, {
//             method: 'POST',
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         console.log(response)

//         const data = await response.json();
//         console.log(data)
//         apiKey = data.apiKey; // Hämta nyckeln från API:et
//         console.log("API Key retrieved:", apiKey);
//     } catch (error) {
//         console.error("Error fetching API Key:", error);
//     }
// }

// // Funktion för att hämta information från API:et
// async function fetchPlanetData() {
//     if (!apiKey) {
//         console.error("API key is not set. Fetch the key first.");
//         return;
//     }

//     try {
//         const response = await fetch(apiUrl, {
//             method: "GET", // GET för att hämta planetdata
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-zocom": apiKey, // Använd nyckeln som header
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         const planets = data.bodies.filter(body => body.type === "planet");
//         console.log("Planets data:", planets);
//     } catch (error) {
//         console.error("Error fetching planet data:", error);
//     }
// }


// async function initialize() {
//     await fetchApiKey(); 
//     await fetchPlanetData(); 
// }

// initialize(); 





inputField.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const userInput = inputField.value.trim().toLowerCase(); // Hämta användarens inmatning

        // Jämför inmatningen med namn på himlakroppar från API
        const matchedBody = celestialBodies.find(body => body.name.toLowerCase() === userInput);
        rocket.style.display = "block"
         fire.style.opacity = "1"
        if (matchedBody) {
            console.log(`Match found: ${matchedBody.name}`);
            const bodyElement = document.querySelector(`.${matchedBody.name.toLowerCase()}`);

            
            updateRetroScreen(matchedBody);

            if (bodyElement) {
                await flyToPlanet(bodyElement); 
            } else {
                console.error("Celestial body element not found in the DOM");
            }
        } else {
            console.log("No match found. Please enter a valid celestial body name.");
            planetTitle.textContent = "Error..";
            planetDesc.textContent = "Finns ingen himlakropp med detta namn!";
            box.style.display = "flex";
        }
    }
});

// Funktion för att flyga till planeten eller solen
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

function flyOutPlanet(planet) {
    
        planet.style.transition = "transform 2s ease-in-out, left 2s ease-in-out";
        planet.style.left = "-100%";
        planet.style.transform = "translateY(-50%) scale(0.5)";
       
    };


// Funktion för att uppdatera retro-skärmen
function updateRetroScreen(body) {
    currentPlanet = body; // Uppdatera nuvarande planet
    planetTitle.textContent = "Laddar planet information .......";
    planetDesc.textContent = "";

    setTimeout(() => {
        planetTitle.textContent = `${body.name} / ${body.latinName || "N/A"}`;
        planetDesc.textContent = body.desc;
        fire.style.opacity = "0"
    }, 2000);
}
const toggleInfoBtn = document.getElementById('toggle-info-btn');
let showDetailedInfo = false; 
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
