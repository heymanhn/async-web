import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import createConversationMutation from 'graphql/createConversationMutation';
import meetingQuery from 'graphql/meetingQuery';

import RovalEditor from 'components/editor/RovalEditor';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  color: colors.mainText,
  fontSize: '20px',
  fontWeight: 500,
  padding: '20px 30px',
  width: '100%',
  outline: 'none',
}));

const DiscussionEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  minHeight: '250px',
  padding: '20px 30px',

  // HN: opportunity to DRY these up later once we find a pattern of typography
  // across different editor use cases
  'div:not(:first-of-type)': {
    marginTop: '1em',
  },

  h1: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '1.4em',
  },

  h2: {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '1.3em',
  },

  h3: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '1.2em',
  },
});


class DiscussionComposer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      title: null,
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleSaveTitle = this.handleSaveTitle.bind(this);
  }

  async handleCreate({ payload, text }) {
    this.setState({ isSubmitting: true });
    const { title } = this.state;
    const { client, meetingId: id, afterSubmit } = this.props;

    const response = await client.mutate({
      mutation: createConversationMutation,
      variables: {
        id,
        input: {
          title,
          messages: [{
            body: {
              formatter: 'slatejs',
              text,
              payload,
            },
          }],
        },
      },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id },
      }],
      awaitRefetchQueries: true,
    });

    if (response.data) {
      afterSubmit(response.data.createConversation.id);
      this.setState({ isSubmitting: false });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to create discussion topic'));
  }

  async handleSaveTitle({ text }) {
    const { title } = this.state;

    // HACK due to https://github.com/ianstormtaylor/slate/issues/2434
    if (title !== text) setTimeout(() => this.setState({ title: text }), 0);

    return Promise.resolve();
  }

  render() {
    const { isSubmitting } = this.state;

    const {
      onCancelCompose,
      meetingId,
      ...props
    } = this.props;

    return (
      <Container {...props}>
        <TitleEditor
          contentType="discussionTitle"
          isPlainText
          mode="compose"
          onSubmit={this.handleSaveTitle}
          saveOnBlur
        />
        <DiscussionEditor
          disableAutoFocus
          isSubmitting={isSubmitting}
          mode="compose"
          onCancel={onCancelCompose}
          onSubmit={this.handleCreate}
          contentType="discussion"
        />
      </Container>
    );
  }
}

DiscussionComposer.propTypes = {
  afterSubmit: PropTypes.func,
  client: PropTypes.object.isRequired,
  meetingId: PropTypes.string.isRequired,
  onCancelCompose: PropTypes.func,
};

DiscussionComposer.defaultProps = {
  afterSubmit: () => {},
  onCancelCompose: () => {},
};

export default withApollo(DiscussionComposer);
