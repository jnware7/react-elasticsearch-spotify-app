import React from "react";
import "./Card.css";

const Card = props => {
  return (
    <div className="card">
      <img className="card-img" src={props.img}  />
      <div className="card-artist">{props.artist}</div>
      <div className="card-song">{props.name}</div>
    </div>
  );
}

export default Card;
