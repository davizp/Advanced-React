import ResetPassword from '../components/ResetPassword';

const ResetPage = props => (
  <div>
    <ResetPassword resetToken={props.query.resetToken} />
  </div>
)

export default ResetPage;
