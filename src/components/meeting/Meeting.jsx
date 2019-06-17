import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';

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

  handleSave() {
    // TODO: Mutation to update the entire meeting
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
