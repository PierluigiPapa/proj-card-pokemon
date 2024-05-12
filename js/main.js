// Selezionare gli elementi HTML necessari
const search = document.querySelector('.search');
const number = document.querySelector('.number');
const pokemonImage = document.querySelector('.pokemon-image');
const pokemonNameElement = document.querySelector('.pokemon-name');
const types = document.querySelector('.types');
const statsContainer = document.querySelector('.stats');
const statsNumber = document.querySelectorAll('.stats-number');
const statsPokemon = document.querySelector('h4');
const barInner = document.querySelectorAll('.bar-inner');
const barOuter = document.querySelectorAll('.bar-outer');
const statsDesc = document.querySelectorAll('.stats-desc');
const pokemonNumber = document.querySelector('.number');
const pokedex = document.querySelector('.pokedex');
const shinyCheckbox = document.getElementById('shinyCheckbox');

// Array colori per tipologia Pokémon
const typeColors = {
    "rock": [130, 123, 74],
    "ghost": [69,  22, 69],
    "steel": [48, 112, 135],
    "water": [33, 118, 226],
    "grass": [60, 156, 38],
    "psychic": [176, 16, 67], 
    "ice": [10, 162, 201],
    "dark": [27, 20,  19],
    "fairy": [199, 60, 199],
    "normal": [170, 166, 127],
    "fighting": [183,  92, 0],
    "flying": [63, 130, 194],
    "poison": [86, 17, 135],
    "ground": [86, 40, 5],
    "bug": [102, 115, 5],
    "fire": [222, 37, 38],
    "electric": [238, 183, 0],
    "dragon": [29, 45, 172], 
}

// Array traduzione tipologia Pokémon dall'inglese (API) -> italiano
const italianTypeNames = {
    "rock": "Roccia",
    "ghost": "Spettro",
    "steel": "Acciaio",
    "water": "Acqua",
    "grass": "Erba",
    "psychic": "Psico",
    "ice": "Ghiaccio",
    "dark": "Buio",
    "fairy": "Folletto",
    "normal": "Normale",
    "fighting": "Lotta",
    "flying": "Volante",
    "poison": "Veleno",
    "ground": "Terra",
    "bug": "Coleottero",
    "fire": "Fuoco",
    "electric": "Elettrico",
    "dragon": "Drago"
};

// Dichiarazione della funzione fetchApi
const fetchApi = async (pkmnName) => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnName);

    if (response.status === 200) {
        const pkmnData = await response.json();
        return pkmnData;
    }

    return false;
}

// Nascondo il Pokedex nella home del sito
pokemonImage.style.display = 'none';
statsContainer.style.display = 'none';
statsPokemon.style.display = 'none';

/// Event listener per il cambio dell'input di ricerca
search.addEventListener('change', async (event) => {
    // Nascondi il Pokédex
    pokedex.style.display = 'none';

    // Mostra lo spinner durante il caricamento dei dati
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

    const pkmnData = await fetchApi(event.target.value);

    // Nascondi lo spinner una volta che i dati sono stati caricati o in caso di errore
    spinner.style.display = 'none';
    

    if (!pkmnData) {
        alert('Pokémon does not exist.');
        return;
    }

    const MainColor = typeColors[pkmnData.types[0].type.name];
    statsPokemon.style.color = `rgb(${MainColor[0]}, ${MainColor[1]}, ${MainColor[2]})`;
    pokedex.style.backgroundColor = `rgb(${MainColor[0]}, ${MainColor[1]}, ${MainColor[2]})`;

    shinyCheckbox.style.display = 'none';
    document.getElementById('shinyLabel').style.display = 'none';

    const pokemonName = pkmnData.name.charAt(0).toUpperCase() + pkmnData.name.slice(1);
    pokemonNameElement.innerHTML = pokemonName;

    number.innerHTML = '#' + pkmnData.id.toString().padStart(3, '0');

    const getPokemonImageUrl = (pkmnData) => {
        if (shinyCheckbox.checked) {
            return pkmnData.sprites.other.home.front_shiny;
        } else {
            return pkmnData.sprites.other.home.front_default;
        }
    };

    pokemonImage.src = getPokemonImageUrl(pkmnData);
    pokemonImage.style.display = 'block'; 
    statsContainer.style.display = 'block';
    statsPokemon.style.display = 'block';

    types.innerHTML = '';
    
    pkmnData.types.forEach((t) => {
        let newType = document.createElement('span');
        newType.innerHTML = italianTypeNames[t.type.name];
        newType.classList.add('type');
        newType.style.backgroundColor = `rgb(${typeColors[t.type.name][0]}, ${typeColors[t.type.name][1]}, ${typeColors[t.type.name][2]})`;

        types.appendChild(newType);
    });

    pkmnData.stats.forEach((s, i) => {
        statsNumber[i].innerHTML = s.base_stat.toString().padStart(3, '0');
        barInner[i].style.width = `${s.base_stat}%`;
        barInner[i].style.backgroundColor = `rgb(${MainColor[0]},${MainColor[1]},${MainColor[2]})`;
        barOuter[i].style.backgroundColor = `rgb(${MainColor[0]},${MainColor[1]},${MainColor[2]}, 0.3)`;
        statsDesc[i].style.color = `rgb(${MainColor[0]},${MainColor[1]},${MainColor[2]})`;
        pokemonNumber.style.color = `rgb(${MainColor[0]},${MainColor[1]},${MainColor[2]})`;
        pokemonNameElement.style.color = `rgb(${MainColor[0]},${MainColor[1]},${MainColor[2]})`;
    });

    // Imposta il tempo di caricamento del Pokédex
    setTimeout(() => {
        pokedex.style.display = 'block';
        spinner.style.display = 'none';
    }, 2000); 

    // Mostra lo spinner nel momento del caricamento del Pokédex
    spinner.style.display = 'block';

    event.target.value='';
});
