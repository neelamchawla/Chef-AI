import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import MealPlanCard from '../components/MealPlanCard';
import TodoList from '../components/TodoList';
import GroceryList from '../components/GroceryList';
import BudgetCard from '../components/BudgetCard';
import SubstitutionsList from '../components/SubstitutionsList';
import RecommendationsList from '../components/RecommendationsList';

export default function ResultsPage() {
  const { plan } = usePlan();

  if (!plan) {
    return <Navigate to="/planner" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/planner" className="mb-2 inline-flex items-center gap-1 text-sm text-sage-600 hover:text-sage-800">
            <ArrowLeft size={16} />
            Back to planner
          </Link>
          <h1 className="font-display text-3xl font-bold text-sage-900">Your Cooking Plan</h1>
          {plan.summary && (
            <p className="mt-2 max-w-2xl text-sage-600">{plan.summary}</p>
          )}
        </div>
        <Link to="/planner" className="btn-secondary shrink-0">
          <RefreshCw size={16} />
          New Plan
        </Link>
      </div>

      <BudgetCard budget={plan.budget} />
      <MealPlanCard mealPlan={plan.meal_plan || plan.mealPlan} />
      <TodoList todoList={plan.todo_list || plan.todo} />
      <GroceryList groceryList={plan.grocery_list || plan.grocery} />
      <SubstitutionsList substitutions={plan.substitutions} />
      <RecommendationsList
        recommendations={plan.recommendations}
        summary={plan.ai_summary}
      />
    </div>
  );
}
