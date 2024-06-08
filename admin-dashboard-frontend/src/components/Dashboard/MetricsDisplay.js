import React, { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { PRODUCT_ENGAGEMENT_UPDATED } from '../../graphql/subscriptions/productEngagementUpdated';
import { PRODUCT_STOCK_UPDATED } from '../../graphql/subscriptions/productStockUpdated';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  // Register the components needed for Bar and Line chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const MetricsDisplay = () => {
  const [chartData, setChartData] = useState({});
  const [stockData, setStockData] = useState({});
  const { data: engagementData, loading: loadingEngagement, error: errorEngagement } = useSubscription(PRODUCT_ENGAGEMENT_UPDATED, {
    onError: err => console.error("Engagement error:", err)
  });
  const { data: stockDataResponse, loading: loadingStock, error: errorStock } = useSubscription(PRODUCT_STOCK_UPDATED, {
    onError: err => console.error("Stock error:", err)
  });

  useEffect(() => {
    if (engagementData?.productEngagementUpdated) {
      const labels = engagementData.productEngagementUpdated.map(product => 
        `${product.product_name}${product.is_special ? ' (Special)' : ''}`
      );
      const counts = engagementData.productEngagementUpdated.map(product => product.reviewsAggregate?.count || 0); // Handle missing counts
      const ratings = engagementData.productEngagementUpdated.map(product => {
        const rating = parseFloat(product.reviewsAggregate?.averageRating);
        return isNaN(rating) ? 0 : rating;    // Convert NaN to 0 or another default value
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Review Count',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Average Rating',
            data: ratings,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }
        ]
      });
    }

    if (stockDataResponse?.productStockUpdated) {
        const labels = stockDataResponse.productStockUpdated.map(product =>
            `${product.product_name}${product.is_special ? ' (Special)' : ''}`
        );
        const stocks = stockDataResponse.productStockUpdated.map(product => product.product_stock);
        const tooltips = stockDataResponse.productStockUpdated.map(product =>
          `($${product.product_price} per ${product.minimum_purchase_unit})`
        );

      setStockData({
        labels,
        datasets: [
          {
            label: 'Stock Quantity',
            data: stocks,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ],
        tooltips  // Store prices for tooltip usage
      });
    }
  }, [engagementData, stockDataResponse]);

  const engagementOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };
  
  const stockOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += `${context.raw} units`;
            if (context.datasetIndex === 0) {
              label += `\n${stockData.tooltips[context.dataIndex]}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loadingEngagement || loadingStock) return <p>Loading metrics...</p>;
  if (errorEngagement || errorStock) return <p>Error loading metrics: {errorEngagement?.message || errorStock?.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4">Product Engagement</h2>
      <p className="text-gray-600 text-xl p-2">The metrics displayed reflect which products are receiving the most engagement based on the number of reviews and ratings.</p>
      <p className="text-gray-600 text-xl pb-4">Products marked as 'Special' are featured items on our platform.</p>
      {chartData.labels?.length > 0 ? (
        <Bar data={chartData} options={engagementOptions} />
      ) : (
        <p className="text-gray-500">No engagement data available for the chart.</p>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Stock Metrics</h2>
      <p  className="text-gray-600 text-xl p-2 mt-4">The metrics displayed shows tracking of stock updates of products which could indeed offer valuable insights into user-product engagement.</p>
      {stockData.labels?.length > 0 ? (
        <Line data={stockData} options={stockOptions} />
      ) : (
        <p className="text-gray-500">No stock data available for the chart.</p>
      )}
    </div>
  );
};

export default MetricsDisplay;
