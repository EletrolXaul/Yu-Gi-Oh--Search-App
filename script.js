let allCards = [];
let displayedCards = 0;
const CARDS_PER_LOAD = 20; // Numero di carte caricate per volta

// Funzione per caricare tutte le carte
async function loadAllCards() {
  const cardContainer = document.getElementById("cardContainer");
  try {
    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php`
    );
    if (!response.ok) throw new Error("Errore nella richiesta");

    const data = await response.json();
    allCards = data.data;
    loadMoreCards(); // Carica le prime carte inizialmente
  } catch (error) {
    console.error("Errore:", error);
    cardContainer.innerHTML = `<p>Non è stato possibile caricare le carte. Riprova più tardi.</p>`;
  }
}

// Funzione per caricare un numero specifico di carte
function loadMoreCards() {
  const newCards = allCards.slice(
    displayedCards,
    displayedCards + CARDS_PER_LOAD
  );
  displayCards(newCards);
  displayedCards += CARDS_PER_LOAD;
}

// Funzione per mostrare le carte
function displayCards(cards) {
  const cardContainer = document.getElementById("cardContainer");

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
            <h2>${card.name}</h2>
            <img src="${card.card_images[0].image_url}" alt="${card.name}">
            <p>Tipo: ${card.type}</p>
            ${card.atk ? `<p>ATK: ${card.atk}</p>` : ""}
            ${card.def ? `<p>DEF: ${card.def}</p>` : ""}
            ${card.race ? `<p>Razza: ${card.race}</p>` : ""}
            ${card.attribute ? `<p>Attributo: ${card.attribute}</p>` : ""}
        `;
    cardContainer.appendChild(cardElement);
  });
}

// Funzione per filtrare le carte
function filterCards() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filteredCards = allCards.filter((card) =>
    card.name.toLowerCase().includes(searchInput)
  );
  displayedCards = 0;
  document.getElementById("cardContainer").innerHTML = ""; // Pulisce la griglia
  displayCards(filteredCards.slice(0, CARDS_PER_LOAD)); // Mostra solo un subset
}

// Event listener per caricare più carte quando si scorre in basso
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    displayedCards < allCards.length
  ) {
    loadMoreCards();
  }
});
