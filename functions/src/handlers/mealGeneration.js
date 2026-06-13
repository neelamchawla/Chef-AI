import { generateWithAI } from '../services/aiService.js';
import { calculateBudgetStatus } from '../services/budgetCalculator.js';

export async function generateMealPlanHandler(req, res) {
  try {
    const userInput = req.body;

    if (!userInput || !userInput.budget) {
      return res.status(400).json({ message: 'Missing required user input' });
    }

    const plan = await generateWithAI(userInput);

    if (plan.budget) {
      plan.budget.user_budget = Number(userInput.budget);
      if (!plan.budget.status) {
        plan.budget.status = calculateBudgetStatus(userInput.budget, plan.budget.estimated_cost);
      }
    }

    return res.json(plan);
  } catch (error) {
    console.error('Meal plan error:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate meal plan' });
  }
}
