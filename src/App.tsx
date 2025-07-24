import React, { useState } from 'react';
import { PersonManager } from './components/PersonManager';
import { ExpenseManager } from './components/ExpenseManager';
import { Summary } from './components/Summary';
import { Person, Expense } from './types';
import { Receipt } from 'lucide-react';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addPerson = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name
    };
    setPeople([...people, newPerson]);
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    // Remove expenses paid by this person
    setExpenses(expenses.filter(expense => expense.paidBy !== id));
  };

  const addExpense = (description: string, amount: number, paidBy: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      paidBy,
      date: new Date()
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Receipt size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Ausgaben-Aufteilung</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Erfassen Sie Ihre Gruppenausgaben und lassen Sie sich automatisch berechnen, 
            wer wem wie viel schuldet, damit am Ende alle den gleichen Betrag bezahlt haben.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PersonManager
            people={people}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
          />
          <ExpenseManager
            people={people}
            expenses={expenses}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
          />
        </div>

        <Summary people={people} expenses={expenses} />
      </div>
    </div>
  );
}

export default App;