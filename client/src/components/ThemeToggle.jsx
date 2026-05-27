import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="btn-ghost px-2"
      title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
      aria-label="สลับธีม"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
