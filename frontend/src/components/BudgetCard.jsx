import { Wallet, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const statusConfig = {
  'Within Budget': {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    emoji: '✅',
  },
  'Slightly Over Budget': {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    emoji: '⚠️',
  },
  'Over Budget': {
    icon: TrendingDown,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    emoji: '❌',
  },
};

export default function BudgetCard({ budget }) {
  if (!budget) return null;

  const status = budget.status || 'Within Budget';
  const config = statusConfig[status] || statusConfig['Within Budget'];
  const Icon = config.icon;

  return (
    <section className={`card border-2 ${config.bg}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ${config.color}`}>
          <Wallet size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-sage-900">Budget Summary</h2>
          <div className={`mt-2 flex items-center gap-2 ${config.color}`}>
            <Icon size={18} />
            <span className="font-semibold">{config.emoji} {status}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-xs text-sage-500">Your Budget</p>
              <p className="text-lg font-bold text-sage-900">₹{budget.user_budget ?? budget.userBudget ?? 0}</p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-xs text-sage-500">Estimated Cost</p>
              <p className="text-lg font-bold text-sage-900">₹{budget.estimated_cost ?? budget.estimated ?? 0}</p>
            </div>
          </div>

          {budget.revised_total != null && (
            <p className="mt-3 text-sm text-sage-700">
              Revised total after suggestions: <strong>₹{budget.revised_total}</strong>
            </p>
          )}

          {budget.suggestions?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {budget.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-sage-700">
                  <span className="text-terracotta-500">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
