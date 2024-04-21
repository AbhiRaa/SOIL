import React, { useState, useEffect } from 'react';

function Notification({ message, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose(); // Callback when the notification closes
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);
    if (!visible) return null;
    return (
        <div className="fixed top-0 right-0 mb-4 mr-4 bg-primary text-white text-lg px-4 py-3 rounded animate-slide-up">
            {message}
        </div>
    );
}

export default Notification;