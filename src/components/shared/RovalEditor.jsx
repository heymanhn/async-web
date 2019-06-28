/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import { hotkeys, defaultValue, plugins, renderBlock, renderMark } from 'utils/slateHelper';

import EditorActions from './EditorActions';

const DEFAULT_NODE = 'paragraph';

// Default styles for Roval editor UIs
const StyledEditor = styled(Editor)({
  'dl, ul, ol': {
    marginTop: '1em',
    marginBottom: '1em',
  },
  li: {
    marginTop: '3px',
  },
});

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

    this.state = { value };

    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitOnBlur = this.handleSubmitOnBlur.bind(this);
    this.clearEditorValue = this.clearEditorValue.bind(this);
    this.hasBlock = this.hasBlock.bind(this);
    this.isValueEmpty = this.isValueEmpty.bind(this);
    this.isEditOrComposeMode = this.isEditOrComposeMode.bind(this);
    this.pluginsForType = this.pluginsForType.bind(this);
    this.resetToInitialValue = this.resetToInitialValue.bind(this);
    this.setBlock = this.setBlock.bind(this);
  }

  componentDidUpdate(prevProps) {
    // The editor is only autofocused when initially mounted
    const { mode } = this.props;
    if (mode === 'edit' && prevProps.mode === 'display') {
      this.editor.current.focus().moveToEndOfDocument();
    }
  }

  handleCancel({ saved = false } = {}) {
    const { mode, onCancel } = this.props;

    if (mode === 'edit' && !saved) this.resetToInitialValue();
    onCancel();
  }

  handleChangeValue({ value }) {
    this.setState({ value });
  }

  handleKeyDown(event, editor, next) {
    const { mode } = this.props;

    // UX commands
    if (mode === 'compose' && hotkeys.isSubmitAndKeepOpen(event)) {
      return this.handleSubmit({ keepOpen: true });
    }
    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) return this.handleCancel();

    // Blocks
    if (hotkeys.isLargeFont(event)) return this.setBlock('heading-one');
    if (hotkeys.isMediumFont(event)) return this.setBlock('heading-two');
    if (hotkeys.isSmallFont(event)) return this.setBlock('heading-three');
    if (hotkeys.isBulletedList(event)) return this.setBlock('bulleted-list');
    if (hotkeys.isNumberedList(event)) return this.setBlock('numbered-list');

    // Marks
    let mark;

    if (hotkeys.isBold(event)) {
      mark = 'bold';
    } else if (hotkeys.isItalic(event)) {
      mark = 'italic';
    } else if (hotkeys.isUnderlined(event)) {
      mark = 'underlined';
    } else if (hotkeys.isCode(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    return editor.toggleMark(mark);
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

  clearEditorValue() {
    this.setState({ value: Value.fromJSON(defaultValue) });
  }

  hasBlock(type) {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
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

  resetToInitialValue() {
    const { initialValue } = this.props;
    if (!initialValue) return;

    this.setState({ value: Value.fromJSON(JSON.parse(initialValue)) });
  }

  /* Borrowed from @ianstormtaylor's slateJS example code:
   * https://github.com/ianstormtaylor/slate/blob/master/examples/rich-text/index.js
   */
  setBlock(type) {
    const editor = this.editor.current;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    const isList = this.hasBlock('list-item');
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);

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
  }

  render() {
    const { value } = this.state;
    const { mode, source, ...props } = this.props;

    return (
      <div>
        <StyledEditor
          autoFocus={this.isEditOrComposeMode()}
          onBlur={this.handleSubmitOnBlur}
          onChange={this.handleChangeValue}
          onKeyDown={this.handleKeyDown}
          plugins={this.pluginsForType()}
          readOnly={mode === 'display'}
          ref={this.editor}
          renderBlock={renderBlock}
          renderMark={renderMark}
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
    'discussionTopicModal',
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
