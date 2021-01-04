import React from "react";
import { useCallback, useState, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { withRouter } from "react-router-dom";
import "./App.css";

const buttons = [
  { label: "1", value: "1", action: "vote" },
  { label: "2", value: "2", action: "vote" },
  { label: "3", value: "3", action: "vote" },
  { label: "5", value: "5", action: "vote" },
  { label: "8", value: "8", action: "vote" },
  { label: "13", value: "13", action: "vote" },
  { label: "21", value: "21", action: "vote" },
  { label: "?", value: "?", action: "vote" },
  { label: "Show", value: "show", action: "reveal", class: "btn-primary" },
  { label: "Reset", value: "reset", action: "reset", class: "btn-danger" },
];

const Room = (props) => {
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("user"))
      return JSON.parse(localStorage.getItem("user"));
    return "";
  });
  const [hidden, setHidden] = useState(true);

  const [socketUrl] = useState(
    `wss://ppbe.herokuapp.com/ws/${props.match.params.room}`
  );
  const [messages, setMessages] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  function handleNewMessage(data) {
    switch (data.action) {
      case "vote":
        handleVote(data);
        break;
      case "reveal":
        handleReveal(data);
        break;
      case "reset":
        handleReset(data);
        break;

      default:
        console.error("Unintended action captured");
    }
  }

  useMemo(() => {
    if (lastMessage) {
      handleNewMessage(JSON.parse(lastMessage.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  function handleVote(data) {
    setMessages((messages) => {
      if (!messages.find((message) => message?.user === data.user)) {
        return messages.concat({ user: data.user, points: data.payload });
      }
      return messages.map((message) => {
        if (data.user === message.user) {
          return { ...message, points: data.payload };
        }
        return message;
      });
    });
  }
  function handleReveal(data) {
    setHidden(false);
  }
  function handleReset(data) {
    setMessages((messages) => {
      const newMessages = messages.map((message) => ({
        ...message,
        points: "",
      }));
      return newMessages;
    });
    setHidden(true);
  }

  const handleSubmitUser = useCallback(() => {
    sendMessage(JSON.stringify({ payload: "", user, action: "vote" }));
    localStorage.setItem("user", JSON.stringify(user));
  }, [sendMessage, user]);

  const handleClickSendMessage = useCallback(
    (button) => {
      if (!user) {
        alert("Please enter a username to vote");
        return;
      }
      sendMessage(
        JSON.stringify({ payload: button.value, user, action: button.action })
      );
    },
    [sendMessage, user]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const getMsg = (msg) => {
    if (hidden && msg.points) return "Vote Cast";
    if (hidden) return "Deliberating...";
    return msg.points;
  };

  return (
    <div>
      <p>Connection status: {connectionStatus}</p>
      <h2>Current user: {user}</h2>
      <form
        className="form-group"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitUser();
        }}
      >
        <label>
          <input
            className="form-control"
            placeholder="@username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </label>
        <input type="submit" className="btn btn-primary" value="Submit" />
      </form>
      <div className="container">
        <div className="row justify-content-start">
          {buttons.map((button) => {
            return (
              <div key={button.value} className="col-sm-1">
                <button
                  id={button.value}
                  value={button.value}
                  className={`btn ${button.class || ""}`}
                  onClick={(e) => handleClickSendMessage(button)}
                >
                  {button.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row m-t-5">
        <ul>
          {messages
            .map((message, idx) => {
              if (!message) {
                return null;
              }
              return (
                <p key={idx}>
                  <span className="h3">{message.user}: </span>
                  <span className="h4 text-muted">{getMsg(message)}</span>
                </p>
              );
            })
            .filter(Boolean)}
        </ul>
      </div>
    </div>
  );
};

export default withRouter(Room);
