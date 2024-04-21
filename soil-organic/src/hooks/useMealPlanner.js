import { useState, useEffect, useContext } from 'react';
import UserContext from "../hooks/context";

function useMealPlanner() {
    const { currentloggedInUser } = useContext(UserContext);
    const [mealPlan, setMealPlan] = useState(() => {
        // Attempt to load the initial meal plan from local storage on hook initialization
        if (currentloggedInUser) {
            const storageKey = `mealplan_${currentloggedInUser}`;
            const storedPlan = localStorage.getItem(storageKey);
            return storedPlan ? JSON.parse(storedPlan) : {};
        }
        return {};
    });

    useEffect(() => {
        // React only when currentloggedInUser changes and is defined
        if (currentloggedInUser) {
            const storageKey = `mealplan_${currentloggedInUser}`;
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
            const storageKey = `mealplan_${currentloggedInUser}`;
            console.log('Saving meal plan for:', storageKey);
            localStorage.setItem(storageKey, JSON.stringify(mealPlan));
        }
    }, [mealPlan, currentloggedInUser]);

    // const addMeal = (meal, day) => {
    //     setMealPlan(prevPlan => {
    //         const updatedPlan = { ...prevPlan };
    //         if (!updatedPlan[day]) {
    //             updatedPlan[day] = [];
    //         }
    //         updatedPlan[day].push(meal);
    //         return updatedPlan;
    //     });
    // };

    // const removeMeal = (mealId, day) => {
    //     setMealPlan(prevPlan => {
    //         const updatedPlan = { ...prevPlan };
    //         if (updatedPlan[day]) {
    //             updatedPlan[day] = updatedPlan[day].filter(meal => meal.id !== mealId);
    //         }
    //         return updatedPlan;
    //     });
    // };

    // const clearMealPlan = () => {
    //     setMealPlan({});
    //     // Only remove from local storage if there's a valid user email
    //     if (currentloggedInUser) {
    //         const storageKey = `mealplan_${currentloggedInUser}`;
    //         localStorage.removeItem(storageKey);
    //     }
    // };

    // const saveMealPlan = (newPlan) => {
    //     setMealPlan(newPlan);
    // };

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
            const storageKey = `mealplan_${currentloggedInUser}`;
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
