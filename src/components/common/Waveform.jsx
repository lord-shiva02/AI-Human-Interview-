import React from 'react';

export const Waveform = ({ isActive = true, count = 16, color = "cyan", height = "h-8" }) => {
  const bars = Array.from({ length: count }, (_, i) => i);

  const getColorClasses = () => {
    switch (color) {
      case "cyan":
        return "bg-gradient-to-t from-cyan-500 to-blue-400 shadow-cyan-500/50";
      case "emerald":
        return "bg-gradient-to-t from-emerald-500 to-teal-400 shadow-emerald-500/50";
      case "purple":
        return "bg-gradient-to-t from-purple-500 to-indigo-400 shadow-purple-500/50";
      case "rose":
        return "bg-gradient-to-t from-rose-500 to-pink-400 shadow-rose-500/50";
      default:
        return "bg-cyan-400 shadow-cyan-400/50";
    }
  };

  return (
    <div className={`flex items-center justify-center gap-1 ${height} px-2`}>
      {bars.map((_, index) => {
        // Vary animation durations and delay for realistic natural audio wave spectrum
        const duration = 0.6 + ((index % 5) * 0.15);
        const delay = (index * 0.08) % 0.6;
        const minHeight = isActive ? `${15 + (index % 4) * 10}%` : '15%';

        return (
          <div
            key={index}
            className={`w-1 rounded-full transition-all duration-200 shadow-sm ${getColorClasses()} ${isActive ? 'animate-pulse' : 'opacity-40'}`}
            style={{
              height: isActive ? `${Math.floor(25 + Math.sin(index) * 65)}%` : '15%',
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              minHeight: minHeight
            }}
          />
        );
      })}
    </div>
  );
};
