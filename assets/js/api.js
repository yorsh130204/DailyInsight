// api.js

// API Key variable
const apiKey = "juxxBkj232FVOwS3Pyjqpsp7HqqixJGT";

// Endpoint URLs for The New York Times APIs
const newsApiUrl = `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${apiKey}`;
const booksApiUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;

// Function to fetch news data from the API and update the UI
async function fetchNewsData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayNews(data.results);
  } catch (error) {
    console.error("Error fetching news data: ", error);
  }
}

// Function to fetch books data from the API and update the UI
async function fetchBooksData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayBooks(data.results.books);
  } catch (error) {
    console.error("Error fetching books data: ", error);
    displayBooksError(); // Muestra un mensaje de error en la UI
  }
}

// Function to display news data in the UI
function displayNews(newsData) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = ""; // Clear previous content

  newsData.forEach(newsItem => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("card");
    newsCard.classList.add("d-flex"); // Use flexbox to align items horizontally
    newsCard.innerHTML = `
      <div class="card-body">
        <img src="${newsItem.multimedia[0].url}" class="card-img-top card-img-bottom img-fluid" alt="${newsItem.title}" style="max-width: 200px; max-height: 200px; object-fit: cover; float: left; margin-right: 10px;">
        <h5 class="card-title">${newsItem.title}</h5>
        <p class="card-text">${newsItem.abstract}</p>
        <p class="card-text"><strong>Section:</strong> ${newsItem.section}</p>
        <p class="card-text"><strong>Published Date:</strong> ${newsItem.published_date}</p>
        <a href="${newsItem.url}" target="_blank" class="btn btn-primary">Read More</a>
      </div>
    `;
    newsContainer.appendChild(newsCard);
  });
}

// Función para formatear la fecha y el tiempo
function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
  const formattedDate = new Date(dateTimeString).toLocaleDateString(undefined, options);
  return formattedDate;
}

// Function to display news data in the UI
function displayNews(newsData) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = ""; // Clear previous content

  newsData.forEach(newsItem => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("card");
    newsCard.classList.add("d-flex");
    newsCard.innerHTML = `
      <div class="card-body">
        <img src="${newsItem.multimedia[0].url}" class="card-img-top card-img-bottom img-fluid" alt="${newsItem.title}" style="max-width: 200px; max-height: 200px; object-fit: cover; float: left; margin-right: 10px;">
        <h5 class="card-title">${newsItem.title}</h5>
        <p class="card-text">${newsItem.abstract}</p>
        <p class="card-text"><strong>Section:</strong> ${newsItem.section}</p>
        <p class="card-text"><strong>Published Date:</strong> ${formatDateTime(newsItem.published_date)}</p>
        <a href="${newsItem.url}" target="_blank" class="btn btn-primary">Read More</a>
      </div>
    `;
    newsContainer.appendChild(newsCard);
  });
}

// Función para crear una tabla HTML con los enlaces de compra de un libro (mostrando solo 4 enlaces)
function createBuyLinksTable(buyLinks) {
  let tableHTML = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
          </tr>
        </thead>
        <tbody>
  `;

  const linksToShow = Math.min(buyLinks.length, 4);

  for (let i = 0; i < linksToShow; i++) {
    const link = buyLinks[i];
    tableHTML += `<tr><td style="font-size: 12px;">${link.name}</td><td style="font-size: 12px;"><a href="${link.url}" target="_blank">${link.url}</a></td></tr>`;
  }

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  return tableHTML;
}

// Función para mostrar un mensaje de error en la UI cuando no se encuentran libros
function displayBooksError() {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = "<p>No se encontraron libros.</p>";
}

// Event listener para cargar datos de noticias y libros cuando la página se carga
window.addEventListener("load", () => {
  fetchNewsData(newsApiUrl);
  fetchBooksData(booksApiUrl);
});
