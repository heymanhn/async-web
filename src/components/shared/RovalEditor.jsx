import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';

import { hotkeys, initialValue, plugins } from 'utils/slateHelper';

import EditorActions from './EditorActions';

class RovalEditor extends Component {
  constructor(props) {
    super(props);

    const { initialContent } = props;
    const initialJSON = initialContent ? JSON.parse(initialContent) : initialValue;

    this.state = { content: Value.fromJSON(initialJSON) };

    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearEditorContent = this.clearEditorContent.bind(this);
    this.isContentEmpty = this.isContentEmpty.bind(this);
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

    if (mode === 'compose' && hotkeys.isSubmitAndKeepOpen(event)) {
      return this.handleSubmit({ keepOpen: true });
    }
    if (hotkeys.isSubmit(event)) return this.handleSubmit();
    if (hotkeys.isCancel(event)) this.handleCancel();

    return next();
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

  clearEditorContent() {
    this.setState({ content: Value.fromJSON(initialValue) });
  }

  isContentEmpty() {
    const { content } = this.state;
    return !Plain.serialize(content);
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
          autoFocus={['compose', 'edit'].includes(mode)}
          onChange={this.handleChangeContent}
          onKeyDown={this.handleKeyDown}
          readOnly={mode === 'display'}
          ref={this.editor}
          plugins={this.pluginsForType()}
          value={content}
          {...props}
        />
        {mode !== 'display' && (
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
  mode: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
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
  mode: null,
  onCancel: () => {},
  onSubmit: () => {},
};

export default RovalEditor;
