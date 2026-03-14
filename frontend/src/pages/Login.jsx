import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-paper flex font-body overflow-hidden">
      {/* Left Design Pane - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-ink relative items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-rust rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-amber rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-rust rounded-2xl flex items-center justify-center rotate-3 mb-12 shadow-2xl shadow-rust/40">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="font-heading text-6xl font-extrabold text-white tracking-tighter leading-[0.9] mb-8">
            Empower your <span className="text-rust">SME</span> journey.
          </h1>
          <p className="text-mist text-lg font-medium leading-relaxed mb-12">
            The all-in-one digital toolkit designed specifically for Indian enterprises to scale, manage, and thrive in the modern economy.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-white font-heading text-2xl font-bold">1.2k+</p>
              <p className="text-mist text-xs uppercase tracking-widest font-bold mt-1">SMEs Joined</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-white font-heading text-2xl font-bold">18%</p>
              <p className="text-mist text-xs uppercase tracking-widest font-bold mt-1">Avg Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-paper">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-heading text-4xl font-bold text-ink mb-2">Welcome Back</h2>
            <p className="text-mist font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rust/10 border border-rust/20 text-rust p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-ink ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-rust transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  className="w-full bg-cream/50 border-2 border-transparent focus:border-rust/30 focus:bg-white pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-300 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-ink">Password</label>
                <button type="button" className="text-xs font-bold text-rust hover:underline underline-offset-4">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist group-focus-within:text-rust transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-cream/50 border-2 border-transparent focus:border-rust/30 focus:bg-white pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-300 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rust text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-rust/20 hover:shadow-2xl hover:shadow-rust/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-mist font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink font-bold hover:text-rust transition-colors underline underline-offset-4 decoration-mist/30 hover:decoration-rust">
              Create an account
            </Link>
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink">Made for Bharat</span>
            <div className="w-1 h-1 bg-ink rounded-full"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink">Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
