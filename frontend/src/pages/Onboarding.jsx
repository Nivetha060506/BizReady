import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  ShieldCheck,
  Package,
  Users,
  Receipt,
  Sparkles
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useModuleStore from '../store/moduleStore';
import api from '../services/api';

const Onboarding = () => {
  const { business, setBusiness } = useAuthStore();
  const { updateAllModules } = useModuleStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: business?.industry || 'retail',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    employeeCount: 1,
    invoicingMethod: 'paper',
    painPoint: '',
    preferredLanguage: 'en',
    digitalReadinessScore: 20
  });

  const [selectedModules, setSelectedModules] = useState({
    salesInvoicing: true,
    inventory: true,
    crm: true,
    tasks: true,
    analytics: false,
    vendorPurchases: false,
    hrTimekeeping: false
  });

  const industries = [
    { id: 'retail', label: 'Retail & Shops', icon: Package },
    { id: 'manufacturing', label: 'Manufacturing', icon: Zap },
    { id: 'services', label: 'Services', icon: Users },
    { id: 'food', label: 'Food & Beverage', icon: Sparkles },
    { id: 'other', label: 'Other Business', icon: Building2 },
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/onboarding', {
        ...formData,
        name: business.name,
        enabledModules: selectedModules
      });
      setBusiness(data.business);
      await updateAllModules(selectedModules);
      navigate('/');
    } catch (error) {
      console.error('Onboarding failed', error);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-ink mb-2">Tell us about your business</h3>
              <p className="text-mist font-medium text-sm">Help us customize your dashboard experience.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setFormData({ ...formData, industry: ind.id })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.industry === ind.id 
                      ? 'border-rust bg-rust/5 text-rust' 
                      : 'border-mist/10 text-mist hover:border-mist/30'
                  }`}
                >
                  <ind.icon className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-tight">{ind.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                <input
                  placeholder="Business Phone Number"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3.5 pl-11 rounded-xl outline-none transition-all font-medium text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                <input
                  placeholder="Street Address"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3.5 pl-11 rounded-xl outline-none transition-all font-medium text-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3.5 rounded-xl outline-none transition-all font-medium text-sm"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <input
                  placeholder="State"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3.5 rounded-xl outline-none transition-all font-medium text-sm"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-ink mb-2">How do you work today?</h3>
              <p className="text-mist font-medium text-sm">We'll identify the best tools for your workflow.</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-ink ml-1">Current Invoicing Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Paper/Handwritten', 'Excel/Word', 'Existing Software', 'Not doing yet'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setFormData({ ...formData, invoicingMethod: method })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.invoicingMethod === method 
                        ? 'border-rust bg-rust/5 text-rust font-bold' 
                        : 'border-mist/10 text-ink/70 hover:border-mist/30'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-bold text-ink ml-1">Biggest Operational Pain Point</label>
              <select
                className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3.5 rounded-xl outline-none transition-all font-medium text-sm"
                value={formData.painPoint}
                onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
              >
                <option value="">Select a challenge</option>
                <option value="tracking_payments">Tracking pending payments</option>
                <option value="managing_inventory">Managing stock & inventory</option>
                <option value="customer_followups">Following up with customers</option>
                <option value="reporting">Getting clear business insights</option>
                <option value="gst">GST compliance & tax</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber/10 text-amber rounded-full flex items-center justify-center mx-auto mb-4 border border-amber/20">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-ink mb-2">Digital Readiness Check</h3>
              <p className="text-mist font-medium text-sm">Quickly assess your current digital maturity.</p>
            </div>

            <div className="space-y-6">
              {[
                { label: 'We track every sale digitally.', score: 25 },
                { label: 'We have a list of all our customers.', score: 15 },
                { label: 'We know our stock levels in real-time.', score: 20 },
                { label: 'We use a task list for our team.', score: 10 }
              ].map((q, idx) => (
                <label key={idx} className="flex items-center justify-between p-4 bg-cream/30 rounded-2xl border border-transparent hover:border-mist/20 transition-all cursor-pointer group">
                  <span className="text-sm font-bold text-ink/80 group-hover:text-ink">{q.label}</span>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-rust rounded-lg border-2 border-mist/30"
                    onChange={(e) => {
                      const newScore = e.target.checked ? formData.digitalReadinessScore + q.score : formData.digitalReadinessScore - q.score;
                      setFormData({ ...formData, digitalReadinessScore: newScore });
                    }}
                  />
                </label>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-ink rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber transition-all duration-700" style={{ width: `${formData.digitalReadinessScore}%` }}></div>
                </div>
                <span className="text-white font-heading font-bold text-sm tracking-tighter">{formData.digitalReadinessScore}%</span>
              </div>
              <p className="text-mist text-[10px] uppercase font-bold tracking-widest mt-2 ml-1">Estimated Readiness Score</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-ink mb-2">Configure Your Toolkit</h3>
              <p className="text-mist font-medium text-sm">Select the modules you want to enable. You can change these later.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'salesInvoicing', label: 'Sales & Invoicing', desc: 'Manage bills & GST', icon: Receipt, core: true },
                { id: 'inventory', label: 'Inventory', desc: 'Track stock & alerts', icon: Package, core: true },
                { id: 'crm', label: 'CRM', desc: 'Customer histories', icon: Users, core: true },
                { id: 'tasks', label: 'Task Tracking', desc: 'Team Kanban board', icon: CheckCircle2, core: true },
                { id: 'analytics', label: 'Analytics Pro', desc: 'Insights & growth', icon: BarChart3, core: false },
                { id: 'hrTimekeeping', label: 'HR & Teams', desc: 'Staff management', icon: Users, core: false }
              ].map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => !mod.core && setSelectedModules({ ...selectedModules, [mod.id]: !selectedModules[mod.id] })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col gap-2 ${
                    selectedModules[mod.id] 
                      ? 'border-sage bg-sage/5' 
                      : 'border-mist/10 opacity-70 grayscale'
                  } ${mod.core ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <mod.icon className={`w-5 h-5 ${selectedModules[mod.id] ? 'text-sage' : 'text-mist'}`} />
                    {mod.core && <span className="text-[8px] bg-mist/20 text-mist px-2 py-0.5 rounded-full font-bold uppercase">Ready</span>}
                  </div>
                  <h4 className={`text-sm font-bold ${selectedModules[mod.id] ? 'text-sage' : 'text-ink'}`}>{mod.label}</h4>
                  <p className="text-[10px] text-mist font-medium leading-none">{mod.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto border-2 border-sage/20 relative">
              <ShieldCheck className="w-12 h-12" />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-sage text-white rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            
            <div>
              <h3 className="font-heading text-3xl font-bold text-ink mb-3 tracking-tight">Your Digital Toolkit is Ready!</h3>
              <p className="text-mist font-medium max-w-sm mx-auto leading-relaxed">
                Great job! Based on your setup, we've configured your personal SME dashboard. You can now start managing your business digitally.
              </p>
            </div>

            <div className="bg-cream/50 rounded-2xl p-6 border border-mist/10 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-mist mb-4">Setup Summary</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-ink/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-rust"></div>
                  Industry: {industries.find(i => i.id === formData.industry)?.label}
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-ink/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber"></div>
                  Digital Readiness: {formData.digitalReadinessScore}%
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-ink/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage"></div>
                  {Object.values(selectedModules).filter(v => v).length} Modules Enabled
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 border-2 ${
                  step === s 
                    ? 'bg-rust border-rust text-white shadow-xl shadow-rust/20 scale-110' 
                    : step > s 
                      ? 'bg-sage border-sage text-white' 
                      : 'bg-white border-mist/20 text-mist'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="h-1 bg-mist/10 rounded-full relative">
            <div 
              className="h-full bg-rust transition-all duration-500 ease-out" 
              style={{ width: `${(step - 1) * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-mist/10 p-8 min-h-[500px] flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-mist/10">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-mist font-bold hover:text-ink transition-colors px-4"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="bg-ink text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-ink/10 hover:shadow-xl active:scale-95 transition-all"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-rust text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-xl shadow-rust/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all"
              >
                Launch Dashboard
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
