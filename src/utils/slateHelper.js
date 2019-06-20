import PlaceholderPlugin from 'slate-react-placeholder';
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
