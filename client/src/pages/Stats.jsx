import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Boxes, FolderTree, Heart, Star } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/theme/ThemeContext';
import Spinner from '@/components/Spinner';

const COLORS = ['#2f9e63', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function Stats() {
  const { data, isLoading } = useStats();
  const { theme } = useTheme();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  const { totals, itemsPerCategory, activity, ratingDistribution } = data;

  const isDark = theme === 'dark';
  const grid = isDark ? '#334155' : '#e2e8f0';
  const axisLine = isDark ? '#475569' : '#cbd5e1';
  const tick = { fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 };
  const tooltipStyle = {
    background: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${grid}`,
    borderRadius: 12,
    color: isDark ? '#f1f5f9' : '#0f172a',
  };
  const cursorFill = isDark ? '#ffffff10' : '#00000008';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">สถิติ & สรุปพฤติกรรม</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={FolderTree} label="หมวดหมู่" value={totals.categories} color="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300" />
        <StatCard icon={Boxes} label="ไอเทมทั้งหมด" value={totals.items} color="bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" />
        <StatCard icon={Heart} label="รายการโปรด" value={totals.favorites} color="bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" />
        <StatCard icon={Star} label="คะแนนเฉลี่ย" value={totals.avgRating} color="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" />
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-semibold">ไอเทมที่เพิ่ม (14 วันล่าสุด)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={activity}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={tick} stroke={axisLine} />
            <YAxis allowDecimals={false} tick={tick} stroke={axisLine} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#2f9e63" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-semibold">จำนวนไอเทมแต่ละหมวด</h2>
        {itemsPerCategory.length ? (
          <ResponsiveContainer width="100%" height={Math.max(200, itemsPerCategory.length * 44)}>
            <BarChart data={itemsPerCategory} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" allowDecimals={false} tick={tick} stroke={axisLine} />
              <YAxis type="category" dataKey="name" width={110} tick={tick} stroke={axisLine} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {itemsPerCategory.map((entry, i) => (
                  <Cell key={entry.id} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">ยังไม่มีข้อมูล</p>
        )}
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-semibold">การกระจายคะแนน (ดาว)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ratingDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="rating" tickFormatter={(r) => `${r} ดาว`} tick={tick} stroke={axisLine} />
            <YAxis allowDecimals={false} tick={tick} stroke={axisLine} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
