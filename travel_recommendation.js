const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'results-container';
  const resultsList = document.createElement('ul');
  resultsContainer.appendChild(resultsList);
  document.body.appendChild(resultsContainer);
});

//exlaining the 10 lines : 
/* first two rows we are getting two variables with their id from the html that we have so we can manipulate them late.
the DOMcontentLoaded event fires before any external sources like images or css are fully loaded. The code inside this event handler will execute when the doc is ready.
Then we create a new element div which is assigned an id attribute so i can interact in my css file js file .
We then create an unordered list so i can have it as a container for displaying results and then i append it to the previous div making it a child element. 
Finally the entire resultsContainer (<div> with the embedded <ul>) is appended to the body of the document, meaning it will now appear in the DOM (the structure of the web page).
In summary , we created a container with an unordered list the div to be more precise and we will use it for display.*/

function checkInput(input) {
  if (["beach", "beaches"].includes(input)) {
    return "beaches";
  } else if (["temple", "temples"].includes(input)) {
    return "temples";
  } else if (input === "country" || input === "countries") {
    return "random_cities";
  } else if (["australia", "japan", "brazil"].includes(input)) {
    return input;
  } else {
    return null;
  }
}

//pretty easy to understand what this function does . 

function search() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const searchCriteria = checkInput(input);
  if (!searchCriteria) {
    alert("You have entered an invalid selection. Please try again");
    return;
  }

  fetch("travel_recommendation_api.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const resultsContainer = document.getElementById('results-container');
      const resultsList = resultsContainer.querySelector('ul');
      resultsList.innerHTML = ''; // Clear previous results
      resultsContainer.style.display = 'block'; // Show the container

      if (searchCriteria === "beaches" || searchCriteria === "temples") {
        displayItems(data[searchCriteria]);
      } else if (searchCriteria === "random_cities") {
        const allCities = data.countries.flatMap(country => country.cities);
        const randomCities = getRandomItems(allCities, 2);
        displayItems(randomCities);
      } else {
        // Handle countries
        const countryData = data.countries.find(country => country.name.toLowerCase() === searchCriteria);
        if (countryData && countryData.cities) {
          displayItems(countryData.cities);
        } else {
          console.error(`Country ${searchCriteria} does not exist in the data.`);
        }
      }
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

/* explaining the code:(explaining mostly the difficult parts...)
he fetch function is used to request data from the file travel_recommendation_api.json.
.then(response => {: Once the fetch request resolves, this .then() block is executed.
if (!response.ok): This checks whether the response from the server was successful. If not, an error is thrown.
return response.json();: If the response is successful, the JSON data is extracted from the response and returned for further processing.
const resultsList = resultsContainer.querySelector('ul');: Inside the results-container, it finds the <ul> (unordered list) where the actual results (list items) will be appended.
resultsContainer.style.display = 'block';: This makes the resultsContainer visible by setting its display property to 'block'. It ensures the results are shown only after the search is performed.
If the user input is "beaches" or "temples", the corresponding data is accessed from data[searchCriteria] (where data is the JSON object) and passed to the displayItems() function to be rendered in the UI.
If the user wants to search for "random_cities", the code creates a list of all cities from the data.countries. It does this by using flatMap(), which merges all the cities from each country into one array.
Then, getRandomItems(allCities, 2) picks 2 random cities from this list, which are displayed using the displayItems() function.
If the search is for a specific country, the code looks through the data.countries array to find a matching country using find(). The match is based on the country name (converted to lowercase).
If there is any problem during the fetch operation (like the server not responding or a network failure), this catch() block will handle the error.The error message is logged to the browser's console for debugging.
*/

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

//Math.random() generates a random number between 0 and 1. If the result is positive, element a stays in its current position relative to element b.Since this process is repeated randomly, it creates a "shuffling" effect on the array.

function displayItems(items) {
  const resultsContainer = document.getElementById('results-container');
  const resultsList = resultsContainer.querySelector('ul');
  resultsList.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'block'; // Show the container

  items.forEach(item => {
    const titleItem = document.createElement('li');
    titleItem.className = "result-title";
    titleItem.innerHTML = `<h2>${item.name}</h2>`;

    const imageItem = document.createElement('li');
    imageItem.className = "result-image";
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    img.onload = () => {
      imageItem.appendChild(img);

      const descriptionItem = document.createElement('li');
      descriptionItem.className = "result-description";
      descriptionItem.innerHTML = `<p>${item.description}</p>`;

      resultsList.appendChild(titleItem);
      resultsList.appendChild(imageItem);
      resultsList.appendChild(descriptionItem);
    };

    img.onerror = () => {
      const descriptionItem = document.createElement('li');
      descriptionItem.className = "result-description";
      descriptionItem.innerHTML = `<p>${item.description}</p>`;

      resultsList.appendChild(titleItem);
      resultsList.appendChild(descriptionItem);
    };
  });
}

/* The function takes an array of items (likely containing objects with name, imageUrl, and description properties). The .forEach() method is used to iterate over each item in this array.
titleItem: A new list item (<li>) is created to hold the title of the current item.
The class "result-title" is applied to the <li>, likely for styling purposes.
The content of the <li> is set to an <h2> element containing the item.name, which is the name or title of the travel destination.
An <img> element is created. The src attribute is set to the item.imageUrl, which is the URL of the image associated with this item, and the alt attribute is set to the item.name for accessibility (in case the image cannot be loaded).
img.onload: This event fires when the image is successfully loaded.
imageItem.appendChild(img): The loaded <img> element is appended to the imageItem <li>.
img.onerror: This event handler is triggered if the image fails to load (e.g., broken image URL).
The code will skip displaying the image and proceed to create and append only the titleItem and descriptionItem to the resultsList. This ensures that the user still sees the title and description, even if the image can't be loaded.
*/

btnSearch.addEventListener('click', search);
btnReset.addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.querySelector('ul').innerHTML = '';
  resultsContainer.style.display = 'none'; // Hide the container
});