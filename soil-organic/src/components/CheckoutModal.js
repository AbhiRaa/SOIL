/**
 * CheckoutModal.js
 *
 * This React component is a modal that allows users to enter their payment card details for
 * processing transactions. The modal includes fields for card type, card number, expiry date,
 * and CVV. It validates the input to ensure it meets expected formats and standards before
 * allowing the user to proceed with the checkout.
 *
 * Props:
 * - isOpen: Boolean that controls whether the modal is displayed.
 * - onClose: Function to call when closing the modal.
 * - onCheckoutComplete: Function to execute after successful validation and submission of the form.
 * - cartItems: Array of items currently in the shopping cart (not directly used in this file but may be part of a larger checkout process).
 */
import React, { useState, useRef } from 'react';

function CheckoutModal({ isOpen, onClose, onCheckoutComplete, cartItems, updateShippingAddress, updateCardNumber }) {
    // State for storing and updating card details entered by the user.
    const [cardDetails, setCardDetails] = useState({
        cardType: 'Visa',   // Default card type
        cardNumber: '', // User-entered card number
        expiryDate: '',  // Expiry date of the card
        cvv: '',     // CVV number of the card
        shippingAddress: ''  // Add a field for the shipping address
    });
    // State for managing validation error messages.
    const [errorMessages, setErrorMessages] = useState({});
    // Refs for managing focus transitions between form inputs.
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

    // List of known invalid card numbers for demonstration purposes
    const invalidCardNumbers = [
        '1234-5678-9012-3456',
        '1111-1111-1111-1111',
        '2222-2222-2222-2222',
        '3333-3333-3333-3333',
        '4444-4444-4444-4444',
        '5555-5555-5555-5555',
        '6666-6666-6666-6666',
        '7777-7777-7777-7777',
        '8888-8888-8888-8888',
        '9999-9999-9999-9999',
        '4111-1111-1111-1111', '4000-0000-0000-0002', // Visa
        '5555-5555-5555-4444', '5105-1051-0510-5100', // MasterCard
        '3782-8224-6310-005', '3714-4963-539-8431',   // American Express
        '6011-0009-9013-9424', '6011-0009-9013-0001'  // Discover
    ];

    // Handles input changes and formats them based on their type (e.g., card number, expiry date).
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        let formattedValue = value;

        // Formatting card number to groups of 4 digits separated by dashes.
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16); // Remove non-digits and limit to 16 characters.
            formattedValue = formattedValue ? formattedValue.match(/.{1,4}/g).join('-') : '';
            if (formattedValue.length === 19) {
                expiryRef.current.focus();  // Move focus to expiry input when card number is fully entered.
            }
        } else if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4);  // Format for MM/YY.
            formattedValue = formattedValue.length > 2 ? `${formattedValue.substring(0,2)}/${formattedValue.substring(2,4)}` : formattedValue;
            if (formattedValue.length === 5) {
                cvvRef.current.focus(); // Move focus to CVV input when expiry date is fully entered.
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);  // Limit CVV to 3 digits.
        }

        setCardDetails({ ...cardDetails, [name]: formattedValue }); // Update state with formatted input.
    };

    // Validates all card details to ensure they meet required standards.
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

        // Remove dashes for validation purposes
        const cardNumberDigits = cardDetails.cardNumber.replace(/-/g, '');
        // Check for invalid card numbers
        if (invalidCardNumbers.includes(cardDetails.cardNumber)) {
            errors.cardNumber = 'Invalid card number provided';
            valid = false;
        } else if (cardNumberDigits.length !== 16) {
            errors.cardNumber = 'Card number must be 16 digits';
            valid = false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
            errors.expiryDate = 'Invalid expiry date. Format MM/YY';
            valid = false;
        } else {
            // Convert the expiry date to a format that can be compared
            const [month, year] = cardDetails.expiryDate.split('/');
            const currentYear = new Date().getFullYear() % 100; // Get the last two digits
            const currentMonth = new Date().getMonth() + 1;

            const expiryYearInt = parseInt(year, 10);
            const expiryMonthInt = parseInt(month, 10);

            if (
                expiryYearInt < currentYear ||
                (expiryYearInt === currentYear && expiryMonthInt < currentMonth)
            ) {
                errors.expiryDate = 'Card is expired. Enter a valid expiry date';
                valid = false;
            }
        }
        if (!/^\d{3}$/.test(cardDetails.cvv)) {
            errors.cvv = 'CVV must be 3 digits';
            valid = false;
        }

        setErrorMessages(errors);
        return valid;
    };

    // Handles the submission of the form after validating card details.
    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateCardDetails();
        console.log('Handling submit...');
        if (isFormValid) {
            console.log('Card details are valid, processing checkout...');
            updateShippingAddress(cardDetails.shippingAddress); // Update the shipping address in ShoppingCart
            updateCardNumber(cardDetails.cardNumber); // Update the card number in ShoppingCart
            onCheckoutComplete();   // Callback for successful checkout.
        } else {
            console.log('Card details validation failed');
        }
    };

    if (!isOpen) return null;   // Do not render if not open.

    return (
        <div className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex ${isOpen ? '' : 'hidden'}`}>
            <div className="relative p-8 bg-orange-100 w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
                <h3 className="text-2xl text-primary mb-4 font-medium ">Card Details</h3>
                <form onSubmit={handleSubmit}>
                    {/* Shipping Address Input */}
                    <div className="mb-4">
                        <label className="block text-primary text-md font-bold mb-2" htmlFor="shippingAddress">
                            Shipping Address
                        </label>
                        <input
                            id="shippingAddress"
                            type="text"
                            name="shippingAddress"
                            placeholder="Enter your shipping address"
                            onChange={handleInputChange}
                            value={cardDetails.shippingAddress}
                            className="shadow appearance-none border ${errorMessages.shippingAddress ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-grey-darker"
                            required
                        />
                        {errorMessages.shippingAddress && <p className="text-red-500 text-xs italic">{errorMessages.shippingAddress}</p>}
                    </div>

                    {/* Card Type Selection */}
                    <div className="mb-4">
                        <label className="block text-primary text-md font-bold mb-2" htmlFor="cardType">
                            Select Card Type
                        </label>
                        <select 
                            id="cardType"
                            name="cardType"
                            onChange={handleInputChange}
                            value={cardDetails.cardType}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                        >
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                            
                        </select>
                    </div>

                    {/* Card Number Input */}
                    <div className="mb-4">
                        <label className="block text-primary text-md font-bold mb-2" htmlFor="cardNumber">
                            Card Number
                        </label>
                        <input 
                            id="cardNumber"
                            type="text"
                            maxLength="19"  // 16 digits plus 3 dashes
                            name="cardNumber"
                            placeholder="Card Number"
                            onChange={handleInputChange}
                            value={cardDetails.cardNumber}
                            className="shadow appearance-none border ${errorMessages.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-grey-darker"
                            required
                        />
                        {errorMessages.cardNumber && <p className="text-red-500 text-xs italic">{errorMessages.cardNumber}</p>}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="flex justify-between mb-4">
                        <div className="w-full mr-2">
                            <label className="block text-primary text-md font-bold mb-2" htmlFor="expiryDate">
                                Expiry Date
                            </label>
                            <input 
                                id="expiryDate"
                                type="text"
                                ref={expiryRef}
                                maxLength="5"  // 2 digits, a slash, and 2 more digits
                                name="expiryDate"
                                placeholder="Expiry Date"
                                onChange={handleInputChange}
                                value={cardDetails.expiryDate}
                                className="shadow appearance-none border ${errorMessages.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-grey-darker"
                                required
                            />
                            {errorMessages.expiryDate && <p className="text-red-500 text-xs italic">{errorMessages.expiryDate}</p>}
                        </div>
                        <div className="w-full ml-2">
                            <label className="block text-primary text-md font-bold mb-2" htmlFor="cvv">
                                CVV
                            </label>
                            <input 
                                id="cvv"
                                type="text"
                                ref={cvvRef}
                                maxLength="3"  // 3 digits for CVV
                                name="cvv"
                                placeholder="CVV"
                                onChange={handleInputChange}
                                value={cardDetails.cvv}
                                className="shadow appearance-none border ${errorMessages.cvv ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-grey-darker"
                                required
                            />
                            {errorMessages.cvv && <p className="text-red-500 text-xs italic">{errorMessages.cvv}</p>}
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="flex items-center justify-between mt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Checkout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutModal;
