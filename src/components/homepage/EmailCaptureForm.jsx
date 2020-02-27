/* eslint no-alert: 0 */
import React, { useState } from 'react';
import isHotkey from 'is-hotkey';
import Airtable from 'airtable';
import styled from '@emotion/styled';

import Button from 'components/shared/Button';

const { REACT_APP_AIRTABLE_API_KEY, REACT_APP_AIRTABLE_BASE_KEY } = process.env;

const Container = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  [mq('tabletUp')]: {
    flexDirection: 'row',
  },
}));

const StyledInput = styled.input(({ theme: { colors, mq } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.formBorderGrey}`,
  borderRadius: '5px',
  color: colors.mainText,
  marginBottom: '15px',
  padding: '12px 20px 13px',
  fontSize: '14px',
  letterSpacing: '-0.006em',
  width: '100%',
  outline: 'none',

  '::placeholder': {
    color: colors.grey4,
    fontSize: '14px',
    letterSpacing: '-0.006em',
    opacity: 1, // Firefox
  },

  [mq('tabletUp')]: {
    width: '300px',

    marginRight: '15px',
    marginBottom: 0,
  },
}));

const StyledButton = styled(Button)(({ theme: { mq, colors } }) => ({
  background: colors.grey1,
  color: colors.white,
  fontWeight: 500,
  paddingTop: '12px',
  paddingBottom: '13px',
  textAlign: 'center',
  width: '100%',

  [mq('tabletUp')]: {
    paddingLeft: '20px',
    paddingRight: '20px',
    width: 'auto',
  },
}));

const EmailCaptureForm = props => {
  const [email, setEmail] = useState('');
  const handleChangeEmail = event => setEmail(event.target.value);

  // Send email address to Airtable
  // TODO(HN): Custom success/error message UI
  const handleSubmit = () => {
    const base = new Airtable({ apiKey: REACT_APP_AIRTABLE_API_KEY }).base(
      REACT_APP_AIRTABLE_BASE_KEY
    );

    // Scrappy way of email validation
    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      alert('Invalid email');
      return;
    }

    base('Leads').create(
      {
        Email: email,
        Source: 'Roval Website - email form',
      },
      err => {
        if (err) {
          alert('Sorry, an error occurred');
          return;
        }

        alert(`${email} added to the early access list. Stay tuned!`);
        setEmail('');
      }
    );
  };

  const handleKeyDown = event => {
    if (isHotkey('Enter', event)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Container {...props}>
      <StyledInput
        onChange={handleChangeEmail}
        onKeyDown={handleKeyDown}
        placeholder="Enter your work email"
        type="email"
        value={email}
      />
      <StyledButton onClick={handleSubmit} title="Request early access" />
    </Container>
  );
};

export default EmailCaptureForm;
