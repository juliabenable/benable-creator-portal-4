import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Gift,
  Upload,
  PartyPopper,
  Handshake,
  FileText,
  Package,
  Camera,
  Bell,
} from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { BrandAvatar } from '@/components/BrandAvatar';
import { getStepIndex, type CampaignStep } from '@/types';

const STEP_ACTION_MAP: Record<CampaignStep, { label: string; color: string; icon: React.ElementType }> = {
  invitation: { label: 'Action needed', color: 'bg-amber-500', icon: AlertCircle },
  product_phase: { label: 'Action needed', color: 'bg-amber-500', icon: Gift },
  order_placed: { label: 'Waiting for delivery', color: 'bg-blue-500', icon: Clock },
  order_received: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  content_upload: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  compliance_feedback: { label: 'Action needed', color: 'bg-red-500', icon: AlertCircle },
  content_approved: { label: 'Ready to publish', color: 'bg-emerald-500', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-emerald-500', icon: PartyPopper },
};

const WHAT_TO_EXPECT = [
  { icon: Handshake, title: 'Brand Match', description: 'Get matched with brands that align with your content style' },
  { icon: FileText, title: 'Campaign Brief', description: 'Receive detailed briefs with requirements and deadlines' },
  { icon: Package, title: 'Free Products', description: 'Get products shipped to you at no cost' },
  { icon: Camera, title: 'Create & Submit', description: 'Create authentic content and submit for brand review' },
  { icon: Gift, title: 'Get Compensated', description: 'Earn gift cards, products, and more for your work' },
];

export default function DashboardPage() {
  const { creatorName, creatorStatus, campaigns } = useCreator();
  const navigate = useNavigate();

  if (creatorStatus === 'not_applied') {
    return <Navigate to="/apply" replace />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Status Banner */}
      {creatorStatus === 'pending' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-amber-900">Application Under Review</h2>
              <p className="text-sm text-amber-700 mt-0.5">
                We're reviewing your application. You'll be notified once you're accepted.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {creatorStatus === 'accepted' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">
                Welcome{creatorName ? `, ${creatorName}` : ''}!
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                You're part of the Benable Creator Program.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns */}
      {creatorStatus === 'accepted' && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Your Campaigns</h3>
          {campaigns.length === 0 ? (
            <div className="space-y-5">
              {/* Celebration card */}
              <Card className="border-primary/20">
                <CardContent className="py-6 text-center">
                  <PartyPopper className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg">You're In!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your profile is being matched with brands. You'll receive your first campaign
                    invitation soon.
                  </p>
                </CardContent>
              </Card>

              {/* What to Expect walkthrough */}
              <div>
                <h4 className="font-semibold text-base mb-3">What to Expect</h4>
                <div className="space-y-3">
                  {WHAT_TO_EXPECT.map((item, i) => (
                    <Card key={i}>
                      <CardContent className="flex items-start gap-3 py-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Notify footer */}
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground py-2">
                <Bell className="w-4 h-4" />
                <p>We'll notify you when a campaign is ready</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => {
                const stepInfo = STEP_ACTION_MAP[campaign.currentStep];
                const StepIcon = stepInfo.icon;
                const progress = ((getStepIndex(campaign.currentStep) + 1) / 5) * 100;

                return (
                  <Card
                    key={campaign.id}
                    className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <BrandAvatar campaign={campaign} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">
                              {campaign.brandName}
                            </p>
                            <h4 className="font-semibold mt-0.5 truncate">{campaign.title}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                className={`${stepInfo.color} text-white text-[10px] px-2 py-0.5 border-0 gap-1`}
                              >
                                <StepIcon className="w-3 h-3" />
                                {stepInfo.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Next Steps Info (when pending) */}
      {creatorStatus === 'pending' && (
        <div>
          <h3 className="font-semibold text-lg mb-3">What Happens Next</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'We review your application and social media presence' },
              { step: '2', text: "Once accepted, you'll get matched with brand campaigns" },
              { step: '3', text: "You'll receive products, create content, and get compensated" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-semibold text-primary">
                  {item.step}
                </div>
                <p className="text-sm text-muted-foreground pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
