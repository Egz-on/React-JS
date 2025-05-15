import React, { useEffect, useState } from 'react';

const ExampleThree = () => {
    const [info, setInfo] = useState(() => {
        const savedInfo = localStorage.getItem('info');
        return savedInfo ? JSON.parse(savedInfo) : '';
    });

    useEffect(() => {
        localStorage.setItem('info', JSON.stringify(info));
    }, [info]);

    const handleChange = (event) => {
        setInfo(event.target.value);
    };

    const handleClear = () => setInfo('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-xl font-semibold text-gray-700 mb-4">
                    Enter your info: <span className="text-indigo-600">{info}</span>
                </h1>
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
                    type="text"
                    value={info}
                    placeholder="Enter your info"
                    onChange={handleChange}
                />
                <button
                    className="w-full bg-amber-400 text-white font-medium py-2 px-4 rounded hover:bg-amber-500 transition"
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default ExampleThree;
