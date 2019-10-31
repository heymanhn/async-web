// Library of helper plugins, inspired by https://docs.slatejs.org/guides/plugins
import { isHotkey } from 'is-hotkey';

export const AddSchema = schemaObj => ({ schema: schemaObj });
export const AddCommands = commandsObj => ({ commands: commandsObj });
export const AddQueries = queriesObj => ({ queries: queriesObj });

export const Hotkey = (combination, hotkeyFn) => ({
  onKeyDown(event, editor, next) {
    if (isHotkey(combination, event)) {
      return hotkeyFn(editor, next, event);
    }

    return next();
  },
});

export const RenderMark = (markToRender, componentFn) => ({
  renderMark(props, editor, next) {
    const { mark } = props;

    return mark.type === markToRender ? componentFn(props) : next();
  },
});

export const RenderBlock = (blockToRender, componentFn) => ({
  renderBlock(props, editor, next) {
    const { node } = props;

    return node.type === blockToRender ? componentFn(props) : next();
  },
});

export const RenderInline = (inlineToRender, componentFn) => ({
  renderInline(props, editor, next) {
    const { node } = props;

    return node.type === inlineToRender ? componentFn(props) : next();
  },
});

export const RenderEditor = renderFn => ({
  renderEditor(...props) {
    return renderFn(...props);
  },
});

export const CustomEnterAction = actionFn => ({
  onKeyDown(event, editor, next) {
    if (isHotkey('Enter', event)) return actionFn(editor, next);

    return next();
  },
});

export const CustomBackspaceAction = actionFn => ({
  onKeyDown(event, editor, next) {
    if (isHotkey('Backspace', event)) return actionFn(editor, next);

    return next();
  },
});

export const CustomDropAction = actionFn => ({
  onDrop(event, editor, next) {
    return actionFn(event, editor, next);
  },
});

export const CustomPasteAction = actionFn => ({
  onPaste(event, editor, next) {
    return actionFn(event, editor, next);
  },
});
