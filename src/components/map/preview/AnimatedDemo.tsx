
import React, { useEffect, useState } from "react";

const AnimatedDemo: React.FC = () => {
  const [showMohamed, setShowMohamed] = useState(false);
  const [showFatma, setShowFatma] = useState(false);
  const [showMessage1, setShowMessage1] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setShowMohamed(true), 1000);
    const timer2 = setTimeout(() => setShowFatma(true), 2000);
    const timer3 = setTimeout(() => setShowMessage1(true), 3000);
    const timer4 = setTimeout(() => setShowMessage2(true), 5000);
    
    // Reset animation after completion
    const resetTimer = setTimeout(() => {
      setShowMohamed(false);
      setShowFatma(false);
      setShowMessage1(false);
      setShowMessage2(false);
      // Restart animation
      setTimeout(() => {
        setShowMohamed(true);
        setTimeout(() => setShowFatma(true), 1000);
        setTimeout(() => setShowMessage1(true), 2000);
        setTimeout(() => setShowMessage2(true), 4000);
      }, 1000);
    }, 10000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(resetTimer);
    };
  }, []);
  
  return (
    <>
      {showMohamed && (
        <div className="absolute left-[30%] top-[40%] z-[1001] transition-opacity duration-500 ease-in-out opacity-100">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white">
            <span>M</span>
          </div>
          {showMessage1 && (
            <div className="absolute left-12 top-0 bg-white p-2 rounded-lg shadow-md text-sm animate-fade-in max-w-[120px]">
              Bonjour mon voisin!
            </div>
          )}
        </div>
      )}
      
      {showFatma && (
        <div className="absolute right-[30%] top-[60%] z-[1001] transition-opacity duration-500 ease-in-out opacity-100">
          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white border-2 border-white">
            <span>F</span>
          </div>
          {showMessage2 && (
            <div className="absolute right-12 top-0 bg-white p-2 rounded-lg shadow-md text-sm animate-fade-in max-w-[120px]">
              Ça va?
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AnimatedDemo;
