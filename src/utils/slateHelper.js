import PlaceholderPlugin from 'slate-react-placeholder';
import isHotKey from 'is-hotkey';
import { theme } from 'styles/theme';

export const initialValue = {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: '',
          },
        ],
      },
    ],
  },
};

/* Shared event handler for keyboard UX. Used across all slate editor components.
 * Requires these component-bound details to be implemented:
 * - a state property named `mode`
 * - handleSubmitAndKeepOpen(): only if mode is 'compose'
 * - handleSubmit()
 * - handleCancel()
 */
export function handleKeyDown(event, editor, next) {
  const { mode } = this.state;

  if (isHotKey('Enter', event)) event.preventDefault();
  if (mode === 'compose' && isHotKey('shift+Enter', event)) {
    return this.handleSubmitAndKeepOpen();
  }
  if (isHotKey('mod+Enter', event)) return this.handleSubmit();
  if (isHotKey('Esc', event)) this.handleCancel();

  return next();
}

const queries = { isEmpty: editor => editor.value.document.text === '' };

const createPlaceholderPlugin = (text, color) => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmpty',
  style: {
    color,
  },
});

export const titlePlugins = [
  { queries },
  createPlaceholderPlugin('Untitled Meeting', theme.colors.titlePlaceholder),
];

export const detailsPlugins = [
  { queries },
  createPlaceholderPlugin(
    'Share details to get everyone up to speed',
    theme.colors.textPlaceholder,
  ),
];

export const discussionTopicPlugins = [
  { queries },
  createPlaceholderPlugin(
    'Share your perspective. Shift + Enter to add another topic',
    theme.colors.textPlaceholder,
  ),
];

export const discussionTopicReplyPlugins = [
  { queries },
  createPlaceholderPlugin(
    'Express your thoughts. Take your time',
    theme.colors.textPlaceholder,
  ),
];
