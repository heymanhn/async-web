import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentParticipantsQuery from 'graphql/queries/documentParticipants';

import MemberRow from './MemberRow';

const Container = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  overflow: 'auto',
  top: '41px',
  height: 'auto',
  maxHeight: '240px', // Equivalent to 4 results
  width: '100%',
  backgroundColor: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
}));

const MemberResults = ({ documentId, results }) => {
  const { loading, data } = useQuery(documentParticipantsQuery, {
    variables: { id: documentId },
  });

  if (!results.length) return null;
  if (loading && (!data || !data.documentParticipants)) return null;

  const { documentParticipants } = data;
  const { participants } = documentParticipants;

  return (
    <Container>
      {results.map(r => <MemberRow key={r.id} member={r} /* isParticipant={participants.findIndex(...) >=0} */ />)}
    </Container>

  );
};

MemberResults.propTypes = {
  documentId: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
};

export default MemberResults;
