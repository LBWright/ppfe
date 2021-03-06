import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap"
import "./App.css";
import Home from "./Home";
import Room from "./Room";

export default function App() {
  return (
    <Router>
      <div className="container">
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:room">
            <Room />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
