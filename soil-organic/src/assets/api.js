// const API_KEY = 'b9c5b0ae91e7429392042f7370b57cb5';
const API_KEY = 'caa7e9166b5440c7a5e88f6b726a3c7b';
const BASE_URL = 'https://api.spoonacular.com';

export const fetchMeals = async (query, dietaryPreferences, intolerances, macros) => {
  const { protein, carbs, fat } = macros;
  try {
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
    url += '&number=18'

    console.log("Fetching meals with URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

export const generateMealPlan = async ({ timeFrame, targetCalories, diet, exclude }) => {
  const url = `${BASE_URL}/mealplanner/generate?apiKey=${API_KEY}&timeFrame=${timeFrame}&targetCalories=${targetCalories}&diet=${diet}&exclude=${encodeURIComponent(exclude)}`;
  console.log(url)
  console.log(targetCalories, diet, exclude)
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch meal plan');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal plan: ", error);
    return null;
  }
};


