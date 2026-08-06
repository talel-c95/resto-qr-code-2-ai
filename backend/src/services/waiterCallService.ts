import { WaiterCall } from "../models/WaiterCall";
import { AppError } from "../utils/errors";
import { getIO } from "../config/socket";

function emitToAdmin(event: string, payload: unknown) {
  try {
    getIO().to("admin-room").emit(event, payload);
  } catch {
    // socket layer not initialized — safe to ignore
  }
}

export async function createWaiterCall(tableId: string) {
  const call = await WaiterCall.create({ tableId, status: "pending" });

  emitToAdmin("waiterCall:new", {
    id: call._id.toString(),
    tableId: call.tableId,
    status: call.status,
    createdAt: call.createdAt,
  });

  return call;
}

export async function getAllWaiterCalls() {
  return WaiterCall.find().sort({ createdAt: -1 });
}

export async function resolveWaiterCall(id: string) {
  const call = await WaiterCall.findById(id);
  if (!call) {
    throw new AppError("Waiter call not found", 404);
  }
  call.status = "resolved";
  await call.save();

  emitToAdmin("waiterCall:resolved", { id: call._id.toString() });

  return call;
}