import React, { useEffect } from 'react';

/**
 * Enhanced PurchaseSummaryModal with Premium Dark Theme Design
 * Features a sophisticated purchase confirmation design matching the app's UI with glass morphism and modern styling
 */
function PurchaseSummaryModal({ isOpen, onClose, purchaseDetails }) {
    // Simple background scroll prevention
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Check if purchase details are valid or if there are no items to display
    if (!purchaseDetails || !purchaseDetails.items || purchaseDetails.items.length === 0) {
        return (
            <>
                {/* Premium Backdrop */}
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300" onClick={onClose}></div>
                
                {/* Error State Modal */}
                <div className="fixed inset-0 z-[101] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4">
                        <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-red-400/30 rounded-3xl shadow-2xl p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">❌</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-4">No Purchase Details Available</h2>
                                <button 
                                    onClick={onClose} 
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Calculate totals and purchase details
    const purchaseDateTime = new Date().toLocaleString();
    const totalAmount = purchaseDetails.items.reduce((acc, item) => {
        if (!item.price_at_time || !item.quantity) {
            console.error("Invalid item data", item);
            return acc;
        }
        return acc + item.price_at_time * item.quantity;
    }, 0);

    return (
        <>
            {/* Premium Backdrop with Enhanced Blur */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300" onClick={onClose}></div>
            
            {/* Premium Centered Modal */}
            <div className="fixed inset-0 z-[101] overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4">
                    <div className={`relative w-full max-w-4xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Success Celebration Animation */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute top-20 left-20 text-green-400 text-2xl animate-pulse">✨</div>
                            <div className="absolute top-32 right-32 text-yellow-400 text-xl animate-pulse animation-delay-500">🎉</div>
                            <div className="absolute bottom-32 left-32 text-blue-400 text-lg animate-pulse animation-delay-1000">⭐</div>
                        </div>

                        {/* Modal Header */}
                        <div className="relative p-8 border-b border-white/20 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                                <span className="text-3xl">🎉</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">Purchase Successful!</h2>
                            <p className="text-gray-400 text-lg">Thank you for your order. Here's your purchase summary</p>
                            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mt-6"></div>
                        </div>

                        {/* Modal Body */}
                        <div className="relative p-8 space-y-8">
                            
                            {/* Order Information Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping Information */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-lg">📦</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Shipping Details</h3>
                                    </div>
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Address:</span><br/>
                                        <span className="text-white font-medium">{purchaseDetails.shippingAddress || 'Not provided'}</span>
                                    </p>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-lg">💳</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Payment Method</h3>
                                    </div>
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Card ending in:</span><br/>
                                        <span className="text-white font-medium font-mono">**** **** **** {purchaseDetails.cardNumber || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-white/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-lg">🛒</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Order Items</h3>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Product</th>
                                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Quantity</th>
                                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Price</th>
                                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchaseDetails.items.map((item, index) => (
                                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                                                                <img 
                                                                    src={`http://localhost:4000/${item.product.product_image}`} 
                                                                    alt={item.product.product_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">{item.product.product_name}</p>
                                                                <p className="text-gray-400 text-sm">{item.product.product_quantity}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                            ×{item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-300">
                                                        ${parseFloat(item.price_at_time).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-white font-bold">
                                                        ${(item.price_at_time * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-green-400/30 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Order Total</h3>
                                        <p className="text-gray-400">Including all fees and taxes</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-400">${totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Purchased on: {purchaseDateTime}</span>
                                </div>
                            </div>

                            {/* What's Next Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span>📋</span>
                                    What happens next?
                                </h3>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                                        <span>Order confirmation email sent to your inbox</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                                        <span>Your organic products will be prepared with care</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                                        <span>Delivery within 2-3 business days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="relative border-t border-white/20 p-8 bg-gradient-to-r from-white/5 to-white/10 rounded-b-3xl">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={onClose}
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <span>🏠</span>
                                    <span>Continue Shopping</span>
                                </button>
                            </div>
                            
                            {/* Thank you message */}
                            <div className="text-center mt-6">
                                <p className="text-gray-400 text-sm">
                                    Thank you for choosing SOIL Organic! 🌱 
                                    <span className="block mt-1">We're committed to bringing you the freshest organic products.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchaseSummaryModal;