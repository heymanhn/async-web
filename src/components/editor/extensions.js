import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import SoftBreak from 'slate-soft-break';

import { theme } from 'styles/theme';

import { DEFAULT_NODE } from './defaults';

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
import SelectionToolbar from './plugins/selectionToolbar';

/* **** Commands **** */

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
      .unwrapAnyBlock(type)
      .wrapBlock(type);
  },

  setBlock: (editor, type) => {
    const isActive = editor.hasBlock(type);

    return editor
      .unwrapAnyBlock()
      .setBlocks(isActive ? DEFAULT_NODE : type);
  },

  unwrapAnyBlock: (editor, type) => {
    const parent = editor.getParentBlock();
    if (!parent || parent.type === type) return;

    editor.unwrapBlock(parent.type);
  },
};

/* **** Queries  **** */

export const queries = {
  getParentBlock: editor => editor.value.document.getClosestBlock(editor.value.anchorBlock.key),
  hasBlock: (editor, type) => editor.value.blocks.some(node => node.type === type),
  hasActiveMark: (editor, type) => editor.value.activeMarks.some(mark => mark.type === type),
  isAtBeginning: (editor) => {
    const { value } = editor;
    const { selection } = value;
    return selection.isCollapsed && selection.anchor.offset === 0;
  },
  isEmptyBlock: editor => !editor.value.anchorBlock.text,
  isEmptyDocument: editor => editor.value.document.text === '',
  isEmptyParagraph: (editor) => {
    const { anchorBlock } = editor.value;
    return anchorBlock.type === DEFAULT_NODE && !anchorBlock.text;
  },
  isWrappedBy: (editor, type) => editor.value.blocks.some(block => (
    !!editor.value.document.getClosest(block.key, parent => parent.type === type)
  )),
  isWrappedByAnyBlock: editor => !!editor.getParentBlock(),
};

/* **** Plugins **** */

const createPlaceholderPlugin = (text, color) => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmptyDocument',
  style: {
    color,
  },
});

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
  AutoReplace({
    trigger: 'space',
    before: /(--)$/,
    change: change => change.insertText('— '),
  }),
  SelectionToolbar(),
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
