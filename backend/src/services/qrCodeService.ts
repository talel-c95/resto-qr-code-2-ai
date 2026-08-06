import QRCode from "qrcode";
import { env } from "../config/env";

export async function generateTableQrCode(tableNumber: number): Promise<string> {
  const url = `${env.frontendUrl}/menu/${tableNumber}`;
  return QRCode.toDataURL(url, { width: 400, margin: 2 });
}