import { Outlet, NavLink } from 'react-router-dom';
import { ChefHat, Mic, ClipboardList, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: Sparkles },
  { to: '/planner', label: 'Planner', icon: ClipboardList },
  { to: '/voice', label: 'Voice', icon: Mic },
];

export default function Layout() {
  const { user, signIn, signOut, firebaseEnabled, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-sage-200/80 bg-cream-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-600 text-white">
              <ChefHat size={22} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-sage-900">Cook-to</span>
              <p className="text-xs text-sage-500">AI meal planning</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sage-100 text-sage-800'
                      : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {firebaseEnabled && !loading && (
            <button
              type="button"
              onClick={user ? signOut : signIn}
              className="btn-secondary text-xs"
            >
              {user ? 'Sign out' : 'Sign in'}
            </button>
          )}
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-sage-100 px-4 py-2 md:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive ? 'bg-sage-100 text-sage-800' : 'text-sage-600'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-sage-200/80 py-6 text-center text-sm text-sage-500">
        Cook-to — Your AI cooking assistant
      </footer>
    </div>
  );
}
