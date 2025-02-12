const baseColors = [
  { bg: 'bg-pink-100', hover: 'hover:bg-pink-200' },
  { bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', hover: 'hover:bg-green-200' },
  { bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
  { bg: 'bg-yellow-100', hover: 'hover:bg-yellow-200' },
  { bg: 'bg-indigo-100', hover: 'hover:bg-indigo-200' },
  { bg: 'bg-red-100', hover: 'hover:bg-red-200' },
  { bg: 'bg-orange-100', hover: 'hover:bg-orange-200' },
  { bg: 'bg-lime-100', hover: 'hover:bg-lime-200' },
  { bg: 'bg-cyan-100', hover: 'hover:bg-cyan-200' },
  { bg: 'bg-fuchsia-100', hover: 'hover:bg-fuchsia-200' },
  { bg: 'bg-violet-100', hover: 'hover:bg-violet-200' },
  { bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200' },
  { bg: 'bg-rose-100', hover: 'hover:bg-rose-200' },
  { bg: 'bg-sky-100', hover: 'hover:bg-sky-200' },
  { bg: 'bg-amber-100', hover: 'hover:bg-amber-200' }
];

export const getColorForMember = (memberId) => {
  if (!memberId) return baseColors[0];
  
  // Ensure memberId is treated as a number and is positive
  const id = Math.abs(parseInt(memberId));
  // Safely handle the modulo operation
  const colorIndex = ((id - 1) % baseColors.length + baseColors.length) % baseColors.length;
  
  return baseColors[colorIndex] || baseColors[0];
};