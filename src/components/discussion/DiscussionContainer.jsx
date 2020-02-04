// import React, { useState } from 'react';
// import PropTypes from 'prop-types';

// import { DiscussionContext } from 'utils/contexts';
// import useMountEffect from 'utils/hooks/useMountEffect';

// import HeaderBar from 'components/navigation/HeaderBar';
// import Discussion from './Discussion';

// const DiscussionContainer = ({ discussionId }) => {
//   const [isComposing, setIsComposing] = useState(!discussionId);

//   const startComposing = () => setIsComposing(true);
//   const stopComposing = () => setIsComposing(false);

//   const value = {
//     discussionId,
//     context,
//     draft,
//   };

//   return (
//     <DiscussionContext.Provider value={value}>
//       {discussionId && <DiscussionThread isUnread={isUnread()} />}
//       {isComposing ? (
//         <StyledDiscussionMessage
//           mode="compose"
//           afterCreate={stopComposing}
//           handleCancel={handleCancelCompose}
//           {...props}
//         />
//       ) : (
//         <ModalAddReplyBox
//           handleClickReply={startComposing}
//           isComposing={isComposing}
//         />
//       )}
//     </DiscussionContext.Provider>
//   );
// };

// DiscussionContainer.propTypes = {
//   parent: PropTypes.string,
//   discussionId: PropTypes.string,
// };

// DiscussionContainer.defaultProps = {
//   parent: '',
//   discussionId: null,
// };

// export default DiscussionContainer;
