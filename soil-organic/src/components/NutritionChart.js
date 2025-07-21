import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Enhanced NutritionChart component with improved visual design and better data presentation.
 * Visualizes nutritional values with modern styling and interactive elements.
 */
const NutritionChart = ({ nutritionData }) => {
  // Calculate total macros for percentage display
  const totalMacros = nutritionData.protein + nutritionData.carbohydrates + nutritionData.fat;
  
  // Data for the Pie chart with enhanced styling
  const data = {
    labels: ['🥩 Protein', '🍞 Carbohydrates', '🥑 Fat'],
    datasets: [
      {
        label: 'Macronutrients (g)',
        data: [nutritionData.protein, nutritionData.carbohydrates, nutritionData.fat],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue for protein
          'rgba(251, 191, 36, 0.8)',  // Yellow for carbs
          'rgba(239, 68, 68, 0.8)'    // Red for fat
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)', 
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 3,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
        hoverBorderWidth: 4,
      },
    ],
  };

  // Enhanced configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          },
          color: '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#f97316',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = totalMacros > 0 ? ((value / totalMacros) * 100).toFixed(1) : 0;
            return `${context.label}: ${value}g (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderJoinStyle: 'round',
      }
    },
    interaction: {
      intersect: false,
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="relative h-48 mb-6">
        <Pie data={data} options={options} />
      </div>
      
      {/* Nutrition Stats Cards */}
      <div className="space-y-3">
        {/* Calories - Highlighted */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-500 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="font-semibold text-gray-700">Calories</span>
            </div>
            <span className="font-bold text-lg text-orange-600">
              {Math.round(nutritionData.calories)} kcal
            </span>
          </div>
        </div>

        {/* Macronutrients Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Protein */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
            <div className="text-lg mb-1">🥩</div>
            <div className="font-semibold text-blue-700 text-sm">Protein</div>
            <div className="font-bold text-blue-800">{Math.round(nutritionData.protein)}g</div>
            {totalMacros > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                {Math.round((nutritionData.protein / totalMacros) * 100)}%
              </div>
            )}
          </div>

          {/* Carbohydrates */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center">
            <div className="text-lg mb-1">🍞</div>
            <div className="font-semibold text-yellow-700 text-sm">Carbs</div>
            <div className="font-bold text-yellow-800">{Math.round(nutritionData.carbohydrates)}g</div>
            {totalMacros > 0 && (
              <div className="text-xs text-yellow-600 mt-1">
                {Math.round((nutritionData.carbohydrates / totalMacros) * 100)}%
              </div>
            )}
          </div>

          {/* Fat */}
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            <div className="text-lg mb-1">🥑</div>
            <div className="font-semibold text-red-700 text-sm">Fat</div>
            <div className="font-bold text-red-800">{Math.round(nutritionData.fat)}g</div>
            {totalMacros > 0 && (
              <div className="text-xs text-red-600 mt-1">
                {Math.round((nutritionData.fat / totalMacros) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Daily nutrition summary • Tap chart segments for details
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;