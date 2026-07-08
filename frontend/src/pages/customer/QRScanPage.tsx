import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/customer";

export default function QRScanPage() {
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText: string) => {
    // Expecting decodedText to be a URL like ".../menu/5" or just "5"
    const match = decodedText.match(/\/menu\/(\w+)/);
    const tableId = match ? match[1] : decodedText.trim();

    if (tableId) {
      navigate(`/menu/${tableId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Scan Your Table's QR Code</h1>
      <p className="text-gray-500 mb-6">Point your camera at the QR code on your table.</p>
      <QRScanner onScanSuccess={handleScanSuccess} />
    </div>
  );
}