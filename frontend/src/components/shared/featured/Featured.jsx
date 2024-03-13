import "./featured.scss";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IframeComponent from "../iframeComponent/IFrameComponent";

const Featured = ({ content }) => {
  const navigate = useNavigate();
  const getYouTubeId = (url) => {
    const match = url.match(
      /[?&]v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] || match[2] : null;
  };

  const videoID = content ? getYouTubeId(content.trailer) : null;
  const handlePlayClick = () => {
    navigate(`/fullscreen/${videoID}`);
  };

  return (
    <div className="featured">
      
      <div className="transparent">
        {videoID && <IframeComponent videoId={videoID} />}
        <div className="info">
          {content && (
            <>
              <img
                src={content.imgTitle}
                alt=""
                className="imageTitle"
              />
              <span className="desc">
                {content.description ||
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae adipisci repellendus eum quasi illo, velit numquam, maxime tempora sint deleniti, aliquid qui? Facilis, adipisci! Ratione hic repudiandae temporibus eum earum?"}
              </span>
              <div className="buttons">
             
                <button className="play" onClick={handlePlayClick} >
                          
                  <PlayArrowIcon />
                  <span>Play</span>
                  
                </button>
                
                <button className="more">
                  <InfoOutlinedIcon />
                  <span>Info</span>
                </button>
              </div>
            </>
          )}
        </div>
        <div className="gradient-overlay-bot"></div>
      </div>
     
    </div>
  );
};


export default Featured;
