/**
 * MealCard component for displaying meal information in a card layout.
 * It presents a meal's image, title, preparation time, number of servings, and a link to the full recipe.
 * 
 * @param {object} meal - An object containing details about the meal, such as title, id, imageType,
 *                        readyInMinutes, servings, and sourceUrl.
 */
const MealCard = ({ meal }) => {

    return (
        <div className="border border-primary text-orange-600 rounded-lg p-4 bg-orange-100 w-64 shadow-lg">
          <div>
            <img src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`} alt={meal.title} className="w-full h-40 object-cover rounded-t-lg" />
            <h4 className="mt-2 font-bold">{meal.title}</h4>
            {meal.readyInMinutes && <p className="font-bold">Prep Time: {meal.readyInMinutes} min</p>}
            {meal.servings && <p className="font-bold">Servings: {meal.servings}</p>}
            {meal.sourceUrl && (
            <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out">
                View Recipe
            </a>
        )}
          </div>
        </div>
      );
    };
  export default MealCard;