import { Lightbulb } from 'lucide-react';

export default function RecommendationsList({ recommendations, summary }) {
  if (!recommendations?.length && !summary) return null;

  return (
    <section className="card bg-gradient-to-br from-cream-100 to-sage-50">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={22} className="text-terracotta-500" />
        <h2 className="font-display text-xl font-bold text-sage-900">Smart Recommendations</h2>
      </div>

      {summary && (
        <p className="mb-4 rounded-xl bg-white/70 p-4 text-sm leading-relaxed text-sage-700">
          {summary}
        </p>
      )}

      {recommendations?.length > 0 && (
        <ul className="space-y-2">
          {recommendations.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-sage-700">
              <span className="mt-1 text-terracotta-500">💡</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
