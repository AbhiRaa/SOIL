/**
 * `api.js` is a module providing API access functions to the Spoonacular API, which is utilized for fetching meals and generating meal plans based on various parameters.
 */

// API key for accessing the Spoonacular API.
// const API_KEY = 'caa7e9166b5440c7a5e88f6b726a3c7b';
const API_KEY = 'b9c5b0ae91e7429392042f7370b57cb5';
// Base URL for the Spoonacular API.
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Fetches meal recipes based on a search query and various nutritional and dietary parameters.
 * 
 * @param {string} query - The main ingredient or keyword for the recipe search.
 * @param {string} dietaryPreferences - Dietary restrictions to apply (e.g., vegan, ketogenic).
 * @param {string} intolerances - Allergens or ingredients to exclude from recipes.
 * @param {object} macros - Object containing maximum values for protein, carbs, and fat.
 * @returns {Array} An array of recipe objects or an empty array if an error occurs.
 */
export const fetchMeals = async (query, dietaryPreferences, intolerances, macros) => {
  const { protein, carbs, fat } = macros;
  try {
    // Constructing the URL with query parameters for the API request.
    let url = `${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}&maxCalories=800`;
    if (dietaryPreferences) {
      url += `&diet=${encodeURIComponent(dietaryPreferences)}`;
    } 
    if (intolerances) {
      url += `&intolerances=${encodeURIComponent(intolerances)}`;
    }
    url += `&maxProtein=${protein}`;
    url += `&maxCarbs=${carbs}`;
    url += `&maxFat=${fat}`;
    url += '&number=18';
    url += '&addRecipeNutrition=true'; // CRITICAL: Add nutrition data to response
    url += '&addRecipeInformation=true'; // Add additional recipe info

    console.log("Fetching meals with URL:", url);   // Debugging log for the constructed URL.

    const response = await fetch(url);  // Executing the API request.
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Parsing the JSON response.
    return data.results;  // Returning the results array from the response.
  } catch (error) {
    console.error("Error fetching data: ", error);  // Logging the error to the console.
    return [];  // Returning an empty array in case of error.
  }
};

/**
 * Generates a meal plan with specific calorie targets, dietary restrictions, and exclusions.
 * 
 * @param {object} params - Parameters for generating the meal plan.
 * @param {string} params.timeFrame - Duration for the meal plan (e.g., "day", "week").
 * @param {number} params.targetCalories - Caloric target for the meal plan.
 * @param {string} params.diet - Dietary restrictions for the meal plan.
 * @param {string} params.exclude - Ingredients to exclude from the meal plan.
 * @returns {object|null} The generated meal plan object or null if an error occurs.
 */
export const generateMealPlan = async ({ timeFrame, targetCalories, diet, exclude }) => {
  // Constructing the URL with query parameters for generating a meal plan.
  let url = `${BASE_URL}/mealplanner/generate?apiKey=${API_KEY}&timeFrame=${timeFrame}&targetCalories=${targetCalories}&diet=${diet}&exclude=${encodeURIComponent(exclude)}`;
  
  // Add nutrition data to the meal plan response
  url += '&addRecipeNutrition=true'; // CRITICAL: Add nutrition data to meals
  url += '&addRecipeInformation=true'; // Add additional recipe info
  
  // Debugging
  console.log(url)
  console.log(targetCalories, diet, exclude)
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch meal plan');
    }
    const data = await response.json();
    return data;  // Returning the meal plan data.
  } catch (error) {
    console.error("Error fetching meal plan: ", error);
    return null;  // Returning null in case of error.
  }
};

/**
 * Fetches detailed information including nutrition for multiple recipes in bulk.
 * More efficient than making individual API calls for each recipe.
 * 
 * @param {Array<number>} recipeIds - Array of recipe IDs to fetch information for.
 * @returns {Object} Object containing recipe details keyed by recipe ID, or empty object if error.
 */
export const fetchBulkRecipeInformation = async (recipeIds) => {
  if (!recipeIds || recipeIds.length === 0) {
    return {};
  }
  
  try {
    const idsString = recipeIds.join(',');
    const url = `${BASE_URL}/recipes/informationBulk?ids=${idsString}&apiKey=${API_KEY}&includeNutrition=true`;
    
    console.log(`Fetching bulk nutrition data for ${recipeIds.length} recipes`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch bulk recipe information');
    }
    
    const recipes = await response.json();
    
    // Convert array to object keyed by ID for easy lookup
    const recipesById = {};
    recipes.forEach(recipe => {
      recipesById[recipe.id] = recipe;
    });
    
    return recipesById;
  } catch (error) {
    console.error("Error fetching bulk recipe information: ", error);
    return {};
  }
};