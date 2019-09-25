/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import {
  commands,
  defaultValue,
  plugins,
  queries,
  renderBlock,
  schema,
  singleUseBlocks,
} from './slateHelper';
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
  color: colors.contentText,

  'dl, ul, ol, blockquote, pre': {
    marginTop: '1em',
    marginBottom: 0,
  },

  li: {
    marginTop: '3px',
  },

  pre: {
    span: {
      letterSpacing: '-0.2px',
    },
  },

  blockquote: {
    borderLeft: `3px solid ${colors.borderGrey}`,
    color: colors.grey2,
    padding: '0px 12px',
    marginBottom: '10px',
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
      isMouseDown: false,
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
    this.insertImage = this.insertImage.bind(this);
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
    const { anchorBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && previousBlock && previousBlock.type === 'section-break') {
      next();
      return editor.removeNodeByKey(previousBlock.key);
    }

    if (editor.isEmptyParagraph() && editor.isWrappedByCodeOrQuote()) {
      editor.unwrapBlockByKey(anchorBlock.key);
      return previousBlock ? editor.removeNodeByKey(anchorBlock.key) : next();
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

  handleClick(event, editor, next) {
    // Need to wrap in setTimeout because: https://github.com/ianstormtaylor/slate/issues/2434
    setTimeout(() => this.setState({ isMouseDown: false }), 0);

    return next();
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
        .unwrapListBlocks();
    }

    if (singleUseBlocks.includes(anchorBlock.type)) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  handleKeyDown(event, editor, next) {
    const hotkeys = {
      isEnter: isHotkey('Enter'),
      isSubmit: isHotkey('mod+Enter'),
      isCancel: isHotkey('Esc'),
      isBackspace: isHotkey('Backspace'),
    };

    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event) && this.isValueEmpty()) return this.handleCancel();
    if (hotkeys.isEnter(event)) return this.handleEnterActions(next);
    if (hotkeys.isBackspace(event)) return this.handleBackspaceActions(next);

    return next();
  }

  // Hide the toolbar as well so that there's no brief appearance of the toolbar in the new
  // place where the user's mouse is down
  handleMouseDown(event, editor, next) {
    // Need to wrap in setTimeout because: https://github.com/ianstormtaylor/slate/issues/2434
    setTimeout(() => this.setState({ isMouseDown: true, isToolbarVisible: false }), 0);

    return next();
  }

  // This method abstracts the nitty gritty of preparing SlateJS data for persistence.
  // Parent components give us a method to perform the mutation; we give them the data to persist.
  async handleSubmit() {
    const { value } = this.state;
    const { isPlainText, mode, onSubmit } = this.props;
    if (this.isValueEmpty()) return;

    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    await onSubmit({ text, payload });

    const { isSubmitting } = this.props;
    if (isSubmitting) return;
    if (mode === 'compose' && !isPlainText) this.clearEditorValue();
    this.handleCancel({ saved: true });
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

  insertImage(url) {
    const editor = this.editor.current;
    editor.insertImage(url);
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
    const { isMouseDown, isToolbarVisible, value } = this.state;
    const { isPlainText } = this.props;
    const { fragment, selection } = value;

    if (isMouseDown || isPlainText) return;

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
      forceDisableSubmit,
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
          schema={schema}
          value={value}
          {...props}
        />
        {this.isEditOrComposeMode() && !isPlainText && (
          <EditorActions
            isSubmitting={isSubmitting}
            isSubmitDisabled={this.isValueEmpty() || forceDisableSubmit}
            mode={mode}
            onCancel={this.handleCancel}
            onFileUploaded={this.insertImage}
            onSubmit={this.handleSubmit}
          />
        )}
      </Container>
    );
  }
}

RovalEditor.propTypes = {
  contentType: PropTypes.oneOf([
    'discussion', // Equivalent to the first message of the discussion
    'discussionTitle',
    'meetingName',
    'meetingPurpose',
    'message',
  ]).isRequired,
  disableAutoFocus: PropTypes.bool,
  forceDisableSubmit: PropTypes.bool,
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
  forceDisableSubmit: false,
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
