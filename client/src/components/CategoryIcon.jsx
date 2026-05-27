import { getIcon } from '@/lib/icons';

export default function CategoryIcon({ name, className }) {
  const Icon = getIcon(name);
  return <Icon className={className} />;
}
