import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import MealSearch from '../components/MealSearch';
import MealList from '../components/MealList';
import MealCard from '../components/MealCard';
import { fetchMeals, generateMealPlan } from '../assets/api';
import useMealPlanner from '../hooks/useMealPlanner';
import UserContext from "../hooks/context";
import { calculateBMR, calculateTDEE } from '../utils/calorieCalculator';
import { calculateMacros } from '../utils/macrosCalculator';
import NutritionChart from '../components/NutritionChart';
import { getUserDetails } from "../services/userService.js";
import Footer from "../components/Footer.js";

const intoleranceOptions = [
  { label: "Dairy", value: "dairy" },
  { label: "Egg", value: "egg" },
  { label: "Gluten", value: "gluten" },
  { label: "Grain", value: "grain" },
  { label: "Peanut", value: "peanut" },
  { label: "Seafood", value: "seafood" },
  { label: "Sesame", value: "sesame" },
  { label: "Shellfish", value: "shellfish" },
  { label: "Soy", value: "soy" },
  { label: "Sulfite", value: "sulfite" },
  { label: "Tree Nut", value: "tree nut" },
  { label: "Wheat", value: "wheat" }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function MealPlanningApp() {
  const { currentloggedInUser } = useContext(UserContext);

  const { mealPlan, clearMealPlan, saveMealPlan } = useMealPlanner();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedDayNutrition, setSelectedDayNutrition] = useState(null);
  const [mealPlanData, setMealPlanData] = useState(mealPlan);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState(mealPlan);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [tdee, setTDEE] = useState(0);
  const [macros, setMacros] = useState({ protein: 10, carbs: 10, fat: 1 }); // Default macro values for a meal
  const [dietPreferences, setDietPreferences] = useState("");
  const [intolerances, setIntolerances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Redirect to signup if no user is logged in
  useEffect(() => {
    if (!currentloggedInUser) {
        navigate("/signin");
    }
  }, [currentloggedInUser, navigate]);

  useEffect(() => {
    async function fetchDetails() {
      if (currentloggedInUser && currentloggedInUser.userId) {
        try {
          const userDetails = await getUserDetails(currentloggedInUser.userId);
          if (userDetails) {
            const { weight, height, age, gender, activityLevel, healthGoals, dietaryPreferences } = userDetails.data;
            const bmr = calculateBMR(weight, height, age, gender);
            const tdee = calculateTDEE(bmr, activityLevel);
            const macrosData = calculateMacros(tdee, healthGoals);
            setDailyCalories(bmr); // Optionally show BMR
            setTDEE(tdee);
            setMacros(macrosData);
            setDietPreferences(dietaryPreferences);
            console.log("Macros:", macrosData);
            console.log("Dietary Preferences:", dietaryPreferences);
            console.log("Meal PLAN:", selectedMeals)
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      }
    }
    fetchDetails();
    saveMealPlan(mealPlanData);
    
    // Initialize nutrition data for the selected day if meal plan exists
    if (mealPlanData && mealPlanData[selectedDay] && mealPlanData[selectedDay].nutrients) {
      setSelectedDayNutrition(mealPlanData[selectedDay].nutrients);
    }
  }, [mealPlanData, currentloggedInUser, selectedDay]);

  const handleMealSearch = async (query) => {
    setLoading(true);
    try {
      if (macros) {
        const intoleranceString = intolerances.join(',');
        const results = await fetchMeals(query, dietPreferences, intoleranceString, macros);
        setMeals(results);
      } else {
        console.log("Macros are not defined yet.");
      }
    } catch (err) {
      console.error("Error while fetching meals: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to normalize nutrition information
  const normalizeNutritionData = (nutritionData) => {
    if (nutritionData.nutrients && Array.isArray(nutritionData.nutrients)) {
      // This is the format from the fetchMeals response
      return nutritionData.nutrients.reduce((acc, nutrient) => {
        acc[nutrient.name.toLowerCase()] = nutrient.amount;
        return acc;
      }, {});
    } else if (typeof nutritionData === 'object') {
      // This is the format from the generateMealPlan response
      return {
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        fat: nutritionData.fat,
        carbohydrates: nutritionData.carbohydrates
      };
    } else {
      // If the data is in an unknown format, return a default
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0
      };
    }
  };

  const handleAddMeal = (mealToAdd) => {
    // Normalize the nutritional information
    const nutritionNormalized = normalizeNutritionData(mealToAdd.nutrition);
  
    // Update the meal plan for the selected day
    const updatedMealPlanData = { ...mealPlanData };
    const selectedDayMeals = updatedMealPlanData[selectedDay]?.meals || [];
    updatedMealPlanData[selectedDay] = {
      ...updatedMealPlanData[selectedDay],
      meals: [...selectedDayMeals, mealToAdd],
    };
  
    // Update the nutritional information for the selected day
    const selectedDayNutrients = updatedMealPlanData[selectedDay]?.nutrients || {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
    };
    updatedMealPlanData[selectedDay].nutrients = {
      calories: selectedDayNutrients.calories + (nutritionNormalized.calories || 0),
      protein: selectedDayNutrients.protein + (nutritionNormalized.protein || 0),
      fat: selectedDayNutrients.fat + (nutritionNormalized.fat || 0),
      carbohydrates: selectedDayNutrients.carbohydrates + (nutritionNormalized.carbohydrates || 0),
    };
  
    // Update states with new data
    setMealPlanData(updatedMealPlanData);
    setSelectedDayNutrition(updatedMealPlanData[selectedDay].nutrients);
  
    // Update selected meals for the day and save to local storage using the hook
    setSelectedMeals((prevSelectedMeals) => ({
      ...prevSelectedMeals,
      [selectedDay]: updatedMealPlanData[selectedDay].meals,
    }));
    saveMealPlan(updatedMealPlanData);
  };

  const handleChangeIntolerance = (event) => {
    const selectedOptions = Array.from(event.target.options)
                                  .filter(option => option.selected)
                                  .map(option => option.value);
    setIntolerances(selectedOptions);
  };

  const handleGenerateMealPlan = async () => {
    // Logic to generate meal plan
    try {
      setLoading(true);
      const generatedPlan = await generateMealPlan({
        timeFrame: 'week', // or 'day'
        targetCalories: tdee.toFixed(0), // your Total Daily Energy Expenditure variable
        diet: dietPreferences,
        exclude: intolerances.join(',')
      });
      setMealPlanData(generatedPlan.week); // Here we set the data for the week
      saveMealPlan(generatedPlan); // Save the generated plan using the hook

      // Set the nutrition for the default selected day (e.g., 'monday')
      setSelectedDayNutrition(generatedPlan.week[selectedDay].nutrients);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearMealPlan = () => {
    clearMealPlan(); // Clear meal plan using the hook
    setMealPlanData({}); // Clear local state reflecting the meal plan
    setSelectedMeals({}); // Clear selected meals state
    setSelectedDayNutrition(null); // Clear nutritional info display
  };
  
  const handleSaveMealPlan = () => {
    saveMealPlan(mealPlan); // Save the meal plan using the hook
  };

  const handleDaySelection = (day) => {
    setSelectedDay(day.toLowerCase());
    // When a day is selected, also set the selected day's nutritional data
    if (mealPlanData && mealPlanData[day.toLowerCase()]) {
      setSelectedDayNutrition(mealPlanData[day.toLowerCase()].nutrients);
    }
  };

  const handleRemoveMeal = (mealToRemove) => {
    const updatedMealPlanData = { ...mealPlanData };
    const selectedDayMeals = updatedMealPlanData[selectedDay]?.meals || [];
    const originalMealsCount = selectedDayMeals.length;
    
    // Find and remove the meal
    const updatedMeals = selectedDayMeals.filter(meal => meal.id !== mealToRemove.id);
    updatedMealPlanData[selectedDay] = {
      ...updatedMealPlanData[selectedDay],
      meals: updatedMeals,
    };

    // Handle nutrition data based on whether individual meals have nutrition info
    let updatedNutrition;
    const currentDayNutrition = updatedMealPlanData[selectedDay]?.nutrients || { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    
    // Check if any remaining meals have nutrition data
    const mealsWithNutrition = updatedMeals.some(meal => meal.nutrition);
    
    if (mealsWithNutrition) {
      // If meals have nutrition data, recalculate from remaining meals
      updatedNutrition = updatedMeals.reduce((acc, meal) => {
        let mealNutrition;
        
        if (meal.nutrition) {
          if (meal.nutrition.nutrients && Array.isArray(meal.nutrition.nutrients)) {
            mealNutrition = normalizeNutritionData(meal.nutrition);
          } else if (typeof meal.nutrition === 'object' && meal.nutrition.calories !== undefined) {
            mealNutrition = meal.nutrition;
          } else {
            mealNutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
          }
        } else {
          mealNutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
        }
        
        return {
          calories: acc.calories + (parseFloat(mealNutrition.calories) || 0),
          protein: acc.protein + (parseFloat(mealNutrition.protein) || 0),
          fat: acc.fat + (parseFloat(mealNutrition.fat) || 0),
          carbohydrates: acc.carbohydrates + (parseFloat(mealNutrition.carbohydrates) || 0),
        };
      }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
    } else {
      // If meals don't have nutrition data, estimate based on proportion
      const remainingMealsCount = updatedMeals.length;
      if (remainingMealsCount > 0 && originalMealsCount > 0) {
        const nutritionRatio = remainingMealsCount / originalMealsCount;
        updatedNutrition = {
          calories: currentDayNutrition.calories * nutritionRatio,
          protein: currentDayNutrition.protein * nutritionRatio,
          fat: currentDayNutrition.fat * nutritionRatio,
          carbohydrates: currentDayNutrition.carbohydrates * nutritionRatio,
        };
      } else {
        // No meals left
        updatedNutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
      }
    }

    updatedMealPlanData[selectedDay].nutrients = updatedNutrition;

    // Update states
    setMealPlanData(updatedMealPlanData);
    setSelectedDayNutrition(updatedNutrition);
    setSelectedMeals((prevSelectedMeals) => ({
      ...prevSelectedMeals,
      [selectedDay]: updatedMeals,
    }));
    saveMealPlan(updatedMealPlanData);
  };

  // Helper function to render meals for a day
  const renderMealsForDay = (day) => {
    if (!mealPlanData || !mealPlanData[day.toLowerCase()]) {
      return <p>No meals planned for {day}.</p>;
    }
    return mealPlanData[day.toLowerCase()].meals.map((meal) => (
      <MealCard key={meal.id} meal={meal} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-orange-50">
      <Navigator />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-6xl font-bold text-center text-primary mb-4">🍽️ Personal Meal Planner</h1>
          <p className="text-lg text-center text-gray-700 mb-8">Create customized meal plans based on your health goals and dietary preferences</p>
          
          {/* User Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{dailyCalories.toFixed(0)}</div>
              <div className="text-gray-600">BMR (kcal/day)</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{tdee.toFixed(0)}</div>
              <div className="text-gray-600">TDEE (kcal/day)</div>
            </div>
            {macros && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-primary mb-2 text-center">Daily Macros Target</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>🥩 Protein:</span>
                    <span className="font-bold">{macros.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍞 Carbs:</span>
                    <span className="font-bold">{macros.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥑 Fat:</span>
                    <span className="font-bold">{macros.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">🎯 Customize Your Plan</h2>
            
            {/* Dietary Restrictions */}
            <div className="mb-6">
              <label htmlFor="intolerances" className="block text-lg font-semibold text-gray-700 mb-2">
                🚫 Dietary Restrictions & Allergies
              </label>
              <p className="text-sm text-gray-500 mb-2">Hold Ctrl/Cmd to select multiple items</p>
              <select 
                multiple 
                id="intolerances" 
                name="intolerances" 
                value={intolerances} 
                onChange={handleChangeIntolerance} 
                className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-primary focus:outline-none bg-orange-50 text-primary"
                size="4"
              >
                {intoleranceOptions.map(option => (
                  <option key={option.value} value={option.value} className="p-2">{option.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGenerateMealPlan} 
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                {loading ? "🔄 Generating..." : "✨ Generate Meal Plan"}
              </button>
              <button 
                onClick={handleClearMealPlan}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                🗑️ Clear All
              </button>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Meal Plan Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">📅 Your Weekly Meal Plan</h2>
          
          {/* Day Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelection(day)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedDay === day.toLowerCase() 
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Selected Day Content */}
          {mealPlanData && mealPlanData[selectedDay.toLowerCase()] ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Meals for Selected Day */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  🍽️ Meals for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mealPlanData[selectedDay.toLowerCase()].meals.map((meal, index) => (
                    <MealCard 
                      key={`${meal.id}-${index}`} 
                      meal={meal} 
                      showNutrition={true} 
                      removable={true}
                      onRemove={handleRemoveMeal}
                    />
                  ))}
                </div>
              </div>

              {/* Nutrition Chart */}
              {selectedDayNutrition && (
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-b from-orange-50 to-yellow-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-primary mb-4 text-center">📊 Daily Nutrition</h3>
                    <NutritionChart nutritionData={selectedDayNutrition} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* No Meals - Full Width Centered */
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                🍽️ Meals for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
              </h3>
              <p className="text-gray-500 text-xl mb-2">No meals planned for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</p>
              <p className="text-gray-400 text-lg">Generate a meal plan or search for recipes to add meals</p>
            </div>
          )}
        </div>
      </div>
      {/* Save Meal Plan Section */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="text-center">
          <button 
            onClick={handleSaveMealPlan}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            💾 Save Meal Plan
          </button>
        </div>
      </div>

      {/* Recipe Search Section */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-4xl font-bold text-primary mb-4 text-center">🔍 Discover New Recipes</h2>
            <p className="text-gray-600 text-center mb-8">Search for recipes and add them directly to your selected day's meal plan</p>
            
            {/* Search Box */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md">
                <MealSearch onSearch={handleMealSearch} loading={loading} />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-primary">Searching for delicious recipes...</p>
              </div>
            )}

            {/* Search Results */}
            {!loading && meals.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">
                  🍳 Found {meals.length} Recipe{meals.length !== 1 ? 's' : ''}
                </h3>
                <MealList meals={meals} onAdd={handleAddMeal} selectedDay={selectedDay} />
              </div>
            )}

            {/* No Results State */}
            {!loading && meals.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">Search for recipes to get started</p>
                <p className="text-gray-400">Try searching for "chicken", "vegetarian", or "breakfast"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MealPlanningApp;
