/*
 * Also searches for workspaces in the organization, when needed
 */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { isHotkey } from 'is-hotkey';
import styled from '@emotion/styled';

import resourceMembersQuery from 'graphql/queries/resourceMembers';
import orgWorkspacesQuery from 'graphql/queries/orgWorkspaces';
import { getLocalAppState } from 'utils/auth';
import { ORG_WORKSPACES_QUERY_SIZE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { mod } from 'utils/helpers';

import InputWithIcon from 'components/shared/InputWithIcon';
import SearchResults from 'components/participants/SearchResults';

const Container = styled.div({
  position: 'relative',
  marginBottom: '20px',
});

const OrganizationSearch = ({
  isModalOpen,
  isDropdownVisible,
  currentMembers,
  autoFocus,

  handleAddMember,
  handleAddToWorkspace,
  handleShowDropdown,
  handleHideDropdown,
  handleCloseModal,
  ...props
}) => {
  const {
    resource: { resourceType, resourceId, resourceQuery, createVariables },
  } = useContext(NavigationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { organizationId: id } = getLocalAppState();

  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { resourceType: 'organizations', resourceId: id },
  });

  const { data: workspacesData } = useQuery(orgWorkspacesQuery, {
    variables: { queryParams: { size: ORG_WORKSPACES_QUERY_SIZE } },
    skip: resourceType === 'workspace',
  });

  const { data: resourceData } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
    skip: resourceType === 'workspace',
  });

  if (loading || !data.resourceMembers) return null;
  const { members } = data.resourceMembers;
  const orgMembers = (members || []).map(m => m.user);

  let orgWorkspaces = [];
  if (workspacesData && workspacesData.orgWorkspaces) {
    const { items } = workspacesData.orgWorkspaces;
    orgWorkspaces = (items || []).map(i => i.workspace);
  }

  let currentWorkspaceId = null;
  if (resourceData && resourceData[resourceType]) {
    const { workspaces } = resourceData[resourceType];
    // Assuming that a resource can only be part of one workspace for now
    [currentWorkspaceId] = workspaces || [];
  }

  const memberSearch = () => {
    if (!searchQuery) return [];
    const sanitizedQuery = searchQuery.toLowerCase();

    return orgMembers
      .filter(
        ({ email, fullName }) =>
          email.toLowerCase().includes(sanitizedQuery) ||
          fullName.toLowerCase().includes(sanitizedQuery)
      )
      .map(m => ({ ...m, type: 'member' }));
  };

  const workspaceSearch = () => {
    if (!searchQuery) return [];
    const sanitizedQuery = searchQuery.toLowerCase();

    return orgWorkspaces
      .filter(({ title }) => title.toLowerCase().includes(sanitizedQuery))
      .map(m => ({ ...m, type: 'workspace' }));
  };

  const handleChange = value => {
    const currentQuery = value;
    setSearchQuery(currentQuery);
    setSelectedIndex(0);
    handleShowDropdown();
  };

  const handleAddSelection = obj => {
    const { type, id: objId } = obj;
    if (currentMembers.find(({ id: pid }) => pid === objId)) return;
    if (currentWorkspaceId === objId) return;

    if (type === 'member') handleAddMember(obj);
    if (type === 'workspace') handleAddToWorkspace(objId);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const results = [...memberSearch(), ...workspaceSearch()];

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
        <SearchResults
          handleAddSelection={handleAddSelection}
          currentMembers={currentMembers}
          currentWorkspaceId={currentWorkspaceId}
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

  handleAddMember: PropTypes.func.isRequired,
  handleAddToWorkspace: PropTypes.func.isRequired,
  handleShowDropdown: PropTypes.func.isRequired,
  handleHideDropdown: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

OrganizationSearch.defaultProps = {
  autoFocus: false,
};

export default OrganizationSearch;
