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
    // Verificar si multimedia y su primer elemento existen antes de acceder a url
    const imageUrl = newsItem.multimedia && newsItem.multimedia[0] && newsItem.multimedia[0].url ? newsItem.multimedia[0].url : 'URL_por_defecto.jpg';

    const newsCard = document.createElement("div");
    newsCard.classList.add("card");
    newsCard.classList.add("d-flex");
    newsCard.innerHTML = `
      <div class="card-body">
        <img src="${imageUrl}" class="card-img-top card-img-bottom img-fluid" alt="${newsItem.title}" style="max-width: 200px; max-height: 200px; object-fit: cover; float: left; margin-right: 10px;">
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

// Function to display books data in the UI
function displayBooks(booksData) {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = ""; // Clear previous content

  if (booksData && booksData.length > 0) {
    booksData.forEach(bookItem => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("card");
      bookCard.classList.add("d-flex"); // Use flexbox to align items horizontally

      // Formatear la fecha publicada en "mes día, año hora:minutos"
      const formattedPublishedDate = bookItem.published_date ? new Date(bookItem.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '';

      bookCard.innerHTML = `
        <div class="card-body">
          <h5 class="card-title mb-3">${bookItem.title}</h5>
          <p class="card-text"><strong>Author:</strong> ${bookItem.author}</p>
          <p class="card-text"><strong>Description:</strong> ${bookItem.description || "No description available."}</p>
          ${bookItem.publisher ? `<p class="card-text"><strong>Publisher:</strong> ${bookItem.publisher}</p>` : ''}
          ${formattedPublishedDate ? `<p class="card-text"><strong>Published Date:</strong> ${formattedPublishedDate}</p>` : ''}
          ${bookItem.pages ? `<p class="card-text"><strong>Pages:</strong> ${bookItem.pages}</p>` : ''}
          ${bookItem.genre ? `<p class="card-text"><strong>Genre:</strong> ${bookItem.genre}</p>` : ''}
          ${bookItem.primary_isbn10 ? `<p class="card-text"><strong>ISBN-10:</strong> ${bookItem.primary_isbn10}</p>` : ''}
          ${bookItem.primary_isbn13 ? `<p class="card-text"><strong>ISBN-13:</strong> ${bookItem.primary_isbn13}</p>` : ''}
          <div class="card-body mb-4" style="border: 1px solid #ddd; border-radius: 10px; padding: 15px; margin-top: 15px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
          <h6 style="margin-bottom: 10px; font-weight: bold;">Purchase Links <i id="arrow-icon" class="fas fa-chevron-down"></i></h6>
          ${bookItem.buy_links ? createBuyLinksTable(bookItem.buy_links) : ''}
          </div>
          <a href="${bookItem.amazon_product_url}" target="_blank" class="btn btn-primary">Buy Now</a>
        </div>
      `;

      booksContainer.appendChild(bookCard);
    });
  } else {
    displayBooksError(); // Muestra un mensaje de error en la UI si no hay datos de libros
  }
}

// Función para formatear la fecha y el tiempo
function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
  const formattedDate = new Date(dateTimeString).toLocaleDateString(undefined, options);
  return formattedDate;
}

// Función para crear una tabla HTML con los enlaces de compra de un libro (mostrando solo 4 enlaces)
function createBuyLinksTable(buyLinks) {
  let tableHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">URL</th>
        </tr>
      </thead>
      <tbody>
  `;

  const linksToShow = Math.min(buyLinks.length, 4); // Mostrar como máximo 4 enlaces

  for (let i = 0; i < linksToShow; i++) {
    const link = buyLinks[i];
    tableHTML += `<tr><td style="font-size: 12px;">${link.name}</td><td style="font-size: 12px;"><a href="${link.url}" target="_blank">${link.url}</a></td></tr>`;
  }

  tableHTML += `
      </tbody>
    </table>
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
