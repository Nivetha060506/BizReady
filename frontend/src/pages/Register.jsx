import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    role: 'owner'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await register(formData);
    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-paper flex font-body overflow-hidden">
      {/* Left Design Pane */}
      <div className="hidden lg:flex w-1/2 bg-ink relative items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sage rounded-full blur-[120px]"></div>
          <div className="absolute top-1/4 -right-24 w-64 h-64 bg-amber rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-sage rounded-2xl flex items-center justify-center -rotate-3 mb-12 shadow-2xl shadow-sage/40">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="font-heading text-6xl font-extrabold text-white tracking-tighter leading-[0.9] mb-8">
            Start your <span className="text-sage">Digital</span> transformation.
          </h1>
          <p className="text-mist text-lg font-medium leading-relaxed mb-12">
            Join thousands of Indian businesses digitizing their operations with BizReady. Simple, powerful, and built for you.
          </p>
          
          <ul className="space-y-4">
            {['Invoicing & GST Ready', 'Inventory Smart Alerts', 'CRM & Follow-ups', 'Kanban Task Board'].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-paper font-medium">
                <div className="w-5 h-5 rounded-full bg-sage/20 border border-sage/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-sage"></div>
                </div>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-paper overflow-y-auto">
        <div className="w-full max-w-md my-12 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-heading text-4xl font-bold text-ink mb-2">Create Account</h2>
            <p className="text-mist font-medium">Begin your journey to a smarter business.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rust/10 border border-rust/20 text-rust p-4 rounded-xl flex items-start gap-3 animate-bounce">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-ink ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-sage transition-colors" />
                  <input
                    name="name"
                    required
                    placeholder="Arjun Singh"
                    className="w-full bg-cream/50 border-2 border-transparent focus:border-sage/30 focus:bg-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-300 font-medium"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-ink ml-1">Business Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-sage transition-colors" />
                  <input
                    name="businessName"
                    required
                    placeholder="Classic Textiles"
                    className="w-full bg-cream/50 border-2 border-transparent focus:border-sage/30 focus:bg-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-300 font-medium"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-ink ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-sage transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contact@business.in"
                  className="w-full bg-cream/50 border-2 border-transparent focus:border-sage/30 focus:bg-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-300 font-medium"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-ink ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-sage transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  className="w-full bg-cream/50 border-2 border-transparent focus:border-sage/30 focus:bg-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-300 font-medium"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sage text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sage/20 hover:shadow-2xl hover:shadow-sage/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-mist font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-bold hover:text-sage transition-colors underline underline-offset-4 decoration-mist/30 hover:decoration-sage">
              Sign in here
            </Link>
          </p>

          <div className="mt-10 p-6 bg-cream/30 border border-mist/10 rounded-2xl">
            <p className="text-[10px] text-mist font-bold uppercase tracking-widest mb-2">Our Commitment</p>
            <p className="text-xs text-ink/70 leading-relaxed">
              We focus on data privacy. Your business data is encrypted and used only to power your dashboard. No third-party sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
