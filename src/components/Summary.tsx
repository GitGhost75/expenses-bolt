import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Person, Expense, Balance, Settlement } from '../types';
import { calculateBalances, calculateSettlements } from '../utils/calculations';

interface SummaryProps {
  people: Person[];
  expenses: Expense[];
}

export function Summary({ people, expenses }: SummaryProps) {
  if (people.length === 0 || expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator size={24} />
          Zusammenfassung
        </h2>
        <p className="text-gray-500 text-center py-8">
          Fügen Sie Personen und Ausgaben hinzu, um die Aufteilung zu sehen
        </p>
      </div>
    );
  }

  const balances = calculateBalances(people, expenses);
  const settlements = calculateSettlements(people, balances);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const amountPerPerson = totalExpenses / people.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        <Calculator size={24} />
        Zusammenfassung
      </h2>
      <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Gesamt</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalExpenses.toFixed(2)}€</p>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Pro Person</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{amountPerPerson.toFixed(2)}€</p>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Salden</h3>
        <div className="space-y-2">
          {balances.map((balance) => {
            const person = people.find(p => p.id === balance.personId);
            const isPositive = balance.balance > 0;
            const isNeutral = Math.abs(balance.balance) < 0.01;
            
            return (
              <div
                key={balance.personId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base break-words flex-1 mr-2">{person?.name}</span>
                <span
                  className={`font-semibold text-sm sm:text-base flex-shrink-0 ${
                    isNeutral
                      ? 'text-gray-600'
                      : isPositive
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {isNeutral
                    ? 'Ausgeglichen'
                    : isPositive
                    ? `+${balance.balance.toFixed(2)}€`
                    : `${balance.balance.toFixed(2)}€`
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {settlements.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Ausgleichszahlungen</h3>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-yellow-50 rounded-md border border-yellow-200"
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base break-words">{settlement.from}</span>
                <ArrowRight size={16} className="text-yellow-600 flex-shrink-0 sm:w-4.5 sm:h-4.5" />
                <span className="font-medium text-gray-700 text-sm sm:text-base break-words">{settlement.to}</span>
                <span className="ml-auto font-semibold text-yellow-700 text-sm sm:text-base flex-shrink-0">
                  {settlement.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {settlements.length === 0 && expenses.length > 0 && (
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium text-center text-sm sm:text-base">
            🎉 Alle Ausgaben sind bereits ausgeglichen!
          </p>
        </div>
      )}
    </div>
  );
}