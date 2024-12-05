    let celestialBodies = []; // Variabel för att lagra API-data
    let currentPlanetElement = null; // Håller koll på vilken planet det är för skärmen
    let showDetailedInfo = false;  // Används för att veta vilken information som är på skärmen
    let apiKey; 

    // Hämtade HTML element
    const inputField = document.querySelector('.command-input');
    const box = document.getElementById('retro-computer');
    const planetTitle = document.getElementById("planet-title");
    const planetDesc = document.getElementById("planet-desc");
    const fire = document.getElementById("fire");
    const rocket = document.getElementById("rocket");
    const intro = document.getElementById("intro");
    const toggleInfoBtn = document.getElementById('toggle-info-btn');
    const title = document.getElementById('solartitle');

    //----------------------------------------------HÄMTA KEY----------------------------------------------------------------------------
    const apiKeyUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys"; 
    const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies"; 


    // Hämtar nyckel och tilldelar den en variabel
    async function fetchApiKey() {
        try {
            const response = await fetch(apiKeyUrl, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            apiKey = data.key; 
            console.log("API Key retrieved:", apiKey);

            // Efter att API-nyckeln har hämtats, kalla på nästa funktion
            fetchCelestialData();
        } catch (error) {
            console.error("Error fetching API Key:", error);
        }
    }
    // Med hämtade nyckel så använder vi den för att hämta planeterna
    async function fetchCelestialData() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: { "x-zocom": apiKey }, 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Här hämtar vi ut type planet och star för att få med solen
            const data = await response.json();
            celestialBodies = data.bodies.filter(body => body.type === "planet" || body.type === "star");
        } catch (error) {
            console.error("Error fetching celestial data:", error);
        }
    }
    fetchApiKey();
    //---------------------------------------------------------------------------------------------------------------------
    // Anändning av eventlistener för att reagera på sökning
    inputField.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const userInput = inputField.value.trim().toLowerCase(); // Hämta användarens inmatning
            inputField.value = ""; // rensar textfältet efter varje sökning

            // Jämför inmatningen med namn på himlakroppar från API
            // Användning av toLowerCase är för att förhindra problem med sökning om använder skulle använda sig av versaler
            const matchedBody = celestialBodies.find(body => body.name.toLowerCase() === userInput);
            rocket.style.display = "block"
            fire.style.opacity = "1"
            intro.style.display = "none"

            if (matchedBody) {
                const bodyElement = document.querySelector(`.${matchedBody.name.toLowerCase()}`);

                // Anropa funktionen för att matcha informationen med planeten 
                updateRetroScreen(matchedBody);

                if (bodyElement) {
                    await flyToPlanet(bodyElement); 
                } else {
                    console.error("Celestial body element not found in the DOM");
                }
                //Denna else kontrollerar fel och visar det för användaren
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
            flyOutPlanet(currentPlanetElement); // Flytta ut befintlig planet
            currentPlanetElement = null;
        }
        resetPlanetStyle(newBody);
        currentPlanetElement = newBody; 
        // Style ändringar för att göra planeter och skärmen synlig
        newBody.style.position = "fixed";
        newBody.style.right = "-100px";
        newBody.style.top = "55%";
        newBody.style.opacity = 1;
        box.style.display = "flex";
        // animationen och tiden det ska ta för att planeten ska flyga in i skärmen
        setTimeout(() => {
            newBody.style.transition = "transform 2s ease-in-out, right 2s ease-in-out";
            newBody.style.right = "25%";
            newBody.style.transform = "translateY(-50%) scale(6.5)";
        }, 100);
    }

    // Funktion för att återställa stil på planet så att inga planeter är på varandra
    function resetPlanetStyle(body) {
        body.style.left = "";
        body.style.opacity = 0;
    }
    // tar bort förra planeten
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
        // användning av timeout för att skärmen ska "ladda in"
        setTimeout(() => {
            planetTitle.textContent = `${body.name} / ${body.latinName || "N/A"}`;
            planetDesc.textContent = body.desc;
            fire.style.opacity = "0"
        }, 2000);
    }
    // eventlistener för knappen på skärmen som visar mer information om planeten
    toggleInfoBtn.addEventListener('click', () => {
        if (!currentPlanet) {
            console.error("Ingen planet vald!");
            return;
        }

        if (showDetailedInfo) {
            planetDesc.textContent = currentPlanet.desc;
        // istället för att skapa flera html element så skriver vi in all extra information på ett existerande element
        // och använder oss av template literals
        } else {
            planetDesc.innerHTML = `
                <strong>Omkrets:</strong> ${currentPlanet.circumference} km<br>
                <strong>Avstånd från solen:</strong> ${currentPlanet.distance || 0} km<br>
                <strong>Tempraturen:</strong> ${"Dag: " + currentPlanet.temp.day + " C" + "<br>" + "Natt: " + currentPlanet.temp.night} C<br>
                <strong>Antal månar:</strong> ${currentPlanet.moons.length + "<br>" + currentPlanet.moons}`;   
        }
        showDetailedInfo = !showDetailedInfo; // byter mellan information
    });

    // Denna funktion används för att starta om sidan när man klickar på titeln
    // Eftersom allt innehåll är på samma sida så använder jag mig ov location.reload för att reseta allt
    title.addEventListener('click', () => {
        location.reload()
    });