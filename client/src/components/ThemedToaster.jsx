import { Toaster } from 'sonner';
import { useTheme } from '@/theme/ThemeContext';

export default function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="top-center" theme={theme} />;
}
