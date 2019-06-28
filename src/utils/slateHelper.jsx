import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import { isHotkey } from 'is-hotkey';
import { theme } from 'styles/theme';
import styled from '@emotion/styled';

/* ******************** */

export const defaultValue = {
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
  // Marks
  isBold: isHotkey('mod+b'),
  isItalic: isHotkey('mod+i'),
  isUnderlined: isHotkey('mod+u'),
  isCode: isHotkey('mod+k'),

  // Blocks
  isBulletedList: isHotkey('mod+shift+8'),
  isNumberedList: isHotkey('mod+shift+7'),
  isLargeFont: isHotkey('mod+opt+1'),
  isMediumFont: isHotkey('mod+opt+2'),
  isSmallFont: isHotkey('mod+opt+3'),
  isSectionBreak: isHotkey('mod+shift+Enter'),

  // Actions
  isEnter: isHotkey('Enter'),
  isSubmit: isHotkey('mod+Enter'),
  isSubmitAndKeepOpen: isHotkey('shift+Enter'),
  isCancel: isHotkey('Esc'),
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

/* Methods for determining how to render marks and blocks in the editor  */

export const renderMark = (props, editor, next) => {
  const { attributes, children, mark } = props;

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

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
};
