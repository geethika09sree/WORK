import { demoPerformance } from "./data";

const PERFORMANCE_KEY = "ems_performance";

export function getPerformance() {
  const saved = localStorage.getItem(PERFORMANCE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    PERFORMANCE_KEY,
    JSON.stringify(demoPerformance)
  );

  return demoPerformance;
}

export function savePerformance(records) {
  localStorage.setItem(
    PERFORMANCE_KEY,
    JSON.stringify(records)
  );
}

export function addPerformance(record) {
  const records = getPerformance();

  const newRecord = {
    ...record,
    id: Date.now(),
    date:
      record.date ||
      new Date().toISOString().slice(0, 10),
  };

  savePerformance([...records, newRecord]);

  return newRecord;
}

export function updatePerformance(id, data) {
  const records = getPerformance();

  const updated = records.map((record) =>
    record.id === id
      ? { ...record, ...data }
      : record
  );

  savePerformance(updated);

  return updated;
}

export function deletePerformance(id) {
  const records = getPerformance();

  const updated = records.filter(
    (record) => record.id !== id
  );

  savePerformance(updated);

  return updated;
}
