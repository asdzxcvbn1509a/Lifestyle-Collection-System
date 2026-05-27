const OPTIONS = [
  { value: 'newest', label: 'ใหม่สุด' },
  { value: 'oldest', label: 'เก่าสุด' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
  { value: 'name', label: 'ชื่อ A-Z' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <select
      className="input w-auto"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="จัดเรียง"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
