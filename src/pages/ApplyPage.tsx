import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Crown,
  Globe,
  Info,
  Heart,
  Shirt,
  Sun,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  Baby,
  Palette,
  Flower2,
  Sofa,
  Image,
} from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { StickyCTA } from '@/components/StickyCTA';
import { toast } from 'sonner';

const TOTAL_STEPS = 4;
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Brazil', 'Mexico', 'India', 'Japan'];

const CONTENT_NICHES = [
  { label: 'Beauty', icon: Heart },
  { label: 'Fashion', icon: Shirt },
  { label: 'Lifestyle', icon: Sun },
  { label: 'Fitness', icon: Dumbbell },
  { label: 'Food', icon: UtensilsCrossed },
  { label: 'Travel', icon: Plane },
  { label: 'Parenting', icon: Baby },
  { label: 'DIY / Crafts', icon: Palette },
  { label: 'Wellness', icon: Flower2 },
  { label: 'Home Decor', icon: Sofa },
];

const PRODUCT_CATEGORIES = ['Skincare', 'Makeup', 'Haircare', 'Supplements', 'Clothing', 'Accessories', 'Home', 'Food & Drink'];


export default function ApplyPage() {
  const { creatorStatus, submitApplication } = useCreator();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  // Pre-populate from invitation email (simulated for prototype)
  const [name, setName] = useState('Sarah Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (creatorStatus !== 'not_applied') {
    return <Navigate to="/" replace />;
  }

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function handleNext() {
    if (step === 1 && (!name.trim() || !email.trim())) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleSubmit() {
    submitApplication(name);
    toast.success('Application submitted!');
    navigate('/');
  }

  const progressSteps = ['About You', 'Address', 'Social Stats'];
  const currentStepIndex = step - 1; // step 0 is welcome, so step 1 = index 0

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-8">
      {/* Improved Step Progress Indicator */}
      {step > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            {progressSteps.map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                    i < currentStepIndex
                      ? 'bg-primary'
                      : i === currentStepIndex
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-primary">
              Step {step} of {TOTAL_STEPS - 1}
            </p>
            <p className="text-xs text-muted-foreground">
              {progressSteps[currentStepIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Step content with animation */}
      <div key={step} className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
        {step === 0 && <WelcomeStep />}
        {step === 1 && (
          <PersonalInfoStep
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            selectedNiches={selectedNiches}
            toggleNiche={(n) => toggleItem(selectedNiches, n, setSelectedNiches)}
            selectedCategories={selectedCategories}
            toggleCategory={(c) => toggleItem(selectedCategories, c, setSelectedCategories)}
          />
        )}
        {step === 2 && <ShippingStep />}
        {step === 3 && <SocialStatsStep />}
      </div>

      {/* Navigation */}
      <StickyCTA>
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" className="flex-1 h-12" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button className="flex-1 h-12 text-base font-semibold" onClick={handleNext}>
              {step === 0 ? "Let's Get Started" : 'Next'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button className="flex-1 h-12 text-base font-semibold" onClick={handleSubmit}>
              Submit Application
            </Button>
          )}
        </div>
        {step === TOTAL_STEPS - 1 && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            We'll review your application and get back to you shortly.
          </p>
        )}
      </StickyCTA>
    </div>
  );
}

/* ─── Step 0: VIP Welcome ─── */
function WelcomeStep() {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="welcome-icon icon-container inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <div>
        <Badge variant="secondary" className="text-xs mb-2 gap-1">
          <Crown className="w-3 h-3" />
          By Invitation Only
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">You've Been Invited</h1>
        <p className="text-muted-foreground mt-1.5 text-sm max-w-xs mx-auto">
          Join a select group of creators with priority access to brand campaigns
          as part of Benable's first creator program.
        </p>
      </div>
      <div className="text-left max-w-xs mx-auto space-y-3">
        {[
          { icon: Crown, text: 'Priority access to paid brand campaigns' },
          { icon: Globe, text: 'Work with top beauty, lifestyle & wellness brands' },
          { icon: Sparkles, text: 'Free products or gift cards + compensation for every campaign' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="icon-container w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Personal Info (no Availability) ─── */
function PersonalInfoStep({
  name, setName, email, setEmail,
  selectedNiches, toggleNiche,
  selectedCategories, toggleCategory,
}: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  selectedNiches: string[]; toggleNiche: (n: string) => void;
  selectedCategories: string[]; toggleCategory: (c: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            About You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input id="portfolio" placeholder="https://yoursite.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Niches</CardTitle>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_NICHES.map((niche) => {
              const NicheIcon = niche.icon;
              return (
                <label
                  key={niche.label}
                  className={`flex items-center gap-2.5 text-sm cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
                    selectedNiches.includes(niche.label)
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <Checkbox
                    checked={selectedNiches.includes(niche.label)}
                    onCheckedChange={() => toggleNiche(niche.label)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    selectedNiches.includes(niche.label) ? 'bg-primary/15' : 'bg-muted'
                  }`}>
                    <NicheIcon className={`w-3.5 h-3.5 ${
                      selectedNiches.includes(niche.label) ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <span>{niche.label}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferred Product Categories</CardTitle>
          <p className="text-xs text-muted-foreground">What products do you love working with?</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Step 2: Shipping ─── */
function ShippingStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2.5 p-3 bg-primary/5 rounded-lg">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            We collect your shipping address so that brands can send you products to review as part
            of their campaigns. Your address is kept private and only shared with brands you've
            accepted a campaign with.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label>Street Address</Label>
          <Input placeholder="123 Main St" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>City</Label>
            <Input placeholder="City" />
          </div>
          <div className="space-y-1.5">
            <Label>State / Province</Label>
            <Input placeholder="State" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>ZIP / Postal Code</Label>
            <Input placeholder="ZIP" />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Step 3: Social Stats (Handles + Screenshot Uploads) ─── */
function SocialStatsStep() {
  return (
    <div className="space-y-4">
      {/* TikTok */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white text-[10px] font-bold shrink-0">TK</span>
            TikTok
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>TikTok Handle *</Label>
            <Input placeholder="@yourtiktokhandle" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              Stats Screenshot
              <span className="text-[10px] font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full cursor-help" title="Upload a screenshot from your TikTok analytics showing your followers and average views">
                <Info className="w-3 h-3 inline -mt-0.5" /> What to include
              </span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload a screenshot of your TikTok analytics showing your <strong>followers</strong> and <strong>average views</strong>.
            </p>
            <div className="border-2 border-dashed border-border rounded-lg px-4 py-5 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
              <Image className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-sm font-medium">Upload screenshot</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG — from your TikTok analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instagram */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">IG</span>
            Instagram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Instagram Handle *</Label>
            <Input placeholder="@yourinstagramhandle" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              Stats Screenshot
              <span className="text-[10px] font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full cursor-help" title="Upload a screenshot from your Instagram insights showing your followers, views over 30 days, and reach over 30 days">
                <Info className="w-3 h-3 inline -mt-0.5" /> What to include
              </span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload a screenshot of your Instagram insights showing your <strong>followers</strong>, <strong>views over 30 days</strong>, and <strong>reach over 30 days</strong>.
            </p>
            <div className="border-2 border-dashed border-border rounded-lg px-4 py-5 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
              <Image className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-sm font-medium">Upload screenshot</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG — from your Instagram insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

