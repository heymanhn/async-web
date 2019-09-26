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
import EditorActions from './EditorActions';

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

class RovalEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseDown: false,
      value: null,
    };

    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitOnBlur = this.handleSubmitOnBlur.bind(this);
    this.clearEditorValue = this.clearEditorValue.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.isValueEmpty = this.isValueEmpty.bind(this);
    this.isEditOrComposeMode = this.isEditOrComposeMode.bind(this);
    this.loadInitialValue = this.loadInitialValue.bind(this);
  }

  componentDidMount() {
    this.loadInitialValue();
  }

  // TODO: Do i still need this?
  async componentDidUpdate(prevProps) {
    // The editor is only autofocused when initially mounted
    const { initialValue, mode } = this.props;
    if (mode === 'edit' && prevProps.mode === 'display') {
      this.editor.current.focus().moveToEndOfDocument();
    }

    // Only set the content of the editor if it's changed (eg. loading a new meeting)
    if (initialValue !== prevProps.initialValue) {
      this.loadInitialValue();
    }// else {
    //   this.updateToolbar();
    // }
  }

  handleCancel({ saved = false } = {}) {
    const { mode, onCancel } = this.props;

    if (mode === 'edit' && !saved) this.loadInitialValue();
    onCancel();
  }

  handleChangeValue({ value }) {
    this.setState({ value });
  }

  handleKeyDown(event, editor, next) {
    const hotkeys = {
      isSubmit: isHotkey('mod+Enter'),
      isCancel: isHotkey('Esc'),
    };

    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event) && this.isValueEmpty()) return this.handleCancel();

    return next();
  }

  handleMouseDown() {
    this.setState({ isMouseDown: true });
  }

  handleMouseUp() {
    this.setState({ isMouseDown: false });
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

  clearEditorValue() {
    this.setState({ value: Value.fromJSON(DEFAULT_VALUE) });
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

  // TODO: What to do with the toolbar component?
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
    // this.setState({ value }, this.updateToolbar);
  }

  render() {
    const { isMouseDown, value } = this.state;
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
          isMouseDown={isMouseDown}
          onBlur={this.handleSubmitOnBlur}
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
