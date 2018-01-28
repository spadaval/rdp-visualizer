//jshint esversion:6
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import cy from './graph.js';
import {newId, addTerminal, addName, wait} from './utils.js';
import {grammar} from './grammar.js';
import StringDisplay from './stringdisplay.js';

let curr_root = cy.filter('[level = 0]')[0];
let string = "aaaa";
let curr_pos = 0;

//Emit a non-terminal, shift the shown string
//throws BadTerminalError
export var emit = async (terminal) => {
  await wait(1000);
  if (string[curr_pos + 1] != terminal)
    throw "badTerminalError";
  curr_pos++;
};

render(<StringDisplay string={string} pos={curr_pos}/>, document.getElementById('string'));

//remove all the children of a node, shift the pointer back
var clearChildren = (elem) => {
  console.log(`Clearing ${elem.data('symbol')}-${elem.data('level')}`);
  elem.successors().forEach(elem => {
    if (elem.data("terminal")) {
      console.log(`Unput ${elem.data("symbol")}`);
      // TODO: Do something more fancy here
      curr_pos--;
      elem.remove();
    }
  });
};

// Expand the current element(cytoscape singleton collection)
// with the given grammar and dule number index
var expand = async (elem, grammar) => {
  console.log(`Expanding ${elem.data("symbol")}(${elem.data("level")}) using rules ${grammar[elem.data("symbol")]}`);
  await wait(1000);
  if (typeof elem === 'undefined' || elem.data('terminal')){
    console.log("throwing BadElementError");
    throw new Error('BadElementError');
  }

  for (let ruleno = 0; ruleno < grammar[elem.data('symbol')].length; ruleno++) {
    try { //expand a pattern
      let rule = grammar[elem.data('symbol')][ruleno];
      console.log(`Attempting rule ${elem.data('symbol')}->${rule}`);
      rule.forEach( async (symbol) => {
        if (symbol >= 'a' && symbol <= 'z') {
          await emit(symbol);
          await addTerminal(elem, symbol);
        } else {
          let child_elem = await addName(elem, symbol);
          //recursive call
          console.log("Run recursive call");
          await expand(child_elem, grammar);
        }
      });
      return;
    } catch (e) { //handle the pattern not matching
      clearChildren(elem);
      await wait(1000);
      continue;
    }
    console.log("throwing NoMatchingRuleException");
    throw new Error('NoMatchingRuleException');
  }
  return true;
};

expand(curr_root, grammar, 0).catch(e=>
  console.log(e)
);
