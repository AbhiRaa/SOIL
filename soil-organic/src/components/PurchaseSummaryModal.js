import React from 'react';

/**
 * Component to display a summary of the user's purchase.
 * It renders a modal with details about each item purchased, the total cost, and the purchase date.
 *
 * @param {Object} props - Component properties
 * @param {boolean} isOpen - Flag to control the visibility of the modal
 * @param {function} onClose - Function to call when closing the modal
 * @param {Object} purchaseDetails - Details about the purchase including a list of items
 */
function PurchaseSummaryModal({ isOpen, onClose, purchaseDetails }) {
    if (!isOpen) return null; // First check if the modal should even open

    // Log the purchase details to debug data issues
    console.log("Purchase Details:", purchaseDetails);

    // Check if purchase details are valid or if there are no items to display
    if (!purchaseDetails || !purchaseDetails.items || purchaseDetails.items.length === 0) {
        return (
            <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold">No Purchase Details Available</h2>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // If there are items, proceed with rendering the summary
    const purchaseDateTime = new Date().toLocaleString();
    const totalAmount = purchaseDetails.items.reduce((acc, item) => {
        // Ensure the item has the necessary properties
        if (!item.product_price || !item.quantity) {
            console.error("Invalid item data", item);
            return acc; // Skip this item or handle as needed
        }
        return acc + item.product_price * item.quantity;
    }, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-orange-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-2xl text-primary font-bold mb-4">Purchase Summary</h2>
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Product</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Quantity</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Price</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {purchaseDetails.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{item.product_name}</td>
                                    <td className="px-4 py-2">x{item.quantity}</td>
                                    <td className="px-4 py-2">${item.product_price.toFixed(2)}</td>
                                    <td className="px-4 py-2">${(item.product_price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="font-bold text-xl mt-4">
                    Total Price: ${totalAmount.toFixed(2)}
                </div>
                <div className="text-primary text-lg  mt-2">
                    Purchase Date: {purchaseDateTime}
                </div>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Close
                </button>
            </div>
        </div>
    );
}

export default PurchaseSummaryModal;
