import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getDisplayName = C => C.displayName || C.name || 'Component';

const reactions = [
  {
    code: 'smile',
    icon: '😄',
    text: "That's funny",
  },
  {
    code: 'heart',
    icon: '❤️',
    text: 'Love it',
  },
  {
    code: 'thumbs_up',
    icon: '👍',
    text: 'Agree',
  },
  {
    code: 'thumbs_down',
    icon: '👎',
    text: 'Disagree',
  },
  {
    code: 'thinking_face',
    icon: '🤔',
    text: 'Confused',
  },
  {
    code: 'clap',
    icon: '👏',
    text: 'Applause',
  },
];

/* Provides APIs to add and remove reactions on a message
 *
 * Any parent component will need to pass the following props:
 * - conversationId
 * - messageId
 *
 * The HOC provides the following props to the child component:
 * - func addReaction(code: String)
 * - func removeReaction(code: String)
 * - array of reactions
 */
const withReactions = (WrappedComponent) => {
  class WithReactions extends Component {
    constructor(props) {
      super(props);

      this.addReaction = this.addReaction.bind(this);
      this.removeReaction = this.removeReaction.bind(this);
    }

    addReaction(code) {
      console.log("Adding reaction " + code);
    }

    removeReaction(code) {
      console.log("Removing reaction " + code);
    }

    render() {
      return (
        <WrappedComponent
          addReaction={this.addReaction}
          removeReaction={this.removeReaction}
          reactions={reactions}
          {...this.props}
        />
      );
    }
  }

  WithReactions.displayName = `WithReactions(${getDisplayName(WrappedComponent)})`;
  WithReactions.propTypes = {
    conversationId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
  };

  return WithReactions;
};

export default withReactions;
