/* eslint jsx-a11y/alt-text: 0 */

import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import SoftBreak from 'slate-soft-break';

import { theme } from 'styles/theme';

import Bold from './plugins/marks/bold';
import Italic from './plugins/marks/italic';
import Underlined from './plugins/marks/underlined';
import CodeSnippet from './plugins/marks/codeSnippet';
import Headings from './plugins/blocks/headings';
import SectionBreak from './plugins/blocks/sectionBreak';
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
    before: /(--)$/,
    change: change => change.insertText('— '),
  }),
];

// DRY THIS UP FURTHER LATER
const coreEditorPlugins = [
  // Marks
  Bold(),
  Italic(),
  Underlined(),
  CodeSnippet(),

  // Blocks
  Headings(),
  Lists(),
  BlockQuote(),
  CodeBlock(),
  SectionBreak(),
  Image(),

  // Inlines
  Link(),

  // Others
  SoftBreak({ shift: true }),
  markdownPlugins,
];

export const plugins = {
  meetingTitle: [],
  meetingPurpose: [],
  discussionTitle: [
    createPlaceholderPlugin('Untitled Discussion', theme.colors.titlePlaceholder),
  ],
  discussion: [
    createPlaceholderPlugin(
      'Post a message to start this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    coreEditorPlugins,
  ],
  message: [
    createPlaceholderPlugin(
      'Share your perspective with others in this discussion. Be as expressive as you like.',
      theme.colors.textPlaceholder,
    ),
    coreEditorPlugins,
  ],
};
