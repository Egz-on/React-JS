import React, { useState } from 'react';

const Counter = () => {
    const [counter, setCounter] = useState(0);

    const increment = () => {
        setCounter(counter + 1);
    };

    const decrement = () => {
        setCounter(counter - 1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">🔢 Counter</h1>
                <p className="text-5xl font-semibold text-indigo-600 mb-6">{counter}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={increment}
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        +
                    </button>
                    <button
                        onClick={decrement}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        -
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Counter;
