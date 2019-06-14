import { breakpoints } from 'styles/theme';

const getBreakpoint = () => {
  const width = window.innerWidth;
  if (width <= 0) return null;

  for (let i = 0; i < breakpoints.length; i += 1) {
    const [name, size] = breakpoints[i];
    if (name === 'mobileOnly') {
      if (width <= size) return name;
    } else if (width >= size) {
      return name;
    }
  }

  return null;
};

export default getBreakpoint;
