import { useEffect } from 'react';

// New way of detecting clicking outside an element, using React hooks
const useClickOutside = ({ handleClickOutside, ref }) => {
  useEffect(() => {
    const handleClick = (event) => {
      // Means it's a click outside the component.
      if (!ref.current.contains(event.target)) handleClickOutside();
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });
};

export default useClickOutside;
