import { useState } from 'react';

const useHover = noHover => {
  const [hover, setHover] = useState(false);

  function disableHover(event) {
    event.stopPropagation();
    if (!noHover) setHover(false);
  }

  function enableHover(event) {
    event.stopPropagation();
    if (!noHover) setHover(true);
  }

  return {
    hover,
    onBlur: disableHover,
    onFocus: enableHover,
    onMouseOut: disableHover,
    onMouseOver: enableHover,
  };
};

export default useHover;
