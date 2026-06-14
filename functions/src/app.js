import express from 'express';
import cors from 'cors';
import { generateMealPlanHandler } from './handlers/mealGeneration.js';
import { voiceCommandHandler } from './handlers/speechProcessing.js';
import { chatHandler } from './handlers/chat.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ai: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/generate-meal-plan', generateMealPlanHandler);
app.post('/api/voice-command', voiceCommandHandler);
app.post('/api/chat', chatHandler);

export default app;
