let page = 1;
const perPage = 10;
let searchName = null;

function loadListingData() {

    let url = "";

    if (searchName) {
        url = `http://localhost:8080/api/movies?page=${page}&perPage=${perPage}&title=${searchName}`
    } else {
        url = `http://localhost:8080/api/movies?page=${page}&perPage=${perPage}`;
    }

    fetch(url)
        .then(res =>{
            return res.ok ? res.json() : Promise.reject(res.status);
        })  
        .then(data => {

            if(data.length){

                let rows = `${data.map(post => (
                    `<tr data-id=${post._id}>
                    <td>${post.year}</td>
                    <td>${post.title}</td>
                    <td>${post.plot ? post.plot : "N/A"}</td>
                    <td>${post.rated ? post.rated : "N/A"}</td>
                    <td>${Math.floor(post.runtime/60)+ ":" + (post.runtime%60).toString().padStart(2,'0')}</td>
                </tr>`
                )).join('')}`;

                document.querySelector("#listingsTable tbody").innerHTML = rows;

                document.querySelectorAll('#listingsTable tbody tr').forEach((row) => {
                    row.addEventListener('click', (e) => {
                        let clickedId = row.getAttribute('data-id');

                        fetch(`http://localhost:8080/api/movies/${clickedId}`).then(res => res.json()).then(data => {
                            document.querySelector("#detailsModal .modal-title").innerHTML = data.name;

                            let body = `
                                <img class="img-fluid w-100" src=${data.poster}><br><br>
                                <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
                                <p>${data.fullplot ? data.fullplot : "N/A"}</p>
                                <strong>Cast:</strong> ${data.cast ? data.cast.join(', ') : "N/A"}<br><br>
                                <strong>Awards:</strong> ${data.awards.text}<br>
                                <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                            `;

                            document.querySelector("#detailsModal .modal-body").innerHTML = body;
                            new bootstrap.Modal(document.getElementById('detailsModal')).show();
                        });

                    });
                });

                document.querySelector("#current-page").innerHTML = page;
            }else{
                if(page > 1){ 
                    page--; 
                }else{
                    document.querySelector("#listingsTable tbody").innerHTML = `<tr><td colspan="4"><strong> No data available</td></tr>`;
                }
            }
        }).catch(err=>{
            if(page > 1){ 
                page--; 
            }else{
                document.querySelector("#listingsTable tbody").innerHTML = `<tr><td colspan="4"><strong> No data available</td></tr>`;
            }
        });
}

// Execute when the DOM is 'ready'
document.addEventListener('DOMContentLoaded', function () {

    loadListingData();

    document.querySelector(".pagination #previous-page").addEventListener("click", function (e) {
        if (page > 1) {
            page--;
            loadListingData();
        }
    });

    document.querySelector(".pagination #next-page").addEventListener("click", function (e) {
        page++;
        loadListingData();
    });

    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        searchName = document.querySelector('#name').value;
        page = 1;
        loadListingData();
    });

    document.querySelector("#clearForm").addEventListener("click", (event) => {
        document.querySelector('#name').value = "";
        searchName = null;
        loadListingData();
    });

});