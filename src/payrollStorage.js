
import { demoPayroll, demoSalaryHikes } from "./data";
import { getEmployees } from "./employeeStorage";

const PAYROLL_KEY = "ems_payroll";
const HIKE_KEY = "ems_salary_hikes";
const PAYSLIP_KEY = "worksphere_payslip_history";

// Converts "October 2026" into "2026-10".
// Also accepts an existing YYYY-MM value.
export function normalizePayrollMonth(month) {
  if (!month) return "";

  if (/^\d{4}-\d{2}$/.test(month)) {
    return month;
  }

  const date = new Date(`${month} 1`);

  if (Number.isNaN(date.getTime())) return month;

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

export function getPayroll() {
  const saved = localStorage.getItem(PAYROLL_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  localStorage.setItem(PAYROLL_KEY, JSON.stringify(demoPayroll));
  return demoPayroll;
}

export function savePayroll(payroll) {
  localStorage.setItem(PAYROLL_KEY, JSON.stringify(payroll));
}

export function getSalaryHikes() {
  const saved = localStorage.getItem(HIKE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  localStorage.setItem(HIKE_KEY, JSON.stringify(demoSalaryHikes));
  return demoSalaryHikes;
}

export function saveSalaryHikes(hikes) {
  localStorage.setItem(HIKE_KEY, JSON.stringify(hikes));
}

// Synchronize payment updates from Payslip History to Payroll.
export function updatePayrollPaymentStatus(
  employeeId,
  month,
  status,
  paidDate
) {
  const payroll = getPayroll();
  const normalizedMonth = normalizePayrollMonth(month);

  const updatedPayroll = payroll.map((item) => {
    const sameEmployee =
      String(item.employeeId) === String(employeeId);

    const sameMonth =
      normalizePayrollMonth(item.month) === normalizedMonth;

    if (!sameEmployee || !sameMonth) return item;

    return {
      ...item,
      paymentStatus: status,
      paidDate: status === "Paid" ? paidDate : "",
    };
  });

  savePayroll(updatedPayroll);
}

// Process payroll and automatically generate/update its payslip.
export function processPayroll(employeeId, month, deductions) {
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

  const normalizedMonth = normalizePayrollMonth(month);

  if (!normalizedMonth) {
    return {
      success: false,
      message: "Please select a valid salary month.",
    };
  }

  const grossSalary = Number(employee.salary);
  const deductionAmount = Number(deductions) || 0;

  if (
    !Number.isFinite(grossSalary) ||
    grossSalary <= 0 ||
    !Number.isFinite(deductionAmount) ||
    deductionAmount < 0 ||
    deductionAmount > grossSalary
  ) {
    return {
      success: false,
      message: "Please enter valid salary and deduction amounts.",
    };
  }

  const payroll = getPayroll();

  const existing = payroll.find(
    (item) =>
      String(item.employeeId) === String(employeeId) &&
      normalizePayrollMonth(item.month) === normalizedMonth
  );

  if (existing) {
    return {
      success: false,
      message:
        "Payroll has already been processed for this employee for this month.",
    };
  }

  const netSalary = grossSalary - deductionAmount;
  const payrollId = Date.now();

  const newPayroll = {
    id: payrollId,
    employeeId: employee.id,
    employeeName: employee.name,
    month,
    grossSalary,
    deductions: deductionAmount,
    netSalary,
    status: "Processed",
    paymentStatus: "Pending",
    paidDate: "",
    processedDate: new Date().toISOString().slice(0, 10),
  };

  savePayroll([...payroll, newPayroll]);

  // Automatically create the corresponding payslip.
  let slips = [];

  try {
    slips = JSON.parse(localStorage.getItem(PAYSLIP_KEY)) || [];
  } catch {
    slips = [];
  }

  const existingSlipIndex = slips.findIndex(
    (slip) =>
      String(slip.employeeId) === String(employee.id) &&
      normalizePayrollMonth(slip.month) === normalizedMonth
  );

  const previousSlip =
    existingSlipIndex >= 0 ? slips[existingSlipIndex] : null;

  const newSlip = {
    ...(previousSlip || {}),
    id: previousSlip?.id || `payroll-${payrollId}`,
    employee: employee.name,
    employeeId: employee.id,
    month: normalizedMonth,
    basic: grossSalary,
    allowances: 0,
    deductions: deductionAmount,
    net: netSalary,
    status: previousSlip?.status || "Pending",
    paidDate: previousSlip?.paidDate || "",
    generatedDate: new Date().toISOString().slice(0, 10),
    payrollId,
  };

  if (existingSlipIndex >= 0) {
    slips[existingSlipIndex] = newSlip;
  } else {
    slips.push(newSlip);
  }

  localStorage.setItem(PAYSLIP_KEY, JSON.stringify(slips));

  return {
    success: true,
    message: "Payroll processed and payslip generated successfully.",
    payroll: newPayroll,
  };
}

export function addSalaryHike(
  employeeId,
  newSalary,
  effectiveDate
) {
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

  const salary = Number(newSalary);

  if (!Number.isFinite(salary) || salary <= 0) {
    return {
      success: false,
      message: "Enter a valid salary.",
    };
  }

  const previousSalary = Number(employee.salary);

  const updatedEmployees = employees.map((emp) =>
    String(emp.id) === String(employeeId)
      ? { ...emp, salary }
      : emp
  );

  localStorage.setItem(
    "ems_employees",
    JSON.stringify(updatedEmployees)
  );

  const hikes = getSalaryHikes();

  const newHike = {
    id: Date.now(),
    employeeId: employee.id,
    employeeName: employee.name,
    previousSalary,
    newSalary: salary,
    effectiveDate,
  };

  saveSalaryHikes([...hikes, newHike]);

  return {
    success: true,
    message: "Salary updated successfully.",
  };
}

