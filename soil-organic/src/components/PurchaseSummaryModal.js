import React from 'react';

function PurchaseSummaryModal({ isOpen, onClose, purchaseDetails }) {
    if (!isOpen) return null; // First check if the modal should even open

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
    const totalAmount = purchaseDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-4">Purchase Summary</h2>
                <ul className="mb-4">
                    {purchaseDetails.items.map((item, index) => (
                        <li key={index} className="grid grid-cols-4 gap-2 mb-2">
                            <span className="font-medium">{item.name}</span>
                            <span>x{item.quantity}</span>
                            <span>${item.price.toFixed(2)}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="font-bold text-xl mb-2">
                    Total: ${totalAmount.toFixed(2)}
                </div>
                <div className="text-gray-600 mb-4">
                    Purchase Date: {purchaseDateTime}
                </div>
                <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Close
                </button>
            </div>
        </div>
    );
}

export default PurchaseSummaryModal;
