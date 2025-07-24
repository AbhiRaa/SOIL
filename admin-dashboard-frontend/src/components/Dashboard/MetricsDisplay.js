import React, { useEffect, useState } from 'react';
import { useSubscription, useQuery } from '@apollo/client';
import { PRODUCT_ENGAGEMENT_UPDATED } from '../../graphql/subscriptions/productEngagementUpdated';
import { PRODUCT_STOCK_UPDATED } from '../../graphql/subscriptions/productStockUpdated';
import { FETCH_USER_LIST } from '../../graphql/queries/fetchUserList';
import { FETCH_PRODUCT_LIST } from '../../graphql/queries/fetchProductList';
import { FETCH_REVIEW_LIST } from '../../graphql/queries/fetchReviewList';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
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
    ArcElement,
    RadialLinearScale,
  } from 'chart.js';
  
  // Register the components needed for all chart types
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale
  );

const MetricsDisplay = () => {
  const [chartData, setChartData] = useState({});
  const [stockData, setStockData] = useState({});
  const [timeFilter, setTimeFilter] = useState('all');
  const [chartType, setChartType] = useState('bar');

  // Fetch data from GraphQL queries
  const { data: userData } = useQuery(FETCH_USER_LIST);
  const { data: productData } = useQuery(FETCH_PRODUCT_LIST);
  const { data: reviewData } = useQuery(FETCH_REVIEW_LIST);

  // Real-time subscriptions
  const { data: engagementData, loading: loadingEngagement, error: errorEngagement } = useSubscription(PRODUCT_ENGAGEMENT_UPDATED, {
    onError: err => console.error("Engagement error:", err)
  });
  const { data: stockDataResponse, loading: loadingStock, error: errorStock } = useSubscription(PRODUCT_STOCK_UPDATED, {
    onError: err => console.error("Stock error:", err)
  });

  // Calculate comprehensive metrics
  const totalUsers = userData?.users?.length || 0;
  const activeUsers = userData?.users?.filter(user => !user.is_blocked)?.length || 0;
  const totalProducts = productData?.products?.length || 0;
  const specialProducts = productData?.products?.filter(product => product.is_special)?.length || 0;
  const lowStockProducts = productData?.products?.filter(product => product.product_stock < 10)?.length || 0;
  const totalReviews = reviewData?.reviews?.length || 0;
  const averageRating = reviewData?.reviews?.length > 0 
    ? (reviewData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewData.reviews.length).toFixed(1)
    : 0;

  // Enhanced chart options
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#64748b',
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // User analytics data
  const userAnalyticsData = {
    labels: ['Active Users', 'Blocked Users'],
    datasets: [
      {
        data: [activeUsers, totalUsers - activeUsers],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Product analytics data
  const productAnalyticsData = {
    labels: ['Regular Products', 'Special Products'],
    datasets: [
      {
        data: [totalProducts - specialProducts, specialProducts],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Rating distribution data
  const ratingDistributionData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: [
          reviewData?.reviews?.filter(r => r.rating === 5).length || 0,
          reviewData?.reviews?.filter(r => r.rating === 4).length || 0,
          reviewData?.reviews?.filter(r => r.rating === 3).length || 0,
          reviewData?.reviews?.filter(r => r.rating === 2).length || 0,
          reviewData?.reviews?.filter(r => r.rating === 1).length || 0,
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Inventory health data
  const inventoryHealthData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [
          productData?.products?.filter(p => p.product_stock > 10).length || 0,
          productData?.products?.filter(p => p.product_stock > 0 && p.product_stock <= 10).length || 0,
          productData?.products?.filter(p => p.product_stock === 0).length || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Business performance radar data
  const performanceRadarData = {
    labels: ['User Engagement', 'Product Quality', 'Customer Satisfaction', 'Inventory Health', 'Content Management'],
    datasets: [
      {
        label: 'Performance Score',
        data: [
          totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
          totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0,
          Math.round(averageRating * 20), // Convert 5-star to 100-point scale
          totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0,
          totalReviews > 0 ? Math.min(100, Math.round((totalReviews / totalProducts) * 10)) : 0,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  useEffect(() => {
    if (engagementData?.productEngagementUpdated) {
      const labels = engagementData.productEngagementUpdated.map(product => 
        `${product.product_name}${product.is_special ? ' ⭐' : ''}`
      );
      const counts = engagementData.productEngagementUpdated.map(product => product.reviewsAggregate?.count || 0);
      const ratings = engagementData.productEngagementUpdated.map(product => {
        const rating = parseFloat(product.reviewsAggregate?.averageRating);
        return isNaN(rating) ? 0 : rating;
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Review Count',
            data: counts,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            borderRadius: 4,
          },
          {
            label: 'Average Rating',
            data: ratings,
            backgroundColor: 'rgba(251, 191, 36, 0.8)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 2,
            borderRadius: 4,
          }
        ]
      });
    }

    if (stockDataResponse?.productStockUpdated) {
      const labels = stockDataResponse.productStockUpdated.map(product =>
        `${product.product_name}${product.is_special ? ' ⭐' : ''}`
      );
      const stocks = stockDataResponse.productStockUpdated.map(product => product.product_stock);

      setStockData({
        labels,
        datasets: [
          {
            label: 'Stock Quantity',
            data: stocks,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
          }
        ],
      });
    }
  }, [engagementData, stockDataResponse]);

  if (loadingEngagement || loadingStock) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-64 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorEngagement || errorStock) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Analytics</h3>
              <p className="text-red-600">{errorEngagement?.message || errorStock?.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Advanced Analytics</h1>
                <p className="text-white/90">Comprehensive business intelligence dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Real-time Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-800">{totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">{Math.round((activeUsers / totalUsers) * 100)}% active</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Products</p>
                <p className="text-3xl font-bold text-slate-800">{totalProducts}</p>
                <p className="text-sm text-orange-600 mt-1">{specialProducts} special</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reviews</p>
                <p className="text-3xl font-bold text-slate-800">{totalReviews}</p>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-slate-600">{averageRating} avg</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Low Stock Alert</p>
                <p className="text-3xl font-bold text-slate-800">{lowStockProducts}</p>
                <p className="text-sm text-red-600 mt-1">Needs attention</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Analytics */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Analytics
              </h3>
              <p className="text-sm text-slate-600 mt-1">Active vs blocked user distribution</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Doughnut data={userAnalyticsData} options={{...baseChartOptions, maintainAspectRatio: false}} />
              </div>
            </div>
          </div>

          {/* Product Analytics */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Product Portfolio
              </h3>
              <p className="text-sm text-slate-600 mt-1">Regular vs special products</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Doughnut data={productAnalyticsData} options={{...baseChartOptions, maintainAspectRatio: false}} />
              </div>
            </div>
          </div>
        </div>

        {/* Rating & Inventory Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rating Distribution
              </h3>
              <p className="text-sm text-slate-600 mt-1">Customer satisfaction breakdown</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Bar data={ratingDistributionData} options={{...baseChartOptions, maintainAspectRatio: false}} />
              </div>
            </div>
          </div>

          {/* Inventory Health */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                </svg>
                Inventory Health
              </h3>
              <p className="text-sm text-slate-600 mt-1">Stock level distribution</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Doughnut data={inventoryHealthData} options={{...baseChartOptions, maintainAspectRatio: false}} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Business Performance Radar */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Performance Overview
              </h3>
              <p className="text-sm text-slate-600 mt-1">Key business metrics radar</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Radar data={performanceRadarData} options={{
                  ...baseChartOptions,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20,
                        color: '#64748b',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>

          {/* Real-time Product Engagement */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <svg className="w-6 h-6 text-violet-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                </svg>
                Product Engagement
              </h3>
              <p className="text-sm text-slate-600 mt-1">Live engagement metrics</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                {chartData.labels?.length > 0 ? (
                  <Bar data={chartData} options={{...baseChartOptions, maintainAspectRatio: false}} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="font-medium">No engagement data available</p>
                      <p className="text-sm">Real-time data will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Tracking */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <svg className="w-6 h-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Real-time Stock Tracking
            </h3>
            <p className="text-sm text-slate-600 mt-1">Live inventory level monitoring</p>
          </div>
          <div className="p-6">
            <div className="h-96">
              {stockData.labels?.length > 0 ? (
                <Line data={stockData} options={{...baseChartOptions, maintainAspectRatio: false}} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="font-medium">No stock data available</p>
                    <p className="text-sm">Real-time stock updates will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
