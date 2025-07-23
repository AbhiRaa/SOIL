import React, { useState } from 'react';

/**
 * Enhanced MealList component with improved layout, filtering, and user experience.
 * Displays search results with better visual hierarchy and interaction feedback.
 *
 * @param {Object[]} meals - Array of meal objects to display.
 * @param {Function} onAdd - Callback function to handle adding a meal to the meal plan.
 * @param {string} selectedDay - Currently selected day for adding meals.
 */
function MealList({ meals, onAdd, selectedDay = 'today', mealSections = [] }) {
    const [addingMealId, setAddingMealId] = useState(null);
    const [addedMeals, setAddedMeals] = useState(new Set());
    const [selectedSections, setSelectedSections] = useState(new Map());

    /**
     * Handle adding meal with user feedback
     */
    const handleAddMeal = async (meal, targetSection = 'breakfast') => {
        setAddingMealId(meal.id);
        
        try {
            await onAdd(meal, targetSection);
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

    const getSelectedSection = (mealId) => {
        return selectedSections.get(mealId) || (mealSections[0]?.id || 'breakfast');
    };

    const setSelectedSection = (mealId, sectionId) => {
        setSelectedSections(prev => new Map(prev.set(mealId, sectionId)));
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
                <p className="text-gray-300 text-lg">No recipes found</p>
                <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Results Header */}
            <div className="flex justify-between items-center">
                <p className="text-gray-300">
                    Showing {meals.length} recipe{meals.length !== 1 ? 's' : ''}
                    {selectedDay && (
                        <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded-full">
                            Adding to {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                        </span>
                    )}
                </p>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => {
                    const nutrition = getNutritionData(meal);
                    const isAdding = addingMealId === meal.id;
                    const isAdded = addedMeals.has(meal.id);

                    return (
                        <div 
                            key={meal.id} 
                            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-102 hover:shadow-xl border border-gray-700"
                        >
                            {/* Image Section */}
                            <div className="relative">
                                {meal.image ? (
                                    <img 
                                        className="w-full h-48 object-cover" 
                                        src={meal.image} 
                                        alt={meal.title}
                                        className="w-full h-32 object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className="w-full h-32 bg-gray-900 flex items-center justify-center"
                                    style={{ display: meal.image ? 'none' : 'flex' }}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🍽️</div>
                                        <p className="text-gray-400">Image not available</p>
                                    </div>
                                </div>
                                
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
                            <div className="p-3">
                                <h3 className="font-bold text-gray-100 text-sm mb-2 line-clamp-2 leading-tight">
                                    {meal.title}
                                </h3>

                                {/* Nutrition Information */}
                                {nutrition && (
                                    <div className="bg-gray-700/50 rounded-lg p-2 mb-3">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">🔥 Calories:</span>
                                                <span className="font-semibold text-orange-400">{Math.round(nutrition.calories)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">🥩 Protein:</span>
                                                <span className="font-semibold text-blue-300">{Math.round(nutrition.protein)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">🍞 Carbs:</span>
                                                <span className="font-semibold text-yellow-300">{Math.round(nutrition.carbohydrates)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">🥑 Fat:</span>
                                                <span className="font-semibold text-red-300">{Math.round(nutrition.fat)}g</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Section Selector and Action Button */}
                                <div className="space-y-2">
                                    {mealSections.length > 0 && !isAdded && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                                Add to section:
                                            </label>
                                            <select
                                                value={getSelectedSection(meal.id)}
                                                onChange={(e) => setSelectedSection(meal.id, e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {mealSections.map(section => (
                                                    <option key={section.id} value={section.id}>
                                                        {section.icon} {section.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleAddMeal(meal, getSelectedSection(meal.id))}
                                        disabled={isAdding || isAdded}
                                        className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-102 disabled:transform-none ${
                                            isAdded 
                                                ? 'bg-green-500 text-white cursor-default'
                                                : isAdding
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg'
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
                                </div>

                                {/* Recipe Link */}
                                {meal.sourceUrl && (
                                    <a 
                                        href={meal.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block text-center mt-1 text-blue-400 hover:text-blue-300 text-xs transition-colors duration-200"
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
