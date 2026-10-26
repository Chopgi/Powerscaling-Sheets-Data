window.onload = function () {
  loadDatabase();
  document
    .querySelector("#searchBtn")
    .addEventListener("click", async function () {
      //      const query = document.querySelector("#searchbar").value;
      filterRoster();
    });
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRS4v9F9SJ-Y4wUOO3efaf3UXCItz8EX4wK4QV6lnHX37MQMrchewnvjC9IcwYnehddX5VjBAzUxi/pub?output=csv";

let characterData = [];

// Helper functions to safely map Google Form response headers
const getCharName = (item) =>
  item["Character Name and era, Example: Goku (Saiyan Saga)"] ||
  item.Character ||
  "";
const getTier = (item) => item["Tier / Tier range"] || item.Tier || "N/A";
const getAP = (item) => item["AP (Attack Potency)"] || item.AP || "N/A";
const getSpeed = (item) => item["Speed"] || "N/A";
const getDurability = (item) => item["Durability"] || "N/A";
const getStriking = (item) => item["Striking Strength"] || "N/A";
const getLifting = (item) => item["Lifting Strength"] || "N/A";
const getStamina = (item) => item["Stamina"] || "N/A";
const getRange = (item) => item["Range"] || "N/A";
const getIntel = (item) => item["Intelligence"] || "N/A";
const getAbilities = (item) =>
  item["Abilities"] || item["Hax / Abilities"] || "N/A";
const getEquip = (item) => item["Standard Equipment"] || "N/A";
const getFeats = (item) =>
  item["External links for primary feats"] || item["Feat / Proof Link"] || "";
const getNotes = (item) => item["Notes"] || "None";
const getTags = (item) =>
  item["Tags, separated by commas inside of quotation marks"] ||
  item.Tags ||
  "";
const getImage = (item) =>
  item["Image Link / Name"] || item["Image Link"] || "";

async function loadDatabase() {
  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    complete: (results) => {
      characterData = results.data.filter(
        (item) => getCharName(item).trim() !== "",
      );
      renderRoster(characterData);
    },
  });
}

function renderRoster(data) {
  const grid = document.getElementById("character-grid");
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center; grid-column: 1/-1;">No characters found.</p>';
    return;
  }

  data.forEach((item) => {
    const charName = getCharName(item);
    const imageSrc = "https://via.placeholder.com/300x350?text=No+Image";
    //   getImage(item) || "https://via.placeholder.com/300x350?text=No+Image"; commented out for debugging
    const rawTags = getTags(item);
    const tagsArray = rawTags
      .split(",")
      .map((t) => t.replace(/"/g, "").trim())
      .filter((t) => t.length > 0);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
          <img class="card-img" src="${imageSrc}" alt="${charName}">
          <div class="card-body" onclick="showProfile('${charName.replace(/'/g, "\\'")}')">
            <h2 class="card-title">${charName}</h2>
            <span class="badge">Tier ${getTier(item)}</span>
            <div class="tags-container">
              ${tagsArray.map((tag) => `<span class="tag" onclick="event.stopPropagation(); searchByTag('${tag}')">${tag}</span>`).join("")}
            </div>
          </div>
        `;
    grid.appendChild(card);
  });
}

function showProfile(characterName) {
  const character = characterData.find(
    (item) => getCharName(item) === characterName,
  );
  if (!character) return;

  document.getElementById("roster-view").classList.add("hidden");
  document.getElementById("profile-view").classList.remove("hidden");

  const charName = getCharName(character);
  const imageSrc =
    getImage(character) || "https://via.placeholder.com/300x350?text=No+Image";
  const proofLink = getFeats(character)
    ? `<a href="${getFeats(character)}" target="_blank" style="color: var(--accent);">View Feat / Calculation Proof</a>`
    : "N/A";
  const rawTags = getTags(character);
  const tagsArray = rawTags
    .split(",")
    .map((t) => t.replace(/"/g, "").trim())
    .filter((t) => t.length > 0);

  const profileContent = document.getElementById("profile-content");
  profileContent.innerHTML = `
        <div class="profile-header">
          <img class="profile-img" src="${imageSrc}" alt="${charName}">
          <div class="profile-info">
            <h1>${charName}</h1>
            <div style="margin-top: 15px;"><span class="badge" style="font-size: 1rem;">Tier ${getTier(character)}</span></div>
            <div class="tags-container" style="margin-top: 15px;">
              ${tagsArray.map((tag) => `<span class="tag" onclick="searchByTag('${tag}')">${tag}</span>`).join("")}
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h2>Combat Metrics & Powerscaling</h2>
          <div class="stats-grid">
            <div class="stat-box"><div class="stat-label">Attack Potency (AP)</div><div class="stat-value">${getAP(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Speed</div><div class="stat-value">${getSpeed(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Durability</div><div class="stat-value">${getDurability(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Striking Strength</div><div class="stat-value">${getStriking(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Lifting Strength</div><div class="stat-value">${getLifting(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Stamina</div><div class="stat-value">${getStamina(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Range</div><div class="stat-value">${getRange(character)}</div></div>
            <div class="stat-box"><div class="stat-label">Intelligence</div><div class="stat-value">${getIntel(character)}</div></div>
            <div class="stat-box full-width"><div class="stat-label">Abilities / Hax</div><div class="stat-value">${getAbilities(character)}</div></div>
            <div class="stat-box full-width"><div class="stat-label">Standard Equipment</div><div class="stat-value">${getEquip(character)}</div></div>
            <div class="stat-box full-width"><div class="stat-label">Feats & Primary Calculation Links</div><div class="stat-value">${proofLink}</div></div>
            <div class="stat-box full-width"><div class="stat-label">Notes / Additional Context</div><div class="stat-value">${getNotes(character)}</div></div>
          </div>
        </div>
      `;
  window.scrollTo(0, 0);
}

function showRoster() {
  document.getElementById("profile-view").classList.add("hidden");
  document.getElementById("roster-view").classList.remove("hidden");
}

function filterRoster() {
  const query = document.getElementById("searchbar").value.toLowerCase();
  const filtered = characterData.filter(
    (item) =>
      getCharName(item).toLowerCase().includes(query) ||
      getTier(item).toLowerCase().includes(query) ||
      getTags(item).toLowerCase().includes(query),
  );
  renderRoster(filtered);
}

function searchByTag(tag) {
  showRoster();
  const searchInput = document.getElementById("search");
  searchInput.value = tag;
  filterRoster();
}
