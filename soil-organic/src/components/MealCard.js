const MealCard = ({ meal }) => {

    return (
        <div className="px-2 w-full md:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <img src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`} alt={meal.title} className="w-full h-32 object-cover rounded-lg" />
            <h4 className="mt-2 font-bold">{meal.title}</h4>
            {meal.readyInMinutes && <p>Prep Time: {meal.readyInMinutes} minutes</p>}
            {meal.servings && <p>Servings: {meal.servings}</p>}
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