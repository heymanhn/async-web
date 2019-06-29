import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

const Inbox = () => (
  <div>Hello</div>
);

Inbox.propTypes = {
  client: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  cid: PropTypes.string,
};

Inbox.defaultProps = { cid: null };

export default withPageTracking(Inbox, 'Inbox'));
