/* eslint jsx-a11y/alt-text: 0 */

import React from 'react';
import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import PasteLinkify from 'slate-paste-linkify';
import SoftBreak from 'slate-soft-break';

import { theme } from 'styles/theme';

import ToggleBlockHotkeys from './plugins/toggleBlockHotkeys';
import ToggleMarkHotkeys from './plugins/toggleMarkHotkeys';
import Image from './plugins/image';

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
  wrapLink: (editor, url) => {
    editor.wrapInline({ type: 'link', data: { url } });
  },

  unwrapLink: (editor) => {
    editor.unwrapInline('link');
  },

  // Works for both bulleted and numbered lists
  setListBlock: (editor, type) => {
    const hasListItems = editor.hasBlock('list-item');

    // This means the user is looking to un-set the list block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    // Converting a bulleted list to a numbered list, or vice versa
    if (hasListItems) {
      return editor
        .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
        .wrapBlock(type);
    }

    // Simplest case: setting the list type as desired
    return editor
      .unwrapNonListBlocks()
      .setBlocks('list-item')
      .wrapBlock(type);
  },

  setWrappedBlock: (editor, type) => {
    // This means the user is looking to un-set the wrapped block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    return editor
      .setBlocks(DEFAULT_NODE)
      .unwrapOtherBlocks()
      .wrapBlock(type);
  },

  /* Borrowed from @ianstormtaylor's slateJS example code:
   * https://github.com/ianstormtaylor/slate/blob/master/examples/rich-text/index.js
   *
   * Handles everything but lists and block quotes.
   */
  setBlock: (editor, type) => {
    if (['bulleted-list', 'numbered-list'].includes(type)) return editor.setListBlock(type);
    if (['block-quote', 'code-block'].includes(type)) return editor.setWrappedBlock(type);

    const isActive = editor.hasBlock(type);

    return editor
      .unwrapOtherBlocks()
      .setBlocks(isActive ? DEFAULT_NODE : type);
  },

  unwrapListBlocks: (editor) => {
    editor
      .unwrapBlock('bulleted-list')
      .unwrapBlock('numbered-list');
  },

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
  isLinkActive: (editor, value) => value.inlines.some(i => i.type === 'link'),
  isWrappedBy: (editor, type) => editor.value.blocks.some(block => (
    !!editor.value.document.getClosest(block.key, parent => parent.type === type)
  )),
  isWrappedByCodeOrQuote: editor => editor.isWrappedBy('code-block')
    || editor.isWrappedBy('block-quote'),
  isWrappedByList: editor => editor.isWrappedBy('bulleted-list')
    || editor.isWrappedBy('numbered-list'),
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
    before: /^(-)$/,
    change: change => change.setBlock('bulleted-list'),
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(1.)$/,
    change: change => change.setBlock('numbered-list'),
  }),
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
  AutoReplace({
    trigger: 'space',
    before: /^(>)$/,
    change: (change) => {
      // Essentially undoing the autoReplace detection
      if (change.isWrappedByAnyBlock()) return change.insertText('> ');

      return change
        .insertBlock(DEFAULT_NODE)
        .moveBackward(1)
        .setBlock('block-quote');
    },
  }),
  AutoReplace({
    trigger: '`',
    before: /^(``)$/,
    change: (change) => {
      // Essentially undoing the autoReplace detection
      if (change.isWrappedByAnyBlock()) return change.insertText('```');

      return change
        .insertBlock(DEFAULT_NODE)
        .moveBackward(1)
        .setBlock('code-block');
    },
  }),
];

export const plugins = {
  meetingTitle: [],
  meetingPurpose: [],
  discussionTitle: [
    createPlaceholderPlugin('Untitled Discussion', theme.colors.titlePlaceholder),
  ],
  discussion: [
    PasteLinkify(),
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Post a message to start this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    ToggleBlockHotkeys(),
    ToggleMarkHotkeys(),
    Image(),
    ...markdownPlugins,
  ],
  message: [
    PasteLinkify(),
    SoftBreak({ shift: true }),
    createPlaceholderPlugin(
      'Share your perspective with others in this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    ToggleBlockHotkeys(),
    ToggleMarkHotkeys(),
    Image(),
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
    case 'code-block':
      return <pre {...attributes}>{children}</pre>;
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
