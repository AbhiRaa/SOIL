import React, { useState } from 'react';

/**
 * Enhanced MealList component with improved layout, filtering, and user experience.
 * Displays search results with better visual hierarchy and interaction feedback.
 *
 * @param {Object[]} meals - Array of meal objects to display.
 * @param {Function} onAdd - Callback function to handle adding a meal to the meal plan.
 * @param {string} selectedDay - Currently selected day for adding meals.
 */
function MealList({ meals, onAdd, selectedDay = 'today' }) {
    const [addingMealId, setAddingMealId] = useState(null);
    const [addedMeals, setAddedMeals] = useState(new Set());

    /**
     * Handle adding meal with user feedback
     */
    const handleAddMeal = async (meal) => {
        setAddingMealId(meal.id);
        
        try {
            await onAdd(meal);
            setAddedMeals(prev => new Set([...prev, meal.id]));
            
            // Remove from added list after 3 seconds for better UX
            setTimeout(() => {
                setAddedMeals(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(meal.id);
                    return newSet;
                });
            }, 3000);
            
        } catch (error) {
            console.error('Error adding meal:', error);
        } finally {
            setAddingMealId(null);
        }
    };

    /**
     * Safe nutrition data extraction
     */
    const getNutritionData = (meal) => {
        if (!meal.nutrition?.nutrients) return null;
        
        const findNutrient = (name) => {
            const nutrient = meal.nutrition.nutrients.find(n => 
                n.name.toLowerCase() === name.toLowerCase()
            );
            return nutrient ? nutrient.amount : 0;
        };

        return {
            calories: findNutrient('Calories'),
            protein: findNutrient('Protein'),
            fat: findNutrient('Fat'),
            carbohydrates: findNutrient('Carbohydrates')
        };
    };

    if (!meals || meals.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-500 text-lg">No recipes found</p>
                <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Results Header */}
            <div className="flex justify-between items-center">
                <p className="text-gray-600">
                    Showing {meals.length} recipe{meals.length !== 1 ? 's' : ''}
                    {selectedDay && (
                        <span className="ml-2 px-2 py-1 bg-primary text-white text-sm rounded-full">
                            Adding to {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                        </span>
                    )}
                </p>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {meals.map((meal) => {
                    const nutrition = getNutritionData(meal);
                    const isAdding = addingMealId === meal.id;
                    const isAdded = addedMeals.has(meal.id);

                    return (
                        <div 
                            key={meal.id} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-100"
                        >
                            {/* Image Section */}
                            <div className="relative">
                                <img 
                                    className="w-full h-48 object-cover" 
                                    src={meal.image} 
                                    alt={meal.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200/f97316/ffffff?text=No+Image';
                                    }}
                                />
                                
                                {/* Success Indicator */}
                                {isAdded && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 shadow-md">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2 leading-tight">
                                    {meal.title}
                                </h3>

                                {/* Nutrition Information */}
                                {nutrition && (
                                    <div className="bg-orange-50 rounded-lg p-3 mb-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">🔥 Calories:</span>
                                                <span className="font-semibold">{Math.round(nutrition.calories)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">🥩 Protein:</span>
                                                <span className="font-semibold">{Math.round(nutrition.protein)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">🍞 Carbs:</span>
                                                <span className="font-semibold">{Math.round(nutrition.carbohydrates)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">🥑 Fat:</span>
                                                <span className="font-semibold">{Math.round(nutrition.fat)}g</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <button 
                                    onClick={() => handleAddMeal(meal)}
                                    disabled={isAdding || isAdded}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none ${
                                        isAdded 
                                            ? 'bg-green-500 text-white cursor-default'
                                            : isAdding
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {isAdding ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : isAdded ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>✅</span>
                                            <span>Added to {selectedDay}!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>➕</span>
                                            <span>Add to {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
                                        </div>
                                    )}
                                </button>

                                {/* Recipe Link */}
                                {meal.sourceUrl && (
                                    <a 
                                        href={meal.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block text-center mt-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200"
                                    >
                                        📋 View Full Recipe
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MealList;
