let allCards = [];
let displayedCards = 0;
const CARDS_PER_LOAD = 20; // Numero di carte caricate per volta

// Elementi per la modal
const cardModal = document.getElementById("cardModal");
const modalCardContent = document.getElementById("modalCardContent");

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

function openModal(card) {
  const modal = document.getElementById("cardModal");
  const modalContent = document.getElementById("modalCardContent");

  modalContent.innerHTML = `
      <h2>${card.name}</h2>
      <img src="${card.card_images[0].image_url}" alt="${
    card.name
  }" class="modal-card-image">
      
      <div class="card-details-grid">
        <div class="detail-item"><i class="fas fa-dna"></i> Tipo: ${
          card.type
        }</div>
        ${
          card.atk
            ? `<div class="detail-item"><i class="fas fa-fist-raised"></i> ATK: ${card.atk}</div>`
            : ""
        }
        ${
          card.def
            ? `<div class="detail-item"><i class="fas fa-shield-alt"></i> DEF: ${card.def}</div>`
            : ""
        }
        ${
          card.race
            ? `<div class="detail-item"><i class="fas fa-paw"></i> Razza: ${card.race}</div>`
            : ""
        }
        ${
          card.attribute
            ? `<div class="detail-item"><i class="fas fa-gem"></i> Attributo: ${card.attribute}</div>`
            : ""
        }
      </div>
      <div class="card-desc">${
        card.desc ? card.desc : "Nessuna descrizione disponibile."
      }</div>
    `;

  modal.style.display = "flex"; // Mostra la modal centrata
}

// Funzione per chiudere la modal
function closeModal() {
  cardModal.style.display = "none";
}

// Funzione per visualizzare le carte
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

    // Evento click per aprire la modal con i dettagli della carta
    cardElement.addEventListener("click", () => openModal(card));
    cardContainer.appendChild(cardElement);
  });
}

// Funzione per filtrare le carte in base alla ricerca
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

// Inizializzazione dopo caricamento del DOM
document.addEventListener("DOMContentLoaded", function () {
  loadAllCards();
  document.getElementById("searchInput").addEventListener("input", filterCards);

  // Evento per chiudere la modal al clic sull'icona di chiusura
  document.querySelector(".close").addEventListener("click", closeModal);

  // Evento per chiudere la modal al clic fuori dal contenuto
  window.addEventListener("click", (event) => {
    if (event.target === cardModal) {
      closeModal();
    }
  });

  // Imposta la modal nascosta all'inizio
  cardModal.style.display = "none";
});
