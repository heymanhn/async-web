/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import { DEFAULT_VALUE } from './defaults';
import {
  commands,
  plugins,
  queries,
} from './extensions';

const Container = styled.div(({ initialHeight, mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: (mode === 'compose' && initialHeight) ? `${initialHeight}px` : 'initial',
}));

// Default styles for Roval editor UIs
const StyledEditor = styled(Editor)(({ theme: { colors } }) => ({
  color: colors.contentText,
}));

/*
 * NOTE: Due to https://github.com/ianstormtaylor/slate/issues/2927, SlateJS does not support
 * defining editor functionality using functional components yet. Therefore, cannot rewrite
 * this with support for Hooks.
 */
class RovalEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseDown: false,
      value: null,
    };

    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePressEscape = this.handlePressEscape.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearEditorValue = this.clearEditorValue.bind(this);
    this.loadInitialValue = this.loadInitialValue.bind(this);
    this.loadDefaultValue = this.loadDefaultValue.bind(this);
  }

  componentDidMount() {
    this.loadInitialValue();
  }

  componentDidUpdate(prevProps) {
    // The editor is only autofocused when initially mounted
    const { mode } = this.props;
    if (mode === 'edit' && prevProps.mode === 'display') {
      this.editor.current.focus().moveToEndOfDocument();
    }
  }

  handleCancel({ saved = false } = {}) {
    const { isDraftSaved, mode, onCancel } = this.props;

    if (isDraftSaved) this.loadDefaultValue();
    if ((mode === 'edit') && !saved) this.loadInitialValue();
    onCancel();
  }

  handlePressEscape(editor, next) {
    const { value } = this.state;
    const { selection } = value;

    if (selection.isExpanded) editor.moveToAnchor();
    if (editor.isEmptyDocument()) return this.handleCancel();

    return next();
  }

  handleChangeValue(editor) {
    const { saveOnBlur } = this.props;
    const { value } = editor;
    const { selection } = value;
    const { isFocused } = selection;

    if (!isFocused) {
      const text = Plain.serialize(value);
      if (saveOnBlur && text) this.handleSubmit();
    }

    this.setState({ value });
  }

  handleKeyDown(event, editor, next) {
    const hotkeys = {
      isSubmit: isHotkey('mod+Enter'),
      isCancel: isHotkey('Esc'),
    };

    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) return this.handlePressEscape(editor, next);

    return next();
  }

  // This method abstracts the nitty gritty of preparing SlateJS data for persistence.
  // Parent components give us a method to perform the mutation; we give them the data to persist.
  async handleSubmit() {
    const { contentType } = this.props; // TEMP CODE
    const editor = this.editor.current;
    if (editor.isEmptyDocument()) return;

    const { value } = editor;
    const { isPlainText, mode, onSubmit } = this.props;
    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    const response = await onSubmit({ text, payload });

    if (!isPlainText && response && response.isNewDiscussion) return;
    if (mode === 'compose' && !isPlainText && contentType !== 'document') this.clearEditorValue();
    if (mode !== 'display') this.handleCancel({ saved: true });
  }

  // Need to wrap setState in a setTimeout call due to:
  // https://github.com/ianstormtaylor/slate/issues/2434
  handleMouseDown() {
    setTimeout(() => this.setState({ isMouseDown: true }), 0);
  }

  // Need to wrap setState in a setTimeout call due to:
  // https://github.com/ianstormtaylor/slate/issues/2434
  handleMouseUp() {
    setTimeout(() => this.setState({ isMouseDown: false }), 0);
  }

  clearEditorValue() {
    this.setState({ value: Value.fromJSON(DEFAULT_VALUE) });
  }

  loadDefaultValue() {
    const value = Value.fromJSON(DEFAULT_VALUE);

    this.setState({ value });
  }

  loadInitialValue() {
    const { initialValue, isPlainText } = this.props;
    let value;

    if (isPlainText && initialValue) {
      value = Plain.deserialize(initialValue);
    } else {
      const initialJSON = initialValue ? JSON.parse(initialValue) : DEFAULT_VALUE;
      value = Value.fromJSON(initialJSON);
    }

    this.setState({ value });
  }

  render() {
    const { isMouseDown, value } = this.state;
    const {
      contentType,
      disableAutoFocus,
      initialHeight,
      mode,
      onSubmit,
      ...props
    } = this.props;
    if (!value) return null;
    const isEditOrComposeMode = mode === 'edit' || mode === 'compose';

    return (
      <Container mode={mode} initialHeight={initialHeight}>
        <StyledEditor
          autoFocus={!disableAutoFocus && isEditOrComposeMode}
          commands={commands}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
          isMouseDown={isMouseDown}
          mode={mode}
          onChange={this.handleChangeValue}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          plugins={plugins[contentType]}
          queries={queries}
          readOnly={mode === 'display'}
          ref={this.editor}
          value={value}
          {...props}
        />
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

    // New to Roval v2
    'documentTitle',
    'document',
  ]).isRequired,
  disableAutoFocus: PropTypes.bool,
  forceDisableSubmit: PropTypes.bool,
  initialHeight: PropTypes.number,
  initialValue: PropTypes.string,
  isDraftSaved: PropTypes.bool,
  isPlainText: PropTypes.bool,
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
  isDraftSaved: false,
  isPlainText: false,
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
  saveOnBlur: false,
};

export default RovalEditor;
