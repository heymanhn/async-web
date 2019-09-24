// Library of helper plugins, inspired by https://docs.slatejs.org/guides/plugins
import { isHotkey } from 'is-hotkey';

export const Hotkey = (combination, hotkeyFn) => ({
  onKeyDown(event, editor, next) {
    if (isHotkey(combination, event)) return editor.command(hotkeyFn);

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

export const AddSchema = schemaObj => ({ schema: schemaObj });
export const AddCommand = commandsObj => ({ commands: commandsObj });
export const AddQuery = queriesObj => ({ queries: queriesObj });
