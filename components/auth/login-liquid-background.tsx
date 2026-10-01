export default function LoginLiquidBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full dark:hidden"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="login-liquid-light-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="login-liquid-light-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#A5F3FC" stopOpacity="0.16" />
          </linearGradient>
          <filter id="login-liquid-filter-light" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.008 0.014;0.014 0.008;0.01 0.018;0.008 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="2.2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="72"
              xChannelSelector="R"
              yChannelSelector="B"
            >
              <animate
                attributeName="scale"
                dur="9s"
                values="48;82;58;72;48"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        <g filter="url(#login-liquid-filter-light)">
          <ellipse cx="290" cy="180" rx="360" ry="250" fill="url(#login-liquid-light-a)">
            <animate attributeName="cx" dur="16s" values="240;420;300;240" repeatCount="indefinite" />
            <animate attributeName="cy" dur="14s" values="170;280;150;170" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1160" cy="620" rx="400" ry="300" fill="url(#login-liquid-light-b)">
            <animate attributeName="cx" dur="18s" values="1180;980;1120;1180" repeatCount="indefinite" />
            <animate attributeName="cy" dur="15s" values="650;500;700;650" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="780" cy="420" rx="260" ry="190" fill="#93C5FD" opacity="0.13">
            <animate attributeName="cx" dur="20s" values="700;860;760;700" repeatCount="indefinite" />
            <animate attributeName="cy" dur="17s" values="430;330;500;430" repeatCount="indefinite" />
          </ellipse>
        </g>

        <rect width="1440" height="900" fill="url(#login-light-wash)" opacity="0" />
      </svg>

      <svg
        className="absolute inset-0 hidden h-full w-full dark:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="login-liquid-dark-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.34" />
            <stop offset="52%" stopColor="#06B6D4" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="login-liquid-dark-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.16" />
          </linearGradient>
          <filter id="login-liquid-filter-dark" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="2"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.008 0.014;0.014 0.008;0.01 0.018;0.008 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="2.2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="76"
              xChannelSelector="R"
              yChannelSelector="B"
            >
              <animate
                attributeName="scale"
                dur="9s"
                values="52;88;62;76;52"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width="1440" height="900" fill="#07111F" opacity="0.34" />
        <g filter="url(#login-liquid-filter-dark)">
          <ellipse cx="300" cy="170" rx="370" ry="260" fill="url(#login-liquid-dark-a)">
            <animate attributeName="cx" dur="16s" values="250;430;310;250" repeatCount="indefinite" />
            <animate attributeName="cy" dur="14s" values="160;280;145;160" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1150" cy="640" rx="410" ry="310" fill="url(#login-liquid-dark-b)">
            <animate attributeName="cx" dur="18s" values="1180;970;1110;1180" repeatCount="indefinite" />
            <animate attributeName="cy" dur="15s" values="650;500;710;650" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="770" cy="410" rx="270" ry="200" fill="#38BDF8" opacity="0.11">
            <animate attributeName="cx" dur="20s" values="700;870;750;700" repeatCount="indefinite" />
            <animate attributeName="cy" dur="17s" values="420;320;510;420" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/15 via-transparent to-[var(--background)]/65" />
    </div>
  );
}
