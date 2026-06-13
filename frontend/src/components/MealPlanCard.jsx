import { Coffee, Sun, Moon } from 'lucide-react';

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
};

const mealLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

export default function MealPlanCard({ mealPlan }) {
  if (!mealPlan) return null;

  return (
    <section className="card">
      <h2 className="mb-6 font-display text-xl font-bold text-sage-900">Meal Plan</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {['breakfast', 'lunch', 'dinner'].map((meal) => {
          const data = mealPlan[meal];
          if (!data) return null;
          const Icon = mealIcons[meal];

          return (
            <div key={meal} className="rounded-xl border border-sage-100 bg-cream-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sage-600">
                <Icon size={18} />
                <span className="text-sm font-semibold uppercase tracking-wide">{mealLabels[meal]}</span>
              </div>
              <h3 className="font-semibold text-sage-900">{data.dish_name || data.name}</h3>
              <dl className="mt-3 space-y-1.5 text-sm text-sage-600">
                {data.prep_time && (
                  <div className="flex justify-between">
                    <dt>Prep</dt>
                    <dd>{data.prep_time}</dd>
                  </div>
                )}
                {data.cook_time && (
                  <div className="flex justify-between">
                    <dt>Cook</dt>
                    <dd>{data.cook_time}</dd>
                  </div>
                )}
                {data.difficulty && (
                  <div className="flex justify-between">
                    <dt>Difficulty</dt>
                    <dd className="capitalize">{data.difficulty}</dd>
                  </div>
                )}
                {data.estimated_cost != null && (
                  <div className="flex justify-between">
                    <dt>Cost</dt>
                    <dd>₹{data.estimated_cost}</dd>
                  </div>
                )}
                {data.calories != null && (
                  <div className="flex justify-between">
                    <dt>Calories</dt>
                    <dd>~{data.calories} kcal</dd>
                  </div>
                )}
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}
