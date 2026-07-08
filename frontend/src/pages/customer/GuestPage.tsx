import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GuestPage() {
  const [tableNumber, setTableNumber] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (tableNumber.trim()) {
      navigate(`/menu/${tableNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Enter Your Table Number</h1>
      <p className="text-gray-500 mb-6">Check the sticker on your table if you don't have a QR code.</p>

      <input
        type="text"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        placeholder="e.g. 5"
        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 mb-4 text-center"
      />

      <button
        onClick={handleContinue}
        disabled={!tableNumber.trim()}
        className="w-full max-w-xs bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-40"
      >
        Continue to Menu
      </button>
    </div>
  );
}