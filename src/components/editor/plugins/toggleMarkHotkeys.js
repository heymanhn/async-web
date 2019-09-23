import { isHotkey } from 'is-hotkey';

function ToggleMarkHotkeys() {
  const hotkeys = {
    isBold: isHotkey('mod+b'),
    isItalic: isHotkey('mod+i'),
    isUnderlined: isHotkey('mod+u'),
    isCodeSnippet: isHotkey('mod+k'),
  };

  return {
    onKeyDown(event, editor, next) {
      let mark;

      if (hotkeys.isBold(event)) {
        mark = 'bold';
      } else if (hotkeys.isItalic(event)) {
        mark = 'italic';
      } else if (hotkeys.isUnderlined(event)) {
        mark = 'underlined';
      } else if (hotkeys.isCodeSnippet(event)) {
        mark = 'code-snippet';
      } else {
        return next();
      }

      event.preventDefault();
      return editor.toggleMark(mark);
    },
  };
}

export default ToggleMarkHotkeys;
