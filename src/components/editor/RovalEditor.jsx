/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
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

class RovalEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseDown: false,
      value: null,
    };

    this.editor = React.createRef();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.clearEditorValue = this.clearEditorValue.bind(this);
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
    }
  }

  handleBlur(event, editor, next) {
    const { value } = this.state;
    const { onSubmitOnBlur, saveOnBlur } = this.props;
    next();

    const isValueEmpty = !Plain.serialize(value);
    if (!saveOnBlur || isValueEmpty) return null;

    const text = Plain.serialize(value);
    return onSubmitOnBlur({ text });
  }

  handleChangeValue({ value }) {
    this.setState({ value });
  }

  handleMouseDown() {
    this.setState({ isMouseDown: true });
  }

  handleMouseUp() {
    this.setState({ isMouseDown: false });
  }

  clearEditorValue() {
    this.setState({ value: Value.fromJSON(DEFAULT_VALUE) });
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
          clearEditorValue={this.clearEditorValue}
          commands={commands}
          isMouseDown={isMouseDown}
          loadInitialValue={this.loadInitialValue}
          mode={mode}
          onBlur={this.handleBlur}
          onChange={this.handleChangeValue}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onSubmit={onSubmit}
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
  ]).isRequired,
  disableAutoFocus: PropTypes.bool,
  forceDisableSubmit: PropTypes.bool,
  initialHeight: PropTypes.number,
  initialValue: PropTypes.string,
  isPlainText: PropTypes.bool,
  mode: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitOnBlur: PropTypes.func,
  saveOnBlur: PropTypes.bool,
};

RovalEditor.defaultProps = {
  disableAutoFocus: false,
  forceDisableSubmit: false,
  initialHeight: null,
  initialValue: null,
  isPlainText: false,
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
  onSubmitOnBlur: () => {},
  saveOnBlur: false,
};

export default RovalEditor;
