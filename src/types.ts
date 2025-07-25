export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
}

export interface Balance {
  personId: string;
  balance: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}