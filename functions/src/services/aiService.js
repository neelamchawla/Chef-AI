import OpenAI from 'openai';
import { generateMockPlan } from '../services/mockData.js';

let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const MEAL_PLAN_SCHEMA = `Return ONLY valid JSON with this exact structure:
{
  "summary": "Brief friendly summary of the plan",
  "meal_plan": {
    "breakfast": { "dish_name": "", "prep_time": "", "cook_time": "", "difficulty": "", "estimated_cost": 0, "calories": 0 },
    "lunch": { "dish_name": "", "prep_time": "", "cook_time": "", "difficulty": "", "estimated_cost": 0, "calories": 0 },
    "dinner": { "dish_name": "", "prep_time": "", "cook_time": "", "difficulty": "", "estimated_cost": 0, "calories": 0 }
  },
  "todo_list": [{ "period": "Morning|Afternoon|Evening", "tasks": ["task1", "task2"] }],
  "grocery_list": {
    "need_to_buy": [{ "item": "", "quantity": 0, "unit": "", "estimated_price": 0 }],
    "already_available": [{ "item": "", "quantity": 0, "unit": "" }],
    "total_estimated_cost": 0
  },
  "substitutions": [{ "original": "", "alternatives": ["alt1", "alt2"], "reason": "" }],
  "budget": {
    "user_budget": 0,
    "estimated_cost": 0,
    "status": "Within Budget|Slightly Over Budget|Over Budget",
    "suggestions": [],
    "revised_total": null
  },
  "recommendations": ["tip1", "tip2"]
}`;

export async function generateWithAI(userInput) {
  const openai = getClient();

  if (!openai) {
    return generateMockPlan(userInput);
  }

  const prompt = `You are Cook-to, an expert meal planning assistant for Indian home cooking.
Create a personalized daily cooking plan based on these user inputs:
${JSON.stringify(userInput, null, 2)}

Requirements:
- Respect dietary restrictions, allergies, and diet type (vegetarian/vegan/non-vegetarian)
- Use available ingredients when possible
- Optimize todo_list chronologically (Morning/Afternoon/Evening) to reduce duplicate prep
- Split grocery into already_available vs need_to_buy
- Compare estimated total cost vs user budget and set budget.status accordingly
- If over budget, include budget.suggestions and budget.revised_total with cheaper alternatives
- Use INR (₹) for all prices
- Provide practical substitutions for allergies, vegetarian swaps, and budget-friendly options
- Include meal prep tips and leftover reuse in recommendations

${MEAL_PLAN_SCHEMA}`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful cooking assistant. Always respond with valid JSON only, no markdown.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  return JSON.parse(content);
}

export async function processVoiceWithAI(transcript, context = {}) {
  const openai = getClient();

  if (!openai) {
    return generateMockVoiceResponse(transcript, context);
  }

  const prompt = `Process this voice command for a cooking assistant app:
"${transcript}"

Existing plan context: ${JSON.stringify(context.existingPlan || null)}

Return ONLY valid JSON:
{
  "summary": "What you understood and did",
  "mealPlan": {
    "breakfast": { "dish_name": "", "prep_time": "", "cook_time": "", "difficulty": "", "estimated_cost": 0, "calories": 0 } or null,
    "lunch": { ... } or null,
    "dinner": { ... } or null
  },
  "todo": [{ "period": "Morning|Afternoon|Evening", "tasks": [] }],
  "grocery": {
    "need_to_buy": [{ "item": "", "quantity": "", "unit": "", "estimated_price": 0 }],
    "already_available": [],
    "total_estimated_cost": 0
  },
  "substitutions": [{ "from": "", "to": ["alt1"] }],
  "budget": { "estimated": 0, "user_budget": 0, "status": "Within Budget" },
  "recommendations": []
}`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Parse cooking voice commands into structured JSON. Use INR prices.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  return JSON.parse(completion.choices[0].message.content);
}

export async function chatWithAI(message, history = []) {
  const openai = getClient();

  if (!openai) {
    return {
      message: `I'd help with "${message}" — add OPENAI_API_KEY for full AI chat. Try the meal planner form for a demo plan!`,
      plan: null,
    };
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are Cook-to, a friendly cooking assistant. Help with meal planning, groceries, and budget tips.
If the user asks to create or update a plan, include a "plan" object in your JSON response with mealPlan, todo, grocery, substitutions, budget fields.
Otherwise respond conversationally.`,
      },
      ...history.slice(-10),
      { role: 'user', content: message },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const parsed = JSON.parse(completion.choices[0].message.content);
  return {
    message: parsed.message || parsed.reply || 'How can I help with your cooking today?',
    plan: parsed.plan || null,
  };
}

function generateMockVoiceResponse(transcript, context) {
  const lower = transcript.toLowerCase();
  const hasEggs = lower.includes('egg');
  const hasBudget = lower.match(/(\d+)\s*(rupee|rs|₹)/i);
  const budget = hasBudget ? Number(hasBudget[1]) : 200;

  return {
    summary: `Planned based on: "${transcript}"`,
    mealPlan: hasEggs
      ? {
          breakfast: {
            dish_name: 'Tomato Omelette',
            prep_time: '5 min',
            cook_time: '10 min',
            difficulty: 'beginner',
            estimated_cost: 40,
            calories: 280,
          },
        }
      : null,
    todo: [
      {
        period: 'Morning',
        tasks: hasEggs ? ['Chop tomatoes', 'Whisk eggs', 'Cook omelette', 'Toast bread'] : ['Review grocery list'],
      },
    ],
    grocery: {
      need_to_buy: lower.includes('milk')
        ? [{ item: 'Milk', quantity: '1', unit: 'litre', estimated_price: 60 }]
        : [],
      already_available: [],
      total_estimated_cost: lower.includes('milk') ? 60 : 0,
    },
    substitutions: [{ from: 'Butter', to: ['Olive Oil', 'Ghee'] }],
    budget: { estimated: hasEggs ? 120 : budget, user_budget: budget, status: 'Within Budget' },
    recommendations: ['Cook extra rice at lunch and reuse for fried rice at dinner.'],
  };
}

export { calculateBudgetStatus } from './budgetCalculator.js';
