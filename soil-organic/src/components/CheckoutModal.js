import React, { useState, useRef, useEffect } from 'react';

/**
 * Enhanced CheckoutModal with Premium Dark Theme Design
 * Features a sophisticated payment form matching the app's UI with glass morphism and modern styling
 */
function CheckoutModal({ isOpen, onClose, onCheckoutComplete, cartItems, updateShippingAddress, updateCardNumber }) {
    // State for storing and updating card details entered by the user
    const [cardDetails, setCardDetails] = useState({
        cardType: 'Visa',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        shippingAddress: ''
    });
    
    // State for managing validation error messages
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Refs for managing focus transitions between form inputs
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

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

    // List of known invalid card numbers for demonstration purposes
    const invalidCardNumbers = [
        '1234-5678-9012-3456', '1111-1111-1111-1111', '2222-2222-2222-2222',
        '3333-3333-3333-3333', '4444-4444-4444-4444', '5555-5555-5555-5555',
        '6666-6666-6666-6666', '7777-7777-7777-7777', '8888-8888-8888-8888',
        '9999-9999-9999-9999', '0000-0000-0000-0000', '4111-1111-1111-1111',
        '4000-0000-0000-0002', '5555-5555-5555-4444', '5105-1051-0510-5100',
        '3782-8224-6310-005', '3714-4963-539-8431', '6011-0009-9013-9424',
        '6011-0009-9013-0001'
    ];

    // Card type configurations
    const cardTypes = [
        { value: 'Visa', label: 'Visa', icon: '💳' },
        { value: 'MasterCard', label: 'MasterCard', icon: '💳' },
        { value: 'AmericanExpress', label: 'American Express', icon: '💳' }
    ];

    // Handles input changes and formats them based on their type
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        let formattedValue = value;

        // Clear specific error when user starts typing
        if (errorMessages[name]) {
            setErrorMessages(prev => ({ ...prev, [name]: '' }));
        }

        // Formatting card number to groups of 4 digits separated by dashes
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16);
            formattedValue = formattedValue ? formattedValue.match(/.{1,4}/g).join('-') : '';
            if (formattedValue.length === 19) {
                expiryRef.current.focus();
            }
        } else if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4);
            formattedValue = formattedValue.length > 2 ? `${formattedValue.substring(0,2)}/${formattedValue.substring(2,4)}` : formattedValue;
            if (formattedValue.length === 5) {
                cvvRef.current.focus();
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardDetails({ ...cardDetails, [name]: formattedValue });
    };

    // Validates all card details to ensure they meet required standards
    const validateCardDetails = () => {
        let valid = true;
        let errors = {};

        // Shipping address validation
        if (!cardDetails.shippingAddress) {
            errors.shippingAddress = 'Shipping address is required';
            valid = false;
        } else if (cardDetails.shippingAddress.length < 10) {
            errors.shippingAddress = 'Shipping address is too short';
            valid = false;
        } else if (!/\d/.test(cardDetails.shippingAddress)) {
            errors.shippingAddress = 'Address must include a street number';
            valid = false;
        }

        // Card number validation
        const cardNumberDigits = cardDetails.cardNumber.replace(/-/g, '');
        if (invalidCardNumbers.includes(cardDetails.cardNumber)) {
            errors.cardNumber = 'Invalid card number provided';
            valid = false;
        } else if (cardNumberDigits.length !== 16) {
            errors.cardNumber = 'Card number must be 16 digits';
            valid = false;
        }

        // Expiry date validation
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
            errors.expiryDate = 'Invalid expiry date. Format MM/YY';
            valid = false;
        } else {
            const [month, year] = cardDetails.expiryDate.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            const expiryYearInt = parseInt(year, 10);
            const expiryMonthInt = parseInt(month, 10);

            if (expiryYearInt < currentYear || (expiryYearInt === currentYear && expiryMonthInt < currentMonth)) {
                errors.expiryDate = 'Card is expired. Enter a valid expiry date';
                valid = false;
            }
        }

        // CVV validation
        if (!/^\d{3}$/.test(cardDetails.cvv)) {
            errors.cvv = 'CVV must be 3 digits';
            valid = false;
        }

        setErrorMessages(errors);
        return valid;
    };

    // Handles the submission of the form after validating card details
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const isFormValid = validateCardDetails();
        
        if (isFormValid) {
            // Simulate processing delay
            setTimeout(() => {
                updateShippingAddress(cardDetails.shippingAddress);
                updateCardNumber(cardDetails.cardNumber);
                setIsSubmitting(false);
                onCheckoutComplete();
            }, 1500);
        } else {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Premium Backdrop with Enhanced Blur */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] transition-all duration-300" onClick={onClose}></div>
            
            {/* Premium Centered Modal */}
            <div className="fixed inset-0 z-[101] overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4">
                    <div className={`relative w-full max-w-2xl bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Modal Header */}
                        <div className="relative flex items-center justify-between p-8 border-b border-white/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-white/20">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-1">Secure Checkout</h2>
                                    <p className="text-gray-400">Complete your purchase safely</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-xl group"
                            >
                                <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            
                            {/* Shipping Address */}
                            <div>
                                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-300 mb-3">
                                    Shipping Address
                                </label>
                                <input
                                    id="shippingAddress"
                                    type="text"
                                    name="shippingAddress"
                                    placeholder="Enter your complete shipping address"
                                    onChange={handleInputChange}
                                    value={cardDetails.shippingAddress}
                                    className={`w-full px-6 py-4 bg-white/10 border ${errorMessages.shippingAddress ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300`}
                                />
                                {errorMessages.shippingAddress && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errorMessages.shippingAddress}
                                    </p>
                                )}
                            </div>

                            {/* Card Type Selection */}
                            <div>
                                <label htmlFor="cardType" className="block text-sm font-medium text-gray-300 mb-3">
                                    Card Type
                                </label>
                                <select
                                    id="cardType"
                                    name="cardType"
                                    onChange={handleInputChange}
                                    value={cardDetails.cardType}
                                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    {cardTypes.map(type => (
                                        <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Card Number */}
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-3">
                                    Card Number
                                </label>
                                <input
                                    id="cardNumber"
                                    type="text"
                                    maxLength="19"
                                    name="cardNumber"
                                    placeholder="1234-5678-9012-3456"
                                    onChange={handleInputChange}
                                    value={cardDetails.cardNumber}
                                    className={`w-full px-6 py-4 bg-white/10 border ${errorMessages.cardNumber ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 font-mono text-lg tracking-wider`}
                                />
                                {errorMessages.cardNumber && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errorMessages.cardNumber}
                                    </p>
                                )}
                            </div>

                            {/* Expiry Date and CVV Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-3">
                                        Expiry Date
                                    </label>
                                    <input
                                        id="expiryDate"
                                        type="text"
                                        ref={expiryRef}
                                        maxLength="5"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        onChange={handleInputChange}
                                        value={cardDetails.expiryDate}
                                        className={`w-full px-6 py-4 bg-white/10 border ${errorMessages.expiryDate ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 font-mono text-lg`}
                                    />
                                    {errorMessages.expiryDate && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errorMessages.expiryDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-3">
                                        CVV
                                    </label>
                                    <input
                                        id="cvv"
                                        type="text"
                                        ref={cvvRef}
                                        maxLength="3"
                                        name="cvv"
                                        placeholder="123"
                                        onChange={handleInputChange}
                                        value={cardDetails.cvv}
                                        className={`w-full px-6 py-4 bg-white/10 border ${errorMessages.cvv ? 'border-red-400/50' : 'border-white/20'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 font-mono text-lg`}
                                    />
                                    {errorMessages.cvv && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errorMessages.cvv}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-green-400 font-medium text-sm">Secure Payment</p>
                                        <p className="text-gray-300 text-xs">Your payment information is encrypted and secure</p>
                                    </div>
                                </div>
                            </div>

                        </form>

                        {/* Modal Footer */}
                        <div className="relative border-t border-white/20 p-8 bg-gradient-to-r from-white/5 to-white/10 rounded-b-3xl">
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🚀</span>
                                            <span>Complete Purchase</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutModal;