
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PopupPortalProps {
  markerId: string | number;
  children: React.ReactNode;
}

const PopupPortal: React.FC<PopupPortalProps> = ({ markerId, children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findContainer = () => {
      const popupContainer = document.querySelector(`[data-marker-id="${markerId}"]`);
      if (popupContainer) {
        setContainer(popupContainer as HTMLElement);
      }
    };

    findContainer();
    
    // Attempt to find container multiple times as it might not be immediately available
    const interval = setInterval(findContainer, 100);
    
    return () => {
      clearInterval(interval);
      setContainer(null);
    };
  }, [markerId]);

  return container ? createPortal(children, container) : null;
};

export default PopupPortal;
