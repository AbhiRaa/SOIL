import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionChart = ({ nutritionData }) => {
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <Pie data={data} options={options} />
      <div className="nutrition-info">
        <p><strong>Calories:</strong> {nutritionData.calories.toFixed(0)} kcal</p>
        <p><strong>Protein:</strong> {nutritionData.protein.toFixed(0)} grams</p>
        <p><strong>Carbs:</strong> {nutritionData.carbohydrates.toFixed(0)} grams</p>
        <p><strong>Fat:</strong> {nutritionData.fat.toFixed(0)} grams</p>
      </div>
    </div>
  );
};

export default NutritionChart;