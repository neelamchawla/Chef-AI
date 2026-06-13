import { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';
import { savePlan, saveTodos, saveGroceryList } from '../services/firestore';
import VoiceAssistant from '../components/VoiceAssistant';
import MealPlanCard from '../components/MealPlanCard';
import TodoList from '../components/TodoList';
import GroceryList from '../components/GroceryList';
import BudgetCard from '../components/BudgetCard';
import SubstitutionsList from '../components/SubstitutionsList';
import ChatBot from '../components/ChatBot';

export default function VoicePage() {
  const { plan, setPlan } = usePlan();
  const { user } = useAuth();
  const [voiceResult, setVoiceResult] = useState(null);

  const handleVoiceResult = async (result) => {
    setVoiceResult(result);

    const normalized = {
      meal_plan: result.mealPlan || result.meal_plan,
      todo_list: result.todo || result.todo_list,
      grocery_list: result.grocery || result.grocery_list,
      substitutions: result.substitutions,
      budget: result.budget,
      recommendations: result.recommendations,
      summary: result.summary,
    };

    setPlan(normalized);

    if (user) {
      await savePlan(user.uid, { plan: normalized });
      if (normalized.todo_list) await saveTodos(user.uid, normalized.todo_list);
      if (normalized.grocery_list) await saveGroceryList(user.uid, normalized.grocery_list);
    }
  };

  const displayPlan = voiceResult
    ? {
        meal_plan: voiceResult.mealPlan || voiceResult.meal_plan,
        todo_list: voiceResult.todo || voiceResult.todo_list,
        grocery_list: voiceResult.grocery || voiceResult.grocery_list,
        substitutions: voiceResult.substitutions,
        budget: voiceResult.budget,
        recommendations: voiceResult.recommendations,
        summary: voiceResult.summary,
      }
    : plan;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-sage-900">Voice Assistant</h1>
        <p className="mt-2 text-sage-600">
          Speak naturally — plan meals, add todos, and update your grocery list.
        </p>
      </div>

      <VoiceAssistant onResult={handleVoiceResult} />
      <ChatBot onPlanUpdate={handleVoiceResult} />

      {displayPlan && (
        <div className="space-y-8 border-t border-sage-200 pt-8">
          <h2 className="font-display text-2xl font-bold text-sage-900">Latest Results</h2>
          {displayPlan.summary && (
            <p className="text-sage-600">{displayPlan.summary}</p>
          )}
          <BudgetCard budget={displayPlan.budget} />
          <MealPlanCard mealPlan={displayPlan.meal_plan || displayPlan.mealPlan} />
          <TodoList todoList={displayPlan.todo_list || displayPlan.todo} />
          <GroceryList groceryList={displayPlan.grocery_list || displayPlan.grocery} />
          <SubstitutionsList substitutions={displayPlan.substitutions} />
        </div>
      )}
    </div>
  );
}
