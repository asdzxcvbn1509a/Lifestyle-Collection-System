import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

// Search box (UC-07). Submits to the /search results page.
// `className` controls width/visibility so it works both in the desktop navbar
// and inside the mobile menu. `onSubmit` lets callers close the mobile menu.
export default function SearchBar({ className, onSubmit }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
    onSubmit?.();
  };

  return (
    <form onSubmit={submit} className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาไอเทม..."
        className="input w-full pl-8"
      />
    </form>
  );
}
