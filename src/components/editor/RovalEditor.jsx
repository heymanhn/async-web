/*
  handlePressEscape(editor, next) {
    const { value } = this.state;
    const { selection } = value;

    if (selection.isExpanded) editor.moveToAnchor();
    if (editor.isEmptyDocument()) return this.handleCancel();

    return next();
  }

  handleKeyDown(event, editor, next) {
    const hotkeys = {
      isSubmit: isHotkey('mod+Enter'),
      isCancel: isHotkey('Esc'),
    };

    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) return this.handlePressEscape(editor, next);

    return next();
  }
}
*/
