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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  User,
  MapPin,
  BarChart3,
  LinkIcon,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Crown,
  Globe,
  Info,
  ChevronDown,
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
import { toast } from 'sonner';

const TOTAL_STEPS = 5;
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Brazil', 'Mexico', 'India', 'Japan'];
const GENDERS = ['Female', 'Male', 'Non-binary', 'Mixed'];

// Match TikTok & Instagram analytics age brackets
const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];

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

interface PostEntry {
  id: string;
  platform: string;
  type: 'link' | 'image';
  link: string;
}

export default function ApplyPage() {
  const { creatorStatus, submitApplication } = useCreator();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Start with 3 post slots as requested
  const [posts, setPosts] = useState<PostEntry[]>([
    { id: '1', platform: 'tiktok', type: 'link', link: '' },
    { id: '2', platform: 'instagram_reel', type: 'link', link: '' },
    { id: '3', platform: 'instagram_carousel', type: 'link', link: '' },
  ]);

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

  function addPost() {
    setPosts((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: 'tiktok', type: 'link', link: '' },
    ]);
  }

  function removePost(id: string) {
    if (posts.length <= 1) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePost(id: string, field: keyof PostEntry, value: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
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

  const progressSteps = ['About You', 'Address', 'Social Stats', 'Past Posts'];
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
        {step === 4 && (
          <PastPostsStep
            posts={posts}
            addPost={addPost}
            removePost={removePost}
            updatePost={updatePost}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
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
        <p className="text-center text-xs text-muted-foreground mt-3 pb-4">
          We'll review your application and get back to you shortly.
        </p>
      )}
    </div>
  );
}

/* ─── Step 0: VIP Welcome ─── */
function WelcomeStep() {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
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
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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

/* ─── Step 3: Social Stats (Accordion Drawers) ─── */
function SocialStatsStep() {
  const [tiktokOpen, setTiktokOpen] = useState(false);
  const [igOpen, setIgOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* TikTok Stats Drawer */}
      <Collapsible open={tiktokOpen} onOpenChange={setTiktokOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                TikTok Stats
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${tiktokOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <Label>TikTok Handle</Label>
                <Input placeholder="@yourtiktokhandle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Followers</Label>
                  <Input type="number" placeholder="e.g. 15000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Avg. Views</Label>
                  <Input type="number" placeholder="e.g. 5000" />
                </div>
              </div>

              {/* Demographics */}
              <AudienceDemographics platform="tiktok" />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Instagram Stats Drawer */}
      <Collapsible open={igOpen} onOpenChange={setIgOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Instagram Stats
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${igOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <Label>Instagram Handle</Label>
                <Input placeholder="@yourinstagramhandle" />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Followers</Label>
                    <Input type="number" placeholder="e.g. 15000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Reach</Label>
                    <Input type="number" placeholder="e.g. 10000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Average Reel Plays</Label>
                  <Input type="number" placeholder="e.g. 8000" />
                  <p className="text-[11px] text-muted-foreground">
                    Give an approximation from your recent reels
                  </p>
                </div>
              </div>

              {/* Demographics */}
              <AudienceDemographics platform="instagram" />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

/* ─── Audience Demographics (redesigned, shared by both platforms) ─── */
function AudienceDemographics({ platform: _platform }: { platform: string }) {
  return (
    <div className="border-t pt-4 space-y-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Audience Demographics
      </p>

      {/* Top Countries with percentages */}
      <div className="space-y-2">
        <Label className="text-xs">Top Countries</Label>
        <div className="space-y-2">
          {[1, 2].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder={`Country ${num}`} /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Input type="number" placeholder="%" className="h-9 text-center" min={0} max={100} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-xs">Top Gender</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-20">
            <Input type="number" placeholder="%" className="h-9 text-center" min={0} max={100} />
          </div>
        </div>
      </div>

      {/* Age Ranges */}
      <div className="space-y-2">
        <Label className="text-xs">Top Age Ranges</Label>
        <div className="space-y-2">
          {[1, 2].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder={`Age range ${num}`} /></SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Input type="number" placeholder="%" className="h-9 text-center" min={0} max={100} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Past Posts (3+, link or image upload) — flat list, no double cards ─── */
function PastPostsStep({
  posts,
  addPost,
  removePost,
  updatePost,
}: {
  posts: PostEntry[];
  addPost: () => void;
  removePost: (id: string) => void;
  updatePost: (id: string, field: keyof PostEntry, value: string) => void;
}) {
  const platformLabels: Record<string, string> = {
    tiktok: 'TikTok',
    instagram_reel: 'IG Reel',
    instagram_carousel: 'IG Carousel',
    instagram_story: 'IG Story',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <LinkIcon className="w-4 h-4 text-primary" />
        <h2 className="text-base font-semibold">Past Posts</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        Share 3+ of your best posts. Include a mix of formats to show range.
        We'll pull engagement stats from each link.
      </p>

      {posts.map((post, idx) => (
        <div key={post.id} className="space-y-2">
          {/* Row: number label + platform select + remove */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
            <Select value={post.platform} onValueChange={(v) => updatePost(post.id, 'platform', v)}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram_reel">IG Reel</SelectItem>
                <SelectItem value="instagram_carousel">IG Carousel</SelectItem>
                <SelectItem value="instagram_story">IG Story</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="text-[10px] px-1.5">
              {platformLabels[post.platform] || post.platform}
            </Badge>
            <div className="flex-1" />
            {posts.length > 1 && (
              <button type="button" onClick={() => removePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Content input — link or image */}
          {post.type === 'link' ? (
            <div className="flex items-center gap-2 ml-7">
              <Input
                placeholder="Paste link..."
                value={post.link}
                onChange={(e) => updatePost(post.id, 'link', e.target.value)}
                className="h-8 text-sm flex-1"
              />
              <button
                type="button"
                onClick={() => updatePost(post.id, 'type', 'image')}
                className="text-[10px] text-primary hover:underline whitespace-nowrap shrink-0"
              >
                Upload instead
              </button>
            </div>
          ) : (
            <div className="ml-7 flex items-center gap-2">
              <div className="flex-1 border-2 border-dashed rounded-lg px-3 py-2 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-center gap-2">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload screenshot</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updatePost(post.id, 'type', 'link')}
                className="text-[10px] text-primary hover:underline whitespace-nowrap shrink-0"
              >
                Paste link
              </button>
            </div>
          )}

          {/* Divider between posts */}
          {idx < posts.length - 1 && <div className="border-b ml-7" />}
        </div>
      ))}

      {posts.length < 8 && (
        <Button type="button" variant="outline" size="sm" className="w-full mt-2" onClick={addPost}>
          <Plus className="w-4 h-4 mr-1" />
          Add Another Post
        </Button>
      )}
    </div>
  );
}
