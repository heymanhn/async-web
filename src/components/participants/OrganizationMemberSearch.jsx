/* eslint no-mixed-operators: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import organizationMembersQuery from 'graphql/queries/organizationMembers';
import documentParticipantsQuery from 'graphql/queries/documentParticipants';
import addParticipantMutation from 'graphql/mutations/addParticipant';
import localAddParticipantMutation from 'graphql/mutations/local/addDocumentParticipant';
import { getLocalAppState } from 'utils/auth';

import MemberResults from './MemberResults';

const Container = styled.div({
  position: 'relative',
  marginBottom: '20px',
});

const SearchInput = styled.input(({ theme: { colors } }) => ({
  // Remove all default styles for an input element
  WebkitAppearance: 'none',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '14px',
  fontWeight: 400,
  outline: 'none',
  padding: '7px 15px',
  letterSpacing: '-0.006em',
  width: '100%',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },

  ':focus': {
    border: `1px solid ${colors.grey4}`,
  },
}));

const OrganizationMemberSearch = ({
  documentId,
  isDropdownVisible,
  handleShowDropdown,
  handleHideDropdown,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { organizationId: id } = getLocalAppState();
  const { loading: l1, data: data1 } = useQuery(organizationMembersQuery, {
    variables: { id },
  });
  const { loading: l2, data: data2 } = useQuery(documentParticipantsQuery, {
    variables: { id: documentId },
  });

  const [addParticipant] = useMutation(addParticipantMutation);
  const [localAddParticipant] = useMutation(localAddParticipantMutation);

  if (l1 || l2 || !data1.organizationMembers || !data2.documentParticipants) {
    return null;
  }

  let { members } = data1.organizationMembers || [];
  members = members.map(m => m.user);

  const { documentParticipants } = data2;
  let { participants } = documentParticipants;
  participants = (participants || []).map(p => p.user);

  function memberSearch() {
    if (!searchQuery) return [];

    return members.filter(({ email, fullName }) => {
      const sanitizedQuery = searchQuery.toLowerCase();

      return (
        email.toLowerCase().includes(sanitizedQuery) ||
        fullName.toLowerCase().includes(sanitizedQuery)
      );
    });
  }

  function handleChange(event) {
    const currentQuery = event.target.value;
    setSearchQuery(currentQuery);
    setSelectedIndex(0);
    handleShowDropdown();
  }

  // Neat trick to support modular arithmetic for negative numbers
  // https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
  function mod(x, n) {
    return ((x % n) + n) % n;
  }

  function handleAddParticipant(user) {
    if (participants.find(({ id: pid }) => pid === user.id)) return;

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
    setSelectedIndex(0);
  }

  const results = memberSearch();

  function handleKeyPress(event) {
    if (!results.length) return null;

    if (isHotkey('ArrowDown', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex + 1, results.length));
    }
    if (isHotkey('ArrowUp', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex - 1, results.length));
    }

    if (isHotkey('Enter', event)) {
      event.preventDefault();

      return handleAddParticipant(results[selectedIndex]);
    }

    if (isHotkey('Escape', event)) return handleHideDropdown();

    return null;
  }

  function updateSelectedIndex(index) {
    if (index !== selectedIndex) setSelectedIndex(index);
  }

  return (
    <Container>
      <SearchInput
        onChange={handleChange}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyPress}
        placeholder="Enter an email address or name"
        spellCheck="false"
        type="text"
        value={searchQuery}
      />
      {isDropdownVisible ? (
        <MemberResults
          documentId={documentId}
          handleAddParticipant={handleAddParticipant}
          participants={participants}
          results={results}
          selectedIndex={selectedIndex}
          updateSelectedIndex={updateSelectedIndex}
        />
      ) : (
        undefined
      )}
    </Container>
  );
};

OrganizationMemberSearch.propTypes = {
  documentId: PropTypes.string.isRequired,
  isDropdownVisible: PropTypes.bool.isRequired,
  handleShowDropdown: PropTypes.func.isRequired,
  handleHideDropdown: PropTypes.func.isRequired,
};

export default OrganizationMemberSearch;
