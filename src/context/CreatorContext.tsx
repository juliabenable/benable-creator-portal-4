import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CreatorStatus, Campaign, CampaignStep, Notification } from '@/types';
import { ALL_STEPS_ORDERED } from '@/types';

interface CreatorContextType {
  creatorName: string;
  creatorStatus: CreatorStatus;
  campaigns: Campaign[];
  notifications: Notification[];
  unreadCount: number;
  setCreatorStatus: (status: CreatorStatus) => void;
  submitApplication: (name: string) => void;
  setCampaignStep: (campaignId: string, step: CampaignStep) => void;
  advanceCampaignStep: (campaignId: string) => void;
  updateCampaignField: (campaignId: string, updates: Partial<Campaign>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  resetAll: () => void;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-1',
    brandName: '28 Lycia',
    brandColor: '#9B6B4A',
    title: 'Summer Glow Collection Launch',
    description:
      'Create engaging content showcasing our new Summer Glow Collection. We want authentic, creative content that highlights the product benefits and your personal skincare routine.',
    compensationType: 'Gift Card + Product',
    currentStep: 'invitation',
    requirements: [
      'Create 1 TikTok video (30-60 seconds) showcasing the product',
      'Create 1 Instagram Reel featuring the product in your skincare routine',
      'Include brand mention @28Lycia in caption',
      'Show product packaging in at least 2 shots',
      'Use natural lighting for all content',
    ],
    hashtags: ['#28Lycia', '#SummerGlow', '#SkincareRoutine', '#Ad', '#Gifted'],
    contentDueDate: '2026-03-20',
    publishDate: '2026-03-25',
    paymentDetails: '$50 gift card + free product (valued at $85)',
    productType: 'gift_card',
    productCode: 'LYCIA-SUMMER-2026-XK9F',
    contentSubmissions: [],
    complianceChecklist: [
      { id: 'c1', category: 'Product Visibility', status: 'needs_improvement', note: 'Product packaging not clearly visible in first 3 seconds of TikTok video' },
      { id: 'c2', category: 'Hashtags', status: 'missing', note: '#Ad hashtag missing from Instagram caption' },
      { id: 'c3', category: 'Lighting', status: 'needs_improvement', note: 'Instagram Reel lighting could be improved — try natural lighting near a window' },
      { id: 'c4', category: 'Brand Mention', status: 'approved', note: 'Great job including @28Lycia!' },
      { id: 'c5', category: 'Video Length', status: 'approved' },
      { id: 'c6', category: 'Content Quality', status: 'approved', note: 'Excellent production quality' },
    ],
    publishedLinks: [],
    brandThankYou:
      "Thank you so much for being part of our Summer Glow launch! Your content was amazing and we'd love to work with you again. Keep glowing!",
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'campaign_invite',
    title: 'New Campaign Invitation',
    message: '28 Lycia has invited you to their Summer Glow Collection Launch campaign.',
    timestamp: new Date().toISOString(),
    read: false,
    campaignId: 'campaign-1',
    actionUrl: '/campaign/campaign-1',
  },
  {
    id: 'notif-2',
    type: 'acceptance',
    title: 'Welcome to Benable!',
    message: 'Your creator application has been accepted. Start exploring campaigns!',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

const STEP_NOTIFICATION_MAP: Partial<Record<CampaignStep, { type: Notification['type']; title: string; message: string }>> = {
  compliance_feedback: { type: 'compliance_feedback', title: 'Changes Needed', message: 'Your content needs some adjustments. Please review the feedback.' },
  content_approved: { type: 'content_approved', title: 'Content Approved!', message: 'Your content has been approved. Time to publish!' },
  completed: { type: 'general', title: 'Campaign Complete', message: 'Congratulations! Your campaign has been marked as complete.' },
};

function formatStepDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CreatorContext = createContext<CreatorContextType | null>(null);

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [creatorName, setCreatorName] = useState('');
  const [creatorStatus, setCreatorStatus] = useState<CreatorStatus>('not_applied');
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      { ...notif, id: `notif-${Date.now()}`, timestamp: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  function submitApplication(name: string) {
    setCreatorName(name);
    setCreatorStatus('pending');
  }

  function setCampaignStep(campaignId: string, step: CampaignStep) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        return {
          ...c,
          currentStep: step,
          stepTimestamps: { ...c.stepTimestamps, [step]: formatStepDate() },
        };
      })
    );
    // Auto-generate notification
    const notifTemplate = STEP_NOTIFICATION_MAP[step];
    if (notifTemplate) {
      addNotification({ ...notifTemplate, campaignId, actionUrl: `/campaign/${campaignId}` });
    }
  }

  function advanceCampaignStep(campaignId: string) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        const currentIndex = ALL_STEPS_ORDERED.indexOf(c.currentStep);
        const nextStep = ALL_STEPS_ORDERED[currentIndex + 1];
        if (!nextStep) return c;
        return {
          ...c,
          currentStep: nextStep,
          stepTimestamps: { ...c.stepTimestamps, [nextStep]: formatStepDate() },
        };
      })
    );
  }

  function updateCampaignField(campaignId: string, updates: Partial<Campaign>) {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...updates } : c))
    );
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function resetAll() {
    setCreatorName('');
    setCreatorStatus('not_applied');
    setCampaigns(INITIAL_CAMPAIGNS);
    setNotifications(INITIAL_NOTIFICATIONS);
  }

  return (
    <CreatorContext.Provider
      value={{
        creatorName,
        creatorStatus,
        campaigns,
        notifications,
        unreadCount,
        setCreatorStatus,
        submitApplication,
        setCampaignStep,
        advanceCampaignStep,
        updateCampaignField,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        resetAll,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
