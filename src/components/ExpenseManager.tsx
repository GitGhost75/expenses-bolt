import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Receipt } from 'lucide-react';
import { Person, Expense } from '../types';

interface ExpenseManagerProps {
  people: Person[];
  expenses: Expense[];
  onAddExpense: (description: string, amount: number, paidBy: string) => void;
  onRemoveExpense: (id: string) => void;
  onEditExpense: (id: string, description: string, amount: number, paidBy: string) => void;
}

export function ExpenseManager({ people, expenses, onAddExpense, onRemoveExpense, onEditExpense }: ExpenseManagerProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingAmount, setEditingAmount] = useState('');
  const [editingPaidBy, setEditingPaidBy] = useState('');
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());
  const [isExpenseBlockExpanded, setIsExpenseBlockExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && amount && paidBy) {
      onAddExpense(description.trim(), parseFloat(amount), paidBy);
      setDescription('');
      setAmount('');
      setPaidBy('');
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditingDescription(expense.description);
    setEditingAmount(expense.amount.toString());
    setEditingPaidBy(expense.paidBy);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingDescription('');
    setEditingAmount('');
    setEditingPaidBy('');
  };

  const saveEdit = () => {
    if (editingDescription.trim() && editingAmount && editingPaidBy && editingId) {
      onEditExpense(editingId, editingDescription.trim(), parseFloat(editingAmount), editingPaidBy);
      cancelEditing();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const toggleExpense = (expenseId: string) => {
    const newExpanded = new Set(expandedExpenses);
    if (newExpanded.has(expenseId)) {
      newExpanded.delete(expenseId);
    } else {
      newExpanded.add(expenseId);
    }
    setExpandedExpenses(newExpanded);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-4 sm:-m-6 p-4 sm:p-6 rounded-t-lg transition-colors duration-200"
        onClick={() => setIsExpenseBlockExpanded(!isExpenseBlockExpanded)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-1">
          <Receipt size={24} />
          Ausgaben
          {expenses.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded-full ml-2">
              {expenses.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {expenses.length > 0 && (
            <span className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:inline">
              Gesamt: {expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}€
            </span>
          )}
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            {isExpenseBlockExpanded ? <ChevronDown size={20} className="sm:w-6 sm:h-6" /> : <ChevronRight size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>
      
      {isExpenseBlockExpanded && (
        <>
          <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 mt-4">
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung (z.B. Restaurant, Taxi, etc.)"
            className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Betrag (€)"
              step="0.01"
              min="0"
              className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-1">
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-4 py-3 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus size={18} />
          Ausgabe hinzufügen
        </button>
      </form>

          <div className="space-y-3">
        {expenses.map((expense) => {
          const paidByPerson = people.find(p => p.id === expense.paidBy);
          const isExpanded = expandedExpenses.has(expense.id);
          
          if (editingId === expense.id) {
            return (
              <div
                key={expense.id}
                className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden"
              >
                <div className="p-3 sm:p-4 space-y-3">
                  <input
                    type="text"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    placeholder="Beschreibung"
                    className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      placeholder="Betrag (€)"
                      step="0.01"
                      min="0"
                      className="flex-1 px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <select
                      value={editingPaidBy}
                      onChange={(e) => setEditingPaidBy(e.target.value)}
                      className="flex-1 px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Bezahlt von...</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={!editingDescription.trim() || !editingAmount || !editingPaidBy}
                      className="px-3 py-1.5 sm:py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1 text-sm sm:text-base"
                    >
                      <Check size={16} />
                      Speichern
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1.5 sm:py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1 text-sm sm:text-base"
                    >
                      <X size={16} />
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div 
              key={expense.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Akkordeon Header */}
              <div 
                className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleExpense(expense.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    {isExpanded ? <ChevronDown size={18} className="sm:w-5 sm:h-5" /> : <ChevronRight size={18} className="sm:w-5 sm:h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm sm:text-base break-words">{expense.description}</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {paidByPerson?.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="font-semibold text-base sm:text-lg text-green-600">
                    {expense.amount.toFixed(2)}€
                  </span>
                </div>
              </div>
              
              {/* Akkordeon Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Datum:</span>
                        <div className="text-gray-800">{formatDate(expense.date)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Bezahlt von:</span>
                        <div className="text-gray-800">{paidByPerson?.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Betrag:</span>
                        <div className="text-gray-800 font-semibold text-sm sm:text-base">{expense.amount.toFixed(2)}€</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Anteil pro Person:</span>
                        <div className="text-gray-800 text-sm sm:text-base">{(expense.amount / people.length).toFixed(2)}€</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(expense);
                        }}
                        className="px-3 py-2 sm:py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                        title="Bearbeiten"
                      >
                        <Edit2 size={16} />
                        Bearbeiten
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveExpense(expense.id);
                        }}
                        className="px-3 py-2 sm:py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {expenses.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-2">💳</div>
            <p className="text-gray-500 text-base sm:text-lg mb-1">Noch keine Ausgaben erfasst</p>
            <p className="text-gray-400 text-sm sm:text-base">Fügen Sie Ihre erste Ausgabe hinzu</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}