import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import MealSearch from '../components/MealSearch';
import MealList from '../components/MealList';
import MealCard from '../components/MealCard';
import { fetchMeals, generateMealPlan } from '../assets/api';
import useMealPlanner from '../hooks/useMealPlanner';
import UserContext from "../hooks/context";
import { findUser } from "../data/users";
import { calculateBMR, calculateTDEE } from '../utils/calorieCalculator';
import { calculateMacros } from '../utils/macrosCalculator';
import NutritionChart from '../components/NutritionChart';

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
    if (currentloggedInUser) {
      const userDetails = findUser(currentloggedInUser);
      if (userDetails && userDetails.profile) {
        const { weight, height, age, gender, activityLevel, healthGoals, dietaryPreferences } = userDetails.profile;
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
    }
    saveMealPlan(mealPlanData);
  }, [mealPlanData, currentloggedInUser]);

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
    <div className="bg-cyan-50">
      <Navigator />
      <div className="max-w-full mx-auto mt-6 p-6 bg-orange-50 border-t-2 shadow-md">
        <h2 className="text-5xl font-semibold mb-4 text-primary flex justify-center">Meal Planner</h2>
        <div className="flex gap-5 justify-evenly mt-4 p-4">
        <h2 className="text-2xl font-bold mb-4 text-primary">Daily Calorie Target: {dailyCalories.toFixed(0)} kcal (BMR)</h2>
        <h2 className="text-2xl font-bold mb-4 text-primary">Total Daily Energy Expenditure: {tdee.toFixed(0)} kcal</h2>
        {macros && ( 
          <div className="text-2xl mb-2 text-primary font-bold">
            <h2 className="mb-2">Macronutrients Target according to Health Goals:</h2>
            <ul className="text-primary text-lg font-bold">
              <li>Protein: {macros.protein} grams</li>
              <li>Carbs: {macros.carbs} grams</li>
              <li>Fat: {macros.fat} grams</li>
            </ul>
          </div>
        )}

        <div className="flex-col gap-4">
          {/* Multi-select dropdown for dietary restrictions */}
          <div className="w-full flex-col gap-3">
            <label htmlFor="intolerances" className="block text-2xl font-bold text-primary  mb-1">Select Dietary Restrictions:</label>
            <p className="text-primary text-sm">*press Ctrl for multiple selections</p>
            <select multiple id="intolerances" name="intolerances" value={intolerances} onChange={handleChangeIntolerance} className="form-multiselect bg-orange-50 block w-full mt-1 pl-3 pr-10 py-2 text-primary text-xl border-gray-300 focus:outline-none focus:ring-primary focus:border-primary  rounded-md">
              {intoleranceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

        {/* Generate and Clear Meal Plan Buttons */}
        <div className="flex gap-4 mt-4 ">
          <button onClick={handleGenerateMealPlan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Meal Plan</button>
          {loading && <p>Loading meals...</p>}
          {error && <p>Error: {error}</p>}
          <button onClick={handleClearMealPlan} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Clear Meal Plan</button>
        </div>
        </div>

        </div>

        {/* Meal Plan and Nutrition Chart for the Selected Day */}
        <div className="md:flex   mt-6 border-t-2 justify-around border-primary">
          <div className="w-full lg:w-1/2 m-4">
            {/* Weekly Menu Navigation */}
            <div className="flex gap-4 justify-between">
            <div className="flex flex-wrap gap-2 space-x-4 overflow-auto">
            {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => handleDaySelection(day)}
              className={`py-2 px-4 active:bg-primary rounded-md ${selectedDay === day.toLowerCase() ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {day}
            </button>
          ))}
          </div>
            
          </div>
            <h3 className="font-bold text-3xl mt-5 mb-5 text-primary">Your Meal Plan for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</h3>
             {/* Render meals for the selected day */}
            <div className="flex flex-wrap justify-center gap-5 mx-2">
              {renderMealsForDay(selectedDay)}
            </div>
          </div>
          {/* Conditionally render the NutritionChart component if nutritional data is available */}
        {selectedDayNutrition && (
          <div className="w-full border-l-2 border-sm border-primary p-2 lg:w-1/3 mt-4 lg:mt-0 lg:ml-4">
            <h1 className="text-5xl text-center mb-6 text-primary"> Your Daily Macros</h1>
            <NutritionChart nutritionData={selectedDayNutrition} />
          </div>
        )}
        </div>
        {/* Meal Plan Generation and Dietary Restrictions */}
        {/* Save Meal Plan Button */}
            <div className="mt-8 flex justify-center">
              <button onClick={handleSaveMealPlan} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Meal Plan</button>
            </div>
        <div className="mt-5 flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-5xl mt-5 text-primary text-bold">Find Your Favourite Recipes</h1>
            <p className="text-sm text-primary">*enter any recipe you desire in the search bar</p>
            </div>
            <div className="searchbox">
            <MealSearch onSearch={handleMealSearch} />  
            </div>
          </div>
        {loading && <p>Loading meals...</p>}
        {error && <p>Error: {error}</p>}
        <MealList meals={meals} onAdd={handleAddMeal} />
        {/* <MealPlanner selectedMeals={selectedMeals} onRemove={handleRemoveMeal} /> */}
        </div>
      </div>
    </div>
  );
}

export default MealPlanningApp;
