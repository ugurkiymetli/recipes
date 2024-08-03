document.addEventListener('DOMContentLoaded', () => {
  const controlsDiv = document.getElementById('controls');
  const recipeDisplayDiv = document.getElementById('recipeDisplay');

  // Fetch recipes from JSON file
  fetch('recipes.json')
    .then((response) => response.json())
    .then((recipes) => {
      // Generate category buttons
      const categories = [...new Set(recipes.map((recipe) => recipe.category))];
      categories.forEach((category) => {
        const button = document.createElement('button');
        button.textContent = category;
        button.dataset.category = category;
        button.classList.add('tab-button');
        if (category === 'breakfast') {
          button.classList.add('active');
        }
        controlsDiv.appendChild(button);
      });

      // Event listener for category buttons
      controlsDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          document
            .querySelectorAll('.tab-button')
            .forEach((btn) => btn.classList.remove('active'));
          e.target.classList.add('active');
          const selectedCategory = e.target.dataset.category;
          displayRecipes(selectedCategory);
        }
      });

      // Set default category as 'breakfast'
      displayRecipes('breakfast');

      // Function to display recipes
      function displayRecipes(category) {
        const filteredRecipes = recipes.filter(
          (recipe) => recipe.category === category
        );
        recipeDisplayDiv.innerHTML = filteredRecipes
          .map(
            (recipe) => `
            <div class="recipe">
              <h2>${recipe.name}</h2>
              <p class="category">Category: ${recipe.category}</p>
              <ul class="ingredients">
                ${recipe.ingredients
                  .map(
                    (ingredient) => `
                  <li>${ingredient.item}: ${ingredient.quantity} ${ingredient.unit}</li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          `
          )
          .join('');
        recipeDisplayDiv.classList.add('active');
      }
    })
    .catch((error) => console.error('Error fetching recipes:', error));
});
