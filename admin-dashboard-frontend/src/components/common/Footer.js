import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">SOIL Organic</h3>
                                <p className="text-sm text-slate-600">Admin Dashboard</p>
                            </div>
                        </div>
                        <p className="text-slate-600 mb-4 max-w-md">
                            Comprehensive admin dashboard for managing your organic marketplace. 
                            Monitor users, products, reviews, and analytics in real-time.
                        </p>
                        <div className="flex space-x-4">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.180 1.966-.967 6.161-.967 6.161-.408 1.751-1.514 2.057-3.064 1.288l-2.362-1.174-1.142.887c-.126.098-.233.181-.48.181-.312 0-.259-.116-.366-.411L9.09 13.37l-2.725-.918c-.595-.2-.605-.595.125-.891l10.64-4.102c.495-.191.93.118.773.756z"/>
                                </svg>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="/" className="hover:text-slate-800 transition-colors">Dashboard</a></li>
                            <li><a href="/users" className="hover:text-slate-800 transition-colors">User Management</a></li>
                            <li><a href="/products" className="hover:text-slate-800 transition-colors">Products</a></li>
                            <li><a href="/reviews" className="hover:text-slate-800 transition-colors">Reviews</a></li>
                            <li><a href="/metrics" className="hover:text-slate-800 transition-colors">Analytics</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                admin@soil.com
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Melbourne, Australia
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-slate-600 mb-4 sm:mb-0">
                        © {new Date().getFullYear()} SOIL Organic Admin Dashboard. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            System Online
                        </span>
                        <span>v2.1.0</span>
                        <span className="hidden sm:inline">Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;