import { processVoiceWithAI } from '../services/aiService.js';

export async function voiceCommandHandler(req, res) {
  try {
    const { transcript, context } = req.body;

    if (!transcript?.trim()) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    const result = await processVoiceWithAI(transcript, context || {});
    return res.json(result);
  } catch (error) {
    console.error('Voice command error:', error);
    return res.status(500).json({ message: error.message || 'Failed to process voice command' });
  }
}
