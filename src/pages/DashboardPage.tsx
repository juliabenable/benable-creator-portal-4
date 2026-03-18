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
  Heart,
  TrendingUp,
  ThumbsUp,
  HelpCircle,
} from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { BrandAvatar } from '@/components/BrandAvatar';
import { getStepIndex, type CampaignStep } from '@/types';

const STEP_ACTION_MAP: Record<CampaignStep, { label: string; color: string; icon: React.ElementType }> = {
  interest_check: { label: 'Are you interested?', color: 'bg-purple-500', icon: ThumbsUp },
  invitation: { label: 'Action needed', color: 'bg-amber-500', icon: AlertCircle },
  product_phase: { label: 'Action needed', color: 'bg-amber-500', icon: Gift },
  order_placed: { label: 'Waiting for delivery', color: 'bg-blue-500', icon: Clock },
  order_received: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  content_upload: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  content_review: { label: 'Under review', color: 'bg-blue-500', icon: Clock },
  compliance_feedback: { label: 'Action needed', color: 'bg-red-500', icon: AlertCircle },
  content_approved: { label: 'Ready to publish', color: 'bg-emerald-500', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-emerald-500', icon: PartyPopper },
};

const WHAT_TO_EXPECT = [
  { icon: Handshake, title: 'Brand Match', description: 'Get matched with brands that align with your content style' },
  { icon: FileText, title: 'Campaign Brief', description: 'Receive detailed briefs with requirements and deadlines' },
  { icon: Package, title: 'Free Products or Gift Cards', description: 'Get products shipped to you or gift cards for each campaign' },
  { icon: Camera, title: 'Create & Submit', description: 'Create authentic content and submit for brand review' },
  { icon: Gift, title: 'Get Compensated', description: 'Earn gift cards, products, and more for your work' },
];

export default function DashboardPage() {
  const { creatorName, creatorStatus, campaigns } = useCreator();
  const navigate = useNavigate();

  if (creatorStatus === 'not_applied') {
    return <Navigate to="/apply" replace />;
  }

  // Separate interest-check campaigns from active ones
  const interestCampaigns = campaigns.filter((c) => c.currentStep === 'interest_check' && !c.declined);
  const activeCampaigns = campaigns.filter((c) => c.currentStep !== 'interest_check' && !c.declined);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Status Banner */}
      {creatorStatus === 'pending' && (
        <Card className="border-pink-200 bg-pink-50">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="icon-container w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-pink-600 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <h2 className="font-semibold text-pink-900">Application Under Review</h2>
              <p className="text-sm text-pink-700 mt-0.5">
                We're reviewing your application. You'll be notified once you're accepted.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {creatorStatus === 'accepted' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="icon-container w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" style={{ animationDuration: '2.5s' }} />
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

      {/* Interest Check Cards (are you interested?) */}
      {creatorStatus === 'accepted' && interestCampaigns.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3 section-title">New Opportunities</h3>
          <div className="space-y-3">
            {interestCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="group cursor-pointer border-purple-200 bg-purple-50/50 hover:shadow-md transition-shadow active:scale-[0.99]"
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
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {campaign.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-purple-500 text-white text-[10px] px-2 py-0.5 border-0 gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            Are you interested?
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 shrink-0 mt-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      {creatorStatus === 'accepted' && (
        <div>
          <h3 className="font-semibold text-lg mb-3 section-title">Your Campaigns</h3>
          {activeCampaigns.length === 0 && interestCampaigns.length === 0 ? (
            <div className="space-y-5">
              <Card className="border-primary/20">
                <CardContent className="py-6 text-center">
                  <div className="relative mx-auto w-12 h-12 mb-3">
                    <PartyPopper className="welcome-icon w-12 h-12 text-primary mx-auto animate-bounce" style={{ animationDuration: '2.5s' }} />
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                  </div>
                  <h3 className="font-bold text-lg">You're In!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your profile is being matched with brands. You'll receive your first campaign
                    invitation soon.
                  </p>
                </CardContent>
              </Card>

              <div>
                <h4 className="font-semibold text-base mb-3 section-title">What to Expect</h4>
                <div className="space-y-3">
                  {WHAT_TO_EXPECT.map((item, i) => (
                    <Card key={i}>
                      <CardContent className="flex items-start gap-3 py-3">
                        <div className="icon-container w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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

              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground py-2">
                <Bell className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
                <p>We'll notify you when a campaign is ready</p>
              </div>
            </div>
          ) : activeCampaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active campaigns yet. Check the opportunities above!
            </p>
          ) : (
            <div className="space-y-3">
              {activeCampaigns.map((campaign) => {
                const stepInfo = STEP_ACTION_MAP[campaign.currentStep];
                const StepIcon = stepInfo.icon;
                const progress = ((getStepIndex(campaign.currentStep) + 1) / 6) * 100;

                return (
                  <Card
                    key={campaign.id}
                    className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99] overflow-hidden"
                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                  >
                    {/* Progress bar at top of card */}
                    <div className="h-1 bg-muted">
                      <div
                        className="h-full bg-primary rounded-r-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <BrandAvatar campaign={campaign} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground font-medium">
                              {campaign.brandName}
                            </p>
                            <Badge
                              className={`${stepInfo.color} text-white text-[10px] px-2 py-0.5 border-0 gap-1 shrink-0`}
                            >
                              <StepIcon className="w-3 h-3" />
                              {stepInfo.label}
                            </Badge>
                          </div>
                          <h4 className="font-semibold mt-0.5 truncate">{campaign.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {campaign.compensationType} · Due {campaign.contentDueDate}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Not Accepted State */}
      {creatorStatus === 'not_accepted' && (
        <div className="space-y-5">
          <Card className="border-muted">
            <CardContent className="py-6 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 animate-pulse" style={{ animationDuration: '3s' }} />
              <h3 className="font-bold text-lg">Thanks for Applying!</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                We're growing quickly and spots in our creator program are limited right now.
                Unfortunately, we're not able to offer a spot at this time — but we'd love to
                reconsider as the program expands.
              </p>
            </CardContent>
          </Card>

          <div>
            <h4 className="font-semibold text-base mb-3 section-title">Tips to Strengthen Your Profile</h4>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, title: 'Grow your audience', text: 'Keep posting consistently and engaging with your community. A growing, active audience is what brands look for.' },
                { icon: Camera, title: 'Level up your content', text: 'Focus on high-quality visuals, good lighting, and authentic storytelling that resonates with your niche.' },
                { icon: Sparkles, title: 'Stay on our radar', text: "We regularly review past applicants as new spots open up. You don't need to re-apply — we'll reach out when the time is right." },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="flex items-start gap-3 py-3">
                    <div className="icon-container w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Steps Info (when pending) */}
      {creatorStatus === 'pending' && (
        <div>
          <h3 className="font-semibold text-lg mb-3 section-title">What Happens Next</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'We review your application and social media presence' },
              { step: '2', text: "Once accepted, we'll reach out when a brand campaign is a good fit for your profile. Not every campaign will be a match — we hand-pick creators for each one." },
              { step: '3', text: "You'll receive products, create content, and get compensated for campaigns you participate in" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="icon-container w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-semibold text-primary">
                  {item.step}
                </div>
                <p className="text-sm text-muted-foreground pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help/Contact Footer */}
      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground py-2">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Questions? Email <a href="mailto:collabs@benable.com" className="underline hover:text-foreground">collabs@benable.com</a></span>
      </div>
    </div>
  );
}
