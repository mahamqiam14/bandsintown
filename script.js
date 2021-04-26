
const searchInputTxt = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const artistList = document.getElementById('artist');



// event listeners
searchBtn.addEventListener('click', getartistList);


searchInputTxt.addEventListener('keyup', function(event){       //This ensures that the search button also works when ENTER is pressed on the keyboard
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById('search-btn').click();

    }
});

document.onreadystatechange = function() {              //If a request is taking too long, a loader has also be added to the page so the user can see that the request is being processed
    if (document.readyState !== "complete") {
        document.querySelector(
          "body").style.visibility = "hidden";
        document.querySelector(
          "#loader").style.visibility = "visible";
    } else {
        document.querySelector(
          "#loader").style.display = "none";
        document.querySelector(
          "body").style.visibility = "visible";
    }
};


// get event list that matches with the search input
function getartistList(){                                                               //This function is called when the search button is clicked, as per the event listener in line 9
    
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://rest.bandsintown.com/artists/${searchInputTxt}/events?app_id=123`)
    .then(response => response.json())
    .then(data => {
        
        let html = "";

        if( Object.keys(data) != "errorMessage" && Object.keys(data).length > 0) {      //This IF statement checks whether the search input has matched an entry on the API 
            console.log(Object.keys(data));                                             //If the search input matches an artist on the API, it will return the events of that artist, 
                                                                                        // then the value of Object.keys(data).length would be equal to the number of events found, 
                                                                                        //therefore Object.keys(data).length would be greater than 0, satisfying the IF condition
           
            
            data.map((art, index) => {                                                  //The map() method will create a new array with the results of calling a function for every element
                                                                                        //therefore, it will iterate through each event for the artist and display a card for each with the event info
               
                html += `
                    <div class = "artist-item" data-id = "${data[index].id}">
                        <div class="flip-card-inner">
                            <div class = "artist-name" >
                                <h3>${data[index].venue.name}</h3>                      //index represents each event element
                                <h4>${data[index].datetime}</h4>
                                <h5>${data[index].venue.city}, ${data[index].venue.country}</h5>
                                <a href='#' class = "event-btn">View event</a>
                            </div>
                            <div class="flip-card-back">                                //The div will be displayed when the user hovers over each card element of the event
                    
                                <div class = "event-instruct">
                                    <h3>Event Description:</h3>
                                    <p>${data[index].description}</p>
                                </div>
                                
                                <div class = "event-link">
                                    <a href = "${data[index].url}" ><i class="fas fa-shopping-cart"></i></a>                //This will take the user to the bandsintown website which contains a link for the tickets for the event
                                    <a href = 
                                    "${`https://www.google.com/maps/search/?api=1&query=${data[index].venue.latitude},      //As per the coordinates provided in the IP, this link will redirect the user to google maps and display the exact location of the event
                                        ${data[index].venue.longitude}`}" ><i class="fas fa-map-marker-alt"></i>
                                    </a>                
                                    <a href = "${data[0].artist.facebook_page_url}" ><i class="fab fa-facebook-square"></i></a>     //For further info on the artist, this link will redirect the user to the artist's facebook page
                                
                                </div>
                                     
                            </div>
                        </div>
                    </div>

    
                `;
                
            })
        
            artistList.classList.remove('notFound');
        } 
        
        else if (data.errorMessage){                        //The other condition of the IF statement checks whether the search input matches an artist
                                                            //if no match is found, Object.keys(data) will return an error message suggesting that the input is invalid
            html = `
            <div class="notFound">
            <h4> Invalid search! </h4>
            <p>Please try again</p>
           </div>
           `;

           artistList.classList.add('notFound');
        }

        else{                                   //If an artist match is found, but they have no upcoming events, it will return the following statement
            
           html = `
           <div class="notFound">
            <h4> Sorry, we didn't find any upcoming events for the artist "${searchInputTxt}" </h4>
            <p>Please try a different search</p>
           </div>
           `;
            artistList.classList.add('notFound');
        }

        artistList.innerHTML = html;
    })
    
        
    
    
}



