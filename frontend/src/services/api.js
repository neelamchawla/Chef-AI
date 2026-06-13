const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function generateMealPlan(userInput) {
  const response = await fetch(`${API_BASE}/generate-meal-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInput),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to generate meal plan');
  }

  return response.json();
}

export async function processVoiceCommand(transcript, context = {}) {
  const response = await fetch(`${API_BASE}/voice-command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, context }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to process voice command');
  }

  return response.json();
}

export async function chatWithAI(message, history = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Chat request failed');
  }

  return response.json();
}
