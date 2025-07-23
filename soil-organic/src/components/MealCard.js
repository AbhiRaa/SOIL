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
        <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-white/15 hover:border-white/30">
            {/* Image Section */}
            <div className="relative overflow-hidden">
                <img 
                    src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`}
                    alt={meal.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/374151/9CA3AF?text=No+Image';
                    }}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Remove Button (if removable) */}
                {removable && onRemove && (
                    <button
                        onClick={() => onRemove(meal)}
                        className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white rounded-full p-2 shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="Remove meal"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Quick Info Badge */}
                {meal.readyInMinutes && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⏱️ {meal.readyInMinutes} min
                    </div>
                )}
                
                {/* Difficulty Badge */}
                {meal.spoonacularScore && (
                    <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ {Math.round(meal.spoonacularScore/10)}/10
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h4 className="font-bold text-lg text-white group-hover:text-green-300 mb-3 line-clamp-2 leading-tight transition-colors duration-300">
                    {meal.title}
                </h4>

                {/* Quick Stats */}
                <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                    {meal.servings && (
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                            <span>👥</span>
                            <span className="font-medium">{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                    {nutrition?.calories && (
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                            <span>🔥</span>
                            <span className="font-medium">{Math.round(nutrition.calories)} cal</span>
                        </div>
                    )}
                </div>

                {/* Nutrition Details (if enabled) */}
                {showNutrition && nutrition && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4">
                        <h5 className="text-green-400 font-semibold text-sm mb-3 text-center">Nutrition Info</h5>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            {nutrition.protein && (
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-blue-400 text-lg">🥩</span>
                                    </div>
                                    <div className="font-bold text-blue-400">{Math.round(nutrition.protein)}g</div>
                                    <div className="text-gray-400 text-xs">Protein</div>
                                </div>
                            )}
                            {nutrition.carbohydrates && (
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-400 text-lg">🍞</span>
                                    </div>
                                    <div className="font-bold text-yellow-400">{Math.round(nutrition.carbohydrates)}g</div>
                                    <div className="text-gray-400 text-xs">Carbs</div>
                                </div>
                            )}
                            {nutrition.fat && (
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-red-400 text-lg">🥑</span>
                                    </div>
                                    <div className="font-bold text-red-400">{Math.round(nutrition.fat)}g</div>
                                    <div className="text-gray-400 text-xs">Fat</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                    {meal.sourceUrl && (
                        <a 
                            href={meal.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <span>📝</span>
                            <span>View Full Recipe</span>
                        </a>
                    )}
                    
                    {/* Additional Info Row */}
                    <div className="flex justify-between items-center text-xs text-gray-400">
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