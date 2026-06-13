import { CheckCircle2, Circle } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export default function TodoList({ todoList }) {
  const { checkedItems, toggleCheck } = usePlan();

  if (!todoList?.length) return null;

  const total = todoList.reduce((acc, section) => acc + (section.tasks?.length || 0), 0);
  const checked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-sage-900">Cooking To-Do List</h2>
        {total > 0 && (
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
            {checked}/{total} done
          </span>
        )}
      </div>

      <div className="space-y-6">
        {todoList.map((section, sectionIdx) => (
          <div key={section.period || sectionIdx}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-terracotta-500">
              {section.period}
            </h3>
            <ul className="space-y-2">
              {(section.tasks || []).map((task, taskIdx) => {
                const id = `todo-${sectionIdx}-${taskIdx}`;
                const isChecked = checkedItems[id];

                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => toggleCheck(id)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        isChecked
                          ? 'border-sage-200 bg-sage-50 text-sage-500 line-through'
                          : 'border-sage-100 bg-white hover:border-sage-200'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-sage-500" />
                      ) : (
                        <Circle size={20} className="mt-0.5 shrink-0 text-sage-300" />
                      )}
                      <span className="text-sm">{task}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
