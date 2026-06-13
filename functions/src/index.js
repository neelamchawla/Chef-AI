import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateMealPlanHandler } from './handlers/mealGeneration.js';
import { voiceCommandHandler } from './handlers/speechProcessing.js';
import { chatHandler } from './handlers/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ai: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/generate-meal-plan', generateMealPlanHandler);
app.post('/api/voice-command', voiceCommandHandler);
app.post('/api/chat', chatHandler);

app.listen(PORT, () => {
  console.log(`Cook-to API running on http://localhost:${PORT}`);
});
