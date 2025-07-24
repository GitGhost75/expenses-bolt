import React, { useState } from 'react';
import { GroupManager } from './components/GroupManager';
import { PersonManager } from './components/PersonManager';
import { ExpenseManager } from './components/ExpenseManager';
import { Summary } from './components/Summary';
import { Group, Person, Expense } from './types';
import { Receipt, ArrowLeft } from 'lucide-react';

function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const activeGroup = groups.find(g => g.id === activeGroupId);

  const addGroup = (name: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      people: [],
      expenses: [],
      createdAt: new Date()
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    if (activeGroupId === id) {
      setActiveGroupId(null);
    }
  };

  const updateGroup = (updatedGroup: Group) => {
    setGroups(groups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
  };

  const addPerson = (name: string) => {
    if (!activeGroup) return;
    
    const newPerson: Person = {
      id: Date.now().toString(),
      name
    };
    
    const updatedGroup = {
      ...activeGroup,
      people: [...activeGroup.people, newPerson]
    };
    
    updateGroup(updatedGroup);
  };

  const removePerson = (id: string) => {
    if (!activeGroup) return;
    
    const updatedGroup = {
      ...activeGroup,
      people: activeGroup.people.filter(person => person.id !== id),
      expenses: activeGroup.expenses.filter(expense => expense.paidBy !== id)
    };
    
    updateGroup(updatedGroup);
  };

  const renamePerson = (id: string, newName: string) => {
    if (!activeGroup) return;
    
    const updatedGroup = {
      ...activeGroup,
      people: activeGroup.people.map(person => 
        person.id === id ? { ...person, name: newName } : person
      )
    };
    
    updateGroup(updatedGroup);
  };

  const addExpense = (description: string, amount: number, paidBy: string) => {
    if (!activeGroup) return;
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      paidBy,
      date: new Date()
    };
    
    const updatedGroup = {
      ...activeGroup,
      expenses: [...activeGroup.expenses, newExpense]
    };
    
    updateGroup(updatedGroup);
  };

  const removeExpense = (id: string) => {
    if (!activeGroup) return;
    
    const updatedGroup = {
      ...activeGroup,
      expenses: activeGroup.expenses.filter(expense => expense.id !== id)
    };
    
    updateGroup(updatedGroup);
  };

  if (!activeGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Receipt size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Ausgaben-Aufteilung</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Verwalten Sie mehrere Ausgaben-Gruppen und lassen Sie sich automatisch berechnen, 
              wer wem wie viel schuldet, damit am Ende alle den gleichen Betrag bezahlt haben.
            </p>
          </header>

          <GroupManager
            groups={groups}
            onAddGroup={addGroup}
            onRemoveGroup={removeGroup}
            onSelectGroup={setActiveGroupId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setActiveGroupId(null)}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              Zurück zu Gruppen
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Receipt size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">{activeGroup.name}</h1>
            </div>
            <p className="text-gray-600">
              Erfassen Sie die Ausgaben für diese Gruppe und sehen Sie die automatische Aufteilung
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PersonManager
            people={activeGroup.people}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
            onRenamePerson={renamePerson}
          />
          <ExpenseManager
            people={activeGroup.people}
            expenses={activeGroup.expenses}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
          />
        </div>

        <Summary people={activeGroup.people} expenses={activeGroup.expenses} />
      </div>
    </div>
  );
}

export default App;