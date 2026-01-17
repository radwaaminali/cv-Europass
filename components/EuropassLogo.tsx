
import React from 'react';

export const EuropassLogo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative w-12 h-12 flex-shrink-0">
        {/* Background Gradient Circle with Rotate Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-700 to-blue-900 rounded-xl shadow-lg transform rotate-6 border border-white/20"></div>
        
        {/* Network Grid Effect Overlay */}
        <div className="absolute inset-0 opacity-30 rounded-xl overflow-hidden" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
               backgroundSize: '6px 6px' 
             }}>
        </div>
        
        {/* Main Icon Content */}
        <div className="absolute inset-0 flex items-center justify-center">
           <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
           </svg>
        </div>

        {/* Decorative Stars (EU Style) */}
        <div className="absolute -top-1 -right-1 flex space-x-0.5">
           <i className="fa-solid fa-star text-[6px] text-yellow-400 animate-pulse"></i>
           <i className="fa-solid fa-star text-[6px] text-yellow-400 animate-pulse delay-75"></i>
           <i className="fa-solid fa-star text-[6px] text-yellow-400 animate-pulse delay-150"></i>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black text-blue-900 tracking-tighter uppercase italic drop-shadow-sm">europass</span>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">curriculum vitae</span>
      </div>
    </div>
  );
};
