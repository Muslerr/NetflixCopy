import React, { useEffect, useState } from "react";
import List from "../../components/shared/list/List.jsx";
import axios from "axios";
import Header from "../../components/shared/Header/Header.jsx";
import "./ContentPage.scss";
import {Store} from "../../Store.jsx"
import { useContext } from "react";

const ContentPage = ({title}) => {
  const [genres, setGenres] = useState([])
  const [lists, setLists] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const getGenres = async () => {
      const {data} = await axios.get("/api/v1/content/genres",{
        headers: { authorization: `Bearer ${userInfo.token}` }});
      setGenres(data);
      console.log(data)
    }

    const getLists = async () => {
      
     
      if (title === "Home") {
       const {data} = await axios.get("/api/v1/lists",{
          headers: { authorization: `Bearer ${userInfo.token}` }});   
        setLists(data);          
      } 
      
      
      // else if (title === "Movies") {
      //   lists = await axios.get("/api/v1/lists/movies");
      // } else if (title === "Series") {
      //   lists = await axios.get("/api/v1/lists/series");
      // } else if (title === "New & Popular") {
      //   lists = await axios.get("/api/v1/lists/newandpopular");
      // }
      
    };

    getGenres()
    getLists()
  }, [])

  return (
    <div className="page">
      <p></p>
      {/* <div className="page-header">
        <Header title={title} genres={genres} />
      </div> */}
      <div className="page-lists">
        {lists.map((list, index) => (
         <><List key={list.title} data={list.content} /><div><br></br></div></>
        
        ))}
       
      </div>
    </div>
  );
};

export default ContentPage;
