import PlaceholderPlugin from 'slate-react-placeholder';
import AutoReplace from 'slate-auto-replace';
import SoftBreak from 'slate-soft-break';
import styled from '@emotion/styled';

import { theme } from 'styles/theme';
import { track } from 'utils/analytics';

import { DEFAULT_NODE, DEFAULT_PLAIN_NODE } from './defaults';
import { BoldPlugin } from './plugins/marks/bold';
import { ItalicPlugin } from './plugins/marks/italic';
import Underlined from './plugins/marks/underlined';
import CodeSnippet from './plugins/marks/codeSnippet';
import { TextBlockPlugin } from './plugins/blocks/text';
import { HeadingsPlugin } from './plugins/blocks/headings';
import { SectionBreak } from './plugins/blocks/sectionBreak';
import { Image } from './plugins/blocks/image';
import { ListsPlugin } from './plugins/blocks/lists';
import Link from './plugins/inlines/link';
import { BlockQuotePlugin } from './plugins/blocks/blockQuote';
import { CodeBlockPlugin } from './plugins/blocks/codeBlock';
import SelectionToolbar from './plugins/selectionToolbar';
import CompositionMenu from './plugins/compositionMenu';
import EditorActions from './plugins/editorActions';
import InlineEditorActions from './plugins/inlineEditorActions';

// HN: Not supporting drag and drop guides for now
// import DragAndDrop from './plugins/dragAndDrop';
// import DragAndDropIndicator from './plugins/blocks/dragAndDropIndicator';
import Drafts from './plugins/drafts';
import ImageLoadingIndicator from './plugins/blocks/imageLoadingIndicator';
import CustomBodyPlaceholder from './plugins/customBodyPlaceholder';
import AutoSave from './plugins/autoSave';
import AutoScroll from './plugins/autoScroll';
import { InlineDiscussionPlugin } from './plugins/inlineDiscussion';

/* **** Commands **** */

export const commands = {
  clearBlock: (editor) => {
    if (editor.isEmptyBlock()) return null;
    return editor
      .moveAnchorToStartOfBlock()
      .moveFocusToEndOfBlock()
      .delete();
  },

  setWrappedBlock: (editor, type, source) => {
    // This means the user is looking to un-set the wrapped block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    track('Block inserted to content', { type, source });

    return editor
      .setBlocks(DEFAULT_NODE)
      .unwrapAnyBlock(type)
      .wrapBlock(type);
  },

  setBlock: (editor, type, source) => {
    const isActive = editor.hasBlock(type);

    // We're not interested in text blocks...
    if (!isActive && type !== DEFAULT_NODE) track('Block inserted to content', { type, source });

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
  getParentBlock: (editor) => {
    const { document, startBlock } = editor.value;
    if (!startBlock) return null;
    return document.getClosestBlock(startBlock.key);
  },
  hasBlock: (editor, type) => editor.value.blocks.some(node => node.type === type),
  hasActiveMark: (editor, type) => editor.value.activeMarks.some(mark => mark.type === type),
  isAtBeginning: (editor) => {
    const { value } = editor;
    const { selection } = value;
    return selection.isCollapsed && selection.anchor.offset === 0;
  },
  isEmptyBlock: editor => !editor.value.startBlock.text,
  isEmptyDocument: (editor) => {
    const { value } = editor;
    const { document: doc } = value;
    const blocks = doc.getBlocks();

    if (blocks.size === 1) {
      const firstBlock = blocks.first();
      const matchingTypes = [DEFAULT_NODE, DEFAULT_PLAIN_NODE];
      return matchingTypes.includes(firstBlock.type) && !firstBlock.text;
    }

    return false;
  },
  isEmptyAndUnfocusedDocument: (editor) => {
    const { value } = editor;
    const { selection } = value;

    return editor.isEmptyDocument() && !selection.isFocused;
  },
  isEmptyParagraph: (editor) => {
    const { startBlock } = editor.value;
    return startBlock.type === DEFAULT_NODE && !startBlock.text;
  },
  isWrappedBy: (editor, type) => editor.value.blocks.some(block => (
    !!editor.value.document.getClosest(block.key, parent => parent.type === type)
  )),
  isWrappedByAnyBlock: editor => !!editor.getParentBlock(),
};

/* **** Plugins **** */
const coreEditorPlugins = [
  // Marks
  BoldPlugin(),
  ItalicPlugin(),
  Underlined(),
  CodeSnippet(),

  // Blocks
  TextBlockPlugin(),
  HeadingsPlugin(),
  ListsPlugin(),
  BlockQuotePlugin(),
  CodeBlockPlugin(),
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
  CompositionMenu(),
  ImageLoadingIndicator(),
];

const discussionPlugins = [
  ...coreEditorPlugins,

  // HN: Not supporting drag and drop guides for now
  // DragAndDrop(),
  // DragAndDropIndicator(),

  Drafts(),
  EditorActions(),
];

const inlineDiscussionPlugins = [
  ...coreEditorPlugins,
  Drafts(),
  InlineEditorActions(),
];

const createDiscussionTitlePlaceholder = text => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmptyDocument',
  style: {
    color: theme.colors.titlePlaceholder,
    lineHeight: '43px',
    opacity: 1,
  },
});

const createDocumentTitlePlaceholder = text => PlaceholderPlugin({
  placeholder: text,
  when: 'isEmptyDocument',
  style: {
    color: theme.colors.titlePlaceholder,
    lineHeight: '48px',
    opacity: 1,
  },
});

const DocumentPlaceholder = styled.div({
  lineHeight: '26px',
});

const createDocumentPlaceholder = text => CustomBodyPlaceholder({
  placeholder: text,
  when: 'isEmptyAndUnfocusedDocument',
  Component: DocumentPlaceholder,
});

export const plugins = {
  meetingTitle: [],
  meetingPurpose: [],
  discussionTitle: [createDiscussionTitlePlaceholder('Untitled Discussion')],
  discussion: discussionPlugins,
  message: discussionPlugins,

  // Roval v2
  documentTitle: [createDocumentTitlePlaceholder('Untitled Document')],
  document: [
    ...coreEditorPlugins,
    AutoSave(),
    AutoScroll(),
    InlineDiscussionPlugin(),
    createDocumentPlaceholder('Say what you have to say'),
  ],
  discussionReply: inlineDiscussionPlugins,
};
