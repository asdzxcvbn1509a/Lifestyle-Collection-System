import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

// Navbar search box (UC-07). Submits to the /search results page.
export default function SearchBar() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={submit} className="relative hidden sm:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาไอเทม..."
        className="input w-44 pl-8 md:w-56"
      />
    </form>
  );
}
