/* eslint jsx-a11y/alt-text: 0 */

import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import SoftBreak from 'slate-soft-break';

import { theme } from 'styles/theme';

import ToggleBlockHotkeys from './plugins/toggleBlockHotkeys';
import ToggleMarkHotkeys from './plugins/toggleMarkHotkeys';
import Image from './plugins/blocks/image';
import Lists from './plugins/blocks/lists';
import Link from './plugins/inlines/link';
import BlockQuote from './plugins/blocks/blockQuote';
import CodeBlock from './plugins/blocks/codeBlock';

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

const DEFAULT_NODE = 'paragraph';
export const commands = {
  setWrappedBlock: (editor, type) => {
    // This means the user is looking to un-set the wrapped block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    return editor
      .setBlocks(DEFAULT_NODE)
      .unwrapOtherBlocks(type)
      .wrapBlock(type);
  },

  setBlock: (editor, type) => {
    if (['block-quote', 'code-block'].includes(type)) return editor.setWrappedBlock(type);

    const isActive = editor.hasBlock(type);

    return editor
      .unwrapOtherBlocks()
      .setBlocks(isActive ? DEFAULT_NODE : type);
  },

  // HN: How do I abstract this? Into which plugin?
  unwrapNonListBlocks: (editor) => {
    editor
      .unwrapBlock('block-quote')
      .unwrapBlock('code-block');
  },

  unwrapOtherBlocks: (editor) => {
    editor
      .unwrapListBlocks()
      .unwrapNonListBlocks();
  },
};

export const queries = {
  hasBlock: (editor, type) => editor.value.blocks.some(node => node.type === type),
  hasActiveMark: (editor, type) => editor.value.activeMarks.some(mark => mark.type === type),
  isAtBeginning: (editor) => {
    const { value } = editor;
    const { selection } = value;
    return selection.isCollapsed && selection.anchor.offset === 0;
  },
  isEmpty: editor => editor.value.document.text === '',
  isEmptyParagraph: (editor) => {
    const { anchorBlock } = editor.value;
    return anchorBlock.type === 'paragraph' && !anchorBlock.text;
  },
  isWrappedBy: (editor, type) => editor.value.blocks.some(block => (
    !!editor.value.document.getClosest(block.key, parent => parent.type === type)
  )),
  isWrappedByCodeOrQuote: editor => editor.isWrappedBy('code-block')
    || editor.isWrappedBy('block-quote'),
  isWrappedByAnyBlock: editor => editor.isWrappedByCodeOrQuote() || editor.isWrappedByList(),
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
    before: /^(#)$/,
    change: change => change.setBlock('heading-one'),
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(##)$/,
    change: change => change.setBlock('heading-two'),
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(###)$/,
    change: change => change.setBlock('heading-three'),
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
  meetingTitle: [],
  meetingPurpose: [],
  discussionTitle: [
    createPlaceholderPlugin('Untitled Discussion', theme.colors.titlePlaceholder),
  ],
  // DRY THIS UP LATER
  discussion: [
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Post a message to start this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    ToggleBlockHotkeys(),
    ToggleMarkHotkeys(),
    Image(),
    Lists(),
    Link(),
    BlockQuote(),
    CodeBlock(),
    markdownPlugins,
  ],
  message: [
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Share your perspective with others in this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    ToggleBlockHotkeys(),
    ToggleMarkHotkeys(),
    Image(),
    Lists(),
    Link(),
    BlockQuote(),
    CodeBlock(),
    markdownPlugins,
  ],
};

/* Methods for determining how to render elements in the editor  */

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'section-break':
      return <hr {...attributes} />;
    default:
      return next();
  }
};

export const renderMark = (props, editor, next) => {
  const { attributes, children, mark } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'code-snippet':
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
  'heading-one',
  'heading-two',
  'heading-three',
  'section-break',
];
