import React, { useState } from 'react';
import { Plus, Users, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { Group } from '../types';

interface GroupManagerProps {
  groups: Group[];
  onAddGroup: (name: string) => void;
  onRemoveGroup: (id: string) => void;
  onSelectGroup: (id: string) => void;
}

export function GroupManager({ groups, onAddGroup, onRemoveGroup, onSelectGroup }: GroupManagerProps) {
  const [newGroupName, setNewGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getTotalExpenses = (group: Group) => {
    return group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Neue Gruppe erstellen</h2>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Gruppenname eingeben (z.B. Urlaub 2024, WG Kosten, etc.)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Erstellen</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Meine Gruppen</h2>
        
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Noch keine Gruppen erstellt</p>
            <p className="text-gray-400">Erstellen Sie Ihre erste Gruppe, um mit der Ausgaben-Aufteilung zu beginnen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                onClick={() => onSelectGroup(group.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-200">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveGroup(group.id);
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{group.people.length} Personen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Erstellt am {formatDate(group.createdAt)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gesamtausgaben:</span>
                    <span className="font-semibold text-green-600">
                      {getTotalExpenses(group).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Ausgaben:</span>
                    <span className="text-sm text-gray-500">
                      {group.expenses.length} Einträge
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}