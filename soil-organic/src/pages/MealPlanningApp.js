import Navigator from "../components/NavigationBar";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import MealSearch from '../components/MealSearch';
import MealList from '../components/MealList';
import MealCard from '../components/MealCard';
import { fetchMeals, generateMealPlan, fetchBulkRecipeInformation } from '../assets/api';
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

const defaultMealSections = [
  { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', icon: '🌙' }
];

function MealPlanningApp() {
  const { currentloggedInUser } = useContext(UserContext);

  const { mealPlan, clearMealPlan, saveMealPlan } = useMealPlanner();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedDayNutrition, setSelectedDayNutrition] = useState(null);
  const [mealPlanData, setMealPlanData] = useState(mealPlan);
  const [meals, setMeals] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [tdee, setTDEE] = useState(0);
  const [macros, setMacros] = useState({ protein: 10, carbs: 10, fat: 1 }); // Default macro values for a meal
  const [dietPreferences, setDietPreferences] = useState("");
  const [intolerances, setIntolerances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealSections, setMealSections] = useState(defaultMealSections);
  const [daySections, setDaySections] = useState({});
  const [isAddingSectionMode, setIsAddingSectionMode] = useState(false);
  const [draggedMeal, setDraggedMeal] = useState(null);

  const navigate = useNavigate();

  // Initialize daySections from persisted meal plan data
  useEffect(() => {
    if (mealPlan && Object.keys(mealPlan).length > 0) {
      const newDaySections = {};
      
      Object.keys(mealPlan).forEach(day => {
        const dayData = mealPlan[day];
        newDaySections[day] = [];
        
        // Add custom sections
        if (dayData.customSections) {
          newDaySections[day].push(...dayData.customSections);
        }
        
        // Add removed sections markers
        if (dayData.removedSections) {
          dayData.removedSections.forEach(sectionId => {
            newDaySections[day].push({ id: sectionId, removed: true });
          });
        }
      });
      
      setDaySections(newDaySections);
      setMealPlanData(mealPlan);
    }
  }, [mealPlan]);

  // Get sections for the current day (combining default + custom in proper order)
  const getSectionsForDay = (day) => {
    const dayCustomSections = daySections[day] || [];
    
    // Get removed sections for this day
    const removedSectionIds = dayCustomSections
      .filter(s => s.removed)
      .map(s => s.id);
    
    // Filter out removed default sections
    const activeDefaultSections = defaultMealSections.filter(
      s => !removedSectionIds.includes(s.id)
    );
    
    // Get custom sections and separate them by type
    const customSections = dayCustomSections.filter(s => !s.removed);
    const reAddedDefaultSections = [];
    const trueCustomSections = [];
    
    customSections.forEach(section => {
      const isDefaultSection = defaultMealSections.some(ds => ds.id === section.id);
      if (isDefaultSection) {
        reAddedDefaultSections.push(section);
      } else {
        trueCustomSections.push(section);
      }
    });
    
    // Create final ordered list: 
    // 1. Active default sections (not removed)
    // 2. Re-added default sections in proper order (breakfast -> lunch -> dinner)
    // 3. True custom sections at the end
    const orderedReAddedDefaults = ['breakfast', 'lunch', 'dinner']
      .map(id => reAddedDefaultSections.find(s => s.id === id))
      .filter(Boolean);
    
    return [...activeDefaultSections, ...orderedReAddedDefaults, ...trueCustomSections];
  };

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
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      }
    }
    fetchDetails();
    
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
        console.warn("Macros are not defined yet. Cannot perform meal search.");
        setError("Please wait for your profile data to load before searching for meals.");
      }
    } catch (err) {
      console.error("Error while fetching meals: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced utility function to normalize nutrition information with robust debugging
  const normalizeNutritionData = (nutritionData) => {
    // Handle null, undefined, or non-object values
    if (!nutritionData || typeof nutritionData !== 'object') {
      // console.log('🚨 Nutrition data is null/undefined:', nutritionData);
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0
      };
    }

    // Debug: Log the structure we're working with (commented out for production)
    // console.log('🔍 Normalizing nutrition data:', JSON.stringify(nutritionData, null, 2));

    if (nutritionData.nutrients && Array.isArray(nutritionData.nutrients)) {
      // This is the format from fetchMeals response (searched meals)
      // console.log('📊 Processing nutrients array format');
      const normalized = nutritionData.nutrients.reduce((acc, nutrient) => {
        if (nutrient && nutrient.name) {
          const key = nutrient.name.toLowerCase();
          if (key === 'calories') acc.calories = nutrient.amount || 0;
          else if (key === 'protein') acc.protein = nutrient.amount || 0;
          else if (key === 'fat') acc.fat = nutrient.amount || 0;
          else if (key === 'carbohydrates') acc.carbohydrates = nutrient.amount || 0;
        }
        return acc;
      }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
      
      // console.log('✅ Normalized from nutrients array:', normalized);
      return normalized;
    } else if (typeof nutritionData === 'object') {
      // This could be direct values or nested object (generated meal plan format)
      // console.log('📊 Processing object format');
      let normalized = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0
      };
      
      // Check if values are directly accessible
      if ('calories' in nutritionData) normalized.calories = nutritionData.calories || 0;
      if ('protein' in nutritionData) normalized.protein = nutritionData.protein || 0;
      if ('fat' in nutritionData) normalized.fat = nutritionData.fat || 0;
      if ('carbohydrates' in nutritionData) normalized.carbohydrates = nutritionData.carbohydrates || 0;
      
      // Check for alternative nested structures (Spoonacular might use different formats)
      if (nutritionData.caloricBreakdown && normalized.calories === 0) {
        // console.log('📊 Found caloricBreakdown, checking for nested nutrition');
      }
      
      // console.log('✅ Normalized from object format:', normalized);
      return normalized;
    } else {
      // console.log('🚨 Unknown nutrition data format:', typeof nutritionData);
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0
      };
    }
  };

  // Enhanced comprehensive helper function to recalculate nutrition for a specific day
  const recalculateDayNutrition = (dayData) => {
    // console.log('🧮 Recalculating day nutrition for:', dayData);
    
    if (!dayData || !dayData.sections) {
      // console.log('🚨 No day data or sections found');
      return { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    }

    let totalNutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    let mealsProcessed = 0;
    
    // Sum nutrition from all meals in all sections
    Object.entries(dayData.sections).forEach(([sectionId, sectionMeals]) => {
      // console.log(`📋 Processing section "${sectionId}" with ${sectionMeals ? sectionMeals.length : 0} meals`);
      
      if (Array.isArray(sectionMeals)) {
        sectionMeals.forEach((meal, index) => {
          // console.log(`🍽️ Processing meal ${index + 1} in ${sectionId}:`, meal.title || 'Unknown meal');
          
          if (meal && meal.nutrition) {
            try {
              const nutritionNormalized = normalizeNutritionData(meal.nutrition);
              
              // console.log(`➕ Adding nutrition:`, nutritionNormalized);
              
              totalNutrition.calories += Math.round((nutritionNormalized.calories || 0) * 100) / 100;
              totalNutrition.protein += Math.round((nutritionNormalized.protein || 0) * 100) / 100;
              totalNutrition.fat += Math.round((nutritionNormalized.fat || 0) * 100) / 100;
              totalNutrition.carbohydrates += Math.round((nutritionNormalized.carbohydrates || 0) * 100) / 100;
              
              mealsProcessed++;
            } catch (error) {
              console.warn('❌ Error processing nutrition for meal:', meal.title || 'Unknown meal', error);
            }
          } else {
            // console.warn('⚠️ Meal has no nutrition data:', meal.title || 'Unknown meal');
          }
        });
      }
    });

    // Round final totals to 2 decimal places for accuracy
    const finalNutrition = {
      calories: Math.round(totalNutrition.calories * 100) / 100,
      protein: Math.round(totalNutrition.protein * 100) / 100,
      fat: Math.round(totalNutrition.fat * 100) / 100,
      carbohydrates: Math.round(totalNutrition.carbohydrates * 100) / 100
    };
    
    // console.log(`✅ Day nutrition calculation complete! Processed ${mealsProcessed} meals. Final totals:`, finalNutrition);
    return finalNutrition;
  };

  const handleAddMeal = (mealToAdd, targetSection = 'breakfast') => {
    // Update the meal plan for the selected day with sections
    const updatedMealPlanData = { ...mealPlanData };
    const selectedDayData = updatedMealPlanData[selectedDay] || { sections: {}, nutrients: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 } };
    
    // Initialize sections if they don't exist
    if (!selectedDayData.sections) {
      selectedDayData.sections = {};
    }
    
    // Add meal to the target section with unique mealId
    const sectionMeals = selectedDayData.sections[targetSection] || [];
    const uniqueMealId = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    selectedDayData.sections[targetSection] = [...sectionMeals, { ...mealToAdd, mealId: uniqueMealId }];
    
    // Recalculate nutrition accurately from all meals in all sections
    selectedDayData.nutrients = recalculateDayNutrition(selectedDayData);
    
    updatedMealPlanData[selectedDay] = selectedDayData;
  
    // Update states with new data
    setMealPlanData(updatedMealPlanData);
    setSelectedDayNutrition(selectedDayData.nutrients);
    saveMealPlan(updatedMealPlanData);
    
    console.log(`Added meal "${mealToAdd.title}" to ${targetSection}. New totals:`, selectedDayData.nutrients);
  };

  const handleChangeIntolerance = (value) => {
    if (intolerances.includes(value)) {
      setIntolerances(intolerances.filter(item => item !== value));
    } else {
      setIntolerances([...intolerances, value]);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, meal, sourceSection) => {
    setDraggedMeal({ meal, sourceSection });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSection) => {
    e.preventDefault();
    if (!draggedMeal) return;

    const { meal, sourceSection } = draggedMeal;
    
    if (sourceSection === targetSection) {
      setDraggedMeal(null);
      return;
    }

    // Move meal from source to target section
    const updatedMealPlanData = { ...mealPlanData };
    const selectedDayData = updatedMealPlanData[selectedDay];
    
    if (!selectedDayData || !selectedDayData.sections) {
      setDraggedMeal(null);
      return;
    }

    // Ensure source section exists
    if (!selectedDayData.sections[sourceSection]) {
      console.warn(`Source section ${sourceSection} not found`);
      setDraggedMeal(null);
      return;
    }

    // Remove from source section
    selectedDayData.sections[sourceSection] = selectedDayData.sections[sourceSection].filter(
      m => m.mealId !== meal.mealId
    );

    // Add to target section
    if (!selectedDayData.sections[targetSection]) {
      selectedDayData.sections[targetSection] = [];
    }
    selectedDayData.sections[targetSection] = [...selectedDayData.sections[targetSection], meal];

    // Recalculate nutrition accurately (drag-drop doesn't change total nutrition, but ensures accuracy)
    selectedDayData.nutrients = recalculateDayNutrition(selectedDayData);

    setMealPlanData(updatedMealPlanData);
    setSelectedDayNutrition(selectedDayData.nutrients);
    saveMealPlan(updatedMealPlanData);
    setDraggedMeal(null);
    
    console.log(`Moved meal "${meal.title}" from ${sourceSection} to ${targetSection}. Totals remain:`, selectedDayData.nutrients);
  };

  // Smart section restoration - Add sections back with proper default order and icons
  const getDefaultSectionDetails = (sectionId) => {
    const defaultSections = {
      'breakfast': { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
      'lunch': { id: 'lunch', name: 'Lunch', icon: '☀️' },
      'dinner': { id: 'dinner', name: 'Dinner', icon: '🌙' }
    };
    return defaultSections[sectionId] || null;
  };
  
  const addSectionInProperOrder = (newSection) => {
    const sectionOrder = ['breakfast', 'lunch', 'dinner'];
    const defaultDetails = getDefaultSectionDetails(newSection.id);
    
    if (defaultDetails) {
      // This is a default section, insert it in proper order
      const currentSections = [...mealSections];
      const orderIndex = sectionOrder.indexOf(newSection.id);
      
      if (orderIndex !== -1) {
        // Find the correct position to insert
        let insertIndex = 0;
        for (let i = 0; i < currentSections.length; i++) {
          const currentOrderIndex = sectionOrder.indexOf(currentSections[i].id);
          if (currentOrderIndex === -1 || currentOrderIndex > orderIndex) {
            break;
          }
          insertIndex = i + 1;
        }
        
        currentSections.splice(insertIndex, 0, defaultDetails);
        setMealSections(currentSections);
        return;
      }
    }
    
    // For custom sections, add at the end
    setMealSections(prev => [...prev, newSection]);
  };

  // Add custom meal section (only to current day)
  const handleAddCustomSection = (sectionName) => {
    const normalizedName = sectionName.toLowerCase().trim();
    
    // Check if it's a default section being re-added (case-insensitive)
    let sectionId, newSection, isDefaultSection;
    
    if (normalizedName === 'breakfast') {
      sectionId = 'breakfast';
      newSection = { id: 'breakfast', name: 'Breakfast', icon: '🌅' };
      isDefaultSection = true;
    } else if (normalizedName === 'lunch') {
      sectionId = 'lunch';
      newSection = { id: 'lunch', name: 'Lunch', icon: '☀️' };
      isDefaultSection = true;
    } else if (normalizedName === 'dinner') {
      sectionId = 'dinner';
      newSection = { id: 'dinner', name: 'Dinner', icon: '🌙' };
      isDefaultSection = true;
    } else {
      // Custom section
      sectionId = normalizedName.replace(/\s+/g, '_');
      newSection = {
        id: sectionId,
        name: sectionName, // Use original case for display
        icon: '🍽️'
      };
      isDefaultSection = false;
    }
    
    // Check if section already exists for this day
    const existingSections = getSectionsForDay(selectedDay);
    const sectionExists = existingSections.some(s => s.id === sectionId);
    
    if (sectionExists) {
      alert(`Section "${newSection.name}" already exists for ${selectedDay}!`);
      setIsAddingSectionMode(false);
      return;
    }
    
    // Add section only to the current day
    setDaySections(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newSection]
    }));
    
    // Initialize empty section in meal plan data and save custom sections
    const updatedMealPlanData = { ...mealPlanData };
    
    // Ensure day exists
    if (!updatedMealPlanData[selectedDay]) {
      updatedMealPlanData[selectedDay] = {
        sections: {},
        nutrients: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
      };
    }
    
    // Initialize sections if needed
    if (!updatedMealPlanData[selectedDay].sections) {
      updatedMealPlanData[selectedDay].sections = {};
    }
    
    // Add the section
    if (!updatedMealPlanData[selectedDay].sections[sectionId]) {
      updatedMealPlanData[selectedDay].sections[sectionId] = [];
    }
    
    // Store custom sections info in meal plan data
    if (!isDefaultSection) {
      // Only store non-default sections in customSections
      if (!updatedMealPlanData[selectedDay].customSections) {
        updatedMealPlanData[selectedDay].customSections = [];
      }
      updatedMealPlanData[selectedDay].customSections.push(newSection);
    } else {
      // For re-added default sections, remove from removedSections list
      if (updatedMealPlanData[selectedDay].removedSections) {
        updatedMealPlanData[selectedDay].removedSections = 
          updatedMealPlanData[selectedDay].removedSections.filter(id => id !== sectionId);
      }
    }
    
    setMealPlanData(updatedMealPlanData);
    saveMealPlan(updatedMealPlanData);
    
    setIsAddingSectionMode(false);
  };

  // Delete meal section from current day only
  const handleDeleteSection = (sectionId) => {
    // Find section details
    const allSections = getSectionsForDay(selectedDay);
    const section = allSections.find(s => s.id === sectionId);
    const sectionName = section?.name || sectionId;
    
    // Handle meals in the section being deleted
    const updatedMealPlanData = { ...mealPlanData };
    let totalMealsRemoved = 0;
    
    // Only affect the currently selected day
    if (updatedMealPlanData[selectedDay] && updatedMealPlanData[selectedDay].sections) {
      // Count meals being removed
      const mealsInSection = updatedMealPlanData[selectedDay].sections[sectionId] || [];
      totalMealsRemoved = mealsInSection.length;
      
      // Remove the section from CURRENT DAY ONLY
      delete updatedMealPlanData[selectedDay].sections[sectionId];
      
      // Recalculate nutrition for CURRENT DAY ONLY
      updatedMealPlanData[selectedDay].nutrients = recalculateDayNutrition(updatedMealPlanData[selectedDay]);
    }

    // Handle custom sections persistence
    const isDefaultSection = defaultMealSections.some(s => s.id === sectionId);
    
    if (!isDefaultSection) {
      // Remove from daySections state
      setDaySections(prev => ({
        ...prev,
        [selectedDay]: (prev[selectedDay] || []).filter(s => s.id !== sectionId)
      }));
      
      // Remove from persisted customSections
      if (updatedMealPlanData[selectedDay]?.customSections) {
        updatedMealPlanData[selectedDay].customSections = 
          updatedMealPlanData[selectedDay].customSections.filter(s => s.id !== sectionId);
      }
    } else {
      // For default sections, mark as removed
      setDaySections(prev => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), { id: sectionId, removed: true }]
      }));
      
      // Store removed default sections in meal plan data
      if (!updatedMealPlanData[selectedDay]) {
        updatedMealPlanData[selectedDay] = {
          sections: {},
          nutrients: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
        };
      }
      if (!updatedMealPlanData[selectedDay].removedSections) {
        updatedMealPlanData[selectedDay].removedSections = [];
      }
      if (!updatedMealPlanData[selectedDay].removedSections.includes(sectionId)) {
        updatedMealPlanData[selectedDay].removedSections.push(sectionId);
      }
    }
    
    // Update meal plan data
    setMealPlanData(updatedMealPlanData);
    saveMealPlan(updatedMealPlanData);
    
    // Update nutrition display
    if (updatedMealPlanData[selectedDay]) {
      setSelectedDayNutrition(updatedMealPlanData[selectedDay].nutrients);
    } else {
      setSelectedDayNutrition({ calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
    }
    
    console.log(`Deleted section "${sectionName}" from ${selectedDay} with ${totalMealsRemoved} meals`);
  };


  const handleGenerateMealPlan = async () => {
    // Logic to generate meal plan
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      const generatedPlan = await generateMealPlan({
        timeFrame: 'week', // or 'day'
        targetCalories: tdee.toFixed(0), // your Total Daily Energy Expenditure variable
        diet: dietPreferences,
        exclude: intolerances.join(',')
      });
      
      if (!generatedPlan || !generatedPlan.week) {
        throw new Error('Failed to generate meal plan. Please try again.');
      }

      // Transform the API response to work with our sections structure
      const transformedPlan = {};
      
      // First, collect all meal IDs from the entire week
      const allMealIds = [];
      Object.values(generatedPlan.week).forEach(dayData => {
        const dayMeals = dayData.meals || [];
        dayMeals.forEach(meal => {
          if (meal.id) allMealIds.push(meal.id);
        });
      });
      
      console.log(`📊 Fetching nutrition data for ${allMealIds.length} meals in bulk...`);
      
      // Fetch nutrition data for ALL meals in one API call
      const mealNutritionData = await fetchBulkRecipeInformation(allMealIds);
      
      // Process each day with the fetched nutrition data
      Object.keys(generatedPlan.week).forEach(day => {
        const dayData = generatedPlan.week[day];
        const dayMeals = dayData.meals || [];
        
        console.log(`🗓️ Processing ${day} with ${dayMeals.length} meals`);
        
        // Distribute meals across available sections (using default sections for generation)
        const sections = {};
        const availableSections = defaultMealSections.map(s => s.id);
        
        dayMeals.forEach((meal, index) => {
          // Use available sections, cycling through them
          const sectionKey = availableSections[index % availableSections.length] || 'breakfast';
          if (!sections[sectionKey]) {
            sections[sectionKey] = [];
          }
          
          // Add unique mealId for drag/drop functionality
          const uniqueMealId = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`;
          
          // Get nutrition data from bulk fetch results
          const detailedMeal = mealNutritionData[meal.id];
          
          if (detailedMeal && detailedMeal.nutrition) {
            // Use detailed meal with nutrition
            sections[sectionKey].push({
              ...meal,
              ...detailedMeal,
              mealId: uniqueMealId,
              nutrition: detailedMeal.nutrition
            });
          } else {
            // Fallback to original meal
            sections[sectionKey].push({
              ...meal,
              mealId: uniqueMealId
            });
          }
        });
        
        // Create day data structure
        const dayDataStructure = {
          sections: sections,
          nutrients: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
        };
        
        // Recalculate nutrition from actual meals with fetched nutrition data
        dayDataStructure.nutrients = recalculateDayNutrition(dayDataStructure);
        
        transformedPlan[day] = dayDataStructure;
      });
      
      // Replace existing meal plan completely
      setMealPlanData(transformedPlan);
      saveMealPlan(transformedPlan);

      // Set the nutrition for the default selected day
      if (transformedPlan[selectedDay]) {
        setSelectedDayNutrition(transformedPlan[selectedDay].nutrients);
      }
      
      console.log('Meal plan generated successfully');
    } catch (error) {
      setError(error.message || 'Failed to generate meal plan. Please try again.');
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearMealPlan = () => {
    // Clear all meal plan related state
    const emptyPlan = {};
    
    clearMealPlan(); // Clear meal plan using the hook
    setMealPlanData(emptyPlan); // Clear local state reflecting the meal plan
    setSelectedDayNutrition(null); // Clear nutritional info display
    
    // Force save the empty plan to local storage
    saveMealPlan(emptyPlan);
    
    console.log('Meal plan cleared successfully');
  };
  
  const handleSaveMealPlan = () => {
    saveMealPlan(mealPlanData); // Save the current meal plan data with sections
  };

  const handleDaySelection = (day) => {
    setSelectedDay(day.toLowerCase());
    // When a day is selected, also set the selected day's nutritional data
    if (mealPlanData && mealPlanData[day.toLowerCase()]) {
      setSelectedDayNutrition(mealPlanData[day.toLowerCase()].nutrients);
    }
  };

  const handleRemoveMeal = (mealToRemove, fromSection) => {
    const updatedMealPlanData = { ...mealPlanData };
    const selectedDayData = updatedMealPlanData[selectedDay];
    
    if (!selectedDayData || !selectedDayData.sections || !selectedDayData.sections[fromSection]) {
      console.warn('Cannot remove meal: invalid day data or section');
      return;
    }

    // Store meal info for logging
    const mealTitle = mealToRemove.title || 'Unknown meal';

    // Remove meal from the specific section
    selectedDayData.sections[fromSection] = selectedDayData.sections[fromSection].filter(
      meal => meal.mealId !== mealToRemove.mealId
    );

    // Recalculate nutrition accurately from all remaining meals in all sections
    selectedDayData.nutrients = recalculateDayNutrition(selectedDayData);

    // Update states
    setMealPlanData(updatedMealPlanData);
    setSelectedDayNutrition(selectedDayData.nutrients);
    saveMealPlan(updatedMealPlanData);
    
    console.log(`Removed meal "${mealTitle}" from ${fromSection}. New totals:`, selectedDayData.nutrients);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>
      
      {/* Navigation */}
      <div className="relative z-[100]">
        <Navigator />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-20 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Personal <span className="text-green-400">Meal Planner</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              Create customized meal plans based on your health goals and dietary preferences
            </p>
          </div>
          
          {/* User Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400">{dailyCalories.toFixed(0)}</div>
              <div className="text-gray-300">BMR (kcal/day)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400">{tdee.toFixed(0)}</div>
              <div className="text-gray-300">TDEE (kcal/day)</div>
            </div>
            {macros && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                <h3 className="font-bold text-green-400 mb-2 text-center">Daily Macros Target</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">🥩 Protein:</span>
                    <span className="font-bold text-white">{macros.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">🍞 Carbs:</span>
                    <span className="font-bold text-white">{macros.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">🥑 Fat:</span>
                    <span className="font-bold text-white">{macros.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Customize Your Plan</h2>
            
            {/* Dietary Restrictions */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-200 mb-4">
                🚫 Dietary Restrictions & Allergies
              </label>
              <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {intoleranceOptions.map(option => (
                  <label 
                    key={option.value} 
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={intolerances.includes(option.value)}
                      onChange={(e) => handleChangeIntolerance(e.target.value)}
                      className="w-5 h-5 text-green-500 bg-gray-800 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className={`text-sm font-medium ${intolerances.includes(option.value) ? 'text-green-400' : 'text-gray-300'}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
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
                <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg flex items-center backdrop-blur-sm">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Meal Plan Section */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">📅 Your Weekly Meal Plan</h2>
          
          {/* Day Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelection(day)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedDay === day.toLowerCase() 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Selected Day Content with Enhanced Layout */}
          <div className="space-y-6">
            {/* Nutrition Chart - Moved to top for better visibility */}
            {selectedDayNutrition && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/50 p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4 text-center flex items-center justify-center gap-2">
                  <span>📊</span>
                  <span>Daily Nutrition Summary - {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
                </h3>
                <NutritionChart nutritionData={selectedDayNutrition} />
              </div>
            )}
            
            {/* Meal Sections Container */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>🍽️</span>
                  <span>Meal Sections</span>
                </h3>
                <button
                  onClick={() => setIsAddingSectionMode(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm shadow-lg"
                >
                  <span>➕</span>
                  <span>Add Section</span>
                </button>
              </div>

              {/* Custom Section Creation */}
              {isAddingSectionMode && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const sectionName = e.target.sectionName.value.trim();
                    if (sectionName) {
                      handleAddCustomSection(sectionName);
                      e.target.reset();
                    }
                  }}>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="sectionName"
                        placeholder="Enter section name (e.g., 'Snacks', 'Evening Tea')"
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        maxLength={20}
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSectionMode(false)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Enhanced Meal Sections Grid Layout */}
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {getSectionsForDay(selectedDay).map(section => {
                  const sectionMeals = mealPlanData?.[selectedDay]?.sections?.[section.id] || [];
                  return (
                    <div
                      key={section.id}
                      className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-5 hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-500/70"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, section.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl bg-gray-600/30 rounded-full p-2 flex items-center justify-center w-12 h-12">
                            {section.icon}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{section.name}</h4>
                            <p className="text-gray-400 text-sm">
                              {sectionMeals.length} meal{sectionMeals.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-400 hover:text-red-300 transition-all duration-200 p-2 hover:bg-red-500/20 rounded-lg group"
                          title={`Delete ${section.name} section`}
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {sectionMeals.length > 0 ? (
                        <div className="space-y-3">
                          {sectionMeals.map((meal, index) => (
                            <div
                              key={meal.mealId || `${meal.id}-${index}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, meal, section.id)}
                              className="cursor-move"
                            >
                              <MealCard 
                                meal={meal} 
                                showNutrition={false}
                                removable={true}
                                onRemove={(mealToRemove) => handleRemoveMeal(mealToRemove, section.id)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-600/40 rounded-lg hover:border-gray-500/60 transition-colors">
                          <div className="text-3xl mb-2">🍽️</div>
                          <p className="text-gray-400 text-sm">Drop meals here or add from search results</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Save Meal Plan Section */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pb-8">
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
      <div className="relative z-20 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">🔍 Discover New Recipes</h2>
            <p className="text-gray-300 text-center mb-8">Search for recipes and add them directly to your selected day's meal plan</p>
            
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
                <p className="mt-2 text-green-400">Searching for delicious recipes...</p>
              </div>
            )}

            {/* Search Results */}
            {!loading && meals.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  🍳 Found {meals.length} Recipe{meals.length !== 1 ? 's' : ''}
                </h3>
                <MealList meals={meals} onAdd={handleAddMeal} selectedDay={selectedDay} mealSections={getSectionsForDay(selectedDay)} />
              </div>
            )}

            {/* No Results State */}
            {!loading && meals.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-300 text-lg">Search for recipes to get started</p>
                <p className="text-gray-400">Try searching for "chicken", "vegetarian", or "breakfast"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-40">
        <Footer/>
      </div>
    </div>
  );
}

export default MealPlanningApp;
