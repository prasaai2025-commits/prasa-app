import api from "./api";
import { getDB } from "./offlineDB";

export async function queueAdminAction(action) {
  const db = await getDB();
  const tx = db.transaction("adminApprovals", "readwrite");
  await tx.store.add(action);
  await tx.done;
}

export async function syncAdminApprovals() {
  const db = await getDB();
  const tx = db.transaction("adminApprovals", "readwrite");

  const actions = await tx.store.getAll();

  for (const act of actions) {
    try {
      await api.put(act.url);
      await tx.store.delete(act.id);
    } catch {
      // still offline — leave in queue
    }
  }
}
