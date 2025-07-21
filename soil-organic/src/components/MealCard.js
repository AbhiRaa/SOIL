import React, { useState } from 'react';

/**
 * Enhanced MealCard component with improved interactivity and visual appeal.
 * Features nutrition info, loading states, and better responsive design.
 * 
 * @param {object} meal - An object containing meal details
 * @param {boolean} showNutrition - Whether to show detailed nutrition information
 * @param {Function} onRemove - Optional function to remove meal from plan
 * @param {boolean} removable - Whether the meal can be removed
 */
const MealCard = ({ meal, showNutrition = false, onRemove, removable = false }) => {

    // Extract nutrition data if available
    const nutrition = meal.nutrition ? (
        meal.nutrition.nutrients ? meal.nutrition.nutrients.reduce((acc, nutrient) => {
            acc[nutrient.name.toLowerCase()] = nutrient.amount;
            return acc;
        }, {}) : meal.nutrition
    ) : null;


    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-orange-100">
            {/* Image Section */}
            <div className="relative">
                <img 
                    src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`}
                    alt={meal.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/f97316/ffffff?text=No+Image';
                    }}
                    className="w-full h-48 object-cover"
                />
                
                {/* Remove Button (if removable) */}
                {removable && onRemove && (
                    <button
                        onClick={() => onRemove(meal)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition-all duration-200 transform hover:scale-110"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Quick Info Badge */}
                {meal.readyInMinutes && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                        ⏱️ {meal.readyInMinutes} min
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {meal.title}
                </h4>

                {/* Quick Stats */}
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                    {meal.servings && (
                        <span className="flex items-center gap-1">
                            👥 {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                        </span>
                    )}
                    {nutrition?.calories && (
                        <span className="flex items-center gap-1">
                            🔥 {Math.round(nutrition.calories)} cal
                        </span>
                    )}
                </div>

                {/* Nutrition Details (if enabled) */}
                {showNutrition && nutrition && (
                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {nutrition.protein && (
                                <div className="text-center">
                                    <div className="font-bold text-blue-600">{Math.round(nutrition.protein)}g</div>
                                    <div className="text-gray-600">Protein</div>
                                </div>
                            )}
                            {nutrition.carbohydrates && (
                                <div className="text-center">
                                    <div className="font-bold text-yellow-600">{Math.round(nutrition.carbohydrates)}g</div>
                                    <div className="text-gray-600">Carbs</div>
                                </div>
                            )}
                            {nutrition.fat && (
                                <div className="text-center">
                                    <div className="font-bold text-red-600">{Math.round(nutrition.fat)}g</div>
                                    <div className="text-gray-600">Fat</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {meal.sourceUrl && (
                        <a 
                            href={meal.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm"
                        >
                            📝 Recipe
                        </a>
                    )}
                    
                    {/* Remove Button */}
                    {removable && onRemove && (
                        <button
                            onClick={() => onRemove(meal)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
  export default MealCard;