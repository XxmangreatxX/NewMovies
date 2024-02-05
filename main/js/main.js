// This will keep track of the current page that the user is viewing.
var pageNumber = 1;
//This will be a constant value that we will use to reference how many movie items we wish to view on each page of our application.
const perPage = 10;

function loadMovieData (inTitle = null){
    //noticed that the search will not work if the page and perPage value are not default 1 and 10
    //when the page was change to for example page=10, and we try searching for a movie. Result would return nothing
    let url = inTitle ? `${window.location.href}api/movies?page=1&perPage=10&title=${inTitle}` : `${window.location.href}api/movies?page=${+pageNumber}&perPage=${+perPage}`;
    
    //add/remove d-none from class=pagination
    if (inTitle){
        const cList = document.getElementById("pagination").classList;
        cList.add("d-none");
    } else {
        const cList = document.getElementById("pagination").classList;
        cList.remove("d-none");
    }

    fetch(url)
        .then(res => res.json()).then(data =>{

            //format data for row
            let row = `
            ${data.map(post =>(
                `<tr data-id=${post._id}>
                    <td>${post.year}</td>
                    <td>${post.title}</td>
                    <td>${post.plot ? post.plot : "N/A"}</td>
                    <td>${post.rated ? post.rated : "N/A"}</td>
                    <td>${Math.floor(post.runtime/60)+ ":" + (post.runtime%60).toString().padStart(2,'0')}</td>
                </tr>`
            )).join('')}`;
            
            //populate table with rows
            document.querySelector('#moviesTable tbody').innerHTML = row;
            
            //update the current page number for the pagination
            document.querySelector('#current-page').innerHTML = pageNumber;
            
            //for each row on the current table, check for click event
            //if clicked modal will pop up with more details on clicked movie
            document.querySelectorAll('#moviesTable tbody tr').forEach(row => {
                row.addEventListener("click", c =>{
                    let clicked = row.getAttribute("data-id");
                    
                    fetch(`${window.location.href}api/movies/${clicked}`)
                    .then(res => res.json())
                    .then(data => {
                    
                        document.querySelector("#detailsModal .modal-title").innerHTML = data.title;

                        //format data for modal with movie data
                        let movieDesc = `
                            <img class="img-fluid w-100" src=${data.poster}><br><br>
                            <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
                            <p>${data.fullplot ? data.fullplot : "N/A"}</p>
                            <strong>Cast:</strong> ${data.cast ? data.cast.join(', ') : "N/A"}<br><br>
                            <strong>Awards:</strong> ${data.awards.text}<br>
                            <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                        `;

                        document.querySelector("#detailsModal .modal-body").innerHTML = movieDesc;

                        let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                            backdrop: "static",
                            keyboard: false,
                            focus: true,
                        });

                        modal.show();
                    });

                });
            });
        });
}

// Button that will direct to the previous page
function previousButton(){
    document.getElementById('previous-page')
    .addEventListener("click", c =>{
        if (pageNumber === 1){
            loadMovieData();
        } else{
            pageNumber = pageNumber - 1;
            loadMovieData();
        }
    });
}

// Button that will direct to the next page
function nextButton(){
    document.getElementById('next-page')
    .addEventListener("click", c =>{
        pageNumber = pageNumber + 1;
        loadMovieData();
    });
}

// Button that will direct to specific title
function searchForm(){
    document.querySelector("#searchForm").addEventListener('submit', event => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        // populate the posts table with the title value
        loadMovieData(document.querySelector("#title").value);
    });
}

// Button that will clear the search bar
function clearForm(){
    document.getElementById("clearForm").addEventListener("click", function(){
        document.getElementById("title").value = "";
        // populate the posts table with the title value
        loadMovieData();
    })
}

document.addEventListener('DOMContentLoaded', function() {
    loadMovieData();
    previousButton();
    nextButton();
    searchForm();
    clearForm();
})