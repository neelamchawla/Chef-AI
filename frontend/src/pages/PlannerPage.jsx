import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';
import { generateMealPlan } from '../services/api';
import { savePlan } from '../services/firestore';
import ProgressSteps from '../components/ProgressSteps';
import {
  initialFormState,
  skillLevels,
  dietTypes,
  cookingTimeOptions,
} from '../utils/formDefaults';

export default function PlannerPage() {
  const navigate = useNavigate();
  const { setPlan, setLoading, setError, setUserInput, loading, error } = usePlan();
  const { user, signIn } = useAuth();
  const [form, setForm] = useState(initialFormState);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        numberOfPeople: Number(form.numberOfPeople),
        budget: Number(form.budget),
        cookingTime: Number(form.cookingTime),
      };

      const result = await generateMealPlan(payload);
      setPlan(result);
      setUserInput(payload);

      if (user) {
        await savePlan(user.uid, { plan: result, userInput: payload });
      } else if (signIn) {
        try {
          const signedInUser = await signIn();
          if (signedInUser) {
            await savePlan(signedInUser.uid, { plan: result, userInput: payload });
          }
        } catch {
          // Firebase optional — plan still works locally
        }
      }

      navigate('/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-sage-900">Plan Your Day</h1>
        <p className="mt-2 text-sage-600">Tell us about your preferences and we&apos;ll create your cooking plan.</p>
      </div>

      <ProgressSteps current={step} total={totalSteps} labels={['Basics', 'Preferences', 'Details']} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {step === 1 && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-sage-900">Basic Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Name (optional)</label>
                <input id="name" className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="label" htmlFor="date">Date</label>
                <input id="date" type="date" className="input-field" value={form.date} onChange={(e) => update('date', e.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="people">Number of people</label>
                <input id="people" type="number" min="1" max="20" className="input-field" value={form.numberOfPeople} onChange={(e) => update('numberOfPeople', e.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="time">Available cooking time</label>
                <select id="time" className="input-field" value={form.cookingTime} onChange={(e) => update('cookingTime', e.target.value)}>
                  {cookingTimeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="budget">Budget for the day (₹)</label>
                <input id="budget" type="number" min="50" className="input-field" value={form.budget} onChange={(e) => update('budget', e.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="skill">Skill level</label>
                <select id="skill" className="input-field" value={form.skillLevel} onChange={(e) => update('skillLevel', e.target.value)}>
                  {skillLevels.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-sage-900">Meal Preferences</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="diet">Diet type</label>
                <select id="diet" className="input-field" value={form.dietType} onChange={(e) => update('dietType', e.target.value)}>
                  {dietTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="cuisine">Cuisine preference</label>
                <input id="cuisine" className="input-field" value={form.cuisinePreference} onChange={(e) => update('cuisinePreference', e.target.value)} placeholder="e.g. Indian, Italian, Mexican" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="breakfast">Breakfast preference</label>
                <input id="breakfast" className="input-field" value={form.breakfastPreference} onChange={(e) => update('breakfastPreference', e.target.value)} placeholder="Light, hearty, quick, etc." />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="lunch">Lunch preference</label>
                <input id="lunch" className="input-field" value={form.lunchPreference} onChange={(e) => update('lunchPreference', e.target.value)} placeholder="Salads, rice dishes, sandwiches, etc." />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="dinner">Dinner preference</label>
                <input id="dinner" className="input-field" value={form.dinnerPreference} onChange={(e) => update('dinnerPreference', e.target.value)} placeholder="Curry, pasta, stir-fry, etc." />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-sage-900">Restrictions & Kitchen</h2>
            <div className="grid gap-4">
              <div>
                <label className="label" htmlFor="dietary">Dietary restrictions</label>
                <input id="dietary" className="input-field" value={form.dietaryRestrictions} onChange={(e) => update('dietaryRestrictions', e.target.value)} placeholder="Gluten-free, low-sodium, etc." />
              </div>
              <div>
                <label className="label" htmlFor="allergies">Allergies</label>
                <input id="allergies" className="input-field" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="Nuts, dairy, shellfish, etc." />
              </div>
              <div>
                <label className="label" htmlFor="ingredients">Ingredients already at home</label>
                <textarea id="ingredients" rows={3} className="input-field resize-none" value={form.availableIngredients} onChange={(e) => update('availableIngredients', e.target.value)} placeholder="eggs, bread, tomatoes, rice, onions..." />
              </div>
              <div>
                <label className="label" htmlFor="appliances">Kitchen appliances</label>
                <input id="appliances" className="input-field" value={form.appliances} onChange={(e) => update('appliances', e.target.value)} placeholder="Stove, oven, microwave, air fryer, blender..." />
              </div>
              <div>
                <label className="label" htmlFor="nutrition">Calories / nutrition goal (optional)</label>
                <input id="nutrition" className="input-field" value={form.nutritionGoal} onChange={(e) => update('nutritionGoal', e.target.value)} placeholder="e.g. 2000 calories, high protein" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-3">
          {step > 1 ? (
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              Continue
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Plan
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
