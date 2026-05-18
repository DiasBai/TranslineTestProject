
export const Colors = {
  charcoal: '#252526',
  midnight: '#1B1631',
  ivory: '#F4F5F4',
  accentCyan: '#05C0E6',
  slate: '#787884',
  pewter: '#C9CACC',
  silver: '#AFAFB4',
  emerald: '#00C950',
  error: '#E45A5A',
} as const;

export type ColorToken = keyof typeof Colors;
