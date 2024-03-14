import React, { useEffect, useState } from "react";
import List from "../../components/shared/list/List.jsx";
import Navbar from "../../components/shared/Navbar/Navbar.jsx";
import "./ContentPage.scss";
import Featured from "../../components/shared/featured/Featured.jsx";
import Loading from "../../components/shared/loading/Loading.jsx";
import MessageBox from "../../components/shared/messageBox/MessageBox.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { useContent } from "../../contexts/ContentContext.jsx";
import Footer from "../../components/shared/footer/Footer.jsx";

const ContentPage = ({ title }) => {
  const { get } = useUser();
  const userInfo = get();
  const { genres, lists, loading, error, getData } = useContent();
  const [randomContent, setRandomContent] = useState();
  useEffect(() => {
    getData(title);
  }, [title]);
  useEffect(() => {
    if (lists.length > 0) {
      const randomListIndex = Math.floor(Math.random() * lists.length);
      const randomList = lists[randomListIndex];

      if (randomList) {
        const randomIndex = Math.floor(
          Math.random() * randomList.content.length
        );
        console.log(randomList);
        setRandomContent(randomList.content[randomIndex]);
        console.log(randomContent);
      } else {
        setRandomContent(null);
      }
    }
  }, [lists]);

  return (
    <div className="page" id="page">
      <div className="featured">
        <Featured content={randomContent} />
      </div>
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="pageContent">
        {loading ? (
          <Loading />
        ) : error ? (
          <MessageBox error={error} ></MessageBox>
        ) : (
          <div className="page-lists">
            {lists ? (
              lists.map((list) => (
                <div key={list.title}>
                  <List title={list.title} data={list.content} />
                </div>
              ))
            ) : (
              <h1>error</h1>
            )}
          </div>
        )}
      </div>
      <div className="page-footer">
        <br />
        <br />
        <br />
        <Footer />
      </div>
    </div>
  );
};

export default ContentPage;
