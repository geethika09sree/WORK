import { demoAttendance } from "./data";
import { getEmployees } from "./employeeStorage";

const ATTENDANCE_KEY = "ems_attendance";

function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAttendanceRecords() {
  const savedAttendance = localStorage.getItem(ATTENDANCE_KEY);

  if (savedAttendance) {
    return JSON.parse(savedAttendance);
  }

  localStorage.setItem(
    ATTENDANCE_KEY,
    JSON.stringify(demoAttendance)
  );

  return demoAttendance;
}

export function saveAttendance(records) {
  localStorage.setItem(
    ATTENDANCE_KEY,
    JSON.stringify(records)
  );
}

export function recordCheckIn(employeeId) {
  const employees = getEmployees();
  const employee = employees.find(
    (emp) => String(emp.id) === String(employeeId)
  );

  if (!employee) {
    return {
      success: false,
      message: "Employee not found.",
    };
  }

  const records = getAttendanceRecords();
  const today = getToday();

  const alreadyCheckedIn = records.find(
    (record) =>
      String(record.employeeId) === String(employeeId) &&
      record.date === today
  );

  if (alreadyCheckedIn) {
    return {
      success: false,
      message: `${employee.name} has already checked in today.`,
      record: alreadyCheckedIn,
    };
  }

  const newRecord = {
    id: Date.now(),
    employeeId: employee.id,
    employeeName: employee.name,
    email: employee.email,
    department: employee.department,
    date: today,
    checkIn: getCurrentTime(),
    status: "Present",
    method: "ID Scan",
  };

  const updatedRecords = [...records, newRecord];

  saveAttendance(updatedRecords);

  return {
    success: true,
    message: `${employee.name} checked in successfully.`,
    record: newRecord,
  };
}

export function getAttendanceForDate(date = getToday()) {
  const employees = getEmployees();
  const records = getAttendanceRecords();

  return employees
    .filter((employee) => employee.status === "Active")
    .map((employee) => {
      const record = records.find(
        (item) =>
          String(item.employeeId) === String(employee.id) &&
          item.date === date
      );

      if (record) {
        return record;
      }

      return {
        id: `missing-${employee.id}-${date}`,
        employeeId: employee.id,
        employeeName: employee.name,
        email: employee.email,
        department: employee.department,
        date,
        checkIn: null,
        status: "Not Logged In",
        method: "-",
      };
    });
}

export function getEmployeeAttendance(employeeId) {
  const records = getAttendanceRecords();

  return records
    .filter(
      (record) =>
        String(record.employeeId) === String(employeeId)
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTodayAttendance() {
  return getAttendanceForDate(getToday());
}

export function getTodayDate() {
  return getToday();
}
