export type CreatorStatus = 'not_applied' | 'pending' | 'accepted';

export type CampaignStep =
  | 'invitation'
  | 'product_phase'
  | 'order_placed'
  | 'order_received'
  | 'content_upload'
  | 'compliance_feedback'
  | 'content_approved'
  | 'completed';

export interface SocialStats {
  platform: 'tiktok' | 'instagram';
  handle: string;
  followers: string;
  engagementRate: string;
  topCountry: string;
  topGender: string;
  topAgeRange: string;
}

export interface PastPost {
  id: string;
  platform: 'tiktok' | 'instagram';
  description: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  status: 'approved' | 'needs_improvement' | 'missing';
  note?: string;
}

export interface Notification {
  id: string;
  type: 'campaign_invite' | 'compliance_feedback' | 'reminder' | 'acceptance' | 'content_approved' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  campaignId?: string;
  actionUrl?: string;
}

export interface Campaign {
  id: string;
  brandName: string;
  brandColor?: string;
  title: string;
  description: string;
  compensationType: string;
  currentStep: CampaignStep;
  requirements: string[];
  hashtags: string[];
  contentDueDate: string;
  publishDate: string;
  paymentDetails: string;
  productType: 'gift_card' | 'product_choice';
  productCode?: string;
  productOptions?: string[];
  selectedProduct?: string;
  orderConfirmationNumber?: string;
  stepTimestamps?: Record<string, string>;
  contentSubmissions: { platform: string; url: string }[];
  complianceFeedback?: string;
  complianceChecklist?: ComplianceItem[];
  publishedLinks: { platform: string; url: string }[];
  brandThankYou?: string;
}

export const CAMPAIGN_STEPS: { key: CampaignStep; label: string }[] = [
  { key: 'invitation', label: 'Accept' },
  { key: 'product_phase', label: 'Product' },
  { key: 'content_upload', label: 'Content' },
  { key: 'content_approved', label: 'Publish' },
  { key: 'completed', label: 'Complete' },
];

export function getStepIndex(step: CampaignStep): number {
  switch (step) {
    case 'invitation':
      return 0;
    case 'product_phase':
    case 'order_placed':
    case 'order_received':
      return 1;
    case 'content_upload':
    case 'compliance_feedback':
      return 2;
    case 'content_approved':
      return 3;
    case 'completed':
      return 4;
  }
}

export const ALL_STEPS_ORDERED: CampaignStep[] = [
  'invitation',
  'product_phase',
  'order_placed',
  'order_received',
  'content_upload',
  'compliance_feedback',
  'content_approved',
  'completed',
];
