import React from 'react';

/**
 * MealList component that displays a list of meal cards.
 * Each card shows detailed information about the meal including its nutritional content and provides an
 * option to add the meal to a meal plan.
 *
 * @param {Object[]} meals - Array of meal objects to display.
 * @param {Function} onAdd - Callback function to handle adding a meal to the meal plan.
 */
function MealList({ meals, onAdd }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {meals.map((meal) => (
            <div key={meal.id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-orange-100">
              <img className="w-full" src={meal.image} alt={meal.title} />
              <div className="px-6 py-4">
                <div className="font-bold text-orange-600 text-xl mb-2">{meal.title}</div>
                <ul className='text-orange-600'>
                  <li>Calories: {meal.nutrition.nutrients.find(n => n.name === "Calories").amount.toFixed(2)} kcal</li>
                  <li>Protein: {meal.nutrition.nutrients.find(n => n.name === "Protein").amount.toFixed(2)} g</li>
                  <li>Fat: {meal.nutrition.nutrients.find(n => n.name === "Fat").amount.toFixed(2)} g</li>
                  <li>Carbohydrates: {meal.nutrition.nutrients.find(n => n.name === "Carbohydrates").amount.toFixed(2)} g</li>
                </ul>
              </div>
              <div className="px-6 pt-4 pb-2">
                <button 
                  onClick={() => onAdd(meal)}
                  className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add to Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    };

export default MealList;
