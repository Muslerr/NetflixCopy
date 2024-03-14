import React, { createContext, useState, useContext } from "react";

import axios from "axios";
import { useUser } from "./UserContext";

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);
  const [lists, setLists] = useState([]);
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { get } = useUser();
  let userInfo=get();

  const getData = async (title) => {
    userInfo = get();
    try {
      setLoading(true);
      if (title === "Movies" || title === "Series") {
        const { data } = await axios.get("/api/v1/content/genres", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGenres(data);
      }
      let response = [];
      switch (title) {
        case "Home":
          response = await axios.get("/api/v1/lists", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          break;
        case "Movies":
          response = await axios.get("/api/v1/lists/movies", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          break;
        case "Series":
          response = await axios.get("/api/v1/lists/series", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          break;

        case "New & Popular":
          response = await axios.get("/api/v1/lists/newandpopular", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          break;

        default:
          break;
      }
      setLists(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const getMyList = async () => {
   
    try {
      const response = await axios.get( `/api/v1/users/getMyList/${userInfo._id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setMyList(response.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const addItemToMyList = async (content) => {
    
    if (!myList.some((item) => item._id === content._id)) {
      try {
        const response = await axios.post(
          `/api/v1/users/addtolist/${content._id}`,
        userInfo,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        setMyList((prevList) => [...prevList, content]);
      } catch (error) {
        console.error("Error adding item to list:", error);
      }
    }
  };

  const removeItemFromMyList = async (content) => {
    
    console.log("Removing item from list");
    try {
      const response = await axios.post(
        `/api/v1/users/removefromlist/${content._id}`,
        userInfo,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setMyList((prevList) =>
        prevList.filter((item) => item._id !== content._id)
      );
    } catch (error) {
      console.error("Error removing item from list:", error);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        genres,
        lists,
        loading,
        error,
        myList,
        getData,
        getMyList,
        addItemToMyList,
        removeItemFromMyList,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
export default ContentContext;
