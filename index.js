//jshint esversion:6
import React from 'react';
import {render} from 'react-dom';
import _ from 'lodash';
import cy from './graph.js';
import {newId, addTerminal, addName} from './utils.js';
import {grammar} from './grammar.js';
import StringDisplay from './stringdisplay.js';

let curr_root = cy.filter('[level = 0]')[0];
let string = "aaaa";
let curr_pos = 0;

//Emit a non-terminal, shift the shown string
//throws BadTerminalError
export var emit = (terminal) => {
  if (string[curr_pos + 1] != terminal)
    throw "badTerminalError";
  curr_pos++;
};

render(<StringDisplay string={string} pos={curr_pos}/>, document.getElementById('string'));

//remove all the children of a node, shift the pointer back
var clearChildren = (elem) => {
  elem.successors().forEach(elem => {
    if(elem.data("terminal")){
      console.log(`Unput ${elem.data("symbol")}`);
      // TODO: Do something more fancy here
      curr_pos--;
      elem.remove();
    }
  });
};

// Expand the current element(cytoscape singleton collection)
// with the given grammar and dule number index
var expand = (elem, grammar, ruleno) => {
  console.log(`Expanding ${elem.data("symbol")}(${elem.data("level")}) using rule ${grammar[elem.data("symbol")][ruleno]}}`);

  if (typeof elem === 'undefined' || elem.data('terminal'))
    throw 'BadElementError';

  for (let ruleno = 0; ruleno < grammar[elem.data('symbol')].length; ruleno++) {
    try { //expand a pattern
      let rule = grammar[elem.data('symbol')];
      rule.forEach(symbol => {
        if(symbol>='a' && symbol <='z') {
          emit(symbol);
          addTerminal(elem, symbol);
        }
        else {
          let child_elem = addName(symbol);
          //recursive call
          expand(child_elem);
        }
      });
      return;
    }
    catch(e) { //handle the pattern not matching
      clearChildren(elem);
      continue;
    }
    throw 'NoMatchingRuleException';
  }

};

expand(curr_root, grammar, 0);
