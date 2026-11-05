import { demoLeaves } from "./data";

const LEAVE_KEY = "ems_leaves";

export function getLeaves() {
  const saved = localStorage.getItem(LEAVE_KEY);

  if (saved) return JSON.parse(saved);

  localStorage.setItem(LEAVE_KEY, JSON.stringify(demoLeaves));
  return demoLeaves;
}

export function saveLeaves(leaves) {
  localStorage.setItem(LEAVE_KEY, JSON.stringify(leaves));
}

export function addLeave(leave) {
  const leaves = getLeaves();

  const newLeave = {
    ...leave,
    id: Date.now(),
    status: "Pending",
    appliedDate: new Date().toISOString().slice(0, 10),
  };

  saveLeaves([...leaves, newLeave]);
  return newLeave;
}

export function updateLeaveStatus(id, status) {
  const leaves = getLeaves();

  const updated = leaves.map((leave) =>
    leave.id === id ? { ...leave, status } : leave
  );

  saveLeaves(updated);
  return updated;
}
