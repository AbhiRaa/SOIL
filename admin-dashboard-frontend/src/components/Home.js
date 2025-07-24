import React from 'react';
import { useQuery } from '@apollo/client';
import RecentReviews from './Dashboard/RecentReviews';
import { FETCH_USER_LIST } from '../graphql/queries/fetchUserList';
import { FETCH_PRODUCT_LIST } from '../graphql/queries/fetchProductList';
import { FETCH_REVIEW_LIST } from '../graphql/queries/fetchReviewList';

const Home = () => {
    // Fetch data for dashboard metrics
    const { data: userData } = useQuery(FETCH_USER_LIST);
    const { data: productData } = useQuery(FETCH_PRODUCT_LIST);
    const { data: reviewData } = useQuery(FETCH_REVIEW_LIST);

    // Calculate metrics
    const totalUsers = userData?.users?.length || 0;
    const activeUsers = userData?.users?.filter(user => !user.isBlocked)?.length || 0;
    const totalProducts = productData?.products?.length || 0;
    const lowStockProducts = productData?.products?.filter(product => product.product_stock < 10)?.length || 0;
    const totalReviews = reviewData?.reviews?.length || 0;
    const averageRating = reviewData?.reviews?.length > 0 
        ? (reviewData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewData.reviews.length).toFixed(1)
        : 0;


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className='text-4xl font-bold text-slate-800 mb-2'>Welcome to SOIL Organic Admin</h1>
                <p className='text-lg text-slate-600'>Comprehensive dashboard for managing your organic marketplace</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Users Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Users</p>
                            <p className="text-3xl font-bold text-slate-800">{totalUsers}</p>
                            <p className="text-sm text-green-600 mt-1">{activeUsers} active</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Products</p>
                            <p className="text-3xl font-bold text-slate-800">{totalProducts}</p>
                            {lowStockProducts > 0 && (
                                <p className="text-sm text-red-600 mt-1">{lowStockProducts} low stock</p>
                            )}
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Reviews Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Reviews</p>
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

                {/* System Status Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">System Status</p>
                            <p className="text-2xl font-bold text-emerald-600">Online</p>
                            <p className="text-sm text-slate-500 mt-1">All systems operational</p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className='text-2xl font-bold text-slate-800'>Recent Reviews</h2>
                            <div className="flex items-center text-sm text-slate-600">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Live Updates
                            </div>
                        </div>
                        <RecentReviews />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <a href="/products" className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                                <div className="bg-blue-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-700">Add New Product</span>
                            </a>
                            
                            <a href="/users" className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                                <div className="bg-green-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-700">Manage Users</span>
                            </a>
                            
                            <a href="/metrics" className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                                <div className="bg-purple-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-700">View Analytics</span>
                            </a>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">System Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Version:</span>
                                <span className="font-medium text-slate-800">v2.1.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Last Updated:</span>
                                <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Server Status:</span>
                                <span className="flex items-center font-medium text-green-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Healthy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Additional Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Performance Metrics</h3>
                                <p className="text-sm text-slate-600">Key performance indicators and health metrics</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">User Engagement</p>
                                        <p className="text-sm text-slate-600">Active users ratio</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-green-600 font-medium">Healthy</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 bg-white/80 rounded-lg p-2">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                                        style={{ width: `${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-500 p-2 rounded-lg shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Inventory Health</p>
                                        <p className="text-sm text-slate-600">Products in stock</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                                        {totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0}%
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-green-600 font-medium">Good</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 bg-white/80 rounded-lg p-2">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" 
                                        style={{ width: `${totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-500 p-2 rounded-lg shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Customer Satisfaction</p>
                                        <p className="text-sm text-slate-600">Average rating</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                        {averageRating}/5
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-green-600 font-medium">Excellent</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 bg-white/80 rounded-lg p-2">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Data Summary</h3>
                    <div className="space-y-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-slate-800 mb-2">User Management</h4>
                            <p className="text-sm text-slate-600 mb-2">Total of {totalUsers} registered users with {activeUsers} currently active accounts.</p>
                            <div className="flex space-x-4 text-xs">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{activeUsers} Active</span>
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded">{totalUsers - activeUsers} Blocked</span>
                            </div>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-slate-800 mb-2">Product Catalog</h4>
                            <p className="text-sm text-slate-600 mb-2">{totalProducts} products available with {lowStockProducts} requiring attention.</p>
                            <div className="flex space-x-4 text-xs">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{totalProducts - lowStockProducts} In Stock</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">{lowStockProducts} Low Stock</span>
                            </div>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-slate-800 mb-2">Customer Reviews</h4>
                            <p className="text-sm text-slate-600 mb-2">{totalReviews} reviews collected with an average rating of {averageRating} stars.</p>
                            <div className="flex space-x-4 text-xs">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{totalReviews} Total</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">★ {averageRating} Average</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;