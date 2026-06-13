import { ArrowRightLeft } from 'lucide-react';

export default function SubstitutionsList({ substitutions }) {
  if (!substitutions?.length) return null;

  return (
    <section className="card">
      <div className="mb-6 flex items-center gap-2">
        <ArrowRightLeft size={22} className="text-sage-600" />
        <h2 className="font-display text-xl font-bold text-sage-900">Ingredient Substitutions</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {substitutions.map((sub, idx) => (
          <div key={idx} className="rounded-xl border border-sage-100 bg-cream-50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-sage-900">{sub.original || sub.from}</span>
              <span className="text-sage-400">→</span>
              <span className="text-sage-700">
                {(sub.alternatives || sub.to)?.join?.(' / ') || sub.to}
              </span>
            </div>
            {sub.reason && (
              <p className="mt-2 text-xs text-sage-500">{sub.reason}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
