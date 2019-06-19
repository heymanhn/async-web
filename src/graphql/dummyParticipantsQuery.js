import gql from 'graphql-tag';

export default gql`
  query DummyParticipants {
    participants @rest(type: "[Participants]", path: "/organizations/9503d58c-57fe-11e9-943a-3c15c2d3a602/members") {
      id
      fullName
      profilePictureUrl
    }
  }
`;
