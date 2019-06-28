import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';

import { hotkeys, initialValue, plugins, renderMark } from 'utils/slateHelper';

import EditorActions from './EditorActions';

class RovalEditor extends Component {
  constructor(props) {
    super(props);

    const { initialContent, isPlainText } = props;
    let content;

    if (isPlainText && initialContent) {
      content = Plain.deserialize(initialContent);
    } else {
      const initialJSON = initialContent ? JSON.parse(initialContent) : initialValue;
      content = Value.fromJSON(initialJSON);
    }

    this.state = { content };

    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitOnBlur = this.handleSubmitOnBlur.bind(this);
    this.clearEditorContent = this.clearEditorContent.bind(this);
    this.isContentEmpty = this.isContentEmpty.bind(this);
    this.isEditOrComposeMode = this.isEditOrComposeMode.bind(this);
    this.pluginsForType = this.pluginsForType.bind(this);
    this.resetToInitialContent = this.resetToInitialContent.bind(this);
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

    if (mode === 'edit' && !saved) this.resetToInitialContent();
    onCancel();
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  handleKeyDown(event, editor, next) {
    const { mode } = this.props;

    // UX commands
    if (mode === 'compose' && hotkeys.isSubmitAndKeepOpen(event)) {
      return this.handleSubmit({ keepOpen: true });
    }
    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) return this.handleCancel();

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
    const { content } = this.state;
    const { mode, onSubmit } = this.props;
    if (this.isContentEmpty()) return;

    const text = Plain.serialize(content);
    const payload = JSON.stringify(content.toJSON());

    await onSubmit({ text, payload });

    if (mode === 'compose') this.clearEditorContent();
    if (mode === 'edit' || !keepOpen) this.handleCancel({ saved: true });
    if (keepOpen) this.editor.current.focus();
  }

  handleSubmitOnBlur(event, editor, next) {
    const { saveOnBlur } = this.props;
    next();

    if (saveOnBlur) this.handleSubmit();
  }

  clearEditorContent() {
    this.setState({ content: Value.fromJSON(initialValue) });
  }

  isContentEmpty() {
    const { content } = this.state;
    return !Plain.serialize(content);
  }

  isEditOrComposeMode() {
    const { mode } = this.props;
    return mode === 'compose' || mode === 'edit';
  }

  pluginsForType() {
    const { source } = this.props;
    return plugins[source];
  }

  resetToInitialContent() {
    const { initialContent } = this.props;
    if (!initialContent) return;

    this.setState({ content: Value.fromJSON(JSON.parse(initialContent)) });
  }

  render() {
    const { content } = this.state;
    const { mode, source, ...props } = this.props;

    return (
      <div>
        <Editor
          autoFocus={this.isEditOrComposeMode()}
          onBlur={this.handleSubmitOnBlur}
          onChange={this.handleChangeContent}
          onKeyDown={this.handleKeyDown}
          plugins={this.pluginsForType()}
          readOnly={mode === 'display'}
          ref={this.editor}
          renderMark={renderMark}
          value={content}
          {...props}
        />
        {this.isEditOrComposeMode() && (
          <EditorActions
            isSubmitDisabled={this.isContentEmpty()}
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
  initialContent: PropTypes.string,
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
  initialContent: null,
  isPlainText: false,
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
  saveOnBlur: false,
};

export default RovalEditor;
