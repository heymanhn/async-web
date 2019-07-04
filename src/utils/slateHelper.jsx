import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import PasteLinkify from 'slate-paste-linkify';
import SoftBreak from 'slate-soft-break';
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

export const schema = {
  blocks: {
    'section-break': {
      isVoid: true, // Needed so that we don't need to pass children to section breaks
    },
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
  isBackspace: isHotkey('Backspace'),
};

/* ******************** */

const DEFAULT_NODE = 'paragraph';
export const commands = {
  wrapLink: (editor, url) => {
    editor.wrapInline({ type: 'link', data: { url } });
  },

  unwrapLink: (editor) => {
    editor.unwrapInline('link');
  },

  /* Borrowed from @ianstormtaylor's slateJS example code:
   * https://github.com/ianstormtaylor/slate/blob/master/examples/rich-text/index.js
   */
  setBlock: (editor, type) => {
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    const isList = editor.hasBlock('list-item');
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = editor.hasBlock(type);

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for lists
      const isType = value.blocks.some(block => (
        !!document.getClosest(block.key, parent => parent.type === type)
      ));

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  },
};

export const queries = {
  hasBlock: (editor, type) => editor.value.blocks.some(node => node.type === type),
  hasActiveMark: (editor, type) => editor.value.activeMarks.some(mark => mark.type === type),
  isEmpty: editor => editor.value.document.text === '',
  isEmptyParagraph: (editor) => {
    const { anchorBlock } = editor.value;
    return anchorBlock.type === 'paragraph' && !anchorBlock.text;
  },
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
  AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    change: change => change.setBlocks('section-break').insertBlock(DEFAULT_NODE),
  }),
  AutoReplace({
    trigger: 'space',
    before: /(--)$/,
    change: change => change.insertText('— '),
  }),
];

export const plugins = {
  meetingTitle: [
    createPlaceholderPlugin('Untitled Meeting', theme.colors.titlePlaceholder),
  ],
  meetingDetails: [
    PasteLinkify(),
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Share details to get everyone up to speed',
      theme.colors.textPlaceholder,
    ),
    ...markdownPlugins,
  ],
  discussionTopic: [
    PasteLinkify(),
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Share your perspective. Shift + Enter to add another topic',
      theme.colors.textPlaceholder,
    ),
    ...markdownPlugins,
  ],
  discussionTopicReply: [
    PasteLinkify(),
    SoftBreak({ shift: true }),
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
    case 'section-break':
      return <hr {...attributes} />;
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

/* ******************** */

export const singleUseBlocks = [
  'block-quote',
  'heading-one',
  'heading-two',
  'heading-three',
  'section-break',
];
