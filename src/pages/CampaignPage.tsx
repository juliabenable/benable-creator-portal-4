import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { StepIndicator } from '@/components/StepIndicator';
import { BrandAvatar } from '@/components/BrandAvatar';
import { useCreator } from '@/context/CreatorContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Copy,
  Package,
  Upload,
  ExternalLink,
  Send,
  PartyPopper,
  Clock,
  FileText,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Rocket,
  Image,
  Trophy,
  Star,
  Mail,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Info,
  Home,
  Edit3,
  Check,
} from 'lucide-react';
import type { Campaign, ContentLinkEntry } from '@/types';

/* ─── Sticky CTA Wrapper ─── */
function StickyCTA({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-24 md:hidden" />
      <div className="fixed bottom-0 left-0 right-0 z-30 md:static md:z-auto">
        <div className="bg-gradient-to-t from-background via-background to-transparent pt-4 pb-4 px-4 md:p-0 md:bg-none">
          <div className="max-w-lg mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}

/* ─── Content Link Preview ─── */
function ContentLinkPreview({ platform, url }: { platform: string; url: string }) {
  if (!url) return null;

  const isTikTok = platform.toLowerCase().includes('tiktok');
  const isBenable = platform.toLowerCase().includes('benable');
  const bgColor = isTikTok ? 'bg-black' : isBenable ? 'bg-primary' : 'bg-gradient-to-br from-purple-600 to-pink-500';
  const label = isTikTok ? 'TT' : isBenable ? 'BN' : 'IG';

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center shrink-0`}>
        <span className="text-white text-xs font-bold">{label}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{platform}</p>
        <p className="text-sm truncate">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
    </div>
  );
}

/* ─── Help/Contact Footer ─── */
function HelpFooter() {
  return (
    <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground py-3 mt-2">
      <HelpCircle className="w-3.5 h-3.5" />
      <span>Questions? Email <a href="mailto:collabs@benable.com" className="underline hover:text-foreground">collabs@benable.com</a></span>
    </div>
  );
}

/* ─── Platform options for content ─── */
const CONTENT_PLATFORMS = [
  { value: 'Benable Post', label: 'Benable Post' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'IG Post', label: 'IG Post' },
  { value: 'IG Reel', label: 'IG Reel' },
  { value: 'IG Story', label: 'IG Story' },
];

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns } = useCreator();

  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  // Don't show full page for declined campaigns
  if (campaign.declined) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">You've declined this campaign opportunity.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Campaign Header with Brand Avatar */}
      <div className="flex items-center gap-3">
        <BrandAvatar campaign={campaign} size="lg" />
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {campaign.brandName}
          </p>
          <h1 className="text-xl font-bold mt-0.5">{campaign.title}</h1>
        </div>
      </div>

      {/* Step Indicator — hide for interest_check */}
      {campaign.currentStep !== 'interest_check' && (
        <Card className="py-4">
          <CardContent>
            <StepIndicator currentStep={campaign.currentStep} />
          </CardContent>
        </Card>
      )}

      {/* Dynamic Step Content with Animation */}
      <div
        key={campaign.currentStep}
        className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
      >
        <StepContent campaign={campaign} />
      </div>

      <HelpFooter />
    </div>
  );
}

function StepContent({ campaign }: { campaign: Campaign }) {
  switch (campaign.currentStep) {
    case 'interest_check':
      return <InterestCheckStep campaign={campaign} />;
    case 'invitation':
      return <InvitationStep campaign={campaign} />;
    case 'product_phase':
      return <ProductPhaseStep campaign={campaign} />;
    case 'order_placed':
      return <OrderPlacedStep campaign={campaign} />;
    case 'order_received':
      return <OrderReceivedStep campaign={campaign} />;
    case 'content_upload':
      return <ContentUploadStep campaign={campaign} />;
    case 'content_review':
      return <ContentReviewStep campaign={campaign} />;
    case 'compliance_feedback':
      return <ComplianceFeedbackStep campaign={campaign} />;
    case 'content_approved':
      return <ContentApprovedStep campaign={campaign} />;
    case 'completed':
      return <CompletedStep campaign={campaign} />;
  }
}

type StepProps = { campaign: Campaign };

/* ─── Step: Interest Check (Are you interested?) ─── */
function InterestCheckStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  return (
    <div className="space-y-4">
      {/* Interest Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-5 text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg">New Campaign Opportunity</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {campaign.brandName} is interested in working with you!
          </p>
        </CardContent>
      </Card>

      {/* Campaign Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{campaign.description}</p>

          <Separator />

          {/* Brief summary bullet points */}
          <div className="space-y-2">
            {campaign.briefSummary.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Compensation</p>
              <p className="text-sm font-medium">{campaign.paymentDetails}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accept / Decline Actions */}
      {!showDecline ? (
        <div className="space-y-3">
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={() => {
              window.scrollTo(0, 0);
              setCampaignStep(campaign.id, 'invitation');
              toast.success("Great! Review the full campaign brief to accept.");
            }}
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            I'm Interested
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={() => setShowDecline(true)}
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            Not This Time
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">No problem! Help us understand why</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Please let us know why this campaign isn't a fit. This helps us send you better
              matches in the future.
            </p>
            <Textarea
              placeholder="e.g. Not available during this timeframe, doesn't align with my content, already have a competing partnership..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDecline(false)}
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!declineReason.trim()}
                onClick={() => {
                  updateCampaignField(campaign.id, {
                    declined: true,
                    declineReason: declineReason,
                  });
                  toast('Campaign declined. We\'ll find you a better match!');
                }}
              >
                Decline Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─── Step: Campaign Invitation (Full Brief — Scroll-to-Accept) ─── */
function InvitationStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  const briefEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  function handleBriefScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    if (atBottom) {
      setHasScrolledToEnd(true);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-xs text-amber-800">
            Read the full campaign brief below and scroll to the end to accept.
          </p>
        </CardContent>
      </Card>

      {/* Full Campaign Brief — Scrollable like T&C */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Campaign Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="max-h-[400px] overflow-y-auto px-5 pb-5 space-y-5"
            onScroll={handleBriefScroll}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Compensation</p>
                  <p className="text-sm font-medium">{campaign.paymentDetails}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Content Due</p>
                  <p className="text-sm font-medium">{campaign.contentDueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Publish Window</p>
                  <p className="text-sm font-medium">{campaign.publishWindowStart} — {campaign.publishWindowEnd}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Content Requirements</p>
              <ul className="space-y-1.5">
                {campaign.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {campaign.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Hash className="w-3 h-3 mr-0.5" />
                    {tag.replace('#', '')}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Terms & Commitments</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>• You agree to deliver the content as described above by the due dates specified.</li>
                <li>• All content must be submitted for review before publishing publicly.</li>
                <li>• You may not publish any content from this campaign until it has been approved.</li>
                <li>• You agree to keep the product and campaign details confidential until publication.</li>
                <li>• The brand reserves the right to request revisions to submitted content.</li>
                <li>• Compensation will be delivered after successful campaign completion.</li>
              </ul>
            </div>

            {/* Accept section — inside the brief scroll area */}
            <Separator />

            <div className={`space-y-3 transition-opacity ${hasScrolledToEnd ? 'opacity-100' : 'opacity-50'}`}>
              <p className="text-xs text-muted-foreground">
                By accepting, you agree to deliver the content as described in the brief above by
                the due dates specified. This acts as your binding commitment to this campaign.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    disabled={!hasScrolledToEnd}
                  >
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    {hasScrolledToEnd ? 'Accept & Commit' : 'Read brief to accept'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Accept Campaign Commitment</AlertDialogTitle>
                    <AlertDialogDescription>
                      By accepting, you commit to delivering content as described in the campaign brief
                      by <strong>{campaign.contentDueDate}</strong> and publishing between{' '}
                      <strong>{campaign.publishWindowStart}</strong> and{' '}
                      <strong>{campaign.publishWindowEnd}</strong>. This is a binding agreement with{' '}
                      {campaign.brandName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCampaignStep(campaign.id, 'product_phase');
                        toast.success('Campaign accepted! Check your product details.');
                      }}
                    >
                      I Accept & Commit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div ref={briefEndRef} className="pt-2">
              {!hasScrolledToEnd && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                  Scroll down to read the full brief before accepting
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Step: Product Phase (with address confirm/modify + checkout) ─── */
function ProductPhaseStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-xs text-amber-800">
            Confirm your shipping address, then use your product code to place your order.
          </p>
        </CardContent>
      </Card>

      {/* Confirm or Modify Shipping Address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!editingAddress ? (
            <>
              <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium">123 Main St</p>
                <p className="text-muted-foreground">New York, NY 10001</p>
                <p className="text-muted-foreground">United States</p>
              </div>
              {!addressConfirmed ? (
                <div className="space-y-2">
                  <Button
                    className="w-full h-11 text-base font-semibold"
                    onClick={() => {
                      setAddressConfirmed(true);
                      toast.success('Address confirmed!');
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirm Address
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => setEditingAddress(true)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Need to update your address?
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Address confirmed</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Street Address</Label>
                <Input placeholder="123 Main St" defaultValue="123 Main St" className="h-9" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">City</Label>
                  <Input placeholder="City" defaultValue="New York" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">State</Label>
                  <Input placeholder="State" defaultValue="NY" className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">ZIP</Label>
                  <Input placeholder="ZIP" defaultValue="10001" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Input placeholder="Country" defaultValue="United States" className="h-9" />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setEditingAddress(false);
                  setAddressConfirmed(true);
                  toast.success('Address updated and confirmed!');
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Save & Confirm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Code + Checkout Instructions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            Your Product Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaign.productCode && (
            <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
              <code className="text-sm font-mono font-semibold">{campaign.productCode}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(campaign.productCode || '');
                  toast.success('Code copied!');
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Use this product code at checkout on the brand's website. Add products to your
              cart, enter the code in the promo/gift code field, and complete your order as normal.
            </p>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Order Confirmation Number</Label>
            <Input
              placeholder="e.g. ORD-123456"
              value={confirmationNumber}
              onChange={(e) => setConfirmationNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the confirmation number you received after placing your order.
            </p>
          </div>
        </CardContent>
      </Card>

      <StickyCTA>
        {confirmationNumber.trim() ? (
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={() => {
              updateCampaignField(campaign.id, { orderConfirmationNumber: confirmationNumber });
              window.scrollTo(0, 0);
              setCampaignStep(campaign.id, 'order_placed');
              toast.success('Order marked as placed!');
            }}
          >
            <Package className="w-5 h-5 mr-2" />
            I've Placed My Order
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full h-12 text-base font-semibold">
                <Package className="w-5 h-5 mr-2" />
                I've Placed My Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Missing Confirmation Number</AlertDialogTitle>
                <AlertDialogDescription>
                  You haven't entered an order confirmation number. Adding it helps us track your
                  order. Would you like to go back and add it?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    // Focus the confirmation input
                    const input = document.querySelector('input[placeholder*="ORD"]') as HTMLInputElement;
                    if (input) input.focus();
                  }}
                >
                  Add Confirmation #
                </AlertDialogAction>
                <AlertDialogCancel
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCampaignStep(campaign.id, 'order_placed');
                    toast.success('Order marked as placed!');
                  }}
                >
                  Skip for Now
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </StickyCTA>

      <UpcomingSteps
        steps={[
          'Once your product arrives, confirm receipt',
          'Create your content per the brief',
          'Submit content for review before publishing',
        ]}
      />
    </div>
  );
}

/* ─── Step: Order Placed ─── */
function OrderPlacedStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm">Waiting for Delivery</span>
          </div>
          <p className="text-xs text-blue-800">
            Your order has been placed. Once the product arrives, mark it as received below.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Product is on its way</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please let us know as soon as you receive it.
          </p>
          {campaign.orderConfirmationNumber && (
            <div className="mt-4 bg-muted rounded-lg p-3 inline-block">
              <p className="text-xs text-muted-foreground">Confirmation #</p>
              <p className="text-sm font-mono font-semibold">
                {campaign.orderConfirmationNumber}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'order_received');
            toast.success('Product received! Time to create your content.');
          }}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          I've Received My Product
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Step: Order Received ─── */
function OrderReceivedStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Product Received!</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Great! Now it's time to create your content. Review the requirements and get started.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Content Requirements Reminder</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {campaign.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {campaign.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'content_upload');
            toast.success('Ready to upload your content!');
          }}
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Creating Content
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Collapsible Campaign Brief (Full) ─── */
function CampaignBriefCollapsible({ campaign }: StepProps) {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <Collapsible open={briefOpen} onOpenChange={setBriefOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Campaign Brief
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                briefOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator />
            <div className="max-h-[300px] overflow-y-auto space-y-3 pt-3 pr-1">
              <p className="text-sm text-muted-foreground">{campaign.description}</p>
              <ul className="space-y-1.5">
                {campaign.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {campaign.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                Content due: <strong>{campaign.contentDueDate}</strong>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                Publish window: <strong>{campaign.publishWindowStart} — {campaign.publishWindowEnd}</strong>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

/* ─── Step: Content Upload (Flat layout + inline compliance per deliverable) ─── */
function ContentUploadStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [links, setLinks] = useState<(ContentLinkEntry & { imageMode?: boolean })[]>(
    ['Benable Post', ...campaign.requiredPlatforms].map((p, i) => ({
      id: `link-${i}`,
      platform: p,
      type: 'link' as const,
      url: '',
      imageMode: false,
    }))
  );
  const [checking, setChecking] = useState(false);
  const [preCheckResults, setPreCheckResults] = useState<
    Record<string, { label: string; ok: boolean }[]> | null
  >(null);

  function addLink() {
    setLinks((prev) => [...prev, {
      id: `link-${Date.now()}`,
      platform: 'TikTok',
      type: 'link',
      url: '',
      imageMode: false,
    }]);
  }

  function removeLink(id: string) {
    if (links.length <= 1) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLink(id: string, field: string, value: string | boolean) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function runPreCheck() {
    setChecking(true);
    setPreCheckResults(null);
    setTimeout(() => {
      const results: Record<string, { label: string; ok: boolean }[]> = {};
      links.forEach((link) => {
        const hasContent = link.url.trim() || link.imageMode;
        const isBenable = link.platform.includes('Benable');
        results[link.id] = [
          { label: `Brand tag @${campaign.brandName.replace(/\s/g, '')} in caption`, ok: !isBenable },
          { label: `Required hashtags included`, ok: isBenable ? true : Math.random() > 0.3 },
          { label: 'Content provided', ok: !!hasContent },
        ];
      });
      setPreCheckResults(results);
      setChecking(false);
    }, 2500);
  }

  function handleSubmit() {
    updateCampaignField(campaign.id, { contentSubmissions: links.filter((l) => l.url || l.imageMode) });
    window.scrollTo(0, 0);
    setCampaignStep(campaign.id, 'content_review');
    toast.success('Content submitted for review!');
  }

  const allPassed = preCheckResults
    ? Object.values(preCheckResults).every((checks) => checks.every((c) => c.ok))
    : false;

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Upload className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-xs text-amber-800">
            Upload your draft content for review before publishing. Content is due by{' '}
            <strong>{campaign.contentDueDate}</strong>.
          </p>
        </CardContent>
      </Card>

      {/* DO NOT PUBLISH warning */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              <strong>Do not publish your content yet.</strong> All content must be reviewed and
              approved before going live. Submit your draft links below and we'll get back to you.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible brief for reference */}
      <CampaignBriefCollapsible campaign={campaign} />

      {/* Submit Your Content heading */}
      <div className="px-1">
        <h3 className="text-base font-semibold">Submit Your Content</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Share links to your draft content or upload images.
        </p>
      </div>

      {/* Flat deliverable list — each deliverable is its own card with inline compliance */}
      {links.map((link, idx) => {
        const checks = preCheckResults?.[link.id];
        const hasIssues = checks?.some((c) => !c.ok);

        return (
          <Card key={link.id} className={checks ? (hasIssues ? 'border-amber-200' : 'border-primary/30') : ''}>
            <CardContent className="py-3 space-y-2.5">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{idx + 1}.</span>
                  <Select value={link.platform} onValueChange={(v) => updateLink(link.id, 'platform', v)}>
                    <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {checks && (
                    hasIssues
                      ? <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Needs Attention</Badge>
                      : <Badge className="bg-primary/10 text-primary text-[10px] border-0">Pass</Badge>
                  )}
                </div>
                {links.length > 1 && (
                  <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Content input — stacked, not side by side */}
              {link.imageMode ? (
                <div className="flex items-center gap-2 h-9 px-3 border rounded-md bg-muted/50 text-sm text-muted-foreground cursor-pointer">
                  <Image className="w-4 h-4" />
                  <span>Upload image</span>
                </div>
              ) : (
                <Input
                  placeholder={`Paste ${link.platform} link...`}
                  value={link.url}
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  className="h-9"
                />
              )}
              <button
                onClick={() => updateLink(link.id, 'imageMode', !link.imageMode)}
                className="text-[11px] text-primary hover:underline"
              >
                {link.imageMode ? 'Switch to link' : 'Upload an image instead'}
              </button>

              {/* Inline compliance check results for THIS deliverable */}
              {checks && (
                <div className="space-y-1.5 pt-1 border-t">
                  {checks.map((check, ci) => (
                    <div
                      key={ci}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                        check.ok ? 'bg-primary/5' : 'bg-amber-50'
                      }`}
                    >
                      {check.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                      <span className={check.ok ? 'text-muted-foreground' : 'text-red-600 font-medium'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button type="button" variant="outline" size="sm" className="w-full" onClick={addLink}>
        <Plus className="w-4 h-4 mr-1" />
        Add Another Deliverable
      </Button>

      {/* Error message if compliance has issues */}
      {preCheckResults && !allPassed && (
        <p className="text-xs text-red-600 font-medium px-1">
          Some items need attention. Please fix them before submitting.
        </p>
      )}

      <StickyCTA>
        {!preCheckResults ? (
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={runPreCheck}
            disabled={checking}
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking compliance...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 mr-2" />
                Check & Submit for Review
              </>
            )}
          </Button>
        ) : (
          <Button className="w-full h-12 text-base font-semibold" onClick={handleSubmit}>
            <Send className="w-5 h-5 mr-2" />
            Submit for Review
          </Button>
        )}
      </StickyCTA>

      <UpcomingSteps
        steps={[
          "We'll review your content (1-3 business days)",
          "Once approved, you'll get your publish window",
          'Post and confirm to complete the campaign',
        ]}
      />
    </div>
  );
}

/* ─── Step: Waiting for Review ─── */
function ContentReviewStep({ campaign }: StepProps) {
  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm">Under Review</span>
          </div>
          <p className="text-xs text-blue-800">
            Your content has been submitted and is being reviewed. We'll notify you
            once there's feedback.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Waiting for Review</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            This usually takes 1-3 business days. We'll send you a notification as soon as the
            review is complete.
          </p>
        </CardContent>
      </Card>

      {/* DO NOT PUBLISH reminder */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              <strong>Do not publish your content yet.</strong> Please wait for approval before
              posting publicly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Show submitted links */}
      {campaign.contentSubmissions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submitted Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaign.contentSubmissions.map((sub, i) => (
              <ContentLinkPreview key={i} platform={sub.platform} url={sub.url} />
            ))}
          </CardContent>
        </Card>
      )}

      <CampaignBriefCollapsible campaign={campaign} />
    </div>
  );
}

/* ─── Step: Compliance Feedback (Per-Deliverable with Link Resubmission) ─── */
function ComplianceFeedbackStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  const checklist = campaign.complianceChecklist || [];

  // Group feedback by deliverable (simulate grouping)
  const deliverables = [
    {
      platform: 'TikTok',
      items: checklist.filter((c) => ['Product Visibility', 'Video Length', 'Content Quality'].includes(c.category)),
    },
    {
      platform: 'IG Reel',
      items: checklist.filter((c) => ['Hashtags', 'Lighting', 'Brand Mention'].includes(c.category)),
    },
  ];

  const [resubLinks, setResubLinks] = useState<Record<string, string>>({
    'TikTok': '',
    'IG Reel': '',
  });

  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900 text-sm">Changes Needed</span>
          </div>
          <p className="text-xs text-red-800">
            Your content needs some adjustments before it can be approved. Review the feedback
            for each deliverable below.
          </p>
        </CardContent>
      </Card>

      {/* Reviewer Notes */}
      {campaign.complianceNotes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Reviewer Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-3 text-sm italic">
              "{campaign.complianceNotes}"
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-deliverable feedback with drawers */}
      {deliverables.map((del) => {
        const needsWork = del.items.some((item) => item.status !== 'approved');
        return (
          <Collapsible key={del.platform} defaultOpen={needsWork}>
            <Card className={needsWork ? 'border-amber-200' : 'border-primary/20'}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
                  <span className="flex items-center gap-2">
                    {needsWork ? (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                    {del.platform}
                    {needsWork && (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Needs Changes</Badge>
                    )}
                    {!needsWork && (
                      <Badge className="bg-primary/10 text-primary text-[10px] border-0">Approved</Badge>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 pt-0">
                  {del.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        item.status === 'approved' ? 'bg-primary/5' : 'bg-amber-50'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.status === 'approved' ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : item.status === 'missing' ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.category}</p>
                          {item.status !== 'approved' && (
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${
                                item.status === 'missing' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                            </Badge>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Resubmit link for this deliverable */}
                  {needsWork && (
                    <div className="space-y-1.5 pt-2 border-t">
                      <Label className="text-xs">Updated {del.platform} Link</Label>
                      <Input
                        placeholder="Paste updated content link..."
                        value={resubLinks[del.platform] || ''}
                        onChange={(e) => setResubLinks((prev) => ({ ...prev, [del.platform]: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}

      {/* Collapsible brief */}
      <CampaignBriefCollapsible campaign={campaign} />

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'content_approved');
            toast.success('Updated content submitted!');
          }}
        >
          <Upload className="w-5 h-5 mr-2" />
          Resubmit Updated Content
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Step: Content Approved + Publish (Window Logic + Live Links + "I've Published") ─── */
function ContentApprovedStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [links, setLinks] = useState<ContentLinkEntry[]>(
    ['Benable Post', ...campaign.requiredPlatforms].map((p, i) => ({
      id: `pub-${i}`,
      platform: p,
      type: 'link' as const,
      url: '',
    }))
  );
  const [showMissingLinksPrompt, setShowMissingLinksPrompt] = useState(false);

  // Determine publish window status — respect admin override
  const now = new Date();
  const windowStart = new Date(campaign.publishWindowStart);
  const windowEnd = new Date(campaign.publishWindowEnd);
  const adminOverride = campaign.publishWindowOpen;
  const isPreWindow = adminOverride ? false : now < windowStart;
  const isInWindow = adminOverride ? true : (now >= windowStart && now <= windowEnd);

  // Only required (non-extra) links must have URLs before completing
  const requiredLinks = links.filter((l) => !l.id.startsWith('pub-extra-'));
  const allRequiredFilled = requiredLinks.every((l) => l.url.trim() !== '');
  const filledCount = links.filter((l) => l.url.trim() !== '').length;

  function updateLink(id: string, field: keyof ContentLinkEntry, value: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function addLink() {
    setLinks((prev) => [
      ...prev,
      { id: `pub-extra-${Date.now()}`, platform: '', type: 'link' as const, url: '' },
    ]);
  }

  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function handlePublishClick() {
    if (!allRequiredFilled) {
      setShowMissingLinksPrompt(true);
      return;
    }
    // All links filled — complete
    updateCampaignField(campaign.id, { publishedLinks: links.filter((l) => l.url) });
    window.scrollTo(0, 0);
    setCampaignStep(campaign.id, 'completed');
    toast.success('Campaign completed! Thank you!');
  }

  return (
    <div className="space-y-4">
      {/* Celebration */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-5 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Content Approved!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your content has been approved by {campaign.brandName}.
          </p>
        </CardContent>
      </Card>

      {/* Publish Window Status */}
      {isPreWindow ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-5 text-center">
            <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900">Publish Window Opens Soon</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your publish window opens on <strong>{campaign.publishWindowStart}</strong>.
              We'll notify you when it's time to post!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* "Publish your content now" CTA when in window */
        <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="py-6 text-center">
            <Rocket className="w-14 h-14 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-xl">Publish Your Content Now</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isInWindow
                ? <>Your publish window is open until <strong>{campaign.publishWindowEnd}</strong>. Post your content and submit the live links below.</>
                : 'Post your approved content and submit the live links below.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Live Public Links Input — shown during/after window */}
      {!isPreWindow && (
        <>
          <div className="px-1">
            <h3 className="text-base font-semibold">Your Live Links</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the public link for each piece of published content. All links are required.
            </p>
          </div>

          {links.map((link) => {
            const isExtra = link.id.startsWith('pub-extra-');
            return (
              <Card key={link.id}>
                <CardContent className="py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {isExtra ? (
                      <Input
                        placeholder="Platform name..."
                        value={link.platform}
                        onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                        className="h-7 text-sm font-medium w-36 px-2"
                      />
                    ) : (
                      <span className="text-sm font-medium">{link.platform}</span>
                    )}
                    {link.url.trim() ? (
                      <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 border-0 ml-auto">✓ Submitted</Badge>
                    ) : isExtra ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto text-muted-foreground">Optional</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto text-muted-foreground">Required</Badge>
                    )}
                    {isExtra && (
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder={`Paste your live ${link.platform || 'content'} link...`}
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="h-9"
                  />
                  {link.url && (
                    <ContentLinkPreview platform={link.platform || 'Other'} url={link.url} />
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Add more links button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addLink}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Another Link
          </Button>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${(filledCount / links.length) * 100}%` }}
              />
            </div>
            <span>{filledCount}/{links.length} links submitted</span>
          </div>
        </>
      )}

      {/* "I've Published My Content" button — requires all links, prompts if missing */}
      {!isPreWindow && (
        <StickyCTA>
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handlePublishClick}
          >
            <Rocket className="w-5 h-5 mr-2" />
            I've Published My Content
          </Button>
        </StickyCTA>
      )}

      {/* AlertDialog for missing links — controlled */}
      <AlertDialog open={showMissingLinksPrompt} onOpenChange={setShowMissingLinksPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Missing Live Links</AlertDialogTitle>
            <AlertDialogDescription>
              You still need to add {requiredLinks.filter((l) => !l.url.trim()).length} required live link{requiredLinks.filter((l) => !l.url.trim()).length > 1 ? 's' : ''} before
              completing the campaign. Please paste the public URL for each piece of published content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back & Add Links</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Step: Completed (Message from Benable, back to home, no summary) ─── */
function CompletedStep({ campaign: _campaign }: StepProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Celebration */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardContent className="py-6 text-center">
          <PartyPopper className="w-14 h-14 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-xl">Campaign Complete!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Amazing work! You crushed this campaign.
          </p>
        </CardContent>
      </Card>

      {/* Achievement card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900">Top Performer</p>
              <p className="text-sm text-amber-700 mt-0.5">
                You delivered content on time and met all requirements. You're one of our star creators!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center bg-white/60 rounded-lg py-2">
              <p className="text-lg font-bold text-amber-900">100%</p>
              <p className="text-[10px] text-amber-700 uppercase">On Time</p>
            </div>
            <div className="text-center bg-white/60 rounded-lg py-2">
              <p className="text-lg font-bold text-amber-900">5/5</p>
              <p className="text-[10px] text-amber-700 uppercase">Requirements</p>
            </div>
            <div className="text-center bg-white/60 rounded-lg py-2">
              <div className="flex items-center justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-[10px] text-amber-700 uppercase mt-1">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message from Benable */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Message from Benable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 italic text-sm">
            "Thank you so much for being part of this campaign! Your content was amazing and we'd love to work with you again. Keep creating great content!"
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={() => navigate('/')}
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Button>
    </div>
  );
}

/* ─── Shared: Upcoming Steps ─── */
function UpcomingSteps({ steps }: { steps: string[] }) {
  return (
    <Card className="bg-muted/50 border-dashed">
      <CardContent className="py-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Coming Up Next
        </p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
