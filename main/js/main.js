let page = 1;
const perPage = 10;
let searchName = null;

function loadListingData() {

    let url = "";

    if (searchName) {
        url = `http://localhost:8080/api/listings?page=${page}&perPage=${perPage}&name=${searchName}`
    } else {
        url = `http://localhost:8080/api/listings?page=${page}&perPage=${perPage}`;
    }

    fetch(url)
        .then(res =>{
            return res.ok ? res.json() : Promise.reject(res.status);
        })  
        .then(data => {

            if(data.length){

                let rows = `${data.map(listing => (
                    `<tr data-id="${listing._id}">
                    <td>${listing.name}</td>
                    <td>${listing.room_type} </td>
                    <td>${listing.address.street}</td>
                    <td>${listing.summary}<br /><br />
                    <strong>Accommodates:</strong> ${listing.accommodates}<br />
                    <strong>Rating:</strong> ${listing.review_scores.review_scores_rating} (${listing.number_of_reviews} Reviews)
                    </td>
                </tr>`
                )).join('')}`;

                document.querySelector("#listingsTable tbody").innerHTML = rows;

                document.querySelectorAll('#listingsTable tbody tr').forEach((row) => {
                    row.addEventListener('click', (e) => {
                        let clickedId = row.getAttribute('data-id');

                        fetch(`http://localhost:8080/api/listings/${clickedId}`).then(res => res.json()).then(data => {
                            document.querySelector("#detailsModal .modal-title").innerHTML = data.name;

                            let body = `
                                <img id="photo" onerror="this.onerror=null;this.src = 'https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${data.images.picture_url}" /><br /><br />
                                ${data.neighborhood_overview && data.neighborhood_overview + "<br /><br />"}
                                <strong>Price:</strong> ${data.price.toFixed(2)}<br />
                                <strong>Room:</strong> ${data.room_type}<br />
                                <strong>Bed:</strong> ${data.bed_type} (${data.beds})<br /><br />
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