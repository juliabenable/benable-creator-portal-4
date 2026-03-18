import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
  Plus,
  X,
  Star,
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

const BRAND_NAMES = [
  'Ulta Beauty', 'Sephora', 'Glossier', 'Fenty Beauty', 'Rare Beauty',
  'Charlotte Tilbury', 'The Ordinary', 'Drunk Elephant', 'Sol de Janeiro',
  'Olaplex', 'Tatcha', 'Summer Fridays', 'Kosas', 'Tower 28', 'Merit',
];


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

/* ─── Step 0: VIP Welcome (Premium, exciting with brand logos) ─── */
function WelcomeStep() {
  return (
    <div className="space-y-6 py-2">
      {/* Hero gradient section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-purple-100 to-pink-50 px-6 py-8 text-center">
        {/* Decorative background elements — floating */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.07] pointer-events-none">
          <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-primary animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-6 right-8 w-16 h-16 rounded-full bg-pink-400 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-12 right-16 w-10 h-10 rounded-full bg-purple-400 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>

        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 shadow-sm mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" style={{ animationDuration: '2.5s' }} />
          </div>
          <Badge variant="secondary" className="text-xs mb-3 gap-1 bg-white/80">
            <Crown className="w-3 h-3" />
            By Invitation Only
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">You've Been Invited</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
            Join a select group of creators with priority access to brand campaigns
            as part of Benable's first creator program.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 px-1">
        {[
          { icon: Crown, text: 'Priority access to paid brand campaigns' },
          { icon: Globe, text: 'Work with top beauty, lifestyle & wellness brands' },
          { icon: Sparkles, text: 'Free products or gift cards + compensation for every campaign' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-3 duration-400" style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: 'backwards' }}>
            <div className="icon-container w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <p className="text-sm font-medium">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Brand logos / names marquee */}
      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground text-center uppercase tracking-wider font-medium">
          Brands you could work with
        </p>
        <div className="relative overflow-hidden rounded-xl bg-muted/50 py-4">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {BRAND_NAMES.map((brand, i) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-border/60 text-xs font-medium text-muted-foreground shadow-sm animate-in fade-in-0 zoom-in-95 duration-300 hover:scale-105 hover:shadow-md transition-all"
                style={{ animationDelay: `${i * 40 + 400}ms`, animationFillMode: 'backwards' }}
              >
                <Star className="w-3 h-3 text-primary/50" />
                {brand}
              </span>
            ))}
          </div>
        </div>
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

/* ─── Screenshot upload section for a platform ─── */
function ScreenshotUploadSection({ screenshots, onAdd, onRemove }: {
  screenshots: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {screenshots.length === 0 ? (
        <div
          className="border-2 border-dashed border-border rounded-lg px-4 py-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
          onClick={onAdd}
        >
          <Image className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Upload screenshot</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG — from your analytics</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {screenshots.map((fileName, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-[11px] text-muted-foreground">Screenshot {index + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors w-full justify-center py-2 border border-dashed border-primary/30 rounded-lg hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            Add another screenshot
          </button>
        </>
      )}
    </div>
  );
}

/* ─── "What to include" dialog for TikTok ─── */
function TikTokHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/20 transition-colors inline-flex items-center gap-1"
        >
          <Info className="w-3 h-3" /> What to include
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">How to screenshot your TikTok stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {[
            { step: '1', text: 'Open TikTok → tap the ☰ menu (top right) → TikTok Studio → Analytics' },
            { step: '2', text: 'On the Overview tab, set the date range to "Last 28 days" or "Last 30 days"' },
            { step: '3', text: 'Screenshot the overview showing Followers, Video Views, Profile Views, and Average Views' },
            { step: '4', text: 'Then tap the Followers tab and screenshot your audience demographics (top countries, gender split, age ranges)' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                {item.step}
              </div>
              <p className="text-sm text-muted-foreground pt-0.5">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1.5">
          <p className="font-medium text-foreground/70">Tips</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use full-screen screenshots from the TikTok app (not third-party tools)</li>
            <li>Screenshots should be taken within the last 7 days</li>
            <li>Upload multiple screenshots if your stats span more than one screen</li>
          </ul>
        </div>
        <DialogClose asChild>
          <Button className="w-full mt-1">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/* ─── "What to include" dialog for Instagram ─── */
function InstagramHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/20 transition-colors inline-flex items-center gap-1"
        >
          <Info className="w-3 h-3" /> What to include
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">How to screenshot your Instagram stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {[
            { step: '1', text: 'Open Instagram → tap your profile → tap "Professional dashboard" (or the Insights button)' },
            { step: '2', text: 'Set the date range to "Last 30 days"' },
            { step: '3', text: 'Screenshot the overview showing Accounts Reached, Accounts Engaged, and Total Followers' },
            { step: '4', text: 'Then tap into your audience demographics and screenshot your top countries, gender split, and age ranges' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                {item.step}
              </div>
              <p className="text-sm text-muted-foreground pt-0.5">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1.5">
          <p className="font-medium text-foreground/70">Tips</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>You need a Professional or Creator account to access Insights</li>
            <li>Use full-screen screenshots from the Instagram app (not third-party tools)</li>
            <li>Screenshots should be taken within the last 7 days</li>
            <li>Upload multiple screenshots if your stats span more than one screen</li>
          </ul>
        </div>
        <DialogClose asChild>
          <Button className="w-full mt-1">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Step 3: Social Stats (Handles + Multiple Screenshot Uploads) ─── */
function SocialStatsStep() {
  const [tiktokScreenshots, setTiktokScreenshots] = useState<string[]>([]);
  const [igScreenshots, setIgScreenshots] = useState<string[]>([]);

  function simulateAdd(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    // Simulate a file upload - in production this would open a file picker
    const fakeNames = ['analytics_overview.png', 'stats_page.png', 'followers_detail.png', 'engagement.png'];
    setter((prev) => [...prev, fakeNames[prev.length % fakeNames.length]]);
  }

  return (
    <div className="space-y-5">
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
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Stats Screenshots
              <TikTokHelpDialog />
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload screenshots of your TikTok analytics showing your <strong>followers</strong> and <strong>average views</strong>.
            </p>
            <ScreenshotUploadSection
              screenshots={tiktokScreenshots}
              onAdd={() => simulateAdd(setTiktokScreenshots)}
              onRemove={(index) => setTiktokScreenshots((prev) => prev.filter((_, i) => i !== index))}
            />
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
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Stats Screenshots
              <InstagramHelpDialog />
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload screenshots of your Instagram insights showing your <strong>followers</strong>, <strong>views over 30 days</strong>, and <strong>reach over 30 days</strong>.
            </p>
            <ScreenshotUploadSection
              screenshots={igScreenshots}
              onAdd={() => simulateAdd(setIgScreenshots)}
              onRemove={(index) => setIgScreenshots((prev) => prev.filter((_, i) => i !== index))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
