import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Person } from '../types';

interface PersonManagerProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
}

export function PersonManager({ people, onAddPerson, onRemovePerson }: PersonManagerProps) {
  const [newPersonName, setNewPersonName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Gruppenmitglieder</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Name eingeben"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Hinzufügen</span>
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="font-medium text-gray-700">{person.name}</span>
            <button
              onClick={() => onRemovePerson(person.id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              disabled={people.length <= 1}
            >
              <X size={18} />
            </button>
          </div>
        ))}
        {people.length === 0 && (
          <p className="text-gray-500 text-center py-4">Noch keine Personen hinzugefügt</p>
        )}
      </div>
    </div>
  );
}