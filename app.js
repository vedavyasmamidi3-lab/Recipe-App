const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipeDetailsContainer = document.querySelector(".recipe-details");

/* FETCH RECIPES */
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
        recipeContainer.innerText = "No recipes found";
        return;
    }

    response.meals.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>${meal.strCategory}</p>
        `;

        const button = document.createElement("button");
        button.textContent = "View Recipe";

        button.addEventListener("click", () => {
            openRecipePopUp(meal);
        });

        recipeDiv.appendChild(button);
        recipeContainer.appendChild(recipeDiv);
    });
};

/* SEARCH */
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetchRecipes(searchBox.value.trim());
});

/* OPEN POPUP (FIXED) */
const openRecipePopUp = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>

        <h3>Ingredients</h3>
        <ul class="ingredientList">
            ${fetchIngredients(meal)}
        </ul>

        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    `;

    recipeDetailsContainer.style.display = "block";

    // reset animation
    recipeDetailsContainer.style.opacity = "0";
    recipeDetailsContainer.style.transform = "translate(-50%, -50%) scale(0.8)";

    setTimeout(() => {
        recipeDetailsContainer.style.opacity = "1";
        recipeDetailsContainer.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
};

/* INGREDIENTS */
const fetchIngredients = (meal) => {
    let list = "";

    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];

        if (ing && ing.trim()) {
            list += `<li>${meas} ${ing}</li>`;
        } else {
            break;
        }
    }

    return list;
};

/* CLOSE POPUP */
recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContainer.style.opacity = "0";
    recipeDetailsContainer.style.transform = "translate(-50%, -50%) scale(0.8)";

    setTimeout(() => {
        recipeDetailsContainer.style.display = "none";
    }, 250);
});