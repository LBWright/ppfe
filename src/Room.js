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
  { label: "Show", value: "show", action: "reveal" },
  { label: "Reset", value: "reset", action: "reset" },
];

const Room = (props) => {
  const [user, setUser] = useState(() => localStorage.getItem("user") || "");
  const [hidden, setHidden] = useState(true);

  const [socketUrl] = useState(
    `ws://ppbe.herokuapp.com/ws/${props.match.params.room}`
  );
  const [messages, setMessages] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useMemo(() => {
    if (lastMessage) {
      handleNewMessage(JSON.parse(lastMessage.data));
    }
  }, [lastMessage, handleNewMessage]);

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

  return (
    <div>
      <h2>Connection status: {connectionStatus}</h2>
      <h2>Current user: {user}</h2>
      <form>
        <label>
          Username:{" "}
          <input value={user} onChange={(e) => setUser(e.target.value)} />
        </label>
      </form>
      {buttons.map((button) => {
        return (
          <button
            id={button.value}
            key={button.value}
            value={button.value}
            onClick={(e) => handleClickSendMessage(button)}
          >
            {button.label}
          </button>
        );
      })}
      <div>
        <ul>
          {messages
            .map((message, idx) => {
              if (!message) {
                return null;
              }
              return (
                <p key={idx}>
                  {message.user}:{" "}
                  <span className={hidden ? "hidden" : ""}>
                    {message.points}
                  </span>
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
