let countryRow = document.getElementById("country-row");
let searchInput = document.getElementById("search-input");
let bordersBtn = document.createElement("button");

let allCountries = [];

function apiFetch(url) {
  const responsePromise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error("Sorry! We didn't find any country!");
      }
      return response.json();
    })

    .catch((err) => console.log(err));
  return responsePromise;
}

apiFetch("https://restcountries.eu/rest/v2/all").then((data) => {
  allCountries = data;
  createAllCountryCards(allCountries);
});

function createAllCountryCards(countries) {
  countryRow.innerHTML = "";
  countries.forEach((country) => {
    let mainDiv = document.createElement("div");
    mainDiv.className = "col-12 md-col-6 lg-col-4 xl-col-3 sm-col-12";
    countryRow.appendChild(mainDiv);
    let div = document.createElement("div");
    div.className = "country-card";
    mainDiv.appendChild(div);
    let countryLink = document.createElement("a");
    countryLink.id = country.name;
    countryLink.className = "country-link";
    countryLink.addEventListener("click", function () {
      clickBorderButtonAndCountry(this.id);
    });
    div.appendChild(countryLink);
    let divContent = document.createElement("div");
    divContent.id = "card-id";
    divContent.className = "content-card";
    countryLink.appendChild(divContent);
    let img = document.createElement("img");
    img.id = "flag";
    img.className = "img-card";
    img.src = country.flag;
    divContent.appendChild(img);
    let countryTitle = document.createElement("h3");
    countryTitle.innerText = country.name;
    divContent.appendChild(countryTitle);
    let population = document.createElement("p");
    population.innerText = `Population: ${country.population}`
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    divContent.appendChild(population);
    let region = document.createElement("p");
    region.innerText = `Region: ${country.region}`;
    divContent.appendChild(region);
    let capital = document.createElement("p");
    capital.innerText = `Capital: ${country.capital}`;
    divContent.appendChild(capital);
  });
}

function searchCountry() {
  const findCountry = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  createAllCountryCards(findCountry);
}

function createCountryPage(country) {
  countryRow.innerHTML = "";

  countryRow.innerHTML = ` 
  <div class="div-backBtn col-12 lg-col-4 md-col-6">
  <i class="fas fa-long-arrow-alt-left"></i>
   <button class="backBtn" onclick="createAllCountryCards(allCountries)">Back</button>
  </div>
  <div class="single-country row">
    <div col-12 lg-col-4 md-col-6>
      <div id="card-id" class="single-country-img">
        <img id="flag" class="img-card" src="${country[0].flag}">
      </div>
    </div>
    
     <div class="country-content col-12 lg-col-6 md-col-6">
        <div class="div-name lg-col-6 md-col-6">
          <h3>${country[0].name}</h3>
          <p>Native Name: <span>${country[0].nativeName}</span></p>
          <p>Population: <span>${country[0].population
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
          <p>Region: <span>${country[0].region}</span></p>
          <p>Sub Region: <span>${country[0].subregion}</span></p>
          <p>Capital: <span>${country[0].capital}</span></p>
        </div>
        <div class="div-top lg-col-6 md-col-6">
          <p class="top-domain">Top Level Domain: <span>${
            country[0].topLevelDomain
          }</span></p>
          <p>Currencies: <span>${country[0].currencies[0].code}</span></p>
          <p>Languages: <span>${country[0].languages.map(
            (lang) => lang.name
          )}</span></p>
        </div>
      <div class="div-borders lg-col-10 md-col-10">
        <p>Border Countries: </p>
        ${country[0].borders
          .slice(0, 3)
          .map((border) => {
            allCountries.filter((country) => {
              if (country.alpha3Code.includes(border)) {
                border = country.name;
              }
            });
            return `${`<button id= "${border}" class="borders-btn" onclick="clickBorderButtonAndCountry(this.id)">${border}</button>`}`;
          })
          .join("")}
        </div>
        </div>
   </div>`;
}
function clickBorderButtonAndCountry(clicked) {
  searchInput.value = "";
  document.getElementById("default").selected = true;

  let buttonBorder = document.getElementById(clicked).id;
  let countryUrl = `https://restcountries.eu/rest/v2/name/${buttonBorder}?fullText=true`;
  apiFetch(countryUrl).then((data) => {
    createCountryPage(data);
  });
}

function filterByOrigin() {
  let select = document.getElementById("filter-region");
  let regionUrl = select.options[select.selectedIndex].value;
  console.log(regionUrl);
  let newRegionUrl = `https://restcountries.eu/rest/v2/region/${regionUrl}`;
  apiFetch(newRegionUrl).then((data) => {
    createAllCountryCards(data);
  });
}
