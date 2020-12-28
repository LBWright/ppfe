import React from "react";
import { useCallback, useState, useRef, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { withRouter } from "react-router-dom";

const Room = (props) => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl] = useState(
    `ws://ppbe.herokuapp.com/ws/${props.match.params.room}`
  );
  const messageHistory = useRef([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(lastMessage),
    [lastMessage]
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.current.map((message, idx) => (
          <span key={idx}>{message?.data}</span>
        ))}
      </ul>
    </div>
  );
};

export default withRouter(Room);
