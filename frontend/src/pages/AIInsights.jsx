import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight, 
  ChevronRight,
  BrainCircuit,
  BarChart3,
  PackageCheck
} from 'lucide-react';
import aiService from '../services/aiService';
import { SalesBarChart } from '../components/DashboardCharts';
import { toast } from 'react-hot-toast';

const RecommendationCard = ({ rec }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'inventory': return AlertTriangle;
      case 'growth': return TrendingUp;
      case 'digital': return Lightbulb;
      default: return Sparkles;
    }
  };

  const getColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-rust bg-rust/10 border-rust/20';
      case 'Medium': return 'text-amber bg-amber/10 border-amber/20';
      default: return 'text-sage bg-sage/10 border-sage/20';
    }
  };

  const Icon = getIcon(rec.type);
  const colorClass = getColor(rec.priority);

  return (
    <div className={`p-5 rounded-2xl border bg-white shadow-soft hover:shadow-md transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${colorClass}`}>
          {rec.priority} Priority
        </span>
      </div>
      <h4 className="font-heading font-bold text-ink mb-2 group-hover:text-rust transition-colors">{rec.title}</h4>
      <p className="text-mist text-sm leading-relaxed mb-4">{rec.description}</p>
      <button className="flex items-center gap-2 text-xs font-bold text-mist hover:text-ink transition-colors uppercase tracking-tight">
        {rec.action} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const AIInsights = () => {
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIContent = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          aiService.getPredictions(),
          aiService.getRecommendations()
        ]);
        setPredictions(pRes.data);
        setRecommendations(rRes.data);
      } catch (error) {
        console.error('Failed to fetch AI insights', error);
        toast.error('Could not load AI insights');
      } finally {
        setLoading(false);
      }
    };
    fetchAIContent();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <BrainCircuit className="w-16 h-16 text-rust/20 animate-pulse" />
        <Sparkles className="w-6 h-6 text-rust absolute -top-2 -right-2 animate-bounce" />
      </div>
      <p className="mt-4 text-mist font-heading font-bold uppercase tracking-widest animate-pulse">Analyzing Business Trends...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-ink text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-ink/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rust/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-rust/20 text-rust px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">AI Prediction Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">
            Smart Insights for <br /> Your Business Growth
          </h1>
          <p className="text-mist max-w-xl font-medium text-lg leading-relaxed">
            Our AI model analyzes your past sales, inventory levels, and customer behavior to provide data-driven recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Predictions Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-ink flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-rust" /> 
              Next Month Sales Prediction
            </h2>
            <div className="text-[10px] font-bold text-mist bg-cream px-3 py-1 rounded-full uppercase tracking-widest">
              Based on 6 months history
            </div>
          </div>
          
          <div className="card-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                 {predictions.length > 0 ? (
                  <SalesBarChart 
                    data={predictions.map(p => ({ 
                      name: p.name, 
                      qty: p.predictedNextMonth 
                    }))} 
                    dataKey="qty"
                  />
                 ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-cream/30 rounded-2xl border border-dashed border-mist/20">
                    <p className="text-sm font-bold text-mist">Insufficient data for predictions</p>
                  </div>
                 )}
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-mist uppercase tracking-widest">Growth Trends</h4>
                {predictions.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-cream/50 border border-mist/5">
                    <div>
                      <p className="text-sm font-bold text-ink">{p.name}</p>
                      <p className="text-[10px] text-mist font-medium uppercase tracking-tighter">Confidence: {p.confidence}</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 font-black text-sm ${parseFloat(p.trend) >= 0 ? 'text-sage' : 'text-rust'}`}>
                        {parseFloat(p.trend) >= 0 ? '+' : ''}{p.trend}%
                        <ArrowUpRight className={`w-3 h-3 ${parseFloat(p.trend) < 0 && 'rotate-90'}`} />
                      </div>
                      <p className="text-[10px] text-mist font-bold uppercase">Predicted: {p.predictedNextMonth} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats card */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-ink flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-rust" /> 
            Smart Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-mist/30">
                <p className="text-sm font-bold text-mist">Everything looks good! Keep selling.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="bg-rust text-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-rust/20">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <PackageCheck className="w-9 h-9 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-heading font-black">Ready to scale?</h4>
            <p className="text-white/80 font-medium tracking-tight">Your top trending product is <span className="text-white font-bold">{predictions[0]?.name || 'loading...'}</span>. Ensure you have enough stock manually.</p>
          </div>
        </div>
        <button className="bg-white text-rust px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cream transition-colors shadow-lg shadow-black/10">
          Sync Inventory
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
