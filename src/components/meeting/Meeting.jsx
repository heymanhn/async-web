import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';
import PlaceholderPlugin from 'slate-react-placeholder';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

// import PageContainer from 'components/shared/PageContainer';
const MetadataContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const MetadataSection = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '60px 20px',
}));

const DiscussionSection = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.bgGrey,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '0px 20px',
}));

const MeetingTitle = styled(Editor)(({ theme: { colors } }) => ({
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '40px',
  width: '100%',
  outline: 'none',
}));

const MeetingDetails = styled(Editor)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,

  div: {
    marginTop: '1em',
  },
}));

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: '',
          },
        ],
      },
    ],
  },
});

class Meeting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: true,
      title: '',
      details: initialValue,
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDetails = this.handleChangeDetails.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    const { client, id } = this.props;
    try {
      const response = await client.query({ query: meetingQuery, variables: { id } });

      if (response.data && response.data.meeting) {
        const { title } = response.data.meeting;
        const deserializedTitle = Plain.deserialize(title);

        this.setState({ loading: false, title: deserializedTitle });
      } else {
        this.setState({ error: true, loading: false });
      }
    } catch (err) {
      this.setState({ error: true, loading: false });
    }
  }

  handleChangeTitle({ value }) {
    this.setState({ title: value });
  }

  handleChangeDetails({ value }) {
    this.setState({ details: value });
  }

  async handleSave(event, editor, next) {
    const { title, details } = this.state;
    const { client, id } = this.props;
    const plainTextTitle = Plain.serialize(title);
    const detailsJSON = JSON.stringify(details.toJSON());

    // TODO: Persist the details once the API changes are done
    next();

    try {
      const response = await client.mutate({
        mutation: updateMeetingMutation,
        variables: { id, input: { title: plainTextTitle } },
      });

      if (response.data && response.data.updateMeeting) {
        client.writeData({ data: { showSavedMessage: true } });
        setTimeout(() => client.writeData({ data: { showSavedMessage: false } }), 2000);
      }
    } catch (err) {
      // No error handling yet
      console.log('error saving meeting');
      next();
    }
  }

  render() {
    const { details, error, loading, title } = this.state;
    if (loading || error) return null;

    return (
      <div>
        <MetadataContainer>
          <MetadataSection>
            <MeetingTitle
              onBlur={this.handleSave}
              onChange={this.handleChangeTitle}
              value={title}
              plugins={[
                {
                  queries: {
                    isEmpty: editor => editor.value.document.text === '',
                  },
                },
                PlaceholderPlugin({
                  placeholder: 'Untitled Meeting',
                  when: 'isEmpty',
                  style: {
                    color: theme.colors.titlePlaceholder,
                    opacity: '1',
                    fontSize: '36px',
                    fontWeight: '600',
                  },
                }),
              ]}
            />
            {/* DRY this up later */}
            <MeetingDetails
              onBlur={this.handleSave}
              onChange={this.handleChangeDetails}
              value={details}
              plugins={[
                {
                  queries: {
                    isEmpty: editor => editor.value.document.text === '',
                  },
                },
                PlaceholderPlugin({
                  placeholder: 'Share details to get everyone up to speed',
                  when: 'isEmpty',
                  style: {
                    color: theme.colors.textPlaceholder,
                    opacity: '1',
                    fontSize: '16px',
                    fontWeight: '400',
                  },
                }),
              ]}
            />
          </MetadataSection>
        </MetadataContainer>
        <DiscussionSection>
          Add Discussion Topic
        </DiscussionSection>
      </div>
    );
  }
}

Meeting.propTypes = {
  client: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default withApollo(withPageTracking(Meeting, 'Meeting'));
