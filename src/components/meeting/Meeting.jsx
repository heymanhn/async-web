import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import { initialValue, titlePlugins, detailsPlugins } from 'utils/slateHelper';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

import MeetingInfo from './MeetingInfo';
import DiscussionTopic from './DiscussionTopic';

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

const AddDiscussionButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  marginTop: '30px',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '26px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const DiscussionButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '25px',

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

const MeetingTitle = styled(Editor)(({ theme: { colors } }) => ({
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '30px',
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

class Meeting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: true,
      title: '',
      details: '',
      participants: [],
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
        const { title, body, participants } = response.data.meeting;
        const deserializedTitle = Plain.deserialize(title);
        const details = body && body.formatter === 'slatejs'
          ? JSON.parse(body.payload) : initialValue;

        this.setState({
          loading: false,
          title: deserializedTitle,
          details: Value.fromJSON(details),
          participants,
        });
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

    next();

    try {
      const response = await client.mutate({
        mutation: updateMeetingMutation,
        variables: {
          id,
          input: {
            title: plainTextTitle,
            body: {
              formatter: 'slatejs',
              payload: detailsJSON,
            },
          },
        },
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
    const { details, error, loading, title, participants } = this.state;
    if (loading || error) return null;

    return (
      <div>
        <MetadataContainer>
          <MetadataSection>
            <MeetingTitle
              onBlur={this.handleSave}
              onChange={this.handleChangeTitle}
              value={title}
              plugins={titlePlugins}
            />
            <MeetingInfo participants={participants} />
            {/* DRY this up later */}
            <MeetingDetails
              onBlur={this.handleSave}
              onChange={this.handleChangeDetails}
              value={details}
              plugins={detailsPlugins}
            />
          </MetadataSection>
        </MetadataContainer>
        <DiscussionSection>
          <AddDiscussionButton>
            <PlusSign>+</PlusSign>
            <DiscussionButtonText>ADD DISCUSSION TOPIC</DiscussionButtonText>
          </AddDiscussionButton>
          <DiscussionTopic />
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
