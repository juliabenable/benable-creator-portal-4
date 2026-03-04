import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  User,
  MapPin,
  BarChart3,
  ImagePlus,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Crown,
  Globe,
} from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { toast } from 'sonner';

const TOTAL_STEPS = 5;
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Brazil', 'Mexico', 'India', 'Japan'];
const GENDERS = ['Female', 'Male', 'Non-binary', 'Mixed'];
const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];
const CONTENT_NICHES = ['Beauty', 'Fashion', 'Lifestyle', 'Fitness', 'Food', 'Travel', 'Tech', 'Parenting', 'DIY / Crafts'];
const PRODUCT_CATEGORIES = ['Skincare', 'Makeup', 'Haircare', 'Supplements', 'Clothing', 'Accessories', 'Home', 'Food & Drink'];
const AVAILABILITY_OPTIONS = [
  { value: 'full_time', label: 'Full-time creator' },
  { value: 'part_time', label: 'Part-time / Side hustle' },
  { value: 'occasional', label: 'Occasional campaigns' },
];

interface PostEntry {
  id: string;
  platform: string;
  description: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
}

export default function ApplyPage() {
  const { creatorStatus, submitApplication } = useCreator();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');

  const [posts, setPosts] = useState<PostEntry[]>([
    { id: '1', platform: 'tiktok', description: '', views: '', likes: '', comments: '', shares: '' },
  ]);

  if (creatorStatus !== 'not_applied') {
    return <Navigate to="/" replace />;
  }

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function addPost() {
    setPosts((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: 'tiktok', description: '', views: '', likes: '', comments: '', shares: '' },
    ]);
  }

  function removePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Progress bar */}
      {step > 0 && (
        <div className="mb-6">
          <Progress value={(step / (TOTAL_STEPS - 1)) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Step {step} of {TOTAL_STEPS - 1}
          </p>
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
            availability={availability}
            setAvailability={setAvailability}
          />
        )}
        {step === 2 && <ShippingStep />}
        {step === 3 && <SocialStatsStep />}
        {step === 4 && (
          <PastPostsStep posts={posts} addPost={addPost} removePost={removePost} />
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
    <div className="text-center space-y-5 py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div>
        <Badge variant="secondary" className="text-xs mb-3 gap-1">
          <Crown className="w-3 h-3" />
          By Invitation Only
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">You've Been Invited</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
          You're being invited to join a select group of creators who will get
          priority access to brand campaigns as part of Benable's first creator program.
        </p>
      </div>
      <div className="text-left max-w-xs mx-auto space-y-3 pt-2">
        {[
          { icon: Crown, text: 'Priority access to paid brand campaigns' },
          { icon: Globe, text: 'Work with top beauty, lifestyle & wellness brands' },
          { icon: Sparkles, text: 'Free products + compensation for every campaign' },
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

/* ─── Step 1: Personal Info + New Fields ─── */
function PersonalInfoStep({
  name, setName, email, setEmail,
  selectedNiches, toggleNiche,
  selectedCategories, toggleCategory,
  availability, setAvailability,
}: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  selectedNiches: string[]; toggleNiche: (n: string) => void;
  selectedCategories: string[]; toggleCategory: (c: string) => void;
  availability: string; setAvailability: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            About You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input id="portfolio" placeholder="https://yoursite.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Content Niches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_NICHES.map((niche) => (
              <label key={niche} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedNiches.includes(niche)}
                  onCheckedChange={() => toggleNiche(niche)}
                />
                {niche}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preferred Product Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">What products do you love working with?</p>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={availability} onValueChange={setAvailability} className="space-y-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <RadioGroupItem value={opt.value} />
                {opt.label}
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Step 2: Shipping ─── */
function ShippingStep() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">So brands can send you products to review.</p>
        <div>
          <Label>Street Address</Label>
          <Input placeholder="123 Main St" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>City</Label>
            <Input placeholder="City" />
          </div>
          <div>
            <Label>State / Province</Label>
            <Input placeholder="State" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>ZIP / Postal Code</Label>
            <Input placeholder="ZIP" />
          </div>
          <div>
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

/* ─── Step 3: Social Stats ─── */
function SocialStatsStep() {
  return (
    <div className="space-y-4">
      {(['TikTok', 'Instagram'] as const).map((platform) => (
        <Card key={platform}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {platform} Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>{platform} Handle</Label>
              <Input placeholder={`@your${platform.toLowerCase()}handle`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Followers</Label>
                <Input type="number" placeholder="e.g. 15000" />
              </div>
              <div>
                <Label>Engagement Rate (%)</Label>
                <Input type="number" step="0.1" placeholder="e.g. 4.5" />
              </div>
            </div>
            <Separator />
            <p className="text-xs font-medium text-muted-foreground">Top Audience Demographics</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Country</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Gender</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Age Range</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Step 4: Past Posts ─── */
function PastPostsStep({
  posts,
  addPost,
  removePost,
}: {
  posts: PostEntry[];
  addPost: () => void;
  removePost: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-primary" />
          Past Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Share a few of your best posts so we can see your content style.
        </p>
        {posts.map((post, idx) => (
          <div key={post.id} className="border rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">Post {idx + 1}</Badge>
              {posts.length > 1 && (
                <button type="button" onClick={() => removePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <Label className="text-xs">Platform</Label>
              <Select defaultValue={post.platform}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Post Description / Link</Label>
              <Input placeholder="Link or brief description" className="h-9" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['Views', 'Likes', 'Comments', 'Shares'] as const).map((label) => (
                <div key={label}>
                  <Label className="text-xs">{label}</Label>
                  <Input type="number" placeholder="0" className="h-9" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={addPost}>
          <Plus className="w-4 h-4 mr-1" />
          Add Another Post
        </Button>
      </CardContent>
    </Card>
  );
}
