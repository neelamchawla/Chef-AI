import { calculateBudgetStatus, getBudgetSuggestions } from '../services/budgetCalculator.js';

export function generateMockPlan(userInput) {
  const budget = Number(userInput.budget) || 500;
  const people = Number(userInput.numberOfPeople) || 2;
  const isVeg = userInput.dietType === 'vegetarian' || userInput.dietType === 'vegan';
  const ingredients = (userInput.availableIngredients || '').toLowerCase();

  const hasRice = ingredients.includes('rice');
  const hasEggs = ingredients.includes('egg');
  const hasOnion = ingredients.includes('onion');

  const breakfast = hasEggs
    ? { dish_name: 'Masala Omelette with Toast', prep_time: '10 min', cook_time: '10 min', difficulty: 'beginner', estimated_cost: 45, calories: 320 }
    : { dish_name: 'Vegetable Upma', prep_time: '10 min', cook_time: '15 min', difficulty: 'beginner', estimated_cost: 35, calories: 280 };

  const lunch = isVeg
    ? { dish_name: 'Vegetable Pulao', prep_time: '15 min', cook_time: '25 min', difficulty: 'intermediate', estimated_cost: 80, calories: 450 }
    : { dish_name: 'Chicken Pulao', prep_time: '20 min', cook_time: '30 min', difficulty: 'intermediate', estimated_cost: 150, calories: 520 };

  const dinner = isVeg
    ? { dish_name: 'Dal Tadka with Rice', prep_time: '10 min', cook_time: '35 min', difficulty: 'beginner', estimated_cost: 60, calories: 400 }
    : { dish_name: 'Chicken Curry with Rice', prep_time: '15 min', cook_time: '40 min', difficulty: 'intermediate', estimated_cost: 180, calories: 550 };

  const mealCost = breakfast.estimated_cost + lunch.estimated_cost + dinner.estimated_cost;
  const groceryCost = Math.round(mealCost * 0.85);

  const needToBuy = [
    { item: 'Fresh vegetables', quantity: 500, unit: 'g', estimated_price: 40 },
    { item: 'Cooking oil', quantity: 100, unit: 'ml', estimated_price: 25 },
  ];

  if (!hasRice) needToBuy.push({ item: 'Basmati rice', quantity: 500, unit: 'g', estimated_price: 60 });
  if (!isVeg) needToBuy.push({ item: 'Chicken', quantity: 500, unit: 'g', estimated_price: 120 });
  if (!hasOnion) needToBuy.push({ item: 'Onions', quantity: 250, unit: 'g', estimated_price: 20 });

  const alreadyAvailable = [];
  if (hasRice) alreadyAvailable.push({ item: 'Rice', quantity: 1, unit: 'kg' });
  if (hasEggs) alreadyAvailable.push({ item: 'Eggs', quantity: 6, unit: 'pcs' });
  if (hasOnion) alreadyAvailable.push({ item: 'Onions', quantity: 3, unit: 'pcs' });

  const totalGrocery = needToBuy.reduce((sum, i) => sum + i.estimated_price, 0);
  const budgetAnalysis = getBudgetSuggestions(budget, totalGrocery, needToBuy);

  const name = userInput.name ? `${userInput.name}'s` : 'Your';

  return {
    summary: `${name} personalized plan for ${people} people — ${isVeg ? 'vegetarian' : 'balanced'} meals optimized for ${userInput.cookingTime || 60} minutes of cooking time.`,
    meal_plan: { breakfast, lunch, dinner },
    todo_list: [
      {
        period: 'Morning',
        tasks: [
          isVeg ? 'Soak dal for 30 minutes' : 'Marinate chicken for 30 minutes',
          'Chop onions, tomatoes, and vegetables',
          `Prepare ${breakfast.dish_name.toLowerCase()}`,
        ],
      },
      {
        period: 'Afternoon',
        tasks: [
          hasRice ? 'Use available rice' : 'Wash and soak rice',
          `Cook ${lunch.dish_name.toLowerCase()}`,
          'Prep salad or raita side',
        ],
      },
      {
        period: 'Evening',
        tasks: [
          `Finish ${dinner.dish_name.toLowerCase()}`,
          'Heat roti or prepare fresh rice',
          'Set table and pack leftovers',
        ],
      },
    ],
    grocery_list: {
      need_to_buy: needToBuy,
      already_available: alreadyAvailable,
      total_estimated_cost: totalGrocery,
    },
    substitutions: [
      { original: 'Butter', alternatives: ['Olive oil', 'Ghee'], reason: 'Budget-friendly and lactose-free option' },
      { original: 'Chicken', alternatives: ['Tofu', 'Paneer', 'Soya chunks'], reason: 'Vegetarian protein swap' },
      { original: 'Milk', alternatives: ['Almond milk', 'Soy milk'], reason: 'Dairy allergy alternative' },
      { original: 'Spinach', alternatives: ['Kale', 'Methi leaves'], reason: 'Seasonal green substitute' },
    ],
    budget: {
      user_budget: budget,
      estimated_cost: totalGrocery,
      status: budgetAnalysis.status,
      suggestions: budgetAnalysis.suggestions,
      revised_total: budgetAnalysis.revised_total,
    },
    recommendations: [
      'Cook extra rice at lunch and reuse it for fried rice or lemon rice at dinner.',
      'Chop all vegetables in the morning to save time during lunch and dinner prep.',
      'Batch-cook dal in the afternoon — it tastes better reheated and saves evening effort.',
      userInput.nutritionGoal
        ? `Aim for balanced portions across three meals to meet your goal: ${userInput.nutritionGoal}.`
        : 'Include a protein source in each meal for sustained energy.',
    ],
  };
}
