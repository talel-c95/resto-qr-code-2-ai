import { motion } from "framer-motion";
import { Download, X } from "lucide-react";

interface QRCodeDisplayProps {
  qrCode: string;
  tableNumber: number;
  onClose: () => void;
}

export function QRCodeDisplay({ qrCode, tableNumber, onClose }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-noir/80 flex items-center justify-center z-50 px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-charcoal border border-gold/20 rounded-lg p-6 flex flex-col items-center gap-4 max-w-xs w-full"
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="font-display text-lg text-linen">Table {tableNumber}</h3>
          <button onClick={onClose} className="text-smoke hover:text-linen transition-colors">
            <X size={20} />
          </button>
        </div>
        <img src={qrCode} alt={`QR code for table ${tableNumber}`} className="w-full rounded-lg bg-linen p-2" />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold flex items-center gap-2 w-full justify-center"
        >
          <Download size={18} /> Download PNG
        </motion.button>
      </motion.div>
    </motion.div>
  );
}