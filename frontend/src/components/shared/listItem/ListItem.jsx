import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import "./ListItem.scss";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { useContent } from "../../../contexts/ContentContext.jsx";

const ListItem = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItemToMyList, removeItemFromMyList, myList } = useContent();
  const hoverTimeoutRef = useRef(null);
  const hoverStartTimeRef = useRef(null);
  const [isInMyList, setIsInMyList] = useState();

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
    },
  };

  const getYouTubeId = (url) => {
    const match = url.match(
      /[?&]v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] || match[2] : null;
  };
  const videoID = getYouTubeId(content.trailer);

  const handleMouseEnter = () => {
    hoverStartTimeRef.current = performance.now();
    hoverTimeoutRef.current = requestAnimationFrame(handleHoverTimeout);
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  const handleHoverTimeout = () => {
    const elapsedTime = performance.now() - hoverStartTimeRef.current;
    if (elapsedTime >= 500) {
      setIsHovered(true);
    } else {
      hoverTimeoutRef.current = requestAnimationFrame(handleHoverTimeout);
    }
  };

  const isContentInList = () => {
    return myList.some((item) => item._id === content._id);
  };
  const addItem = async () => {
    await addItemToMyList(content);
  };

  const removeItem = async () => {
    await removeItemFromMyList(content);
  };

  useEffect(() => {
    setIsInMyList(isContentInList());
  }, [myList]);

  // {isHovered ? "listItem hover" : "listItem"}
  return (
    <div
      className={`listItem ${isHovered ? "hover" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isHovered && (
        <>
          <div className="spa">{content.title}</div>
          <img className="img" src={content.img} alt={content.title}></img>
        </>
      )}
      {isHovered && (
        <>
          <div>
            <YouTube videoId={videoID} opts={opts} />
          </div>
          <div className="itemInfo">
            <div className="icons">
              <Link to={`/fullscreen/${videoID}`}>
                <PlayArrowOutlinedIcon fontSize="large" className="icon" />
              </Link>
              {isInMyList ? (
                <CheckIcon className="icon" onClick={removeItem} />
              ) : (
                <AddOutlinedIcon className="icon" onClick={addItem} />
              )}
            </div>
            <div className="itemInfoTop">
              <span>{content.duration}</span>
              <span className="limit">+16</span>
              <span>{content.year}</span>
            </div>
            <div className="desc">
              {content.description.split(" ").slice(0, 20).join(" ") + " ..."}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItem;
