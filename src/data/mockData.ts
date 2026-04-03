import { Transaction, FinancialSummary, CategorySpending, BalanceTrend, MonthlyComparison, IncomeSource, SpendingTrend, CashFlowItem, BudgetItem, SpendingHeatMap } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    amount: 2500,
    category: 'Salary',
    description: 'Monthly salary',
    type: 'income',
    tags: ['salary', 'monthly'],
    notes: 'January salary payment',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '2',
    date: '2024-01-16',
    amount: 1200,
    category: 'Rent',
    description: 'Monthly rent payment',
    type: 'expense',
    tags: ['housing', 'monthly'],
    notes: 'Apartment rent',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '3',
    date: '2024-01-17',
    amount: 85,
    category: 'Groceries',
    description: 'Weekly groceries',
    type: 'expense',
    tags: ['food', 'weekly'],
    notes: 'Whole Foods shopping'
  },
  {
    id: '4',
    date: '2024-01-18',
    amount: 350,
    category: 'Entertainment',
    description: 'Concert tickets',
    type: 'expense',
    tags: ['entertainment', 'music'],
    notes: 'Taylor Swift concert'
  },
  {
    id: '5',
    date: '2024-01-19',
    amount: 150,
    category: 'Transportation',
    description: 'Gas and parking',
    type: 'expense',
    tags: ['transport', 'car'],
    notes: 'Monthly gas fill-up'
  },
  {
    id: '6',
    date: '2024-01-20',
    amount: 500,
    category: 'Freelance',
    description: 'Freelance project payment',
    type: 'income',
    tags: ['freelance', 'project'],
    notes: 'Web design project completion'
  },
  {
    id: '7',
    date: '2024-01-21',
    amount: 75,
    category: 'Utilities',
    description: 'Electric bill',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Electricity bill',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '8',
    date: '2024-01-22',
    amount: 200,
    category: 'Healthcare',
    description: 'Doctor visit',
    type: 'expense',
    tags: ['health', 'medical'],
    notes: 'Annual checkup'
  },
  {
    id: '9',
    date: '2024-01-23',
    amount: 45,
    category: 'Groceries',
    description: 'Coffee and snacks',
    type: 'expense',
    tags: ['food', 'daily'],
    notes: 'Starbucks and snacks'
  },
  {
    id: '10',
    date: '2024-01-24',
    amount: 120,
    category: 'Entertainment',
    description: 'Movie tickets',
    type: 'expense',
    tags: ['entertainment', 'movies'],
    notes: 'Date night movie'
  },
  {
    id: '11',
    date: '2024-01-25',
    amount: 80,
    category: 'Transportation',
    description: 'Uber rides',
    type: 'expense',
    tags: ['transport', 'rideshare'],
    notes: 'Uber to work and back'
  },
  {
    id: '12',
    date: '2024-01-26',
    amount: 300,
    category: 'Freelance',
    description: 'Web design project',
    type: 'income',
    tags: ['freelance', 'design'],
    notes: 'Landing page design'
  },
  {
    id: '13',
    date: '2024-01-27',
    amount: 95,
    category: 'Utilities',
    description: 'Internet bill',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Home internet',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '14',
    date: '2024-01-28',
    amount: 150,
    category: 'Healthcare',
    description: 'Pharmacy',
    type: 'expense',
    tags: ['health', 'prescription'],
    notes: 'Prescription medication'
  },
  {
    id: '15',
    date: '2024-01-29',
    amount: 65,
    category: 'Groceries',
    description: 'Weekly produce',
    type: 'expense',
    tags: ['food', 'weekly'],
    notes: 'Farmers market'
  },
  {
    id: '16',
    date: '2024-01-30',
    amount: 200,
    category: 'Entertainment',
    description: 'Restaurant dinner',
    type: 'expense',
    tags: ['food', 'dining'],
    notes: 'Anniversary dinner'
  },
  {
    id: '17',
    date: '2024-01-31',
    amount: 110,
    category: 'Transportation',
    description: 'Public transport pass',
    type: 'expense',
    tags: ['transport', 'monthly'],
    notes: 'Monthly bus pass',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '18',
    date: '2024-02-01',
    amount: 2500,
    category: 'Salary',
    description: 'Monthly salary',
    type: 'income',
    tags: ['salary', 'monthly'],
    notes: 'February salary payment',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '19',
    date: '2024-02-02',
    amount: 1200,
    category: 'Rent',
    description: 'Monthly rent payment',
    type: 'expense',
    tags: ['housing', 'monthly'],
    notes: 'Apartment rent',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '20',
    date: '2024-02-03',
    amount: 45,
    category: 'Groceries',
    description: 'Breakfast items',
    type: 'expense',
    tags: ['food', 'daily'],
    notes: 'Cereal and milk'
  },
  {
    id: '21',
    date: '2024-02-04',
    amount: 180,
    category: 'Entertainment',
    description: 'Gaming subscription',
    type: 'expense',
    tags: ['entertainment', 'gaming'],
    notes: 'Xbox Game Pass',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '22',
    date: '2024-02-05',
    amount: 75,
    category: 'Transportation',
    description: 'Car maintenance',
    type: 'expense',
    tags: ['transport', 'car'],
    notes: 'Oil change'
  },
  {
    id: '23',
    date: '2024-02-06',
    amount: 400,
    category: 'Freelance',
    description: 'Mobile app development',
    type: 'income',
    tags: ['freelance', 'development'],
    notes: 'React Native app'
  },
  {
    id: '24',
    date: '2024-02-07',
    amount: 60,
    category: 'Utilities',
    description: 'Water bill',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Water and sewage',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '25',
    date: '2024-02-08',
    amount: 85,
    category: 'Healthcare',
    description: 'Dental checkup',
    type: 'expense',
    tags: ['health', 'dental'],
    notes: 'Routine cleaning'
  },
  {
    id: '26',
    date: '2024-02-09',
    amount: 120,
    category: 'Groceries',
    description: 'Weekly shopping',
    type: 'expense',
    tags: ['food', 'weekly'],
    notes: 'Walmart run'
  },
  {
    id: '27',
    date: '2024-02-10',
    amount: 250,
    category: 'Entertainment',
    description: 'Concert tickets',
    type: 'expense',
    tags: ['entertainment', 'music'],
    notes: 'Jazz concert'
  },
  {
    id: '28',
    date: '2024-02-11',
    amount: 90,
    category: 'Transportation',
    description: 'Taxi rides',
    type: 'expense',
    tags: ['transport', 'taxi'],
    notes: 'Weekend taxi rides'
  },
  {
    id: '29',
    date: '2024-02-12',
    amount: 350,
    category: 'Freelance',
    description: 'Logo design project',
    type: 'income',
    tags: ['freelance', 'design'],
    notes: 'Company logo redesign'
  },
  {
    id: '30',
    date: '2024-02-13',
    amount: 55,
    category: 'Utilities',
    description: 'Phone bill',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Mobile phone plan',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '31',
    date: '2024-02-14',
    amount: 175,
    category: 'Healthcare',
    description: 'Eye exam',
    type: 'expense',
    tags: ['health', 'vision'],
    notes: 'Annual eye checkup'
  },
  {
    id: '32',
    date: '2024-02-15',
    amount: 95,
    category: 'Groceries',
    description: 'Specialty foods',
    type: 'expense',
    tags: ['food', 'specialty'],
    notes: 'Organic and specialty items'
  },
  {
    id: '33',
    date: '2024-02-16',
    amount: 320,
    category: 'Entertainment',
    description: 'Sports event tickets',
    type: 'expense',
    tags: ['entertainment', 'sports'],
    notes: 'Basketball game tickets'
  },
  {
    id: '34',
    date: '2024-02-17',
    amount: 140,
    category: 'Transportation',
    description: 'Airport parking',
    type: 'expense',
    tags: ['transport', 'travel'],
    notes: 'Weekend trip parking'
  },
  {
    id: '35',
    date: '2024-02-18',
    amount: 600,
    category: 'Freelance',
    description: 'Consulting project',
    type: 'income',
    tags: ['freelance', 'consulting'],
    notes: 'Business consulting'
  },
  {
    id: '36',
    date: '2024-02-19',
    amount: 70,
    category: 'Utilities',
    description: 'Trash service',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Waste management',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '37',
    date: '2024-02-20',
    amount: 125,
    category: 'Healthcare',
    description: 'Physical therapy',
    type: 'expense',
    tags: ['health', 'therapy'],
    notes: 'Knee therapy session'
  },
  {
    id: '38',
    date: '2024-02-21',
    amount: 80,
    category: 'Groceries',
    description: 'Household supplies',
    type: 'expense',
    tags: ['household', 'monthly'],
    notes: 'Cleaning supplies and paper products'
  },
  {
    id: '39',
    date: '2024-02-22',
    amount: 190,
    category: 'Entertainment',
    description: 'Streaming services',
    type: 'expense',
    tags: ['entertainment', 'streaming'],
    notes: 'Netflix, Disney+, Hulu',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '40',
    date: '2024-02-23',
    amount: 105,
    category: 'Transportation',
    description: 'Fuel',
    type: 'expense',
    tags: ['transport', 'car'],
    notes: 'Gas fill-up'
  },
  {
    id: '41',
    date: '2024-02-24',
    amount: 450,
    category: 'Freelance',
    description: 'Content writing project',
    type: 'income',
    tags: ['freelance', 'writing'],
    notes: 'Blog content package'
  },
  {
    id: '42',
    date: '2024-02-25',
    amount: 88,
    category: 'Utilities',
    description: 'Home security',
    type: 'expense',
    tags: ['utilities', 'security'],
    notes: 'Home alarm monitoring',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '43',
    date: '2024-02-26',
    amount: 210,
    category: 'Healthcare',
    description: 'Specialist visit',
    type: 'expense',
    tags: ['health', 'specialist'],
    notes: 'Cardiologist consultation'
  },
  {
    id: '44',
    date: '2024-02-27',
    amount: 135,
    category: 'Groceries',
    description: 'Organic produce',
    type: 'expense',
    tags: ['food', 'organic'],
    notes: 'Whole Foods organic section'
  },
  {
    id: '45',
    date: '2024-02-28',
    amount: 275,
    category: 'Entertainment',
    description: 'Theater tickets',
    type: 'expense',
    tags: ['entertainment', 'theater'],
    notes: 'Broadway show tickets'
  },
  {
    id: '46',
    date: '2024-02-29',
    amount: 160,
    category: 'Transportation',
    description: 'Car rental',
    type: 'expense',
    tags: ['transport', 'rental'],
    notes: 'Weekend car rental'
  },
  {
    id: '47',
    date: '2024-03-01',
    amount: 380,
    category: 'Freelance',
    description: 'Video editing project',
    type: 'income',
    tags: ['freelance', 'video'],
    notes: 'YouTube video editing'
  },
  {
    id: '48',
    date: '2024-03-02',
    amount: 92,
    category: 'Utilities',
    description: 'Gas bill',
    type: 'expense',
    tags: ['utilities', 'monthly'],
    notes: 'Natural gas heating',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '49',
    date: '2024-03-03',
    amount: 165,
    category: 'Healthcare',
    description: 'Medical supplies',
    type: 'expense',
    tags: ['health', 'supplies'],
    notes: 'First aid and medical supplies'
  },
  {
    id: '50',
    date: '2024-03-04',
    amount: 2500,
    category: 'Salary',
    description: 'Monthly salary',
    type: 'income',
    tags: ['salary', 'monthly'],
    notes: 'March salary payment',
    isRecurring: true,
    recurringFrequency: 'monthly'
  }
];

export const mockFinancialSummary: FinancialSummary = {
  totalBalance: 8640,
  totalIncome: 12630,
  totalExpenses: 3990,
  monthlyIncome: 4200,
  monthlyExpenses: 1330,
  savingsRate: 68.3,
  financialHealthScore: 82
};

export const mockCategorySpending: CategorySpending[] = [
  {
    category: 'Rent',
    amount: 2400,
    percentage: 60.2,
    color: '#FF6384',
    icon: 'bi-house'
  },
  {
    category: 'Entertainment',
    amount: 1890,
    percentage: 47.4,
    color: '#36A2EB',
    icon: 'bi-controller'
  },
  {
    category: 'Healthcare',
    amount: 1295,
    percentage: 32.5,
    color: '#FFCE56',
    icon: 'bi-heart-pulse'
  },
  {
    category: 'Transportation',
    amount: 1085,
    percentage: 27.2,
    color: '#4BC0C0',
    icon: 'bi-car-front'
  },
  {
    category: 'Groceries',
    amount: 725,
    percentage: 18.2,
    color: '#9966FF',
    icon: 'bi-basket'
  },
  {
    category: 'Utilities',
    amount: 520,
    percentage: 13.0,
    color: '#FF9F40',
    icon: 'bi-lightning'
  }
];

export const mockBalanceTrend: BalanceTrend[] = [
  {
    month: 'Aug 2023',
    balance: 2000,
    income: 3000,
    expenses: 1000
  },
  {
    month: 'Sep 2023',
    balance: 3200,
    income: 3500,
    expenses: 1300
  },
  {
    month: 'Oct 2023',
    balance: 2800,
    income: 2800,
    expenses: 1200
  },
  {
    month: 'Nov 2023',
    balance: 4100,
    income: 4200,
    expenses: 900
  },
  {
    month: 'Dec 2023',
    balance: 3900,
    income: 3000,
    expenses: 1200
  },
  {
    month: 'Jan 2024',
    balance: 4840,
    income: 3500,
    expenses: 1260
  },
  {
    month: 'Feb 2024',
    balance: 7200,
    income: 4700,
    expenses: 1340
  },
  {
    month: 'Mar 2024',
    balance: 8640,
    income: 4430,
    expenses: 990
  }
];

export const mockMonthlyComparison: MonthlyComparison[] = [
  {
    month: 'Jan 2024',
    income: 3500,
    expenses: 1260,
    net: 2240
  },
  {
    month: 'Feb 2024',
    income: 4700,
    expenses: 1340,
    net: 3360
  },
  {
    month: 'Mar 2024',
    income: 4430,
    expenses: 990,
    net: 3440
  }
];

export const mockIncomeSources: IncomeSource[] = [
  {
    source: 'Salary',
    amount: 7500,
    percentage: 59.4
  },
  {
    source: 'Freelance',
    amount: 5130,
    percentage: 40.6
  }
];

export const mockSpendingTrend: SpendingTrend[] = [
  { date: '2024-01-15', amount: 1200, movingAverage: 1200 },
  { date: '2024-01-16', amount: 85, movingAverage: 642 },
  { date: '2024-01-17', amount: 350, movingAverage: 545 },
  { date: '2024-01-18', amount: 150, movingAverage: 446 },
  { date: '2024-01-19', amount: 75, movingAverage: 372 },
  { date: '2024-01-20', amount: 200, movingAverage: 343 },
  { date: '2024-01-21', amount: 45, movingAverage: 293 },
  { date: '2024-01-22', amount: 120, movingAverage: 274 },
  { date: '2024-01-23', amount: 80, movingAverage: 250 },
  { date: '2024-01-24', amount: 300, movingAverage: 266 },
  { date: '2024-01-25', amount: 95, movingAverage: 249 },
  { date: '2024-01-26', amount: 150, movingAverage: 236 },
  { date: '2024-01-27', amount: 65, movingAverage: 218 },
  { date: '2024-01-28', amount: 200, movingAverage: 221 },
  { date: '2024-01-29', amount: 110, movingAverage: 207 },
  { date: '2024-01-30', amount: 2500, movingAverage: 543 },
  { date: '2024-01-31', amount: 1200, movingAverage: 621 },
  { date: '2024-02-01', amount: 45, movingAverage: 578 },
  { date: '2024-02-02', amount: 180, movingAverage: 543 },
  { date: '2024-02-03', amount: 75, movingAverage: 506 },
  { date: '2024-02-04', amount: 400, movingAverage: 513 },
  { date: '2024-02-05', amount: 60, movingAverage: 478 },
  { date: '2024-02-06', amount: 85, movingAverage: 449 },
  { date: '2024-02-07', amount: 120, movingAverage: 428 },
  { date: '2024-02-08', amount: 250, movingAverage: 429 },
  { date: '2024-02-09', amount: 90, movingAverage: 408 },
  { date: '2024-02-10', amount: 350, movingAverage: 416 },
  { date: '2024-02-11', amount: 55, movingAverage: 391 },
  { date: '2024-02-12', amount: 175, movingAverage: 378 },
  { date: '2024-02-13', amount: 95, movingAverage: 362 },
  { date: '2024-02-14', amount: 320, movingAverage: 371 },
  { date: '2024-02-15', amount: 140, movingAverage: 354 },
  { date: '2024-02-16', amount: 600, movingAverage: 393 },
  { date: '2024-02-17', amount: 70, movingAverage: 368 },
  { date: '2024-02-18', amount: 125, movingAverage: 353 },
  { date: '2024-02-19', amount: 80, movingAverage: 338 },
  { date: '2024-02-20', amount: 190, movingAverage: 335 },
  { date: '2024-02-21', amount: 105, movingAverage: 320 },
  { date: '2024-02-22', amount: 450, movingAverage: 343 },
  { date: '2024-02-23', amount: 88, movingAverage: 326 },
  { date: '2024-02-24', amount: 210, movingAverage: 319 },
  { date: '2024-02-25', amount: 135, movingAverage: 308 },
  { date: '2024-02-26', amount: 275, movingAverage: 311 },
  { date: '2024-02-27', amount: 160, movingAverage: 298 },
  { date: '2024-02-28', amount: 380, movingAverage: 308 },
  { date: '2024-02-29', amount: 92, movingAverage: 293 },
  { date: '2024-03-01', amount: 165, movingAverage: 284 },
  { date: '2024-03-02', amount: 2500, movingAverage: 478 },
  { date: '2024-03-03', amount: 1200, movingAverage: 543 },
  { date: '2024-03-04', amount: 45, movingAverage: 508 }
];

export const mockCashFlow: CashFlowItem[] = [
  { category: 'Salary', amount: 7500, type: 'income', order: 1 },
  { category: 'Freelance', amount: 5130, type: 'income', order: 2 },
  { category: 'Rent', amount: -2400, type: 'expense', order: 3 },
  { category: 'Entertainment', amount: -1890, type: 'expense', order: 4 },
  { category: 'Healthcare', amount: -1295, type: 'expense', order: 5 },
  { category: 'Transportation', amount: -1085, type: 'expense', order: 6 },
  { category: 'Groceries', amount: -725, type: 'expense', order: 7 },
  { category: 'Utilities', amount: -520, type: 'expense', order: 8 }
];

export const mockBudgetItems: BudgetItem[] = [
  { category: 'Rent', budgeted: 1200, actual: 1200, variance: 0 },
  { category: 'Groceries', budgeted: 400, actual: 363, variance: -37 },
  { category: 'Entertainment', budgeted: 300, actual: 630, variance: 330 },
  { category: 'Transportation', budgeted: 200, actual: 362, variance: 162 },
  { category: 'Utilities', budgeted: 300, actual: 260, variance: -40 },
  { category: 'Healthcare', budgeted: 200, actual: 432, variance: 232 }
];

export const mockSpendingHeatMap: SpendingHeatMap[] = [
  { day: 'Mon', amount: 245, intensity: 0.3 },
  { day: 'Tue', amount: 180, intensity: 0.2 },
  { day: 'Wed', amount: 320, intensity: 0.4 },
  { day: 'Thu', amount: 150, intensity: 0.2 },
  { day: 'Fri', amount: 480, intensity: 0.6 },
  { day: 'Sat', amount: 620, intensity: 0.8 },
  { day: 'Sun', amount: 390, intensity: 0.5 }
];

export const categories = ['All', 'Salary', 'Rent', 'Groceries', 'Entertainment', 'Transportation', 'Utilities', 'Healthcare', 'Freelance'];

export const categoryColors = {
  'Salary': '#10b981',
  'Freelance': '#06b6d4',
  'Rent': '#ef4444',
  'Groceries': '#f59e0b',
  'Entertainment': '#8b5cf6',
  'Transportation': '#3b82f6',
  'Utilities': '#f97316',
  'Healthcare': '#ec4899'
};

export const categoryIcons = {
  'Salary': 'bi-briefcase',
  'Freelance': 'bi-laptop',
  'Rent': 'bi-house',
  'Groceries': 'bi-basket',
  'Entertainment': 'bi-controller',
  'Transportation': 'bi-car-front',
  'Utilities': 'bi-lightning',
  'Healthcare': 'bi-heart-pulse'
};
