/**
 * REFERENCE: https://www.omnicalculator.com/health/bmr-harris-benedict-equation
 * Calculate Basal Metabolic Rate (BMR) using the Harris-Benedict equation
 * @param {number} weight - Body weight in kilograms
 * @param {number} height - Height in centimeters
 * @param {number} age - Age in years
 * @param {string} gender - Gender 'male' or 'female'
 * @returns {number} - Estimated BMR
 */
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
      return 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
    } else {
      return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    }
  }
  
  /**
   * Calculate Total Daily Energy Expenditure (TDEE) based on activity level
   * @param {number} bmr - Basal Metabolic Rate
   * @param {string} activityLevel - Activity level ('sedentary', 'lightly active', 'moderately active', 'very active', 'super active')
   * @returns {number} - Adjusted caloric needs based on activity level
   */
  function calculateTDEE(bmr, activityLevel) {
    const activityFactors = {
      'sedentary': 1.2, // Sedentary (little or no exercise): BMR times 1.2
      'lightly active': 1.375, // Lightly active (light exercise/sports 1-3 days/week): BMR times 1.375
      'moderately active': 1.55, // Moderately active (moderate exercise/sports 3-5 days/week): BMR times 1.55
      'very active': 1.725, // Very active (hard exercise/sports 6-7 days a week): BMR times 1.725
      'super active': 1.9 // Super active (very hard exercise/physical job & exercise 2x/day): BMR times 1.9
    };
    
    return bmr * (activityFactors[activityLevel] || 1.2); // Default to sedentary if unspecified
  }
  
  export { calculateBMR, calculateTDEE };
  