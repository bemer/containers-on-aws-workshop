import React, { Component } from "react";
import "./NotFound.css";

export default class NotFoundContainer extends Component {

  render() {
    return (
      <div className="NotFound" data-text="Oh no! Our spaghetti code not found this. We will prepare soon!">
        <spaguetti>
          <fork></fork>
          <meat></meat>
          <pasta></pasta>
          <plate></plate>
        </spaguetti>
      </div>
    );
  }
}