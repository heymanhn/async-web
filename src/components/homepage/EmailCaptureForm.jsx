import React, { Component } from 'react';
import Airtable from 'airtable';
import styled from '@emotion/styled';

import Button from 'components/shared/Button';

const AIRTABLE_API_KEY = 'key3qqel4AvZJG4P7';
const AIRTABLE_BASE_KEY = 'appKgutXo3juylRwd';

const Container = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignItems: 'center',

  [mq('tabletUp')]: {
    flexDirection: 'row',
  },
}));

const FormField = styled.input(({ theme: { colors, mq } }) => ({
  background: colors.white,
  border: `1px solid ${colors.formBorderGrey}`,
  borderRadius: '3px',
  color: colors.mainText,
  marginBottom: '20px',
  padding: '8px 15px',
  textAlign: 'left',
  fontSize: '16px',
  width: '100%',
  outline: 'none',

  '::placeholder': {
    color: colors.formPlaceholderGrey,
    fontSize: '16px',
    opacity: 1, // Firefox
  },

  [mq('tabletUp')]: {
    maxWidth: '270px',

    marginRight: '20px',
    marginBottom: '10px',
  },
}));

const StyledButton = styled(Button)({
  marginBottom: '10px',
});

export default class EmailCaptureForm extends Component {
  constructor(data) {
    super(data);

    this.state = { email: '' };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  // Send email address to Airtable
  // TODO(HN): Custom success/error message UI
  handleSubmit() {
    const { email } = this.state;
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_KEY);

    // Scrappy way of email validation
    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      alert('Invalid email');
      return;
    }

    base('Leads').create({
      Email: email,
      Source: 'Company Website - top email form',
    }, (err) => {
      if (err) {
        alert('Sorry, an error occurred');
        return;
      }

      alert(`${email} added to the waitlist. Stay tuned!`);
      this.setState({ email: '' });
    });
  }

  render() {
    const { email } = this.state;

    return (
      <Container>
        <FormField
          onChange={this.handleChangeEmail}
          onKeyPress={this.handleKeyPress}
          placeholder="Enter your email"
          type="email"
          value={email}
        />
        <StyledButton onClick={this.handleSubmit} title="Request Access" />
      </Container>
    );
  }
}
