/** Set único de íconos de línea: 24×24, trazo 1,75, extremos redondeados (concordancia con Pacífico). */
const P: Record<string, string> = {
  logo: 'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM6 12h2.2l1.6-3.5 2.4 7 1.8-3.5H18',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  home: 'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM6 12h2.2l1.6-3.5 2.4 7 1.8-3.5H18',
  calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  laptop: 'M3 5h18v12H3zM2 20h20',
  watch: 'M6 6h12v12H6zM9 6V3h6v3M9 18v3h6v-3M12 10v2.5l1.6 1',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  download: 'M12 4v11M7 10l5 5 5-5M4 20h16',
  share: 'M12 3v12M8 7l4-4 4 4M5 12v8h14v-8',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  video: 'M3 6h13v12H3zM16 10l5-3v10l-5-3',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
  alert: 'M12 3l9.5 17h-19zM12 10v4M12 17.5v.5',
  pause: 'M9 5v14M15 5v14',
  hand: 'M7 11V7a2 2 0 1 1 4 0v4M11 9V5a2 2 0 1 1 4 0v4M15 10V7a2 2 0 1 1 4 0v7a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.5L3 13a2 2 0 0 1 3.5-2L7 12',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8v.5',
  x: 'M6 6l12 12M18 6L6 18',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  minus: 'M5 12h14',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 24, color = 'currentColor', stroke = 1.75, className }: { name: IconName; size?: number; color?: string; stroke?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}
