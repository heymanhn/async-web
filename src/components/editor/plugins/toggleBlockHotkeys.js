import { isHotkey } from 'is-hotkey';

function ToggleBlockHotkeys() {
  const hotkeys = {
    isLargeFont: isHotkey('mod+opt+1'),
    isMediumFont: isHotkey('mod+opt+2'),
    isSmallFont: isHotkey('mod+opt+3'),
  };

  return {
    onKeyDown(event, editor, next) {
      let block;

      if (hotkeys.isLargeFont(event)) {
        block = 'heading-one';
      } else if (hotkeys.isMediumFont(event)) {
        block = 'heading-two';
      } else if (hotkeys.isSmallFont(event)) {
        block = 'heading-three';
      } else {
        return next();
      }

      event.preventDefault();
      return editor.setBlock(block);
    },
  };
}

export default ToggleBlockHotkeys;
