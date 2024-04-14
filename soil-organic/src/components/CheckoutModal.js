import React, { useState, useRef } from 'react';

function CheckoutModal({ isOpen, onClose, onCheckoutComplete, cartItems }) {
    const [cardDetails, setCardDetails] = useState({
        cardType: 'Visa',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    // const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        let formattedValue = value;
        //let errors = {};

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

    const validateCardDetails = () => {
        let valid = true;
        let errors = {};

        // Remove dashes for validation purposes
        const cardNumberDigits = cardDetails.cardNumber.replace(/-/g, '');
        if (cardNumberDigits.length !== 16) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateCardDetails();
        console.log('Handling submit...');
        if (isFormValid) {
            console.log('Card details are valid, processing checkout...');
            onCheckoutComplete();
        } else {
            console.log('Card details validation failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 overflow-auto bg-smoke-light flex ${isOpen ? '' : 'hidden'}`}>
            <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
                <h3 className="text-xl mb-4">Card Details</h3>
                <form onSubmit={handleSubmit}>
                    {/* Card Type Selection */}
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="cardType">
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
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="cardNumber">
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
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="expiryDate">
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
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="cvv">
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
