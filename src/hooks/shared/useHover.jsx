import { useState } from 'react';

const useHover = (
  allowHover = true,
  handleHoverOn = () => {},
  handleHoverOff = () => {}
) => {
  const [hover, setHover] = useState(false);

  const enableHover = event => {
    event.stopPropagation();
    if (allowHover) {
      setHover(true);
      handleHoverOn();
    }
  };

  const disableHover = event => {
    event.stopPropagation();
    if (allowHover) {
      setHover(false);
      handleHoverOff();
    }
  };

  return {
    hover,
    onBlur: disableHover,
    onFocus: enableHover,
    onMouseOut: disableHover,
    onMouseOver: enableHover,
  };
};

export default useHover;
