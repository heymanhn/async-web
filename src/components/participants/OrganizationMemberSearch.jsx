/* eslint no-mixed-operators: 0 */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import organizationMembersQuery from 'graphql/queries/organizationMembers';
import documentMembersQuery from 'graphql/queries/documentMembers';
import discussionMembersQuery from 'graphql/queries/discussionMembers';
import addDocumentMemberMutation from 'graphql/mutations/addDocumentMember';
import localAddDocumentMemberMutation from 'graphql/mutations/local/addDocumentMember';
import addDiscussionMemberMutation from 'graphql/mutations/addDiscussionMember';
import localAddDiscussionMemberMutation from 'graphql/mutations/local/addDiscussionMember';
import { getLocalAppState } from 'utils/auth';
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

  const { loading: l1, data: data1 } = useQuery(organizationMembersQuery, {
    variables: { id },
  });
  const { loading: l2, data: data2 } = useQuery(documentMembersQuery, {
    variables: { id: documentId },
    skip: !documentId,
  });
  const { loading: l3, data: data3 } = useQuery(discussionMembersQuery, {
    variables: { id: discussionId },
    skip: !discussionId,
  });

  const [addDocumentMember] = useMutation(addDocumentMemberMutation);
  const [localAddDocumentMember] = useMutation(localAddDocumentMemberMutation);
  const [addDiscussionMember] = useMutation(addDiscussionMemberMutation);
  const [localAddDiscussionMember] = useMutation(
    localAddDiscussionMemberMutation
  );

  if (l1 || l2 || l3 || !data1.organizationMembers) {
    return null;
  }

  let { members } = data1.organizationMembers || [];
  members = members.map(m => m.user);

  let resourceMembers;
  if (documentId) {
    const { documentMembers } = data2;
    ({ resourceMembers } = documentMembers || {});
  } else if (discussionId) {
    const { discussionMembers } = data3;
    ({ resourceMembers } = discussionMembers || {});
  }

  const participants = (resourceMembers || []).map(p => p.user);

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

  function handleAddDocumentMember(user) {
    if (participants.find(({ id: pid }) => pid === user.id)) return;

    addDocumentMember({
      variables: {
        id: documentId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddDocumentMember({
      variables: { id: documentId, user, accessType: DEFAULT_ACCESS_TYPE },
    });
  }

  function handleAddDiscussionMember(user) {
    if (participants.find(({ id: pid }) => pid === user.id)) return;

    addDiscussionMember({
      variables: {
        id: discussionId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddDiscussionMember({
      variables: { id: discussionId, user, accessType: DEFAULT_ACCESS_TYPE },
    });
  }

  function handleAddMember(user) {
    if (documentId) {
      handleAddDocumentMember(user);
    } else if (discussionId) {
      handleAddDiscussionMember(user);
    }

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

      return handleAddMember(results[selectedIndex]);
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
