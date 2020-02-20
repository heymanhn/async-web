/* eslint no-mixed-operators: 0 */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import objectMembersQuery from 'graphql/queries/objectMembers';
import addMemberMutation from 'graphql/mutations/addMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import { getLocalAppState } from 'utils/auth';
import { mod } from 'utils/helpers';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

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
  isDropdownVisible,
  handleShowDropdown,
  handleHideDropdown,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const DEFAULT_ACCESS_TYPE = 'collaborator';

  const { organizationId: id } = getLocalAppState();
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const objectType = documentId ? 'documents' : 'discussions';
  const objectId = documentId || discussionId;

  const { loading: l1, data: orgMembership } = useQuery(objectMembersQuery, {
    variables: { objectType: 'organizations', id },
  });

  const { loading: l2, data: objectMembership } = useQuery(objectMembersQuery, {
    variables: { objectType, id: objectId },
  });

  const [addMember] = useMutation(addMemberMutation);
  const [localAddMember] = useMutation(localAddMemberMutation);

  if (l1 || l2 || !orgMembership.objectMembers) {
    return null;
  }

  let { members } = orgMembership.objectMembers || [];
  members = members.map(m => m.user);

  const { resourceMembers } = objectMembership.objectMembers;
  const participants = (resourceMembers || []).map(p => p.user);

  const memberSearch = () => {
    if (!searchQuery) return [];

    return members.filter(({ email, fullName }) => {
      const sanitizedQuery = searchQuery.toLowerCase();

      return (
        email.toLowerCase().includes(sanitizedQuery) ||
        fullName.toLowerCase().includes(sanitizedQuery)
      );
    });
  };

  const handleChange = event => {
    const currentQuery = event.target.value;
    setSearchQuery(currentQuery);
    setSelectedIndex(0);
    handleShowDropdown();
  };

  const handleAddMember = user => {
    if (participants.find(({ id: pid }) => pid === user.id)) return;

    addMember({
      variables: {
        objectType,
        id: objectId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddMember({
      variables: {
        objectType,
        id: objectId,
        user,
        accessType: DEFAULT_ACCESS_TYPE,
      },
    });

    setSearchQuery('');
    setSelectedIndex(0);
  };

  const results = memberSearch();

  const handleKeyDown = event => {
    if (!results.length) return null;

    if (isHotkey('ArrowDown', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex + 1, results.length));
    }
    if (isHotkey('ArrowUp', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex - 1, results.length));
    }

    if (isHotkey('Enter', event)) {
      event.preventDefault();

      return handleAddMember(results[selectedIndex]);
    }

    if (isHotkey('Escape', event)) return handleHideDropdown();

    return null;
  };

  const updateSelectedIndex = index =>
    index !== selectedIndex && setSelectedIndex(index);

  return (
    <Container>
      <SearchInput
        onChange={handleChange}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        placeholder="Enter an email address or name"
        spellCheck="false"
        type="text"
        value={searchQuery}
      />
      {isDropdownVisible ? (
        <MemberResults
          handleAddMember={handleAddMember}
          members={participants}
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
  isDropdownVisible: PropTypes.bool.isRequired,
  handleShowDropdown: PropTypes.func.isRequired,
  handleHideDropdown: PropTypes.func.isRequired,
};

export default OrganizationMemberSearch;
