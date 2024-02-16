/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ali Keshavarzi Student ID: 138245220 Date: 2/4/2024
*
********************************************************************************/ 


let pageNumber = 1;
const perPage = 10;

async function loadMovieData(inTitle = null) {
  try {
    let url = inTitle
    ? `${window.location.href}/api/movies?page=1&perPage=10&title=${inTitle}`
    : `${window.location.href}api/movies?page=${+pageNumber}&perPage=$`

    const response = await fetch(apiUrl);
    const data = await response.json();

    const paginationControl = document.querySelector('.pagination');
    paginationControl.classList.toggle('d-none', inTitle !== null);

    const tableRows = data.map((movie) => `
      <tr data-id="${movie._id}">
        <td>${movie.year}</td>
        <td>${movie.title}</td>
        <td>${movie.plot || 'N/A'}</td>
        <td>${movie.rated || 'N/A'}</td>
        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
      </tr>
    `).join('');

    const tableBody = document.querySelector('#moviesTable tbody');
    tableBody.innerHTML = tableRows;

    const currentPageDisplay = document.querySelector('#current-page');
    currentPageDisplay.textContent = pageNumber;

    const tableRowsArray = Array.from(document.querySelectorAll('#moviesTable tbody tr'));
    tableRowsArray.forEach((row) => {
      row.addEventListener('click', async () => {
        const movieId = row.getAttribute('data-id');

        const movieResponse = await fetch(`/api/movies/${movieId}`);
        const selectedMovie = await movieResponse.json();

        const modalTitle = document.querySelector('#modalTitle');
        const modalBody = document.querySelector('#modalBody');

        modalTitle.textContent = selectedMovie.title;

        const modalContent = `
          <img class="img-fluid w-100" src="${selectedMovie.poster}">
          <br><br>
          <strong>Directed By:</strong> ${selectedMovie.directors.join(', ')}
          <br><br>
          <p>${selectedMovie.fullplot}</p>
          <strong>Cast:</strong> ${selectedMovie.cast.join(', ') || 'N/A'}
          <br><br>
          <strong>Awards:</strong> ${selectedMovie.awards.text}
          <br>
          <strong>IMDB Rating:</strong> ${selectedMovie.imdb.rating} (${selectedMovie.imdb.votes} votes)
        `;

        modalBody.innerHTML = modalContent;

        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
        detailsModal.show();
      });
    });
  } catch (error) {
    console.error('Error loading movie data:', error);
  }
}

document.getElementById('previous-page').addEventListener('click', () => {
  if (pageNumber > 1) {
    pageNumber--;
    loadMovieData();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  pageNumber++;
  loadMovieData();
});

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  loadMovieData(title);
});

document.getElementById('clearForm').addEventListener('click', () => {
  document.getElementById('title').value = '';
  loadMovieData();
});

document.addEventListener('DOMContentLoaded', () => {
  loadMovieData();
});
