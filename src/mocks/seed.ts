import type {
  Department,
  Employee,
  EmploymentStatus,
} from '@/features/employees/types/employee'

type SeedRow = Omit<Employee, 'id'>

const SEED_ROWS: SeedRow[] = [
  { employeeId: 'EMP-1001', firstName: 'Amina', lastName: 'Okonkwo', email: 'amina.okonkwo@meridian.test', jobTitle: 'Staff Engineer', department: 'Engineering', employmentStatus: 'active', joiningDate: '2021-03-12' },
  { employeeId: 'EMP-1002', firstName: 'James', lastName: 'Chen', email: 'james.chen@meridian.test', jobTitle: 'Finance Manager', department: 'Finance', employmentStatus: 'active', joiningDate: '2019-08-04' },
  { employeeId: 'EMP-1003', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@meridian.test', jobTitle: 'HR Business Partner', department: 'Human Resources', employmentStatus: 'on_leave', joiningDate: '2020-01-20' },
  { employeeId: 'EMP-1004', firstName: 'Mateo', lastName: 'Alvarez', email: 'mateo.alvarez@meridian.test', jobTitle: 'Account Executive', department: 'Sales', employmentStatus: 'active', joiningDate: '2022-05-16' },
  { employeeId: 'EMP-1005', firstName: 'Hannah', lastName: 'Brooks', email: 'hannah.brooks@meridian.test', jobTitle: 'Operations Lead', department: 'Operations', employmentStatus: 'active', joiningDate: '2018-11-02' },
  { employeeId: 'EMP-1006', firstName: 'Sofia', lastName: 'Lindgren', email: 'sofia.lindgren@meridian.test', jobTitle: 'Brand Designer', department: 'Marketing', employmentStatus: 'active', joiningDate: '2023-02-27' },
  { employeeId: 'EMP-1007', firstName: 'Noah', lastName: 'Patel', email: 'noah.patel@meridian.test', jobTitle: 'Customer Success Manager', department: 'Customer Success', employmentStatus: 'inactive', joiningDate: '2017-06-09' },
  { employeeId: 'EMP-1008', firstName: 'Elena', lastName: 'Rossi', email: 'elena.rossi@meridian.test', jobTitle: 'Corporate Counsel', department: 'Legal', employmentStatus: 'active', joiningDate: '2021-09-13' },
  { employeeId: 'EMP-1009', firstName: 'Daniel', lastName: 'Okoye', email: 'daniel.okoye@meridian.test', jobTitle: 'Frontend Engineer', department: 'Engineering', employmentStatus: 'active', joiningDate: '2024-01-08' },
  { employeeId: 'EMP-1010', firstName: 'Maya', lastName: 'Thompson', email: 'maya.thompson@meridian.test', jobTitle: 'Payroll Specialist', department: 'Finance', employmentStatus: 'on_leave', joiningDate: '2022-10-03' },
  { employeeId: 'EMP-1011', firstName: 'Liam', lastName: 'Wright', email: 'liam.wright@meridian.test', jobTitle: 'Recruiter', department: 'Human Resources', employmentStatus: 'active', joiningDate: '2023-07-17' },
  { employeeId: 'EMP-1012', firstName: 'Chloe', lastName: 'Nguyen', email: 'chloe.nguyen@meridian.test', jobTitle: 'Sales Operations Analyst', department: 'Sales', employmentStatus: 'active', joiningDate: '2020-04-21' },
  { employeeId: 'EMP-1013', firstName: 'Omar', lastName: 'Haddad', email: 'omar.haddad@meridian.test', jobTitle: 'Facilities Coordinator', department: 'Operations', employmentStatus: 'inactive', joiningDate: '2016-12-01' },
  { employeeId: 'EMP-1014', firstName: 'Isla', lastName: 'MacLeod', email: 'isla.macleod@meridian.test', jobTitle: 'Content Strategist', department: 'Marketing', employmentStatus: 'active', joiningDate: '2021-06-28' },
  { employeeId: 'EMP-1015', firstName: 'Kenji', lastName: 'Mori', email: 'kenji.mori@meridian.test', jobTitle: 'Support Engineer', department: 'Customer Success', employmentStatus: 'active', joiningDate: '2022-08-15' },
  { employeeId: 'EMP-1016', firstName: 'Ava', lastName: 'Santos', email: 'ava.santos@meridian.test', jobTitle: 'Privacy Analyst', department: 'Legal', employmentStatus: 'active', joiningDate: '2024-03-04' },
  { employeeId: 'EMP-1017', firstName: 'Benjamin', lastName: 'Clarke', email: 'benjamin.clarke@meridian.test', jobTitle: 'Platform Engineer', department: 'Engineering', employmentStatus: 'on_leave', joiningDate: '2019-02-11' },
  { employeeId: 'EMP-1018', firstName: 'Fatima', lastName: 'El-Sayed', email: 'fatima.elsayed@meridian.test', jobTitle: 'Controller', department: 'Finance', employmentStatus: 'active', joiningDate: '2015-09-30' },
  { employeeId: 'EMP-1019', firstName: 'Grace', lastName: 'Okafor', email: 'grace.okafor@meridian.test', jobTitle: 'People Operations Manager', department: 'Human Resources', employmentStatus: 'active', joiningDate: '2018-05-07' },
  { employeeId: 'EMP-1020', firstName: 'Hugo', lastName: 'Berg', email: 'hugo.berg@meridian.test', jobTitle: 'Enterprise AE', department: 'Sales', employmentStatus: 'inactive', joiningDate: '2019-10-14' },
  { employeeId: 'EMP-1021', firstName: 'Ines', lastName: 'Moreau', email: 'ines.moreau@meridian.test', jobTitle: 'Supply Chain Analyst', department: 'Operations', employmentStatus: 'active', joiningDate: '2023-11-06' },
  { employeeId: 'EMP-1022', firstName: 'Jonah', lastName: 'Kim', email: 'jonah.kim@meridian.test', jobTitle: 'Product Marketing Manager', department: 'Marketing', employmentStatus: 'active', joiningDate: '2020-07-22' },
  { employeeId: 'EMP-1023', firstName: 'Leila', lastName: 'Hassan', email: 'leila.hassan@meridian.test', jobTitle: 'Onboarding Specialist', department: 'Customer Success', employmentStatus: 'on_leave', joiningDate: '2021-12-09' },
  { employeeId: 'EMP-1024', firstName: 'Marcus', lastName: 'Diaz', email: 'marcus.diaz@meridian.test', jobTitle: 'Contracts Manager', department: 'Legal', employmentStatus: 'active', joiningDate: '2017-03-18' },
  { employeeId: 'EMP-1025', firstName: 'Nina', lastName: 'Kowalski', email: 'nina.kowalski@meridian.test', jobTitle: 'QA Engineer', department: 'Engineering', employmentStatus: 'active', joiningDate: '2022-01-31' },
  { employeeId: 'EMP-1026', firstName: 'Oscar', lastName: 'Bennett', email: 'oscar.bennett@meridian.test', jobTitle: 'FP&A Analyst', department: 'Finance', employmentStatus: 'active', joiningDate: '2024-04-15' },
  { employeeId: 'EMP-1027', firstName: 'Penelope', lastName: 'Shah', email: 'penelope.shah@meridian.test', jobTitle: 'Learning Partner', department: 'Human Resources', employmentStatus: 'inactive', joiningDate: '2018-08-27' },
  { employeeId: 'EMP-1028', firstName: 'Quinn', lastName: 'Foster', email: 'quinn.foster@meridian.test', jobTitle: 'Sales Development Rep', department: 'Sales', employmentStatus: 'active', joiningDate: '2023-09-05' },
  { employeeId: 'EMP-1029', firstName: 'Ravi', lastName: 'Iyer', email: 'ravi.iyer@meridian.test', jobTitle: 'Workplace Manager', department: 'Operations', employmentStatus: 'active', joiningDate: '2020-02-24' },
  { employeeId: 'EMP-1030', firstName: 'Sara', lastName: 'Johansson', email: 'sara.johansson@meridian.test', jobTitle: 'Campaign Manager', department: 'Marketing', employmentStatus: 'on_leave', joiningDate: '2019-05-19' },
  { employeeId: 'EMP-1031', firstName: 'Theo', lastName: 'Mbeki', email: 'theo.mbeki@meridian.test', jobTitle: 'Renewals Manager', department: 'Customer Success', employmentStatus: 'active', joiningDate: '2021-04-06' },
  { employeeId: 'EMP-1032', firstName: 'Uma', lastName: 'Desai', email: 'uma.desai@meridian.test', jobTitle: 'Litigation Counsel', department: 'Legal', employmentStatus: 'active', joiningDate: '2016-01-12' },
  { employeeId: 'EMP-1033', firstName: 'Victor', lastName: 'Lang', email: 'victor.lang@meridian.test', jobTitle: 'Engineering Manager', department: 'Engineering', employmentStatus: 'active', joiningDate: '2014-10-08' },
  { employeeId: 'EMP-1034', firstName: 'Willa', lastName: 'Hart', email: 'willa.hart@meridian.test', jobTitle: 'Treasury Analyst', department: 'Finance', employmentStatus: 'inactive', joiningDate: '2020-09-01' },
  { employeeId: 'EMP-1035', firstName: 'Xavier', lastName: 'Young', email: 'xavier.young@meridian.test', jobTitle: 'HR Coordinator', department: 'Human Resources', employmentStatus: 'active', joiningDate: '2024-06-10' },
  { employeeId: 'EMP-1036', firstName: 'Yara', lastName: 'Castro', email: 'yara.castro@meridian.test', jobTitle: 'Solutions Consultant', department: 'Sales', employmentStatus: 'active', joiningDate: '2022-12-12' },
  { employeeId: 'EMP-1037', firstName: 'Zane', lastName: 'Murphy', email: 'zane.murphy@meridian.test', jobTitle: 'Logistics Specialist', department: 'Operations', employmentStatus: 'on_leave', joiningDate: '2023-03-20' },
  { employeeId: 'EMP-1038', firstName: 'Amelia', lastName: 'Park', email: 'amelia.park@meridian.test', jobTitle: 'Lifecycle Marketer', department: 'Marketing', employmentStatus: 'active', joiningDate: '2021-08-16' },
  { employeeId: 'EMP-1039', firstName: 'Bodhi', lastName: 'Singh', email: 'bodhi.singh@meridian.test', jobTitle: 'Technical Account Manager', department: 'Customer Success', employmentStatus: 'active', joiningDate: '2019-11-25' },
  { employeeId: 'EMP-1040', firstName: 'Cora', lastName: 'Whitfield', email: 'cora.whitfield@meridian.test', jobTitle: 'Paralegal', department: 'Legal', employmentStatus: 'inactive', joiningDate: '2022-06-07' },
  { employeeId: 'EMP-1041', firstName: 'Diego', lastName: 'Fernandez', email: 'diego.fernandez@meridian.test', jobTitle: 'Security Engineer', department: 'Engineering', employmentStatus: 'active', joiningDate: '2020-03-03' },
  { employeeId: 'EMP-1042', firstName: 'Esme', lastName: 'Walsh', email: 'esme.walsh@meridian.test', jobTitle: 'Revenue Accountant', department: 'Finance', employmentStatus: 'active', joiningDate: '2023-05-29' },
]

export function createSeedEmployees(): Employee[] {
  return SEED_ROWS.map((row) => ({
    ...row,
    id: createStableId(row.employeeId),
  }))
}

export function isDepartment(value: string): value is Department {
  return SEED_ROWS.some((row) => row.department === value) ||
    [
      'Engineering',
      'Human Resources',
      'Finance',
      'Operations',
      'Sales',
      'Marketing',
      'Customer Success',
      'Legal',
    ].includes(value)
}

export function isEmploymentStatus(value: string): value is EmploymentStatus {
  return value === 'active' || value === 'inactive' || value === 'on_leave'
}

function createStableId(employeeId: string): string {
  return `emp-${employeeId.toLowerCase()}`
}
