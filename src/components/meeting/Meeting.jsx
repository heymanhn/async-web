import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

import PageContainer from 'components/shared/PageContainer';

const MeetingTitle = styled.input(({ theme: { colors } }) => ({
  background: 'none',
  border: 'none',
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '40px',
  width: '100%',
  outline: 'none',

  '::placeholder': {
    color: colors.titlePlaceholder,
  },
}));

// const MeetingDetails = styled.div(({ theme: { colors } }) => ({
//   fontSize: '16px',
//   lineHeight: '25px',
//   fontWeight: 400,
//   color: colors.textPlaceholder,
// }));

class Meeting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: true,
      title: '',
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    const { client, id } = this.props;
    try {
      const response = await client.query({ query: meetingQuery, variables: { id } });

      if (response.data && response.data.meeting) {
        const { title } = response.data.meeting;

        this.setState({ loading: false, title });
      } else {
        this.setState({ error: true, loading: false });
      }
    } catch (err) {
      this.setState({ error: true, loading: false });
    }
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  async handleSave() {
    const { title } = this.state;
    const { client, id } = this.props;

    try {
      const response = await client.mutate({
        mutation: updateMeetingMutation,
        variables: { id, input: { title } },
      });

      if (response.data && response.data.updateMeeting) {
        client.writeData({ data: { showSavedMessage: true } });
        setTimeout(() => client.writeData({ data: { showSavedMessage: false } }), 2000);
      }
    } catch (err) {
      // No error handling yet
      console.log('error saving meeting');
    }
  }

  render() {
    const { error, loading, title } = this.state;
    if (loading || error) return null;

    return (
      <PageContainer isDocument>
        <MeetingTitle
          onBlur={this.handleSave}
          onChange={this.handleChangeTitle}
          placeholder="Untitled Meeting"
          type="textarea"
          value={title}
        />
      </PageContainer>
    );
  }
}

Meeting.propTypes = {
  client: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default withApollo(withPageTracking(Meeting, 'Meeting'));
