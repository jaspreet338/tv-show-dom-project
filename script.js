//You can edit ALL of the code here
let allEpisodes = []; // fetchAllEpisodes();
function setup() {
  makePageForEpisodes(allEpisodes);

  const searchElem = document.getElementById("searchBox");
  searchElem.addEventListener("input", wordSearch);

  const selectEpisode = document.getElementById("selectEp");
  allEpisodes.forEach((episode) => {
    const optionElem = document.createElement("option");

    optionElem.textContent = `${formatSeasonAndEp(
      episode.season,
      episode.number
    )} - ${episode.name}`;
    selectEpisode.appendChild(optionElem);
  });
  selectEpisode.addEventListener("change", onEpisodeSelect);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeElem = document.createElement("div");
    episodeElem.setAttribute("class", "episode");

    rootElem.appendChild(episodeElem);

    const titleElem = document.createElement("h4");
    titleElem.setAttribute("class", "episodeTitle");
    titleElem.innerHTML = `${episode.name} - ${formatSeasonAndEp(
      episode.season,
      episode.number
    )}`;
    episodeElem.appendChild(titleElem);

    const imageElem = document.createElement("img");
    imageElem.setAttribute("class", "episodeImage");
    imageElem.src = episode.image.medium;
    episodeElem.appendChild(imageElem);

    const episodeSummary = document.createElement("div");
    episodeSummary.setAttribute("class", "episodeSummary");
    episodeSummary.innerHTML = episode.summary;
    episodeElem.appendChild(episodeSummary);
  });
}

function wordSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  let allEpisodesCopy = JSON.parse(JSON.stringify(allEpisodes));
  const matchedEpisodes = allEpisodesCopy.filter((episode) => {
    const nameResult = episode.name.toLowerCase().indexOf(searchTerm);
    episode.name = episode.name
      .toLowerCase()
      .replaceAll(searchTerm, `<span class="highlight">${searchTerm}</span>`);
    const summaryResult = episode.summary.toLowerCase().indexOf(searchTerm);
    episode.summary = episode.summary
      .toLowerCase()
      .replaceAll(searchTerm, `<span class="highlight">${searchTerm}</span>`);
    return nameResult > -1 || summaryResult > -1;
  });
  document.getElementById(
    "numberOfResults"
  ).innerText = `Displaying ${matchedEpisodes.length}/${allEpisodesCopy.length} episodes`;
  if (searchTerm.length === 0) {
    return makePageForEpisodes(allEpisodes);
  }
  makePageForEpisodes(matchedEpisodes);
}

function onEpisodeSelect(event) {
  const selectEpisode = event.target.value;
  if (selectEpisode.trim().toLowerCase() === "all episodes") {
    return makePageForEpisodes(allEpisodes);
  }

  for (const episode of allEpisodes) {
    if (episode.name === selectEpisode.split("-")[1].trim()) {
      makePageForEpisodes([episode]);
    }
  }
}

function formatSeasonAndEp(season, episode) {
  return `S${season < 10 ? `0${season}` : season}E${
    episode < 10 ? `0${episode}` : episode
  }`;
}

window.onload = () => {
  fetch("https://api.tvmaze.com/shows/82/episodes").then((response) => {
    response.json().then((data) => {
      allEpisodes = data;
      debugger;
      setup();
    });
  });
};