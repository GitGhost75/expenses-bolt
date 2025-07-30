import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Receipt } from 'lucide-react';
import { Person, Expense } from '../types';

interface ExpenseManagerProps {
  people: Person[];
  expenses: Expense[];
  onAddExpense: (description: string, amount: number, paidBy: string[], involvedPeople: string[]) => void;
  onRemoveExpense: (id: string) => void;
  onEditExpense: (id: string, description: string, amount: number, paidBy: string[], involvedPeople: string[]) => void;
}

export function ExpenseManager({ people, expenses, onAddExpense, onRemoveExpense, onEditExpense }: ExpenseManagerProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<string[]>([]);
  const [involvedPeople, setInvolvedPeople] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingAmount, setEditingAmount] = useState('');
  const [editingPaidBy, setEditingPaidBy] = useState<string[]>([]);
  const [editingInvolvedPeople, setEditingInvolvedPeople] = useState<string[]>([]);
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());
  const [isExpenseBlockExpanded, setIsExpenseBlockExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && amount && paidBy.length > 0 && involvedPeople.length > 0) {
      onAddExpense(description.trim(), parseFloat(amount), paidBy, involvedPeople);
      setDescription('');
      setAmount('');
      setPaidBy([]);
      setInvolvedPeople([]);
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditingDescription(expense.description);
    setEditingAmount(expense.amount.toString());
    setEditingPaidBy(expense.paidBy);
    setEditingInvolvedPeople(expense.involvedPeople);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingDescription('');
    setEditingAmount('');
    setEditingPaidBy([]);
    setEditingInvolvedPeople([]);
  };

  const saveEdit = () => {
    if (editingDescription.trim() && editingAmount && editingPaidBy.length > 0 && editingInvolvedPeople.length > 0 && editingId) {
      onEditExpense(editingId, editingDescription.trim(), parseFloat(editingAmount), editingPaidBy, editingInvolvedPeople);
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

  const togglePersonInList = (personId: string, currentList: string[], setList: (list: string[]) => void) => {
    if (currentList.includes(personId)) {
      setList(currentList.filter(id => id !== personId));
    } else {
      setList([...currentList, personId]);
    }
  };

  const PersonSelector = ({ 
    title, 
    selectedPeople, 
    onToggle, 
    allSelected = false,
    onSelectAll 
  }: { 
    title: string; 
    selectedPeople: string[]; 
    onToggle: (personId: string) => void;
    allSelected?: boolean;
    onSelectAll?: () => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{title}</label>
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {allSelected ? 'Alle abwählen' : 'Alle auswählen'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {people.map((person) => (
          <label
            key={person.id}
            className={`flex items-center p-2 rounded-md border cursor-pointer transition-colors duration-200 ${
              selectedPeople.includes(person.id)
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedPeople.includes(person.id)}
              onChange={() => onToggle(person.id)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm break-words">{person.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

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
            <PersonSelector
              title="Bezahlt von"
              selectedPeople={paidBy}
              onToggle={(personId) => togglePersonInList(personId, paidBy, setPaidBy)}
              allSelected={paidBy.length === people.length}
              onSelectAll={() => {
                if (paidBy.length === people.length) {
                  setPaidBy([]);
                } else {
                  setPaidBy(people.map(p => p.id));
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <PersonSelector
            title="Betrifft Personen"
            selectedPeople={involvedPeople}
            onToggle={(personId) => togglePersonInList(personId, involvedPeople, setInvolvedPeople)}
            allSelected={involvedPeople.length === people.length}
            onSelectAll={() => {
              if (involvedPeople.length === people.length) {
                setInvolvedPeople([]);
              } else {
                setInvolvedPeople(people.map(p => p.id));
              }
            }}
          />
          </div>
        
        <button
          type="submit"
          disabled={!description.trim() || !amount || paidBy.length === 0 || involvedPeople.length === 0 || people.length === 0}
          className="w-full px-4 py-3 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus size={18} />
          Ausgabe hinzufügen
        </button>
      </form>

          <div className="space-y-3">
        {expenses.map((expense) => {
          const paidByPeople = people.filter(p => expense.paidBy.includes(p.id));
          const involvedPeopleNames = people.filter(p => expense.involvedPeople.includes(p.id));
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
                    
                    <div className="flex-1 space-y-3">
                      <PersonSelector
                        title="Bezahlt von"
                        selectedPeople={editingPaidBy}
                        onToggle={(personId) => togglePersonInList(personId, editingPaidBy, setEditingPaidBy)}
                        allSelected={editingPaidBy.length === people.length}
                        onSelectAll={() => {
                          if (editingPaidBy.length === people.length) {
                            setEditingPaidBy([]);
                          } else {
                            setEditingPaidBy(people.map(p => p.id));
                          }
                        }}
                      />
                      
                      <PersonSelector
                        title="Betrifft Personen"
                        selectedPeople={editingInvolvedPeople}
                        onToggle={(personId) => togglePersonInList(personId, editingInvolvedPeople, setEditingInvolvedPeople)}
                        allSelected={editingInvolvedPeople.length === people.length}
                        onSelectAll={() => {
                          if (editingInvolvedPeople.length === people.length) {
                            setEditingInvolvedPeople([]);
                          } else {
                            setEditingInvolvedPeople(people.map(p => p.id));
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={!editingDescription.trim() || !editingAmount || editingPaidBy.length === 0 || editingInvolvedPeople.length === 0}
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
                      Bezahlt von: {paidByPeople.map(p => p.name).join(', ')}
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
                        <div className="text-gray-800">{paidByPeople.map(p => p.name).join(', ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Betrifft:</span>
                        <div className="text-gray-800">{involvedPeopleNames.map(p => p.name).join(', ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Betrag:</span>
                        <div className="text-gray-800 font-semibold text-sm sm:text-base">{expense.amount.toFixed(2)}€</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Anteil pro Person:</span>
                        <div className="text-gray-800 text-sm sm:text-base">{(expense.amount / expense.involvedPeople.length).toFixed(2)}€</div>
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