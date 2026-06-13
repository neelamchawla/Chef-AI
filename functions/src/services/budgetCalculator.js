export function calculateBudgetStatus(userBudget, estimatedCost) {
  const budget = Number(userBudget) || 0;
  const cost = Number(estimatedCost) || 0;

  if (budget === 0) return 'Within Budget';

  const ratio = cost / budget;

  if (ratio <= 1) return 'Within Budget';
  if (ratio <= 1.15) return 'Slightly Over Budget';
  return 'Over Budget';
}

export function getBudgetSuggestions(userBudget, estimatedCost, groceryItems = []) {
  const status = calculateBudgetStatus(userBudget, estimatedCost);
  const suggestions = [];
  let revisedTotal = estimatedCost;

  if (status === 'Over Budget' || status === 'Slightly Over Budget') {
    const overBy = estimatedCost - userBudget;
    suggestions.push(`You're ₹${Math.round(overBy)} over budget.`);

    const expensive = [...groceryItems]
      .filter((i) => i.estimated_price > 50)
      .sort((a, b) => b.estimated_price - a.estimated_price);

    expensive.slice(0, 3).forEach((item) => {
      suggestions.push(`Swap ${item.item} for a budget-friendly alternative to save ~₹${Math.round(item.estimated_price * 0.3)}`);
      revisedTotal -= item.estimated_price * 0.3;
    });

    suggestions.push('Consider simpler one-pot meals to reduce ingredient costs.');
  }

  return {
    status,
    suggestions,
    revised_total: status !== 'Within Budget' ? Math.round(revisedTotal) : null,
  };
}
