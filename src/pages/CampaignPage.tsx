import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { CampaignTimeline } from '@/components/CampaignTimeline';
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
} from 'lucide-react';
import type { Campaign } from '@/types';

/* ─── Sticky CTA Wrapper ─── */
function StickyCTA({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Spacer for mobile so content isn't hidden behind sticky CTA */}
      <div className="h-20 md:hidden" />
      <div className="fixed bottom-16 left-0 right-0 z-30 md:static md:z-auto">
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
  const bgColor = isTikTok ? 'bg-black' : 'bg-gradient-to-br from-purple-600 to-pink-500';
  const label = isTikTok ? 'TT' : 'IG';

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

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns } = useCreator();
  const [timelineOpen, setTimelineOpen] = useState(false);

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

      {/* Step Indicator */}
      <Card className="py-4">
        <CardContent>
          <StepIndicator currentStep={campaign.currentStep} />
        </CardContent>
      </Card>

      {/* Collapsible Timeline */}
      <Collapsible open={timelineOpen} onOpenChange={setTimelineOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
              <span>Campaign Timeline</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  timelineOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-4">
              <CampaignTimeline
                currentStep={campaign.currentStep}
                stepTimestamps={campaign.stepTimestamps}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Dynamic Step Content with Animation */}
      <div
        key={campaign.currentStep}
        className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
      >
        <StepContent campaign={campaign} />
      </div>
    </div>
  );
}

function StepContent({ campaign }: { campaign: Campaign }) {
  switch (campaign.currentStep) {
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
    case 'compliance_feedback':
      return <ComplianceFeedbackStep campaign={campaign} />;
    case 'content_approved':
      return <ContentApprovedStep campaign={campaign} />;
    case 'completed':
      return <CompletedStep campaign={campaign} />;
  }
}

type StepProps = { campaign: Campaign };

/* ─── Step: Campaign Invitation ─── */
function InvitationStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();

  return (
    <div className="space-y-4">
      {/* Action Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-sm text-amber-800">
            Review the campaign brief below and accept to participate.
          </p>
        </CardContent>
      </Card>

      {/* Campaign Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campaign Brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{campaign.description}</p>

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
                <p className="text-xs text-muted-foreground">Publish Date</p>
                <p className="text-sm font-medium">{campaign.publishDate}</p>
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
        </CardContent>
      </Card>

      {/* Accept Section with Confirmation Dialog */}
      <Card className="border-primary/20">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Accept Campaign</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                By accepting, you agree to deliver the content as described in the brief above by
                the due dates specified. This acts as your binding commitment to this campaign.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full h-12 text-base font-semibold">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Accept & Commit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Campaign Commitment</AlertDialogTitle>
                <AlertDialogDescription>
                  By accepting, you commit to delivering content as described in the campaign brief
                  by <strong>{campaign.contentDueDate}</strong> and publishing on{' '}
                  <strong>{campaign.publishDate}</strong>. This is a binding agreement with{' '}
                  {campaign.brandName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setCampaignStep(campaign.id, 'product_phase');
                    toast.success('Campaign accepted! Check your product details.');
                  }}
                >
                  I Accept & Commit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Step: Product Phase ─── */
function ProductPhaseStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [confirmationNumber, setConfirmationNumber] = useState('');

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-sm text-amber-800">
            Use your product code to place your order, then enter your confirmation number below.
          </p>
        </CardContent>
      </Card>

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

          {campaign.productOptions && campaign.productOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Choose your product:</p>
              {campaign.productOptions.map((option) => (
                <Button
                  key={option}
                  variant={campaign.selectedProduct === option ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          <Separator />

          <div>
            <Label>Order Confirmation Number</Label>
            <Input
              placeholder="e.g. ORD-123456"
              value={confirmationNumber}
              onChange={(e) => setConfirmationNumber(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the confirmation number you received after placing your order.
            </p>
          </div>
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            if (confirmationNumber) {
              updateCampaignField(campaign.id, { orderConfirmationNumber: confirmationNumber });
            }
            setCampaignStep(campaign.id, 'order_placed');
            toast.success('Order marked as placed!');
          }}
        >
          <Package className="w-5 h-5 mr-2" />
          I've Placed My Order
        </Button>
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
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm">Waiting for Delivery</span>
          </div>
          <p className="text-sm text-blue-800">
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
            setCampaignStep(campaign.id, 'order_received');
            toast.success('Product received! Time to create your content.');
          }}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          I've Received My Product
        </Button>
      </StickyCTA>

      <UpcomingSteps
        steps={[
          'Create your content per the brief',
          'Submit content for review',
          'Publish on your scheduled date',
        ]}
      />
    </div>
  );
}

/* ─── Step: Order Received ─── */
function OrderReceivedStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Product Received!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Great! Now it's time to create your content. Review the requirements and get started.
          </p>
        </CardContent>
      </Card>

      {/* Quick Requirements Reminder */}
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

/* ─── Step: Content Upload ─── */
function ContentUploadStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-sm">Action Required</span>
          </div>
          <p className="text-sm text-amber-800">
            Upload your draft content for review before publishing. Content is due by{' '}
            <strong>{campaign.contentDueDate}</strong>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Submit Your Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share links to your draft content (unlisted or private links are fine).
          </p>
          <div>
            <Label>TikTok Video Link</Label>
            <Input
              placeholder="https://www.tiktok.com/..."
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
            />
          </div>
          {tiktokUrl && <ContentLinkPreview platform="TikTok" url={tiktokUrl} />}

          <div>
            <Label>Instagram Reel Link</Label>
            <Input
              placeholder="https://www.instagram.com/..."
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>
          {instagramUrl && <ContentLinkPreview platform="Instagram" url={instagramUrl} />}
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            const submissions = [];
            if (tiktokUrl) submissions.push({ platform: 'TikTok', url: tiktokUrl });
            if (instagramUrl) submissions.push({ platform: 'Instagram', url: instagramUrl });
            updateCampaignField(campaign.id, { contentSubmissions: submissions });
            setCampaignStep(campaign.id, 'compliance_feedback');
            toast.success('Content submitted for review!');
          }}
        >
          <Send className="w-5 h-5 mr-2" />
          Submit for Review
        </Button>
      </StickyCTA>

      <UpcomingSteps
        steps={[
          "We'll review your content",
          "Once approved, you'll get your publish date",
          'Post and confirm to complete the campaign',
        ]}
      />
    </div>
  );
}

/* ─── Step: Compliance Feedback (Structured Checklist) ─── */
function ComplianceFeedbackStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  const checklist = campaign.complianceChecklist || [];

  const needsAttention = checklist.filter((item) => item.status !== 'approved');
  const lookingGood = checklist.filter((item) => item.status === 'approved');

  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900 text-sm">Changes Needed</span>
          </div>
          <p className="text-sm text-red-800">
            Your content needs some adjustments before it can be approved. Please review the
            checklist below.
          </p>
        </CardContent>
      </Card>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Needs Attention ({needsAttention.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAttention.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="shrink-0 mt-0.5">
                  {item.status === 'missing' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.category}</p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        item.status === 'missing'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  {item.note && (
                    <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Looking Good */}
      {lookingGood.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Looking Good ({lookingGood.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lookingGood.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{item.category}</p>
                  {item.note && (
                    <p className="text-sm text-muted-foreground mt-0.5">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
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

/* ─── Step: Content Approved + Publish (Merged Flow) ─── */
function ContentApprovedStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [tiktokLink, setTiktokLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');

  return (
    <div className="space-y-4">
      {/* Celebration */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-5 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Content Approved!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your content has been approved by {campaign.brandName}. Publish on your scheduled date
            and share the links below.
          </p>
        </CardContent>
      </Card>

      {/* Publish Date */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Publish Date</p>
              <p className="text-lg font-bold text-primary">{campaign.publishDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Links Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Public Post Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you've published, share the public URLs to your posts.
          </p>
          <div>
            <Label>TikTok Post URL</Label>
            <Input
              placeholder="https://www.tiktok.com/@you/video/..."
              value={tiktokLink}
              onChange={(e) => setTiktokLink(e.target.value)}
            />
          </div>
          {tiktokLink && <ContentLinkPreview platform="TikTok" url={tiktokLink} />}

          <div>
            <Label>Instagram Post URL</Label>
            <Input
              placeholder="https://www.instagram.com/p/..."
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
            />
          </div>
          {instagramLink && <ContentLinkPreview platform="Instagram" url={instagramLink} />}
        </CardContent>
      </Card>

      {/* Complete with Confirmation Dialog */}
      <StickyCTA>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full h-12 text-base font-semibold">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirm & Complete Campaign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                By confirming, you verify that your content has been published on{' '}
                <strong>{campaign.publishDate}</strong> and the links provided are the live public
                posts. This will mark the campaign as complete.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const links = [];
                  if (tiktokLink) links.push({ platform: 'TikTok', url: tiktokLink });
                  if (instagramLink) links.push({ platform: 'Instagram', url: instagramLink });
                  updateCampaignField(campaign.id, { publishedLinks: links });
                  setCampaignStep(campaign.id, 'completed');
                  toast.success('Campaign completed! Thank you!');
                }}
              >
                Confirm & Complete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StickyCTA>
    </div>
  );
}

/* ─── Step: Completed ─── */
function CompletedStep({ campaign }: StepProps) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6 text-center">
          <PartyPopper className="w-14 h-14 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-xl">Campaign Complete!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Amazing work! Here's your campaign summary.
          </p>
        </CardContent>
      </Card>

      {/* Brand Thank You */}
      {campaign.brandThankYou && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Message from {campaign.brandName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 italic text-sm">
              "{campaign.brandThankYou}"
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Brand</span>
            <span className="font-medium">{campaign.brandName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Campaign</span>
            <span className="font-medium">{campaign.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Compensation</span>
            <span className="font-medium">{campaign.paymentDetails}</span>
          </div>
          <Separator />
          {campaign.publishedLinks.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Published Content</p>
              {campaign.publishedLinks.map((link, i) => (
                <ContentLinkPreview key={i} platform={link.platform} url={link.url || 'Link submitted'} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
