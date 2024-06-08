/**
 * A custom hook to manage meal plans within a React application.
 * This hook leverages localStorage to persist meal plans on a per-user basis,
 * utilizing the current logged-in user's context to differentiate between users.
 * 
 * The hook exposes methods to add meals to a specific day, remove meals, clear the entire meal plan,
 * and manually save an updated meal plan. This allows for flexible integration within components
 * that require meal planning functionalities.
 *
 * Usage:
 * - Import the hook into a React component.
 * - Call the hook to access its functionalities and state.
 * - Use the provided methods to manipulate the meal plan.
 *
 * Example:
 * const { mealPlan, addMeal, removeMeal, clearMealPlan, saveMealPlan } = useMealPlanner();
 *
 * @module useMealPlanner
 */
import { useState, useEffect, useContext } from 'react';
import UserContext from "../hooks/context";

function useMealPlanner() {
    const { currentloggedInUser } = useContext(UserContext);
    const [mealPlan, setMealPlan] = useState(() => {
        // Attempt to load the initial meal plan from local storage on hook initialization
        if (currentloggedInUser) {
            const storageKey = `mealplan_${currentloggedInUser.userEmail}`;
            const storedPlan = localStorage.getItem(storageKey);
            return storedPlan ? JSON.parse(storedPlan) : {};
        }
        return {};
    });

    useEffect(() => {
        // React only when currentloggedInUser changes and is defined
        if (currentloggedInUser) {
            const storageKey = `mealplan_${currentloggedInUser.userEmail}`;
            console.log('Attempting to fetch meal plan for:', storageKey);

            const storedPlan = localStorage.getItem(storageKey);
            if (storedPlan) {
                console.log('Found stored meal plan:', storedPlan);
                setMealPlan(JSON.parse(storedPlan));
            } else {
                console.log('No user logged in, setting meal plan to empty object');
                setMealPlan({});
            }
        } else {
            console.log('No user logged in, setting meal plan to empty object');
            setMealPlan({});
        }
    }, [currentloggedInUser]);

    useEffect(() => {
        // Persist the meal plan to local storage whenever it changes, but only if there is a logged-in user
        if (currentloggedInUser && mealPlan) {
            const storageKey = `mealplan_${currentloggedInUser.userEmail}`;
            console.log('Saving meal plan for:', storageKey);
            localStorage.setItem(storageKey, JSON.stringify(mealPlan));
        }
    }, [mealPlan, currentloggedInUser]);

    const addMeal = (meal, day) => {
        setMealPlan(prevPlan => ({
            ...prevPlan,
            [day]: [...(prevPlan[day] || []), meal]
        }));
    };

    const removeMeal = (mealId, day) => {
        setMealPlan(prevPlan => ({
            ...prevPlan,
            [day]: prevPlan[day].filter(meal => meal.id !== mealId)
        }));
    };

    const clearMealPlan = () => {
        if (currentloggedInUser) {
            const storageKey = `mealplan_${currentloggedInUser.userEmail}`;
            console.log('Clearing meal plan from local storage:', storageKey);
            localStorage.removeItem(storageKey);
        }
        setMealPlan({});
    };

    const saveMealPlan = (newPlan) => {
        console.log('Manually saving new meal plan:', newPlan);
        setMealPlan(newPlan);
    };

    return {
        mealPlan,
        addMeal,
        removeMeal,
        clearMealPlan,
        saveMealPlan,
    };
};

export default useMealPlanner;
