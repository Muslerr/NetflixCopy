import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
const MessageBox = ({error}) => {
  return <h1>something went wrong please refresh and try again {error.message}</h1> ;
};

export default MessageBox;
