import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import PasteLinkify from 'slate-paste-linkify';
import { isHotkey } from 'is-hotkey';
import { theme } from 'styles/theme';

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

  // Actions
  isEnter: isHotkey('Enter'),
  isSubmit: isHotkey('mod+Enter'),
  isSubmitAndKeepOpen: isHotkey('shift+Enter'),
  isCancel: isHotkey('Esc'),
};

/* ******************** */

export const commands = {
  wrapLink: (editor, url) => {
    editor.wrapInline({ type: 'link', data: { url } });
  },
  unwrapLink(editor) {
    editor.unwrapInline('link');
  },
};

export const queries = {
  isEmpty: editor => editor.value.document.text === '',
  isLinkActive: (editor, value) => value.inlines.some(i => i.type === 'link'),
};

/* ******************** */

const createPlaceholderPlugin = (text, color) => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmpty',
  style: {
    color,
  },
});

const markdownPlugins = [
  AutoReplace({
    trigger: 'space',
    before: /^(>)$/,
    change: change => change.setBlocks('block-quote'),
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(-)$/,
    change: change => change.setBlocks('list-item').wrapBlock('bulleted-list'),
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(1.)$/,
    change: change => change.setBlocks('list-item').wrapBlock('numbered-list'),
  }),
];

export const plugins = {
  meetingTitle: [
    createPlaceholderPlugin('Untitled Meeting', theme.colors.titlePlaceholder),
  ],
  meetingDetails: [
    PasteLinkify(),
    createPlaceholderPlugin(
      'Share details to get everyone up to speed',
      theme.colors.textPlaceholder,
    ),
    ...markdownPlugins,
  ],
  discussionTopic: [
    PasteLinkify(),
    createPlaceholderPlugin(
      'Share your perspective. Shift + Enter to add another topic',
      theme.colors.textPlaceholder,
    ),
    ...markdownPlugins,
  ],
  discussionTopicReply: [
    PasteLinkify(),
    createPlaceholderPlugin(
      'Express your thoughts. Take your time',
      theme.colors.textPlaceholder,
    ),
    ...markdownPlugins,
  ],
};

/* Methods for determining how to render elements in the editor  */

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
    case 'link':
      return (
        <a
          {...attributes}
          href={node.data.get('url')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
};

export const renderInline = (props, editor, next) => {
  const { node, attributes, children } = props;

  switch (node.type) {
    case 'link':
      return (
        <a
          {...attributes}
          href={node.data.get('url')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    default:
      return next();
  }
};


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
