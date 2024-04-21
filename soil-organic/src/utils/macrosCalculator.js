/** To provide personalized nutritional targets based on health goals, we can create a utility function that adjusts macronutrient ranges
  (carbs, proteins, and fats) according to the user's health goals, such as weight loss, muscle gain, or overall health improvement.
  This can guide the API requests to fetch meals that match these specific nutritional parameters.
  For simplicity, the ranges are presented as percentages of total calorie intake:
    1. Weight Loss: Higher protein to preserve muscle mass, moderate fat, lower carbohydrate.
    2. Muscle Gain: Higher protein to support muscle synthesis, balanced carbs for energy, moderate fat.
    3. Overall Health: Balanced approach with equal emphasis on all macronutrients.
*/
function calculateMacros(tdee, healthGoals) {
    let proteinPercentage, fatPercentage, carbPercentage;

    if (healthGoals.includes('weight loss') && healthGoals.includes('muscle gain')) {
        // High protein for muscle gain and moderated carb and fat for weight control
        proteinPercentage = 0.35;  // Increase protein percentage
        fatPercentage = 0.25;
        carbPercentage = 0.40;
    } else if (healthGoals.includes('weight loss') && healthGoals.includes('overall health improvement')) {
        // Balanced approach with focus on nutrient density
        proteinPercentage = 0.30;
        fatPercentage = 0.30;  // Higher fat for nutrient absorption
        carbPercentage = 0.40;
    } else if (healthGoals.includes('muscle gain') && healthGoals.includes('overall health improvement')) {
        // Focus on caloric surplus with balanced macros
        proteinPercentage = 0.25;
        fatPercentage = 0.25;
        carbPercentage = 0.50;  // More carbs for energy
    } else if (healthGoals.includes('weight loss')) {
        // Increased focus on reducing caloric intake and maintaining a balanced diet
        proteinPercentage = 0.30;
        fatPercentage = 0.30;
        carbPercentage = 0.40;
    } else if (healthGoals.includes('muscle gain')) {
        // Higher protein for muscle synthesis, moderate fat, and higher carbs for energy
        proteinPercentage = 0.35;
        fatPercentage = 0.20;
        carbPercentage = 0.45;
    } else if (healthGoals.includes('overall health improvement')) {
        // Balanced macro distribution to support overall health and well-being
        proteinPercentage = 0.25;
        fatPercentage = 0.35;
        carbPercentage = 0.40;
    } else if (healthGoals.length === 3) {
        // Trying to balance all three goals
        proteinPercentage = 0.30;
        fatPercentage = 0.30;
        carbPercentage = 0.40;
    } else {
        // Default case, potentially for individual goals or unspecified combinations
        proteinPercentage = 0.30; // Default protein
        fatPercentage = 0.30; // Default fat
        carbPercentage = 0.40; // Default carbs
    }

    // Calculate grams of each macronutrient
    let proteinGrams = (tdee * proteinPercentage) / 4; // 4 calories per gram of protein
    let fatGrams = (tdee * fatPercentage) / 9; // 9 calories per gram of fat
    let carbGrams = (tdee * carbPercentage) / 4; // 4 calories per gram of carbohydrates

    return {
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carbs: Math.round(carbGrams)
    };
}

export { calculateMacros };
