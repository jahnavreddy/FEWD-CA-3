const url1 = "https://www.themealdb.com/api/json/v1/1/random.php";
const getdata = document.getElementById("ingredients");
const results = document.getElementById("search")

function getData(url) {
  axios
    .get(url)
    .then((res) => {
      console.log(res.data.meals);
      const data = res.data.meals[0];
      const output = `
        <div id="card1">
          <img src="${data.strMealThumb}" alt="">
          <h3>${data.strMeal}</h3>
          <button class="cook-btn">How to Cook</button>
        </div>`;
      document.getElementById("random").innerHTML += output;

      const cookButton = document.querySelectorAll('.cook-btn');
      cookButton.forEach(button => {
        button.addEventListener('click', () => {
          const mealId = data.idMeal;
          getIngredients(mealId);
          food.style.display = "none";
          document.getElementById("random").style.display = "none";
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

getData(url1);

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('inputSearch');
  const food = document.getElementById('searchResults');

  function onEnter(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      bringData();
      searchInput.value = '';
    }
  }

  searchInput.addEventListener('keypress', onEnter);

  function bringData() {
    const searchValue = searchInput.value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    if (searchValue !== '') {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let output = '';
          for (let i = 0; i < data.meals.length; i++) {
            output += `
              <div id="card">
                <img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}">
                <h3>${data.meals[i].strMeal}</h3>
                <button class="cook-btn" data-mealid="${data.meals[i].idMeal}">How to Cook</button>
              </div>`;
            
          }
          results.style.display = "block";
          console.log(data);
          food.innerHTML = output;

          const cookButton = document.querySelectorAll('.cook-btn');
          cookButton.forEach(button => {
            button.addEventListener('click', (event) => {
              const mealId = event.target.getAttribute('data-mealid');
              getIngredients(mealId);
              food.style.display = "none";
              document.getElementById("random").style.display = "none";
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  bringData();
});

function getIngredients(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      let ingredientOutput = '';
      const mealThumbnail = meal.strMealThumb;
      const mealName = meal.strMeal;
      const instructions = meal.strInstructions;

      const image = `<img src="${mealThumbnail}" alt="${mealName}"></img>`;

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
          ingredientOutput += `
            <div>${measure} ${ingredient}</div>
          `;
        } else {
          break;
        }
      }

      const combinedOutput = `
        <div id="howtocook">
          <div>${image}</div>
          <div id="ingredient">${ingredientOutput}</div>
          <div id="process"><strong>Instructions:</strong> ${instructions}</div>
          <div> <button id="Back">Back</button></div>
        </div>`;

      getdata.innerHTML = combinedOutput;
      console.log(combinedOutput);

      const food = document.getElementById('searchResults');
      const Back = document.getElementById('Back');

      Back.onclick = () => {
        getdata.innerHTML = "";
        food.style.display = "block";
        food.style.display = "flex";
        document.getElementById("random").style.display = "block";
        bringData();
      };
    })
    .catch(error => {
      console.log(error);
    });
}