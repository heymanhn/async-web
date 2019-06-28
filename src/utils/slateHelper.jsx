import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import { isKeyHotkey } from 'is-hotkey';
import { theme } from 'styles/theme';

/* ******************** */

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

/* ******************** */

export const hotkeys = {
  isBold: isKeyHotkey('mod+b'),
  isItalic: isKeyHotkey('mod+i'),
  isUnderlined: isKeyHotkey('mod+u'),
  isCode: isKeyHotkey('mod+k'),
  isSubmit: isKeyHotkey('mod+Enter'),
  isSubmitAndKeepOpen: isKeyHotkey('shift+Enter'),
  isCancel: isKeyHotkey('Esc'),
};

/* ******************** */

const queries = { isEmpty: editor => editor.value.document.text === '' };

const createPlaceholderPlugin = (text, color) => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmpty',
  style: {
    color,
  },
});

export const plugins = {
  meetingTitle: [
    { queries },
    createPlaceholderPlugin('Untitled Meeting', theme.colors.titlePlaceholder),
  ],
  meetingDetails: [
    { queries },
    createPlaceholderPlugin(
      'Share details to get everyone up to speed',
      theme.colors.textPlaceholder,
    ),
  ],
  discussionTopic: [
    { queries },
    createPlaceholderPlugin(
      'Share your perspective. Shift + Enter to add another topic',
      theme.colors.textPlaceholder,
    ),
  ],
  discussionTopicReply: [
    { queries },
    createPlaceholderPlugin(
      'Express your thoughts. Take your time',
      theme.colors.textPlaceholder,
    ),
  ],
};

/* ******************** */

export const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'code':
      return <code {...attributes}>{children}</code>;
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    default:
      return next();
  }
};
