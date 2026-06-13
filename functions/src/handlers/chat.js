import { chatWithAI } from '../services/aiService.js';

export async function chatHandler(req, res) {
  try {
    const { message, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const result = await chatWithAI(message, history || []);
    return res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ message: error.message || 'Chat failed' });
  }
}
