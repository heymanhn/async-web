import { useState } from 'react';

const useHover = (
  allowHover,
  handleHoverOn = () => {},
  handleHoverOff = () => {}
) => {
  const [hover, setHover] = useState(false);

  function enableHover(event) {
    event.stopPropagation();
    if (allowHover) {
      setHover(true);
      handleHoverOn();
    }
  }

  function disableHover(event) {
    event.stopPropagation();
    if (allowHover) {
      setHover(false);
      handleHoverOff();
    }
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
