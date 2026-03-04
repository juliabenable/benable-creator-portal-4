import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { BrandAvatar } from '@/components/BrandAvatar';
import { getStepIndex, type CampaignStep } from '@/types';

const STEP_LABEL: Record<CampaignStep, string> = {
  invitation: 'Review & Accept',
  product_phase: 'Product Details',
  order_placed: 'Awaiting Delivery',
  order_received: 'Ready to Create',
  content_upload: 'Upload Content',
  compliance_feedback: 'Changes Needed',
  content_approved: 'Approve & Publish',
  completed: 'Completed',
};

export default function CampaignsListPage() {
  const { creatorStatus, campaigns } = useCreator();
  const navigate = useNavigate();

  if (creatorStatus !== 'accepted') {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">
          You'll see your campaigns here once you're accepted into the program.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold">Campaigns</h1>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10 text-muted-foreground">
            <p className="text-sm">No campaigns yet.</p>
          </CardContent>
        </Card>
      ) : (
        campaigns.map((campaign) => {
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
                      <h4 className="font-semibold mt-0.5">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {campaign.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {STEP_LABEL[campaign.currentStep]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {campaign.compensationType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
                </div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
