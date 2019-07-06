import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import {
  setLocalUser,
  clearLocalUser,
} from 'utils/auth';
import { parseQueryString } from 'utils/queryParams';
import fakeAuthQuery from 'graphql/fakeAuthQuery'; // Temporary, for the prototype
import isLoggedInQuery from 'graphql/isLoggedInQuery';

import LoadingIndicator from 'components/shared/LoadingIndicator';

const Container = styled.div(({ theme: { containerMargin, maxViewport } }) => ({
  margin: containerMargin,
  maxWidth: maxViewport,
}));

class Auth extends Component {
  constructor(props) {
    super(props);

    const { location: { search } } = this.props;
    this.state = {
      params: parseQueryString(search),
      error: false,
      loading: true,
    };
  }

  async componentDidMount() {
    const { client } = this.props;
    const { isLoggedIn } = client.readQuery({ query: isLoggedInQuery });

    const { params } = this.state;
    if (!params || !params.email || isLoggedIn) {
      this.setState({ loading: false });
      return;
    }

    const { email } = params;
    if (email) {
      try {
        const response = await client.query({
          query: fakeAuthQuery, variables: { email },
        });

        if (response.data && response.data.user) {
          const { id: userId, token: userToken } = response.data.user;
          setLocalUser({ userId, userToken });
          client.writeData({ data: { isLoggedIn: true } });

          const { user: { id, fullName: name } } = response.data;
          window.analytics.identify(id, { name, email });
          this.setState({ loading: false });
        }
      } catch (err) {
        client.resetStore();
        clearLocalUser();
        this.setState({ error: true, loading: false });
      }
    }
  }

  render() {
    const { error, loading, params } = this.state;
    if (loading) return <Container><LoadingIndicator color="grey5" /></Container>;
    if (error || !params || !params.email) return <Container>Cannot log in</Container>;

    return <Container>Logged in successfully</Container>;
  }
}

Auth.propTypes = {
  client: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withApollo(Auth);
