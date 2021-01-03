import React, { useState } from "react";
import { withRouter } from "react-router";

export default withRouter(function Home(props) {
  const [room, setRoom] = useState("");
  function handleChange(e) {
    setRoom(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.history.push(room);
  }

  return (
    <div>
      <form className="form-group" onSubmit={handleSubmit}>
        <label htmlFor="new-room">
          <h2>Create a new Pointing Room</h2>
          <input className="form-control" id="new-room" type="text" value={room} onChange={handleChange} />
        </label>
        <input className="btn btn-primary" type="submit" value="Submit" />
      </form>
    </div>
  );
});
