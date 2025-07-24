import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Person, Expense } from '../types';

interface ExpenseManagerProps {
  people: Person[];
  expenses: Expense[];
  onAddExpense: (description: string, amount: number, paidBy: string) => void;
  onRemoveExpense: (id: string) => void;
}

export function ExpenseManager({ people, expenses, onAddExpense, onRemoveExpense }: ExpenseManagerProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && amount && paidBy) {
      onAddExpense(description.trim(), parseFloat(amount), paidBy);
      setDescription('');
      setAmount('');
      setPaidBy('');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausgaben</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung (z.B. Restaurant, Taxi, etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Betrag (€)"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-1">
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bezahlt von...</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!description.trim() || !amount || !paidBy || people.length === 0}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Ausgabe hinzufügen
        </button>
      </form>

      <div className="space-y-3">
        {expenses.map((expense) => {
          const paidByPerson = people.find(p => p.id === expense.paidBy);
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{expense.description}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(expense.date)} • Bezahlt von {paidByPerson?.name}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg text-green-600">
                  {expense.amount.toFixed(2)}€
                </span>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {expenses.length === 0 && (
          <p className="text-gray-500 text-center py-8">Noch keine Ausgaben erfasst</p>
        )}
      </div>
    </div>
  );
}