import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * NutritionChart component visualizes the nutritional values of a meal.
 * It takes `nutritionData` as a prop, which contains values for protein, carbohydrates, fat, and calories.
 */
const NutritionChart = ({ nutritionData }) => {
  // Data for the Pie chart, utilizing the passed `nutritionData` prop
  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Nutrition',
        data: [nutritionData.protein, nutritionData.carbohydrates, nutritionData.fat],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuration options for the Pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Render a Pie chart using react-chartjs-2 with provided data and options
  return (
    <div className='m-4'>
      <Pie data={data} options={options} />
      <div className="nutrition-info text-primary text-lg">
        <p><strong>Calories:</strong> {nutritionData.calories.toFixed(0)} kcal</p>
        <p><strong>Protein:</strong> {nutritionData.protein.toFixed(0)} grams</p>
        <p><strong>Carbs:</strong> {nutritionData.carbohydrates.toFixed(0)} grams</p>
        <p><strong>Fat:</strong> {nutritionData.fat.toFixed(0)} grams</p>
      </div>
    </div>
  );
};

export default NutritionChart;