import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showPersian?: boolean;
}

export function Logo({ className, variant = 'dark', showPersian = true }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy';
  const bearColor = variant === 'light' ? '#ffffff' : '#0c4a6e';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Bear ears */}
        <circle cx="10" cy="10" r="5" fill={bearColor} />
        <circle cx="30" cy="10" r="5" fill={bearColor} />
        <circle cx="10" cy="10" r="2.5" fill="#f0f9ff" />
        <circle cx="30" cy="10" r="2.5" fill="#f0f9ff" />
        {/* Bear head */}
        <circle cx="20" cy="22" r="13" fill={bearColor} />
        {/* Bear snout */}
        <ellipse cx="20" cy="26" rx="7" ry="5" fill="#f0f9ff" />
        {/* Eyes */}
        <circle cx="15" cy="20" r="1.8" fill="#0c4a6e" />
        <circle cx="25" cy="20" r="1.8" fill="#0c4a6e" />
        {/* Nose */}
        <ellipse cx="20" cy="24" rx="2" ry="1.5" fill="#0c4a6e" />
        {/* Smile */}
        <path d="M17 27 Q20 29 23 27" stroke="#0c4a6e" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col items-start leading-none">
        <span className={cn('text-xl font-bold tracking-wider', textColor)}>JURU</span>
        {showPersian && (
          <span className={cn('text-xs font-medium', variant === 'light' ? 'text-white/80' : 'text-muted-foreground')}>
            جورو
          </span>
        )}
      </div>
    </div>
  );
}
