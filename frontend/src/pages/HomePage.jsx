import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  ShoppingCart,
  Wallet,
  UtensilsCrossed,
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Personalized Meals',
    description: 'Breakfast, lunch, and dinner tailored to your schedule and tastes.',
  },
  {
    icon: CheckCircle2,
    title: 'Smart To-Do List',
    description: 'Chronological prep tasks optimized to save time and reduce duplicate work.',
  },
  {
    icon: ShoppingCart,
    title: 'Grocery Lists',
    description: 'Split into what you have and what you need, with quantities and prices.',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'See if your plan fits your budget with smart cost-saving suggestions.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-600 via-sage-700 to-sage-800 px-6 py-16 text-white sm:px-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-sage-200">
            AI-Powered Cooking
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Your day, your meals, your budget — planned in minutes
          </h1>
          <p className="mt-4 text-lg text-sage-100">
            Tell us about your day and preferences. Cook-to generates a full meal plan,
            cooking checklist, grocery list, and budget analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/planner" className="btn-primary bg-white text-sage-800 hover:bg-cream-100">
              Start Planning
              <ArrowRight size={18} />
            </Link>
            <Link to="/voice" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Mic size={18} />
              Try Voice Assistant
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-terracotta-500/20" />
      </section>

      <section>
        <h2 className="font-display mb-8 text-2xl font-bold text-sage-900">What you get</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card transition hover:shadow-md">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-sage-900">{title}</h3>
              <p className="mt-2 text-sm text-sage-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card bg-gradient-to-r from-cream-100 to-sage-50">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-sage-900">Ready to cook smarter?</h2>
            <p className="mt-1 text-sage-600">Fill in your preferences and let AI do the planning.</p>
          </div>
          <Link to="/planner" className="btn-primary shrink-0">
            Create My Plan
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
