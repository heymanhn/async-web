import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import { isKeyHotkey } from 'is-hotkey';
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
  isBold: isKeyHotkey('mod+b'),
  isItalic: isKeyHotkey('mod+i'),
  isUnderlined: isKeyHotkey('mod+u'),
  isCode: isKeyHotkey('mod+k'),

  // Blocks
  isBulletedList: isKeyHotkey('mod+shift+8'),
  isNumberedList: isKeyHotkey('mod+shift+7'),
  isLargeFont: isKeyHotkey('mod+opt+1'),
  isMediumFont: isKeyHotkey('mod+opt+2'),
  isSmallFont: isKeyHotkey('mod+opt+3'),
  isSectionBreak: isKeyHotkey('mod+shift+Enter'),

  // Actions
  isEnter: isKeyHotkey('Enter'),
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

const LargeFont = styled.div({

});

const MediumFont = styled.div({

});

const SmallFont = styled.div({

});

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <LargeFont {...attributes}>{children}</LargeFont>;
    case 'heading-two':
      return <MediumFont {...attributes}>{children}</MediumFont>;
    case 'heading-three':
      return <SmallFont {...attributes}>{children}</SmallFont>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
};
