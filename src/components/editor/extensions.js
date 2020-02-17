import PlaceholderPlugin from 'slate-react-placeholder';
import SoftBreak from 'slate-soft-break';
import styled from '@emotion/styled';

import { theme } from 'styles/theme';

import { DEFAULT_ELEMENT_TYPE, DEFAULT_PLAIN_NODE } from './utils';
import Link from './plugins/inlines/link';

// HN: Not supporting drag and drop guides for now
// import DragAndDrop from './plugins/dragAndDrop';
// import DragAndDropIndicator from './plugins/blocks/dragAndDropIndicator';
import ImageLoadingIndicator from './plugins/blocks/imageLoadingIndicator';
import CustomBodyPlaceholder from './plugins/customBodyPlaceholder';
import AutoScroll from './plugins/autoScroll';
import {
  ContextHighlightPlugin,
  InlineDiscussionPlugin,
} from './plugins/inlineDiscussion';

/* **** Commands **** */

export const commands = {
  moveEndToStartOfParentBlock: (editor, start) => {
    const { value } = editor;
    const { document } = value;

    const parentBlock = document.getParent(start.key);
    const parentBlockKey = parentBlock
      ? parentBlock.getFirstText().key
      : start.key;

    return editor.moveEndTo(parentBlockKey, 0);
  },

  moveStartToEndOfParentBlock: (editor, end) => {
    const { value } = editor;
    const { document } = value;

    const parentBlock = document.getParent(end.key);
    const parentBlockKey = parentBlock
      ? parentBlock.getLastText().key
      : end.key;

    return editor.moveStartTo(parentBlockKey, 0).moveStartToEndOfBlock();
  },
};

/* **** Queries  **** */

export const queries = {
  isAtBeginning: editor => {
    const { value } = editor;
    const { selection } = value;
    return selection.isCollapsed && selection.anchor.offset === 0;
  },
  isEmptyBlock: editor =>
    editor.value.startBlock && !editor.value.startBlock.text,
  isEmptyDocument: editor => {
    const { value } = editor;
    const { document: doc } = value;
    const blocks = doc.getBlocks();

    if (blocks.size === 1) {
      const firstBlock = blocks.first();
      const matchingTypes = [DEFAULT_ELEMENT_TYPE, DEFAULT_PLAIN_NODE];
      return matchingTypes.includes(firstBlock.type) && !firstBlock.text;
    }

    return false;
  },
  isEmptyAndUnfocusedDocument: editor => {
    const { value } = editor;
    const { selection } = value;

    return editor.isEmptyDocument() && !selection.isFocused;
  },
  isWrappedBy: (editor, type) =>
    editor.value.blocks.some(
      block =>
        !!editor.value.document.getClosest(
          block.key,
          parent => parent.type === type
        )
    ),
  isWrappedByAnyBlock: editor => !!editor.getParentBlock(),
};

/* **** Plugins **** */

const createDocumentTitlePlaceholder = text =>
  PlaceholderPlugin({
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

const createDocumentPlaceholder = text =>
  CustomBodyPlaceholder({
    placeholder: text,
    when: 'isEmptyAndUnfocusedDocument',
    Component: DocumentPlaceholder,
  });

const coreEditorPlugins = [
  // Inlines
  Link(),

  // Others
  SoftBreak({ shift: true }),
  ImageLoadingIndicator(),
];

const documentPlugins = [
  ...coreEditorPlugins,
  AutoScroll(),
  InlineDiscussionPlugin(),
  createDocumentPlaceholder('Say what you have to say'),
];

const contextPlugins = [...coreEditorPlugins, ContextHighlightPlugin()];

export const plugins = {
  documentTitle: [createDocumentTitlePlaceholder('Untitled Document')],
  document: documentPlugins,
  discussionContext: contextPlugins,
};
