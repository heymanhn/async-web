import { isHotkey } from 'is-hotkey';

function ToggleBlockHotkeys() {
  const hotkeys = {
    isBlockQuote: isHotkey('mod+shift+9'),
    isCodeBlock: isHotkey('mod+shift+k'),
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
      } else if (hotkeys.isBlockQuote(event)) {
        block = 'block-quote';
      } else if (hotkeys.isCodeBlock(event)) {
        block = 'code-block';
      } else {
        return next();
      }

      event.preventDefault();
      return editor.setBlock(block);
    },
  };
}

export default ToggleBlockHotkeys;
