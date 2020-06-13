import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';

const PleaseSignIn = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {(payload) => {
      const { me } = payload.data || {};

      if (!me) {
        return (
          <div>
            Please Sign In before Continuing
            <SignIn />
          </div>
        );
      }

      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
