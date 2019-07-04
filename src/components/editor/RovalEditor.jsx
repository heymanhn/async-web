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

// Default styles for Roval editor UIs
const StyledEditor = styled(Editor)(({ theme: { colors } }) => ({
  'dl, ul, ol, blockquote, pre': {
    marginTop: '1em',
    marginBottom: '1em',
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

    const { initialValue, isPlainText } = props;
    let value;

    if (isPlainText && initialValue) {
      value = Plain.deserialize(initialValue);
    } else {
      const initialJSON = initialValue ? JSON.parse(initialValue) : defaultValue;
      value = Value.fromJSON(initialJSON);
    }

    this.state = {
      isClicked: false,
      isToolbarVisible: false,
      value,
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
    this.pluginsForType = this.pluginsForType.bind(this);
    this.renderEditor = this.renderEditor.bind(this);
    this.resetToInitialValue = this.resetToInitialValue.bind(this);
    this.updateToolbar = this.updateToolbar.bind(this);
  }

  componentDidMount() {
    this.updateToolbar();
  }

  componentDidUpdate(prevProps) {
    // The editor is only autofocused when initially mounted
    const { mode } = this.props;
    if (mode === 'edit' && prevProps.mode === 'display') {
      this.editor.current.focus().moveToEndOfDocument();
    }
    this.updateToolbar();
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

    if (mode === 'edit' && !saved) this.resetToInitialValue();
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
    const { selection } = value;
    const { anchorBlock } = value;

    if (anchorBlock.type === 'list-item' && !anchorBlock.text) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list');
    }

    if (singleUseBlocks.includes(anchorBlock.type)) {
      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    if (anchorBlock.type === 'code-block') {
      // Pressing enter on a blank line for a code block will reset to a paragraph
      if (anchorBlock.text.endsWith('\n')) {
        editor.deleteBackward(2); // Remove the first newline as well
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
    const { mode, onSubmit } = this.props;
    if (this.isValueEmpty()) return;

    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    await onSubmit({ text, payload });

    if (mode === 'compose') this.clearEditorValue();
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

  pluginsForType() {
    const { source } = this.props;
    return plugins[source];
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

  resetToInitialValue() {
    const { initialValue } = this.props;
    if (!initialValue) return;

    this.setState({ value: Value.fromJSON(JSON.parse(initialValue)) });
  }

  updateToolbar() {
    const { isClicked, isToolbarVisible, value } = this.state;
    const { fragment, selection } = value;

    if (!isClicked) return;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      if (isToolbarVisible) this.setState({ isToolbarVisible: false });
      return;
    }

    if (!isToolbarVisible) this.setState({ isToolbarVisible: true });
  }

  render() {
    const { value } = this.state;
    const { mode, source, ...props } = this.props;

    return (
      <div>
        <StyledEditor
          autoFocus={this.isEditOrComposeMode()}
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
        {this.isEditOrComposeMode() && (
          <EditorActions
            isSubmitDisabled={this.isValueEmpty()}
            mode={mode}
            onCancel={this.handleCancel}
            onSubmit={this.handleSubmit}
            size={source === 'discussionTopic' ? 'large' : 'small'}
          />
        )}
      </div>
    );
  }
}

RovalEditor.propTypes = {
  initialValue: PropTypes.string,
  isPlainText: PropTypes.bool,
  mode: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  saveOnBlur: PropTypes.bool,
  source: PropTypes.oneOf([
    'meetingTitle',
    'meetingDetails',
    'discussionTopic',
    'discussionTopicReply',
  ]).isRequired,
};

RovalEditor.defaultProps = {
  initialValue: null,
  isPlainText: false,
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
  saveOnBlur: false,
};

export default RovalEditor;
