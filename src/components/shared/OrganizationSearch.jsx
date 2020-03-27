/*
 * Also searches for workspaces in the organization, when needed
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import resourceMembersQuery from 'graphql/queries/resourceMembers';
import { getLocalAppState } from 'utils/auth';
import { mod } from 'utils/helpers';

import InputWithIcon from 'components/shared/InputWithIcon';
import MemberResults from 'components/participants/MemberResults';

const Container = styled.div({
  position: 'relative',
  marginBottom: '20px',
});

const OrganizationSearch = ({
  isModalOpen,
  isDropdownVisible,
  currentMembers,
  autoFocus,

  handleAdd,
  handleShowDropdown,
  handleHideDropdown,
  handleCloseModal,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { organizationId: id } = getLocalAppState();

  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { resourceType: 'organizations', id },
  });

  if (loading || !data.resourceMembers) return null;
  const { members } = data.resourceMembers;
  const orgMembers = (members || []).map(m => m.user);

  const memberSearch = () => {
    if (!searchQuery) return [];

    return orgMembers.filter(({ email, fullName }) => {
      const sanitizedQuery = searchQuery.toLowerCase();

      return (
        email.toLowerCase().includes(sanitizedQuery) ||
        fullName.toLowerCase().includes(sanitizedQuery)
      );
    });
  };

  const handleChange = value => {
    const currentQuery = value;
    setSearchQuery(currentQuery);
    setSelectedIndex(0);
    handleShowDropdown();
  };

  const handleAddSelection = user => {
    if (currentMembers.find(({ id: pid }) => pid === user.id)) return;

    handleAdd(user);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const results = memberSearch();

  // What this means: at most three presses of the Escape key to close modal
  const handleCancel = () => {
    if (isDropdownVisible) return handleHideDropdown();

    if (searchQuery) {
      setSearchQuery('');
      return setSelectedIndex(0);
    }

    return handleCloseModal();
  };

  const handleKeyDown = event => {
    // This first hotkey should trigger even if there are no results
    if (isHotkey('Escape', event)) {
      event.preventDefault();
      return handleCancel();
    }

    if (!results.length) return null;

    if (isHotkey('ArrowDown', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex + 1, results.length));
    }
    if (isHotkey('ArrowUp', event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex - 1, results.length));
    }

    if (isHotkey('Enter', event)) {
      event.preventDefault();

      return handleAddSelection(results[selectedIndex]);
    }

    return null;
  };

  const updateSelectedIndex = index =>
    index !== selectedIndex && setSelectedIndex(index);

  return (
    <Container {...props}>
      <InputWithIcon
        icon="users"
        autoFocus={autoFocus}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        placeholder="Enter an email address or name"
        value={searchQuery}
        setValue={handleChange}
      />
      {isDropdownVisible ? (
        <MemberResults
          handleAddSelection={handleAddSelection}
          members={currentMembers}
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

OrganizationSearch.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  isDropdownVisible: PropTypes.bool.isRequired,
  currentMembers: PropTypes.array.isRequired,
  autoFocus: PropTypes.bool,

  handleAdd: PropTypes.func.isRequired,
  handleShowDropdown: PropTypes.func.isRequired,
  handleHideDropdown: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

OrganizationSearch.defaultProps = {
  autoFocus: false,
};

export default OrganizationSearch;
