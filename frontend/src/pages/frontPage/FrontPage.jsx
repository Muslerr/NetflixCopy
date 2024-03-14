import React from "react";
import "./FrontPage.scss";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "../../components/shared/languageSelector/LanguageSelector";




const FrontPage = () => {
  const [ email, setEmail ] = useState();
  const handleStart = () => {
    navigate("/signUp")
  };
  const navigate=useNavigate();
  const location=useLocation();
  
  
  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">        
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />            
          
        </div>
       
        <div className="wrapper">
        <LanguageSelector/>
        <Link className="loginButton" to="/signIn">Sign In</Link>
       
        </div>
       
      </div>
      <div className="main">
      
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
       
          <div className="input">
            <input type="email" placeholder="email address"  />
            <button className="registerButton" onClick={handleStart}>
              Get Started 
            </button>
          </div>
        
      </div>
    </div>
  );
}


export default FrontPage;
