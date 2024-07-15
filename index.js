const link = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=";
const dsilink = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

window.onload = async function Load() {
  const link1 = link + "a";
  const response = await fetch(link1);
  const data = await response.json();
  displayimg(data.drinks);
}

async function search() {
  const srch = document.getElementById('srch').value;
  const x = srch[0];
  const nlink = link + x;
  const response = await fetch(nlink);
  const data = await response.json();
  clearDisplay();
  displayimg(data.drinks);
}

function displayimg(drinks) {
  modal.style.display = "none";
  const drinkscontainer = document.getElementById("drinkscontainer");
  drinkscontainer.innerHTML = ''; // Clear previous content
  drinks.forEach(imag => {
    const drinkDiv = document.createElement('div');
    drinkDiv.classList.add('drink-item');

    const image = document.createElement('img');
    image.src = imag.strDrinkThumb;
    image.alt = imag.strDrink;
    image.classList.add('drink-image');

    const name = document.createElement('p');
    name.textContent = imag.strDrink;
    name.classList.add('drink-name');

    drinkDiv.appendChild(image);
    drinkDiv.appendChild(name);
    drinkscontainer.appendChild(drinkDiv);

    drinkDiv.addEventListener("click", () => {
      openModal(imag.strDrink);
    });
  });
}

async function singledisplay(drink) {
  const ilink = `${dsilink}${drink}`;
  const response = await fetch(ilink);
  const data = await response.json();

  if (data.drinks && data.drinks.length > 0) {
    const dat = data.drinks[0];
    const dname = document.querySelector('#drname');
    const dimg = document.querySelector('#drimg');
    const ding = document.querySelector('#dring');
    const drec = document.querySelector('#drrec');

    dname.textContent = dat.strDrink;
    dimg.src = dat.strDrinkThumb;
    ding.innerHTML = '';
    for (let i = 1; i <= 15; i++) {
      const ingredient = dat[`strIngredient${i}`];
      const measure = dat[`strMeasure${i}`];
      if (ingredient) {
        const ingredientItem = document.createElement('p');
        ingredientItem.textContent = `${ingredient} - ${measure || ''}`;
        ding.appendChild(ingredientItem);
      } else {
        break;
      }
    }

    const opt = document.getElementById('drrecsel').value;
    const instructionKey = `strInstructions${opt}`;
    const lang = dat[instructionKey] || "Instructions not available in the selected language.";
    drec.textContent = lang;

    openModal(dat.strDrink);
  } else {
    console.error("No drink details found.");
  }
}

function clearDisplay() {
  const drinkscontainer = document.getElementById("drinkscontainer");
  drinkscontainer.innerHTML = ''; // Clear previous content
}

document.getElementById('srch').addEventListener('input', async function () {
  await search();
});

const close = document.querySelector("#closemodal");
const modal = document.querySelector("#modal");

function openModal(drinkName) {
  singledisplay(drinkName);
  modal.style.display = "flex";

  const favBtn = document.getElementById('favbtn');
  favBtn.onclick = () => {
    saveToFavorites(drinkName);
    favBtn.src = 'favourite.png'; 
  };
}
function saveToFavorites(drinkName) {
  const drinkscontainer = document.getElementById("drinkscontainer");
  const drinkItem = Array.from(drinkscontainer.getElementsByClassName("drink-item")).find(item => item.querySelector(".drink-name").textContent === drinkName);
  const drinkImg = drinkItem.querySelector(".drink-image").src;

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.some(fav => fav.name === drinkName)) {
    favorites.push({ name: drinkName, img: drinkImg });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
  }
}


function updateFavoritesCount() {
  const favCount = document.getElementById('favcnt');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favCount.textContent = favorites.length;
}

function displayFavorites(drinkName) {
  const favDialog = document.getElementById('favitem');
  const favList = document.getElementById('favlist');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favList.innerHTML = ''; // Clear previous content
  if (favorites.length === 0) {
    favList.innerHTML += '<p>No favorites saved yet.</p>';
  } else {
    favorites.forEach((fav, index) => {
      const favItem = document.createElement('div');
      favItem.classList.add('fav-item');

      const image = document.createElement('img');
      image.src = fav.img;
      image.alt = fav.name;
      image.classList.add('fav-image');

      const name = document.createElement('p');
      name.textContent = fav.name;
      name.classList.add('fav-name');

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('remove-btn');
      removeBtn.onclick = () => {
        removeFromFavorites(index);
      };

      favItem.appendChild(image);
      favItem.appendChild(name);
      favItem.appendChild(removeBtn);
      favList.appendChild(favItem);
    });
  }

  favDialog.showModal();
  // fav-image.addEventListener("click", () => {
  //   openModal(fav-name.strDrink);
  // });
}

// Function to remove a cocktail from favorites in local storage
function removeFromFavorites(index) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
  updateFavoritesCount();
}

// Event listener for opening favorites dialog
document.getElementById('fav').addEventListener('click', displayFavorites);

close.addEventListener("click", () => {
  location.reload();
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    location.reload();
  }
});

const openfav = document.querySelector("#fav");
const closefav = document.querySelector("#closefav");
const fav = document.querySelector("#favitem");

openfav.addEventListener("click", () => {
  fav.showModal();
});

closefav.addEventListener("click", () => {
  fav.close();
});


  
// Create a simple web page with a search box. +++
  // In searchbox can type only one character.+++
  // Call the above api for searching.+++
  // It will return a set of cocktails.+++
  // Show the result as box/grid with image and name. Make this page responsive.+++
  // On click of each cocktail show modal popup that displays name, image, ingredients and steps.+++
  
  // Provide Option to Save any cocktail to favorites using local storage. Menu should have favourites option which when clicked will show all saved cocktails
