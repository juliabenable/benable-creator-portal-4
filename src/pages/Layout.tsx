import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoControls } from '@/components/DemoControls';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Toaster } from '@/components/ui/sonner';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/campaigns', icon: ClipboardList, label: 'Campaigns' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">benable</span>
        </button>
        <NotificationCenter />
      </header>

      {/* Page Content */}
      <main className="flex-1 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t md:hidden">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <DemoControls />
      <Toaster position="top-center" />
    </div>
  );
}
