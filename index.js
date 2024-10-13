document.addEventListener("DOMContentLoaded", () => {
  const controlsDiv = document.getElementById("controls");
  const recipeDisplayDiv = document.getElementById("recipes");
  let allRecipes = []; // Define allRecipes here

  // Function to get the category class
  function getCategoryClass(category) {
    switch (category.toLowerCase()) {
      case "breakfast":
        return "category-breakfast";
      case "lunch":
        return "category-lunch";
      case "dinner":
        return "category-dinner";
      case "snack":
        return "category-snack";
      default:
        return "category-default";
    }
  }

  function filterRecipes() {
    const selectedCategories = Array.from(
      document.querySelectorAll('#controls input[type="checkbox"]:checked')
    ).map((checkbox) =>
      checkbox.nextElementSibling.getAttribute("data-category")
    );

    const filteredRecipes = allRecipes.filter(
      (recipe) =>
        selectedCategories.includes(recipe.category) ||
        selectedCategories.length === 0
    );
    // Update the display based on the filtered results
    if (filteredRecipes.length === 0) {
      recipeDisplayDiv.innerHTML =
        '<p class="text-center">Tarif bulunamadı.</p>';
    } else {
      displayRecipes(filteredRecipes);
    }
  }

  function displayRecipes(recipes) {
    if (recipes.length === 0) {
      recipeDisplayDiv.innerHTML =
        '<p class="text-center">Tarif bulunamadı.</p>';
    } else {
      recipeDisplayDiv.innerHTML = recipes
        .map((recipe, index) => {
          const categoryClass = getCategoryClass(recipe.category);
          return `
            <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button
                            class="accordion-button collapsed ${categoryClass}"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse${index}"
                            aria-expanded="false"
                            aria-controls="collapse${index}"
                        >
                            ${recipe.name}
                        </button>
                    </h2>
                    <div
                        id="collapse${index}"
                        class="accordion-collapse collapse"
                        aria-labelledby="heading${index}"
                    >
                        <div class="accordion-body">
                            <div class="recipe-card card">
                                <div class="card-body">
                                    <h5 class="card-title">${recipe.name}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${
                                      recipe.category
                                    }</h6>
                                    <div class="ingredient-list mt-4">
                                        <h6 class="card-subtitle mb-2">Malzemeler:</h6>
                                        <ul>
                                            ${recipe.ingredients
                                              .map(
                                                (ingredient) => `
                                                    <li>${ingredient.item}: ${
                                                  ingredient.quantity
                                                } ${ingredient.unit}${
                                                  ingredient.preparation
                                                    ? ` (${ingredient.preparation})`
                                                    : ""
                                                }</li>
                                                `
                                              )
                                              .join("")}
                                        </ul>
                                    </div>
                                    <div class="mt-4">
                                        <h6 class="card-subtitle mb-2">Hazırlık:</h6>
                                        <p class="card-text">${
                                          recipe.preparation
                                        }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");
    }
  }

  document
    .querySelectorAll('#controls input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", filterRecipes);
    });

  // Fetch recipes from JSON file
  fetch("recipes.json")
    .then((response) => response.json())
    .then((recipes) => {
      allRecipes = recipes; // Populate allRecipes here
      displayRecipes(allRecipes); // Display recipes initially
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  // Info button functionality
  const infoButton = document.getElementById("info-button");
  infoButton.addEventListener("click", () => {
    Promise.all([
      fetch("fruits-cals.json"), // Fetch the fruits data
      fetch("dried-fruits-cals.json"), // Fetch the dried fruits data
    ])
      .then(async ([fruitsResponse, driedFruitsResponse]) => {
        const fruitsData = await fruitsResponse.json();
        const driedFruitsData = await driedFruitsResponse.json();

        // Create the table HTML
        const tableHTML = `
        
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Ortalama Ölçü</th>
                <th>Miktar (g)</th>
              </tr>
            </thead>
            <tbody>
            <p class="text-center fs-5 text-primary">1 PORSİYON MEYVE YERİNE GEÇENLER</p>
              ${fruitsData
                .map(
                  (item) => `
                <tr>
                  <td>${item.item}</td>
                  <td>${item.average_measure}</td>
                  <td>${item.quantity !== null ? item.quantity : "N/A"}</td>
                </tr>
              `
                )
                .join("")}
              <tr>
                <td colspan="3" class="text-center"><strong>KURU MEYVELER</strong></td>
              </tr>
              ${driedFruitsData
                .map(
                  (item) => `
                <tr>
                  <td>${item.item}</td>
                  <td>${item.average_measure}</td>
                  <td>${item.quantity !== null ? item.quantity : "N/A"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        recipeDisplayDiv.innerHTML = tableHTML; // Update the recipes div with the table
      })
      .catch((error) =>
        console.error("Error fetching fruits or dried fruits data:", error)
      );
  });
});
