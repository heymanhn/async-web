import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import organizationMembersQuery from 'graphql/queries/organizationMembers';
import addParticipantMutation from 'graphql/mutations/addParticipant';
import localAddParticipantMutation from 'graphql/mutations/local/addDocumentParticipant';
import { getLocalAppState } from 'utils/auth';

import MemberResults from './MemberResults';

const Container = styled.div({
  position: 'relative',
});

const SearchInput = styled.input(({ theme: { colors } }) => ({
  // Get the text truly vertically aligned
  // position: 'relative',
  // top: '1px',

  color: colors.grey1,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  width: '100%',

  // Remove all default styles for an input element
  WebkitAppearance: 'none',

  border: `1px solid ${colors.borderGrey}`,
  background: colors.bgGrey,
  outline: 'none',
  padding: '2px 15px',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },
}));

const OrganizationMemberSearch = ({ documentId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { organizationId: id } = getLocalAppState();
  const { loading, data } = useQuery(organizationMembersQuery, { variables: { id } });
  const [addParticipant] = useMutation(addParticipantMutation);
  const [localAddParticipant] = useMutation(localAddParticipantMutation);

  if (loading || !data.organizationMembers) return null;

  let { members } = data.organizationMembers || [];
  members = members.map(m => m.user);

  function handleChange(event) {
    const currentQuery = event.target.value;
    setSearchQuery(currentQuery);
  }

  function memberSearch() {
    if (!searchQuery) return [];

    return members.filter(({ email, fullName }) => {
      const sanitizedQuery = searchQuery.toLowerCase();

      return email.toLowerCase().includes(sanitizedQuery)
        || fullName.toLowerCase().includes(sanitizedQuery);
    });
  }

  function handleAddParticipant(user) {
    const DEFAULT_ACCESS_TYPE = 'collaborator';

    addParticipant({
      variables: {
        id: documentId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddParticipant({
      variables: { id: documentId, user, accessType: DEFAULT_ACCESS_TYPE },
    });

    setSearchQuery('');
  }

  return (
    <Container>
      <SearchInput
        onChange={handleChange}
        placeholder="Enter an email address or name"
        spellCheck="false"
        type="text"
        value={searchQuery}
      />
      <MemberResults
        documentId={documentId}
        handleAddParticipant={handleAddParticipant}
        results={memberSearch()}
      />
    </Container>
  );
};

OrganizationMemberSearch.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default OrganizationMemberSearch;

/*
<SearchInput
  onBlur={this.handleHideAutocomplete}
  onFocus={this.handleShowAutocomplete}
  onKeyDown={this.handleKeyPress}
  size={30}

  value={currentQuery}
/>
{
  isAutocompleteVisible ? (
    <SearchAutocomplete
      query={currentQuery}
      people={people}
      organizations={organizations}
      totalHits={totalHits}
      selectedIndex={selectedAutocompleteIndex}
      firstSection={this.firstSectionToShow()}
      onDismiss={this.handleDismissAutocomplete}
      onEnterAutocomplete={this.handleMouseOverAutocomplete}
      onExitAutocomplete={this.handleMouseOutAutocomplete}
      onHide={this.handleHideAutocomplete}
    />
  ) : null
}
*/
