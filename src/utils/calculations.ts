import { Person, Expense, Balance, Settlement } from '../types';

export function calculateBalances(people: Person[], expenses: Expense[]): Balance[] {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const amountPerPerson = totalExpenses / people.length;

  const balances: Balance[] = people.map(person => {
    const paid = expenses
      .filter(expense => expense.paidBy === person.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      personId: person.id,
      balance: paid - amountPerPerson
    };
  });

  return balances;
}

export function calculateSettlements(people: Person[], balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    
    const settleAmount = Math.min(creditor.balance, Math.abs(debtor.balance));
    
    if (settleAmount > 0.01) { // Ignore very small amounts
      const creditorName = people.find(p => p.id === creditor.personId)?.name || '';
      const debtorName = people.find(p => p.id === debtor.personId)?.name || '';
      
      settlements.push({
        from: debtorName,
        to: creditorName,
        amount: settleAmount
      });
    }

    creditor.balance -= settleAmount;
    debtor.balance += settleAmount;

    if (creditor.balance < 0.01) creditorIndex++;
    if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
  }

  return settlements;
}