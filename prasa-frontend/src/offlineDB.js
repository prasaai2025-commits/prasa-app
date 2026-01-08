import { openDB } from "idb";

export async function getDB() {
  return openDB("prasa-db", 1, {
    upgrade(db) {
      db.createObjectStore("pendingExpenses", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("pendingTickets", { keyPath: "id", autoIncrement: true });
    }
  });
}
