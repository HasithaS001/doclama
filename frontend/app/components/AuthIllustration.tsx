'use client';

const AuthIllustration = () => {
  return (
    <svg
      width="360"
      height="360"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background Circle */}
      <circle cx="200" cy="200" r="180" fill="#EEF2FF" />
      
      {/* Document Stack */}
      <g transform="translate(120, 120)">
        {/* Bottom Document */}
        <rect x="0" y="20" width="160" height="200" rx="8" fill="#E0E7FF" />
        {/* Middle Document */}
        <rect x="10" y="10" width="160" height="200" rx="8" fill="#C7D2FE" />
        {/* Top Document */}
        <rect x="20" y="0" width="160" height="200" rx="8" fill="#4263eb" />
        
        {/* Document Lines */}
        <g transform="translate(40, 30)">
          <rect width="100" height="6" rx="3" fill="white" opacity="0.7" />
          <rect y="20" width="120" height="6" rx="3" fill="white" opacity="0.7" />
          <rect y="40" width="80" height="6" rx="3" fill="white" opacity="0.7" />
        </g>

        {/* Chat Bubbles */}
        <g transform="translate(50, 100)">
          {/* Left Bubble */}
          <rect
            x="0"
            y="0"
            width="60"
            height="30"
            rx="15"
            fill="white"
          />
          {/* Right Bubble */}
          <rect
            x="70"
            y="40"
            width="60"
            height="30"
            rx="15"
            fill="white"
          />
        </g>
      </g>

      {/* Decorative Elements */}
      <circle cx="100" cy="100" r="8" fill="#4263eb" opacity="0.5" />
      <circle cx="300" cy="150" r="6" fill="#4263eb" opacity="0.5" />
      <circle cx="250" cy="300" r="10" fill="#4263eb" opacity="0.5" />
      <circle cx="150" cy="280" r="5" fill="#4263eb" opacity="0.5" />
    </svg>
  );
};

export default AuthIllustration;
