// Library of helper plugins, inspired by https://docs.slatejs.org/guides/plugins
import { isHotkey } from 'is-hotkey';

export const DEFAULT_NODE = 'paragraph';

export const AddSchema = schemaObj => ({ schema: schemaObj });
export const AddCommands = commandsObj => ({ commands: commandsObj });
export const AddQueries = queriesObj => ({ queries: queriesObj });

export const Hotkey = (combination, hotkeyFn) => ({
  onKeyDown(event, editor, next) {
    if (isHotkey(combination, event)) {
      event.preventDefault();
      return editor.command(hotkeyFn);
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

export const CustomEnterAction = actionFn => ({
  onKeyDown(event, editor, next) {
    if (isHotkey('Enter', event)) return actionFn(editor, next);

    return next();
  },
});
