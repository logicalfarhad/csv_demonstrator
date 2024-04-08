import React, { useEffect, useRef, useState } from "react";
import Avatar from "../../components/Avatar";
import BotResponse from "../../components/BotResponse";
import Error from "../../components/Error";
import IntroSection from "../../components/IntroSection";
import Loading from "../../components/Loading";
import SvgComponent from "../../components/SvgComponent";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "../../components/NavbarMenu/NavbarMenu";
import { useKeycloak } from "@react-keycloak/web";
import { Button, Col, Row } from 'react-bootstrap';
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';
const Prompting = () => {
  const { keycloak } = useKeycloak();
  const [inputPrompt, setInputPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [chatLog, setChatLog] = useState([]);
  const [err, setErr] = useState(false);
  const [responseFromAPI, setReponseFromAPI] = useState(false);
  const navigate = useNavigate();

  const chatLogRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();

  // Check if the entered prompt already exists
  if (!suggestions.includes(inputPrompt)) {
    const updatedPrompts = [...suggestions, inputPrompt];
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    setSuggestions(updatedPrompts); // Update state with the new prompts
  }

    if (!responseFromAPI) {
      if (inputPrompt.trim() !== "") {

        setReponseFromAPI(true);
        setChatLog([...chatLog, { chatPrompt: inputPrompt }]);
        callAPI();
        e.target.querySelector("input").blur();
      }

      async function callAPI() {
        // let bearer = 'Bearer ' + window.localStorage.getItem("token");
        if (!keycloak || !keycloak.authenticated) {
          // Handle unauthenticated user
          return;
        }
        const accessToken = keycloak.token;
        try {
          const response = await fetch(backend + "/openai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ query: inputPrompt }),
          });
          const data = await response.json();
          console.log(data)
          setChatLog([
            ...chatLog,
            {
              chatPrompt: inputPrompt,
              botMessage: data.query,
              queryResult: data.queryResult
            },
          ]);
          setErr(false);
        } catch (err) {
          setErr(err);
          console.log(err);
        }
        //  Set responseFromAPI back to false after the fetch request is complete
        setReponseFromAPI(false);
      }
    }

    setInputPrompt("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    // let isMounted = true;
    // async function checkTokenValidity() {
    //   try {
    //     let bearer = 'Bearer ' + window.localStorage.getItem("token");
    //     const response = await fetch(backend + "/login/check-token", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         'Authorization': bearer
    //       },
    //     });
    //     const data = await response.json();
    //     if (!data.valid) {
    //       console.warn("User session expired, please login again!");
    //       // Handle token invalidity, such as logging out the user
    //       navigate("/auth/login");
    //     } else {
    //       navigate("/prompting");
    //     }
    //   } catch (error) {
    //     console.error("Error checking token validity:", error);
    //     navigate("/auth/login");
    //   }
    // }

    // if (isMounted) {
    //   if (window.localStorage.getItem("token")) {
    //     checkTokenValidity();
    //   } else {
    //     navigate("/auth/login");
    //   }
    // }

    if (chatLogRef.current) {
      chatLogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    // return () => {
    //   isMounted = false;
    // };
  }, [navigate]);


  useEffect(() => {
    const storedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
    setSuggestions(storedPrompts);
    // setShowSuggestions(true)
  }, []);

  const handleSuggestionClick = (suggest) => {
    // Your logic here
    setInputPrompt(suggest);
    setShowSuggestions(false);
  };

  return (
    <>
    <NavbarMenu />
      <section className="chatBox">
        {chatLog.length > 0 ? (
          <div className="chatLogWrapper">
            {chatLog.length > 0 &&
              chatLog.map((chat, idx) => (
                <div
                  className="chatLog"
                  key={idx}
                  ref={chatLogRef}
                  id={`navPrompt-${chat.chatPrompt.replace(
                    /[^a-zA-Z0-9]/g,
                    "-"
                  )}`}
                >
                  <div className="chatPromptMainContainer">
                    <div className="chatPromptWrapper">
                      <Avatar bg="#005b7f" className="userSVG">
                        <svg
                          stroke="white"
                          fill="none"
                          strokeWidth={1.9}
                          viewBox="0 0 24 24"
                          // strokeLinecap="round"
                          // strokeLinejoin="round"
                          className="h-6 w-6"
                          height={40}
                          width={40}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx={12} cy={7} r={4} />
                        </svg>
                      </Avatar>
                      <div id="chatPrompt">{chat.chatPrompt}</div>
                    </div>
                  </div>

                  <div className="botMessageMainContainer">
                    <div className="botMessageWrapper">
                      <Avatar bg="#11a27f" className="openaiSVG">
                        <SvgComponent w={41} h={41} />
                      </Avatar>
                      {chat.botMessage ? (
                        <div id="botMessage">
                          <BotResponse
                            response={chat.botMessage}
                            chatLogRef={chatLogRef}
                            queryResponse={chat.queryResult}
                            question={chat.chatPrompt}
                          />
                        </div>
                      ) : err ? (
                        <Error err={err} />
                      ) : (
                        <Loading />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <br />
          </div>
        ) : (<IntroSection />
        )}

        <form onSubmit={handleSubmit}>
          {chatLog.length == 0 && (
            <div>
              <p>Sample Questions</p>
                  <div>
                      <Row>
                      <Col className="d-grid gap-2" md={2} xs={0}></Col>
                        <Col className="d-grid gap-2" md={4} xs={6}>
                          <Button variant="light" onClick={() => setInputPrompt(document.querySelector('#q1').textContent)}>
                            <div>
                              <div><strong>Dataset explanation</strong></div>
                              <div style={{marginTop:10}} id="q1">Explain the dataset?</div>
                            </div>
                          </Button>
                        </Col>
                        <Col className="d-grid gap-2" md={4} xs={6}>
                          <Button variant="light" onClick={() => setInputPrompt(document.querySelector('#q2').textContent)}>
                            <div>
                              <div><strong>10 rows of your dataset</strong></div>
                              <div style={{marginTop:10}} id="q2">Provide me first 10 rows of any table?</div>
                            </div>
                          </Button>
                        </Col>
                        <Col className="d-grid gap-2" md={2} xs={0}></Col>
                        {/* Repeat the structure for other buttons */}
                      </Row>
                      <br />
                      <br />
                      <Row>
                      <Col className="d-grid gap-2" md={2} xs={0}></Col>
                        <Col className="d-grid gap-2" md={4} xs={6}>
                          <Button variant="light" onClick={() => setInputPrompt(document.querySelector('#q4').textContent)}>
                            <div>
                              <div><strong>Top selling products</strong></div>
                              <div style={{marginTop:10}} id="q3">Provide me complete details of top 10products which are most selling?</div>
                            </div>
                          </Button>
                        </Col>
                        <Col className="d-grid gap-2" md={4} xs={6}>
                          <Button variant="light" onClick={() => setInputPrompt(document.querySelector('#q4').textContent)}>
                            <div>
                              <div><strong>What kind of categories are there?</strong></div>
                              <div style={{marginTop:10}} id="q4">Provide me list of product categories and colors?</div>
                            </div>
                          </Button>
                        </Col>
                        <Col className="d-grid gap-2" md={2} xs={0}></Col>
                        {/* Repeat the structure for other buttons */}
                      </Row>
                    </div>
            </div>
          )}

          <div className="inputPromptWrapper">
            <input
              name="inputPrompt"
              id=""
              autoComplete="off"
              className="inputPrompttTextarea"
              type="text"
              rows="1"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onClick={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)} // Hide suggestions on blur
              autoFocus
              placeholder=" Add new prompt"
            ></input>
            <button aria-label="form submit" type="submit">
              <svg
              style={{rotate:'60deg'}}
                fill="#005B7F"
                width={25}
                // height={35}
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#005B7F"
                strokeWidth={0}
              >
                <title>{"submit form"}</title>
                <path
                  d="m30.669 1.665-.014-.019a.73.73 0 0 0-.16-.21h-.001c-.013-.011-.032-.005-.046-.015-.02-.016-.028-.041-.05-.055a.713.713 0 0 0-.374-.106l-.05.002h.002a.628.628 0 0 0-.095.024l.005-.001a.76.76 0 0 0-.264.067l.005-.002-27.999 16a.753.753 0 0 0 .053 1.331l.005.002 9.564 4.414v6.904a.75.75 0 0 0 1.164.625l-.003.002 6.259-4.106 9.015 4.161c.092.043.2.068.314.068H28a.75.75 0 0 0 .747-.695v-.002l2-27.999c.001-.014-.008-.025-.008-.039l.001-.032a.739.739 0 0 0-.073-.322l.002.004zm-4.174 3.202-14.716 16.82-8.143-3.758zM12.75 28.611v-4.823l4.315 1.992zm14.58.254-8.32-3.841c-.024-.015-.038-.042-.064-.054l-5.722-2.656 15.87-18.139z"
                  stroke="none"
                />
              </svg>
            </button>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="suggestionsWrapper">
          <div className="suggestions">
          {suggestions.slice().reverse().map((suggest, index) => (
  <div key={index} className="suggestion inputPrompttTextarea" onMouseDown={() => handleSuggestionClick(suggest)}>
    {suggest}
  </div>
))}
          </div>
        </div>
      )}

          </div>
        </form>
      </section>
    </>
  );
};

export default Prompting;
