import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCreator } from '@/context/CreatorContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function NotificationList({ onSelect }: { onSelect?: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useCreator();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold">Notifications</p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>
      <ScrollArea className="max-h-80">
        <div className="space-y-0.5 px-1">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
                  !notif.read ? 'bg-primary/5' : 'hover:bg-muted'
                )}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionUrl) navigate(notif.actionUrl);
                  onSelect?.();
                }}
              >
                <div className="flex items-start gap-2">
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  <div className={cn(!notif.read ? '' : 'ml-4')}>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function NotificationCenter() {
  const { unreadCount } = useCreator();
  const isMobile = useIsMobile();

  const bellButton = (
    <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{bellButton}</SheetTrigger>
        <SheetContent side="top" className="max-h-[70vh]">
          <SheetHeader>
            <SheetTitle className="sr-only">Notifications</SheetTitle>
          </SheetHeader>
          <NotificationList />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{bellButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-1">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
}
