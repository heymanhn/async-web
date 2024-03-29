import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import localDeleteResourceFromInboxMtn from 'graphql/mutations/local/deleteResourceFromInbox';
import useResourceDetails from 'hooks/resources/useResourceDetails';
import useHover from 'hooks/shared/useHover';
import { getLocalUser } from 'utils/auth';
import { isResourceUnread, titleize } from 'utils/helpers';
import {
  DEFAULT_DOCUMENT_CONTEXT,
  DEFAULT_DISCUSSION_CONTEXT,
  DocumentContext,
  DiscussionContext,
} from 'utils/contexts';

import DeleteResourceButton from './DeleteResourceButton';

const contexts = {
  document: {
    ResourceContext: DocumentContext,
    defaultContext: DEFAULT_DOCUMENT_CONTEXT,
  },
  discussion: {
    ResourceContext: DiscussionContext,
    defaultContext: DEFAULT_DISCUSSION_CONTEXT,
  },
};

const Container = styled.div({
  display: 'flex',

  padding: '20px 0',
  width: '100%',
});

const DetailsContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flexGrow: 1,
});

const ItemDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled.span(
  ({ hover, isUnread, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 16, weight: isUnread ? 600 : 400 }),
    color: hover ? colors.blue : colors.mainText,
    marginBottom: '2px',
  })
);

const IconContainer = styled.div({
  marginTop: '5px',
  width: '32px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  color: colors.grey2,
  fontSize: '16px',
}));

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',

  cursor: 'pointer',
  borderTop: `1px solid ${colors.borderGrey}`,
  textDecoration: 'none',

  ':last-of-type': {
    borderBottom: `1px solid ${colors.borderGrey}`,
  },

  ':first-of-type': {
    borderTop: 'none',
  },

  ':hover,:active,:visited': {
    textDecoration: 'none',
  },
}));

const InboxRow = ({ item, ...props }) => {
  const { hover, ...hoverProps } = useHover();
  const { document, discussion } = item;
  const resourceType = document ? 'document' : 'discussion';
  const isDocument = resourceType === 'document';
  const resource = document || discussion;

  const [deleteResourceFromInbox] = useMutation(
    localDeleteResourceFromInboxMtn
  );
  const ResourceDetails = useResourceDetails(resourceType, resource);
  if (!ResourceDetails) return null;

  const { id, tags, title, author, owner } = resource;

  const { userId } = getLocalUser();
  const { id: authorId } = author || owner;
  const isAuthor = userId === authorId;

  const afterDeleteResource = () => {
    deleteResourceFromInbox({
      variables: {
        resourceType,
        resourceId: id,
      },
    });
  };

  const { ResourceContext, defaultContext } = contexts[resourceType];
  const value = { ...defaultContext };
  value[`${resourceType}Id`] = id;
  value[`afterDelete${titleize(resourceType)}`] = afterDeleteResource;

  return (
    <ResourceContext.Provider value={value}>
      <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
        <Container {...hoverProps} {...props}>
          <IconContainer>
            <StyledIcon icon={isDocument ? 'file-alt' : 'comments-alt'} />
          </IconContainer>
          <DetailsContainer>
            <ItemDetails>
              <Title hover={hover} isUnread={isResourceUnread(tags)}>
                {title || `Untitled ${resourceType}`}
              </Title>
              <ResourceDetails />
            </ItemDetails>
            {isAuthor && (
              <DeleteResourceButton hover={hover} resourceType={resourceType} />
            )}
          </DetailsContainer>
        </Container>
      </StyledLink>
    </ResourceContext.Provider>
  );
};

InboxRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default InboxRow;
