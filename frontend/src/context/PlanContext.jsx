import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToLatestPlan, subscribeToTodos } from '../services/firestore';

const PlanContext = createContext(null);

const defaultChecked = {};

export function PlanProvider({ children }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState(defaultChecked);
  const [userInput, setUserInput] = useState(null);

  useEffect(() => {
    if (!user) return undefined;

    const unsubPlan = subscribeToLatestPlan(user.uid, (savedPlan) => {
      if (savedPlan?.plan) {
        setPlan(savedPlan.plan);
        setUserInput(savedPlan.userInput || null);
      }
    });

    const unsubTodos = subscribeToTodos(user.uid, (items) => {
      if (items.length && plan?.todo_list) {
        const merged = { ...checkedItems };
        items.forEach((item, i) => {
          if (item.checked) merged[`todo-${i}`] = true;
        });
        setCheckedItems(merged);
      }
    });

    return () => {
      unsubPlan();
      unsubTodos();
    };
  }, [user]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecks = () => setCheckedItems({});

  return (
    <PlanContext.Provider
      value={{
        plan,
        setPlan,
        loading,
        setLoading,
        error,
        setError,
        checkedItems,
        toggleCheck,
        resetChecks,
        userInput,
        setUserInput,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within PlanProvider');
  return context;
}
