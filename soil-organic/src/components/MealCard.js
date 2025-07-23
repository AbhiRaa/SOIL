import React from 'react';

/**
 * Enhanced MealCard component with premium dark theme design.
 * Features glass morphism, improved interactivity, and consistent styling
 * with the MealPlanningApp's dark aesthetic.
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
        <div className="group bg-gray-800/90 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-102 hover:shadow-xl hover:bg-gray-800 hover:border-gray-600">
            {/* Image Section */}
            <div className="relative overflow-hidden">
                {meal.id && meal.imageType ? (
                    <img 
                        src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`}
                        alt={meal.title}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : null}
                <div 
                    className="w-full h-32 bg-gray-900 flex items-center justify-center"
                    style={{ display: meal.id && meal.imageType ? 'none' : 'flex' }}
                >
                    <div className="text-center">
                        <div className="text-4xl mb-2">🍽️</div>
                        <p className="text-gray-500">Image not available</p>
                    </div>
                </div>
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Remove Button (if removable) */}
                {removable && onRemove && (
                    <button
                        onClick={() => onRemove(meal)}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="Remove meal"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Quick Info Badge */}
                {meal.readyInMinutes && (
                    <div className="absolute bottom-2 left-2 bg-gray-900/90 text-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                        ⏱️ {meal.readyInMinutes} min
                    </div>
                )}
                
                {/* Difficulty Badge */}
                {meal.spoonacularScore && (
                    <div className="absolute top-2 left-2 bg-green-600/90 text-white px-2 py-1 rounded-md text-xs font-bold">
                        ⭐ {Math.round(meal.spoonacularScore/10)}/10
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h4 className="font-bold text-base text-gray-100 group-hover:text-green-400 mb-2 line-clamp-2 leading-tight transition-colors duration-200">
                    {meal.title}
                </h4>

                {/* Quick Stats */}
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                    {meal.servings && (
                        <div className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-md">
                            <span>👥</span>
                            <span className="font-medium">{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                    {nutrition?.calories && (
                        <div className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-md">
                            <span>🔥</span>
                            <span className="font-medium">{Math.round(nutrition.calories)} cal</span>
                        </div>
                    )}
                </div>

                {/* Nutrition Details (if enabled) */}
                {showNutrition && nutrition && (
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 mb-3">
                        <h5 className="text-green-400 font-semibold text-xs mb-2 text-center">Nutrition Info</h5>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            {nutrition.protein && (
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto mb-1 bg-blue-600/30 rounded-full flex items-center justify-center">
                                        <span className="text-blue-300 text-base">🥩</span>
                                    </div>
                                    <div className="font-bold text-blue-300">{Math.round(nutrition.protein)}g</div>
                                    <div className="text-gray-500 text-xs">Protein</div>
                                </div>
                            )}
                            {nutrition.carbohydrates && (
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto mb-1 bg-yellow-600/30 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-300 text-base">🍞</span>
                                    </div>
                                    <div className="font-bold text-yellow-300">{Math.round(nutrition.carbohydrates)}g</div>
                                    <div className="text-gray-500 text-xs">Carbs</div>
                                </div>
                            )}
                            {nutrition.fat && (
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto mb-1 bg-red-600/30 rounded-full flex items-center justify-center">
                                        <span className="text-red-300 text-base">🥑</span>
                                    </div>
                                    <div className="font-bold text-red-300">{Math.round(nutrition.fat)}g</div>
                                    <div className="text-gray-500 text-xs">Fat</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-700 space-y-2">
                    {meal.sourceUrl && (
                        <a 
                            href={meal.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-102 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>📝</span>
                            <span>View Full Recipe</span>
                        </a>
                    )}
                    
                    {/* Additional Info Row */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        {meal.healthScore && (
                            <span className="flex items-center gap-1">
                                <span>💚</span>
                                <span>Health: {meal.healthScore}%</span>
                            </span>
                        )}
                        {meal.pricePerServing && (
                            <span className="flex items-center gap-1">
                                <span>💰</span>
                                <span>${(meal.pricePerServing/100).toFixed(2)}/serving</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MealCard;