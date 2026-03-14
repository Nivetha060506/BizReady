import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export const RevenueAreaChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#c84b2f" stopOpacity={0.1}/>
          <stop offset="95%" stopColor="#c84b2f" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8df" />
      <XAxis 
        dataKey="month" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#8b9aab', fontSize: 12, fontWeight: 500 }}
        dy={10}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#8b9aab', fontSize: 12, fontWeight: 500 }}
        tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
      />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#0d0d0d', 
          border: 'none', 
          borderRadius: '12px',
          color: '#f5f1eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
        itemStyle={{ color: '#f5f1eb', fontWeight: 'bold' }}
        cursor={{ stroke: '#c84b2f', strokeWidth: 2 }}
      />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#c84b2f" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorRevenue)" 
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const SalesBarChart = ({ data }) => {
  const colors = ['#3a5a7c', '#4a7c59', '#e8933a', '#c84b2f', '#8b9aab'];
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#0d0d0d', fontSize: 11, fontWeight: 600 }}
          width={80}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ backgroundColor: '#0d0d0d', border: 'none', borderRadius: '8px', color: '#fff' }}
        />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DigitalRadarChart = ({ score }) => {
  const data = [
    { subject: 'Invoicing', A: score, fullMark: 100 },
    { subject: 'CRM', A: Math.min(score + 10, 100), fullMark: 100 },
    { subject: 'Inventory', A: Math.min(score - 10, 100), fullMark: 100 },
    { subject: 'Tasks', A: Math.min(score + 20, 100), fullMark: 100 },
    { subject: 'Analytics', A: Math.min(score - 5, 100), fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#8b9aab" strokeOpacity={0.2} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b9aab', fontSize: 10, fontWeight: 700 }} />
        <Radar
          name="Readiness"
          dataKey="A"
          stroke="#c84b2f"
          fill="#c84b2f"
          fillOpacity={0.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
