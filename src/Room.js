import React from "react";
import { useCallback, useState, useRef, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { withRouter } from "react-router-dom";

const buttons = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
  { label: "8", value: "8" },
  { label: "13", value: "13" },
  { label: "21", value: "21" },
  { label: "?", value: "?" },
];

const Room = (props) => {
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [socketUrl] = useState(
    `ws://ppbe.herokuapp.com/ws/${props.match.params.room}`
  );
  const messageHistory = useRef([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(lastMessage),
    [lastMessage]
  );

  const handleClickSendMessage = useCallback(
    (e) => sendMessage(JSON.stringify({ points: e.target.value, user })),
    [sendMessage, user]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  console.log({ messageHistory });
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
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      {buttons.map((button) => {
        return (
          <button
            id={button.value}
            value={button.value}
            onClick={handleClickSendMessage}
          >
            {button.label}
          </button>
        );
      })}
      <ul>
        {messageHistory.current
          .map((message, idx) => {
            if (!message) {
              return null;
            }
            const data = JSON.parse(message.data);
            return (
              <p key={idx}>
                {data.user}: {data.points}
              </p>
            );
          })
          .filter(Boolean)}
      </ul>
    </div>
  );
};

export default withRouter(Room);
