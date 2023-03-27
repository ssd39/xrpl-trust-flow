import { Link } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthRoute = (props) => {
    if (window.sdk) {
      return <Component {...props} />;
    } else {
      window.location.replace("/")
    }
  };
  return AuthRoute;
};
export default withAuth;
