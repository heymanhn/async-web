/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import {
  commands,
  defaultValue,
  hotkeys,
  plugins,
  queries,
  renderBlock,
  renderMark,
  renderInline,
  schema,
  singleUseBlocks,
} from 'utils/slateHelper';

import EditorActions from './EditorActions';
import Toolbar from './toolbar/Toolbar';

const DEFAULT_NODE = 'paragraph';

const Container = styled.div(({ initialHeight, mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: (mode === 'compose' && initialHeight) ? `${initialHeight}px` : 'initial',
}));

// Default styles for Roval editor UIs
const StyledEditor = styled(Editor)(({ theme: { colors } }) => ({
  '*': {
    color: colors.contentText,
  },

  'dl, ul, ol, blockquote, pre': {
    marginTop: '1em',
    marginBottom: 0,
  },

  li: {
    marginTop: '3px',
  },

  blockquote: {
    borderLeft: `5px solid ${colors.borderGrey}`,
    color: colors.grey2,
    padding: '7px 12px',
  },

  hr: {
    borderRadius: '20px',
    borderTop: `2px solid ${colors.borderGrey}`,
    margin: '2em auto',
    width: '120px',
  },
}));

class RovalEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
      isToolbarVisible: false,
      value: null,
    };

    this.editor = React.createRef();
    this.toolbar = React.createRef();
    this.handleBackspaceActions = this.handleBackspaceActions.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleEnterActions = this.handleEnterActions.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitOnBlur = this.handleSubmitOnBlur.bind(this);
    this.calculateToolbarPosition = this.calculateToolbarPosition.bind(this);
    this.clearEditorValue = this.clearEditorValue.bind(this);
    this.isValueEmpty = this.isValueEmpty.bind(this);
    this.isEditOrComposeMode = this.isEditOrComposeMode.bind(this);
    this.loadInitialValue = this.loadInitialValue.bind(this);
    this.pluginsForType = this.pluginsForType.bind(this);
    this.renderEditor = this.renderEditor.bind(this);
    this.updateToolbar = this.updateToolbar.bind(this);
  }

  componentDidMount() {
    this.loadInitialValue();
  }

  async componentDidUpdate(prevProps) {
    // The editor is only autofocused when initially mounted
    const { initialValue, mode } = this.props;
    if (mode === 'edit' && prevProps.mode === 'display') {
      this.editor.current.focus().moveToEndOfDocument();
    }

    // Only set the content of the editor if it's changed (eg. loading a new meeting)
    if (initialValue !== prevProps.initialValue) {
      this.loadInitialValue();
    } else {
      this.updateToolbar();
    }
  }

  handleBackspaceActions(next) {
    const editor = this.editor.current;
    const { value } = editor;
    const { previousBlock } = value;

    if (editor.isEmptyParagraph() && previousBlock && previousBlock.type === 'section-break') {
      next();
      return editor.removeNodeByKey(previousBlock.key);
    }

    // TODO: handle backspace behavior for deleting a bulleted list

    return next();
  }

  handleCancel({ saved = false } = {}) {
    const { mode, onCancel } = this.props;

    if (mode === 'edit' && !saved) this.loadInitialValue();
    onCancel();
  }

  handleChangeValue({ value }) {
    this.setState({ value });
  }

  handleClick() {
    this.setState({ isClicked: true });
  }

  /*
   * Special cases:
   * 1. Pressing Enter while on a blank list item removes the blank list item and creates a
   *    new default node block
   */
  handleEnterActions(next) {
    const editor = this.editor.current;
    const { value } = editor;
    const { anchorBlock } = value;

    if (anchorBlock.type === 'list-item' && !anchorBlock.text) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list');
    }

    if (singleUseBlocks.includes(anchorBlock.type)) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    // Similar "double Enter" behavior to code blocks below
    if (editor.isWrappedBy('block-quote') && !anchorBlock.text) {
      return editor.setBlocks(DEFAULT_NODE).unwrapBlock('block-quote');
    }

    if (anchorBlock.type === 'code-block') {
      // Pressing enter on a blank line in a code block will reset to a paragraph
      if (anchorBlock.text.endsWith('\n')) {
        editor.deleteBackward(1); // Remove the first newline as well
        next();
        return editor.setBlocks(DEFAULT_NODE);
      }

      return editor.insertText('\n');
    }

    if (editor.hasActiveMark('code-snippet')) {
      next();
      return editor.removeMark('code-snippet');
    }

    return next();
  }

  handleKeyDown(event, editor, next) {
    const { mode } = this.props;

    // UX commands
    if (mode === 'compose' && hotkeys.isSubmitAndKeepOpen(event)) {
      return this.handleSubmit({ keepOpen: true });
    }
    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) return this.handleCancel();
    if (hotkeys.isEnter(event)) return this.handleEnterActions(next);
    if (hotkeys.isBackspace(event)) return this.handleBackspaceActions(next);

    // Blocks
    if (hotkeys.isLargeFont(event)) return editor.setBlock('heading-one');
    if (hotkeys.isMediumFont(event)) return editor.setBlock('heading-two');
    if (hotkeys.isSmallFont(event)) return editor.setBlock('heading-three');
    if (hotkeys.isBulletedList(event)) return editor.setBlock('bulleted-list');
    if (hotkeys.isNumberedList(event)) return editor.setBlock('numbered-list');
    if (hotkeys.isCodeBlock(event)) return editor.setBlock('code-block');

    // Marks
    let mark;

    if (hotkeys.isBold(event)) {
      mark = 'bold';
    } else if (hotkeys.isItalic(event)) {
      mark = 'italic';
    } else if (hotkeys.isUnderlined(event)) {
      mark = 'underlined';
    } else if (hotkeys.isCodeSnippet(event)) {
      mark = 'code-snippet';
    } else {
      return next();
    }

    event.preventDefault();
    return editor.toggleMark(mark);
  }

  handleMouseDown() {
    this.setState({ isClicked: false, isToolbarVisible: false });
  }

  // This method abstracts the nitty gritty of preparing SlateJS data for persistence.
  // Parent components give us a method to perform the mutation; we give them the data to persist.
  async handleSubmit({ keepOpen = false } = {}) {
    const { value } = this.state;
    const { isPlainText, mode, onSubmit } = this.props;
    if (this.isValueEmpty()) return;

    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    await onSubmit({ text, payload });

    if (mode === 'compose' && !isPlainText) this.clearEditorValue();
    if (mode === 'edit' || !keepOpen) this.handleCancel({ saved: true });
    if (keepOpen) this.editor.current.focus();
  }

  handleSubmitOnBlur(event, editor, next) {
    const { saveOnBlur } = this.props;
    next();

    if (saveOnBlur) this.handleSubmit();
  }

  // Figure out where the toolbar should be displayed based on the user's text selection
  calculateToolbarPosition() {
    const { isToolbarVisible } = this.state;
    if (!isToolbarVisible) return {};

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const toolbar = this.toolbar.current;

    return {
      top: `${rect.top + window.pageYOffset - toolbar.offsetHeight}px`,
      left: `${rect.left + window.pageXOffset - toolbar.offsetWidth / 2 + rect.width / 2}px`,
    };
  }

  clearEditorValue() {
    this.setState({ value: Value.fromJSON(defaultValue) });
  }

  isValueEmpty() {
    const { value } = this.state;
    return !Plain.serialize(value);
  }

  isEditOrComposeMode() {
    const { mode } = this.props;
    return mode === 'compose' || mode === 'edit';
  }

  loadInitialValue() {
    const { initialValue, isPlainText } = this.props;
    let value;

    if (isPlainText && initialValue) {
      value = Plain.deserialize(initialValue);
    } else {
      const initialJSON = initialValue ? JSON.parse(initialValue) : defaultValue;
      value = Value.fromJSON(initialJSON);
    }

    this.setState({ value }, this.updateToolbar);
  }

  pluginsForType() {
    const { contentType } = this.props;
    return plugins[contentType];
  }

  renderEditor(props, editor, next) {
    const { isToolbarVisible } = this.state;
    const children = next();
    return (
      <React.Fragment>
        {children}
        <Toolbar
          ref={this.toolbar}
          coords={this.calculateToolbarPosition()}
          editor={editor}
          isOpen={isToolbarVisible}
        />
      </React.Fragment>
    );
  }

  updateToolbar() {
    const { isClicked, isToolbarVisible, value } = this.state;
    const { isPlainText } = this.props;
    const { fragment, selection } = value;

    if (!isClicked || isPlainText) return;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      if (isToolbarVisible) this.setState({ isToolbarVisible: false });
      return;
    }

    if (!isToolbarVisible) this.setState({ isToolbarVisible: true });
  }

  render() {
    const { value } = this.state;
    const {
      contentType,
      disableAutoFocus,
      hideCancelButton,
      initialHeight,
      isPlainText,
      isSubmitting,
      mode,
      ...props
    } = this.props;
    if (!value) return null;

    return (
      <Container mode={mode} initialHeight={initialHeight}>
        <StyledEditor
          autoFocus={!disableAutoFocus && this.isEditOrComposeMode()}
          commands={commands}
          onBlur={this.handleSubmitOnBlur}
          onChange={this.handleChangeValue}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          plugins={this.pluginsForType()}
          queries={queries}
          readOnly={mode === 'display'}
          ref={this.editor}
          renderBlock={renderBlock}
          renderEditor={this.renderEditor}
          renderInline={renderInline}
          renderMark={renderMark}
          schema={schema}
          value={value}
          {...props}
        />
        {this.isEditOrComposeMode() && !isPlainText && (
          <EditorActions
            contentType={contentType}
            hideCancelButton={hideCancelButton}
            isSubmitting={isSubmitting}
            isSubmitDisabled={this.isValueEmpty()}
            mode={mode}
            onCancel={this.handleCancel}
            onSubmit={this.handleSubmit}
          />
        )}
      </Container>
    );
  }
}

RovalEditor.propTypes = {
  contentType: PropTypes.oneOf([
    'discussion',
    'discussionTitle',
    'meetingName',
    'meetingPurpose',
    'largeReply',
    'smallReply',
  ]).isRequired,
  disableAutoFocus: PropTypes.bool,
  hideCancelButton: PropTypes.bool,
  initialHeight: PropTypes.number,
  initialValue: PropTypes.string,
  isPlainText: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  mode: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  saveOnBlur: PropTypes.bool,
};

RovalEditor.defaultProps = {
  disableAutoFocus: false,
  hideCancelButton: false,
  initialHeight: null,
  initialValue: null,
  isPlainText: false,
  isSubmitting: false,
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
  saveOnBlur: false,
};

export default RovalEditor;
