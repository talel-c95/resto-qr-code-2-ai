import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Welcome to Our Restaurant
      </h1>
      <p className="text-gray-500 mb-10">
        Scan, order, and enjoy — no waiting required.
      </p>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          onClick={() => navigate('/scan')}
          className="bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Scan QR Code
        </button>

        <button
          onClick={() => navigate('/guest')}
          className="bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Continue as Guest
        </button>

        <div className="flex justify-center gap-2 text-sm text-gray-500 mt-2">
          <span>Already have an account?</span>
          <button
            onClick={() => navigate('/login')}
            className="text-black font-medium underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}