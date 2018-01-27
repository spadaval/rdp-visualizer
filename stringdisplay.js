//jshint esversion:6
import React from 'react';
import ReactDOM from 'react-dom';

export default class StringDisplay extends React.Component {

  render() {
    let string = this.props.string;
    let pos = this.props.pos;
    return (
      <div className="string-container">
        <span className="complete">{string.slice(0,pos)}</span>
        <span className="current">{string[pos]}</span>
        <span className="normal">{string.slice(pos+1)}</span>
      </div>)
  }
}
