
import { demoEmployees } from "./data";

const EMPLOYEE_KEY = "ems_employees";

export function getEmployees() {
  const savedEmployees = localStorage.getItem(EMPLOYEE_KEY);

  if (savedEmployees) {
    try {
      return JSON.parse(savedEmployees);
    } catch {
      return demoEmployees;
    }
  }

  localStorage.setItem(
    EMPLOYEE_KEY,
    JSON.stringify(demoEmployees)
  );

  return demoEmployees;
}

export function saveEmployees(employees) {
  localStorage.setItem(
    EMPLOYEE_KEY,
    JSON.stringify(employees)
  );
}

export function addEmployee(employee) {
  const employees = getEmployees();

  const newEmployee = {
    ...employee,
    id: Date.now(),
    status: "Active",
    joiningDate: employee.joiningDate || "",
    resignationDate: "",
    resignationReason: "",
  };

  const updatedEmployees = [
    ...employees,
    newEmployee,
  ];

  saveEmployees(updatedEmployees);

  return newEmployee;
}

export function updateEmployee(id, updatedData) {
  const employees = getEmployees();

  const updatedEmployees = employees.map((employee) =>
    String(employee.id) === String(id)
      ? {
          ...employee,
          ...updatedData,

          // Editing a profile must not erase lifecycle records.
          status: employee.status || "Active",
          resignationDate: employee.resignationDate || "",
          resignationReason: employee.resignationReason || "",
        }
      : employee
  );

  saveEmployees(updatedEmployees);

  return updatedEmployees;
}

export function resignEmployee(id, resignationDate, reason) {
  const employees = getEmployees();

  const employee = employees.find(
    (item) => String(item.id) === String(id)
  );

  if (!employee) {
    return {
      success: false,
      message: "Employee not found.",
    };
  }

  if (employee.status === "Resigned") {
    return {
      success: false,
      message: "This employee is already marked as resigned.",
    };
  }

  if (!resignationDate || !reason?.trim()) {
    return {
      success: false,
      message: "Please provide the resignation date and reason.",
    };
  }

  if (
    employee.joiningDate &&
    resignationDate < employee.joiningDate
  ) {
    return {
      success: false,
      message: "Resignation date cannot be before the joining date.",
    };
  }

  const updatedEmployees = employees.map((item) =>
    String(item.id) === String(id)
      ? {
          ...item,
          status: "Resigned",
          resignationDate,
          resignationReason: reason.trim(),
        }
      : item
  );

  saveEmployees(updatedEmployees);

  return {
    success: true,
    message: `${employee.name} has been marked as resigned.`,
    employees: updatedEmployees,
  };
}

export function reinstateEmployee(id) {
  const employees = getEmployees();

  const updatedEmployees = employees.map((employee) =>
    String(employee.id) === String(id)
      ? {
          ...employee,
          status: "Active",
          resignationDate: "",
          resignationReason: "",
        }
      : employee
  );

  saveEmployees(updatedEmployees);

  return updatedEmployees;
}

export function deleteEmployee(id) {
  const employees = getEmployees();

  const updatedEmployees = employees.filter(
    (employee) => String(employee.id) !== String(id)
  );

  saveEmployees(updatedEmployees);

  return updatedEmployees;
}

export function getEmployeeById(id) {
  const employees = getEmployees();

  return employees.find(
    (employee) => String(employee.id) === String(id)
  );
}

