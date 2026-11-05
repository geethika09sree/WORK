export const demoEmployees = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@company.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Software Engineer",
    salary: 65000,
    joiningDate: "2024-06-10",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@company.com",
    phone: "9876543211",
    department: "Human Resources",
    designation: "HR Executive",
    salary: 55000,
    joiningDate: "2023-08-15",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun@company.com",
    phone: "9876543212",
    department: "Finance",
    designation: "Accountant",
    salary: 50000,
    joiningDate: "2022-03-20",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@company.com",
    phone: "9876543213",
    department: "Marketing",
    designation: "Marketing Executive",
    salary: 48000,
    joiningDate: "2024-01-12",
    status: "Active",
  },
];

export const demoDepartments = [
  {
    id: 1,
    name: "Engineering",
    head: "Rahul Sharma",
    employees: 1,
    budget: 1500000,
  },
  {
    id: 2,
    name: "Human Resources",
    head: "Priya Reddy",
    employees: 1,
    budget: 900000,
  },
  {
    id: 3,
    name: "Finance",
    head: "Arjun Kumar",
    employees: 1,
    budget: 1000000,
  },
  {
    id: 4,
    name: "Marketing",
    head: "Sneha Patel",
    employees: 1,
    budget: 850000,
  },
];

export const demoAttendance = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    date: "2026-10-13",
    checkIn: "09:02 AM",
    status: "Present",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Priya Reddy",
    date: "2026-10-13",
    checkIn: "08:57 AM",
    status: "Present",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Arjun Kumar",
    date: "2026-10-13",
    checkIn: null,
    status: "Not Logged In",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "Sneha Patel",
    date: "2026-10-13",
    checkIn: "09:15 AM",
    status: "Present",
  },
];

export const demoLeaves = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    email: "rahul@company.com",
    type: "Casual Leave",
    from: "2026-10-10",
    to: "2026-10-12",
    reason: "Personal work",
    status: "Pending",
    appliedDate: "2026-10-08",
  },
];

export const demoPerformance = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    rating: 4,
    comments: "Good technical performance.",
    date: "2026-09-15",
  },
];

export const demoPayroll = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    month: "October 2026",
    grossSalary: 65000,
    deductions: 5000,
    netSalary: 60000,
    status: "Processed",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Priya Reddy",
    month: "October 2026",
    grossSalary: 55000,
    deductions: 4000,
    netSalary: 51000,
    status: "Processed",
  },
];

export const demoPayslips = [
  {
    id: "PS-2026-001",
    employeeId: 1,
    employeeName: "Rahul Sharma",
    month: "October 2026",
    grossSalary: 65000,
    deductions: 5000,
    netSalary: 60000,
    payDate: "2026-10-01",
    status: "Generated",
  },
];

export const demoSalaryHikes = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    previousSalary: 58000,
    newSalary: 65000,
    effectiveDate: "2026-04-01",
  },
];

export const demoCompanyHistory = [
  {
    id: 1,
    type: "New Joiner",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    date: "2024-06-10",
    description: "Joined as Software Engineer",
  },
  {
    id: 2,
    type: "New Joiner",
    employeeName: "Priya Reddy",
    department: "Human Resources",
    date: "2023-08-15",
    description: "Joined as HR Executive",
  },
];

export const demoFinance = {
  totalBudget: 5000000,
  revenue: 8200000,
  expenses: 4700000,
  payrollExpense: 2180000,
  departments: [
    {
      department: "Engineering",
      expense: 1500000,
    },
    {
      department: "Human Resources",
      expense: 900000,
    },
    {
      department: "Finance",
      expense: 1000000,
    },
    {
      department: "Marketing",
      expense: 850000,
    },
  ],
};

export function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
