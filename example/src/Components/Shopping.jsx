import React, { useState } from 'react';

const Shopping = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [qty, setQty] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !qty) return;

        const newItem = {
            name,
            qty: parseInt(qty),
        };

        setItems((prevItems) => [...prevItems, newItem]);
        setName("");
        setQty("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex flex-col items-center justify-start py-10 px-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">🛒 Shopping List</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Add item name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200 font-semibold"
                    >
                        Add Item 😍
                    </button>
                </form>
            </div>

            <div className="w-full max-w-xl mt-8 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">📝 Your Items</h2>
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm flex justify-between"
                        >
                            <span className="font-medium text-gray-800">Item: {item.name}</span>
                            <span className="text-indigo-700 font-semibold">Qty: {item.qty}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Shopping;
