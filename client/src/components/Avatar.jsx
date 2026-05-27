export default function Avatar({ user, size = 'sm' }) {
  const px = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-8 w-8 text-sm';
  const initial = (user?.displayName || user?.username || '?').charAt(0).toUpperCase();

  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt="" className={`${px} rounded-full object-cover`} />;
  }
  return (
    <div
      className={`${px} flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300`}
    >
      {initial}
    </div>
  );
}
