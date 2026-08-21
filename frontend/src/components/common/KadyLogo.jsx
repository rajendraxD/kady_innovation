

/**
 * KadyLogo - Official Vector Wordmark for Kady Enterprise ATS
 * Supports light & dark modes with the signature vibrant green "A" arch glyph.
 */
export const KadyLogo = ({
  className = 'h-8 w-auto',
  showBadge = false,
  badgeText = '2.0',
  variant = 'full', // 'full' | 'mark'
  textColor = '', // optional custom fill class override for K, D, Y
  ...props
}) => {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="42 4 42 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Kady Mark"
        {...props}
      >
        {/* Signature Stylized Green Arch "A" */}
        <path
          d="M 42 40 L 59.2 4.8 C 60.6 2.2 65.4 2.2 66.8 4.8 L 84 40 H 74.2 C 72.8 27.5 68.8 17.5 63 17.5 C 57.2 17.5 53.2 27.5 51.8 40 H 42 Z"
          fill="#70C100"
        />
      </svg>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 174 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-colors duration-200 ${className}`}
        aria-label="KADY Logo"
        {...props}
      >
        {/* Letter K */}
        <path
          d="M 0 4 H 8.5 V 40 H 0 V 4 Z M 8.5 25.5 L 27.5 4 H 38 L 19 23 L 39 40 H 27.5 L 8.5 22.5 Z"
          className={textColor || 'fill-black dark:fill-white'}
        />

        {/* Signature Stylized Green Arch "A" */}
        <path
          d="M 42 40 L 59.2 4.8 C 60.6 2.2 65.4 2.2 66.8 4.8 L 84 40 H 74.2 C 72.8 27.5 68.8 17.5 63 17.5 C 57.2 17.5 53.2 27.5 51.8 40 H 42 Z"
          fill="#70C100"
        />

        {/* Letter D */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 90 4 H 109 C 120 4 128 12 128 22 C 128 32 120 40 109 40 H 90 V 4 Z M 98.5 12 V 32 H 108 C 114 32 119 27.5 119 22 C 119 16.5 114 12 108 12 H 98.5 Z"
          className={textColor || 'fill-black dark:fill-white'}
        />

        {/* Letter Y */}
        <path
          d="M 134 4 H 144 L 154 19.5 L 164 4 H 174 L 158 24.5 V 40 H 149.5 V 24.5 L 134 4 Z"
          className={textColor || 'fill-black dark:fill-white'}
        />
      </svg>

      {showBadge && (
        <span className="rounded-md bg-lime-500/10 dark:bg-lime-400/15 border border-lime-500/20 px-1.5 py-0.5 text-[10px] font-black text-[#65AC00] dark:text-[#83DE05] uppercase tracking-wider">
          {badgeText}
        </span>
      )}
    </div>
  );
};

export const KadyMark = ({ className = 'h-6 w-auto', ...props }) => (
  <KadyLogo variant="mark" className={className} {...props} />
);

export default KadyLogo;
