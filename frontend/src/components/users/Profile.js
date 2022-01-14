import axios from "axios";
import { useState, useEffect } from "react";

const Profile = (props) => {
  const [details, setDetails] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile") // unimplemented
      .then((response) => {
        setDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return <div></div>;
};

export default Profile;
