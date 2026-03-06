import { Outlet, useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import { DemoControls } from '@/components/DemoControls';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Toaster } from '@/components/ui/sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

function HeaderMenu() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const menuContent = (onClose?: () => void) => (
    <div className="space-y-1 py-1">
      <NotificationCenter inline />
      <Separator className="my-1" />
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
        onClick={() => {
          navigate('/profile');
          onClose?.();
        }}
      >
        <User className="w-4 h-4" />
        My Profile
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          {menuContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        {menuContent()}
      </PopoverContent>
    </Popover>
  );
}

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="logo-mark w-7 h-7 rounded-lg bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF] flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="brand-name font-bold text-lg tracking-tight">benable</span>
        </button>
        <HeaderMenu />
      </header>

      {/* Page Content */}
      <main className="flex-1 pb-6">
        <Outlet />
      </main>

      <DemoControls />
      <Toaster position="top-center" />
    </div>
  );
}
