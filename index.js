//jshint esversion:6
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import cy,{buildGraph} from './graph.js';
//import {newId, addTerminal, addName, wait} from './utils.js';
import {grammar} from './grammar.js';
import StringDisplay from './stringdisplay.js';

let root = cy.nodes('#root');
let string = "aaaaaaaa";
let curr_pos = 0;
const relayout = () => cy.layout({name:'dagre'}).run();
const rerender = () => {
  curr_pos = cy.nodes().filter((e)=>e.data('terminal')==true).length;
  render(<StringDisplay string={string} pos={curr_pos}/>, document.getElementById('string'));
};

const wait = async () => new Promise(resolve => setTimeout(resolve, 500));

var addName = async (elem, symbol) => {
  await wait();
  console.log(`[Adding name ${symbol}]`);
  let child = elem.cy().add({
    data:{
      terminal: false,
      level: +elem.data('level') + 1,
      symbol:symbol
    }
  });
  elem.cy().add({
    data:{
      source: elem.id(),
      target: child.id()
    }
  });
  relayout();
  return child;
};
//TODO make this more functional, and not just copypasta
var addTerminal = async (elem, symbol) => {
  await wait();
  console.log(`[Adding terminal ${symbol}]`);
  let child = elem.cy().add({
    data: {
      terminal: true,
      level: +elem.data('level') + 1,
      symbol: symbol
    }
  });
  elem.cy().add({
    data:{
      source: elem.id(),
      target: child.id()
    }
  });
  relayout();
  return child;
};


//Emit a non-terminal, shift the shown string
//throws BadTerminalError
export var emit = async (terminal) => {
  if (string[curr_pos] != terminal){
    console.log("badTerminalError");
    throw new Error("badTerminalError");
  }
  rerender();
};


//remove all the children of a node, shift the pointer back
var clearChildren = async (elem) => {
  await wait();
  console.log(`Clearing ${elem.data('symbol')}-${elem.data('level')}`);
  elem.style('background-color','pink');
  elem.successors().style("background-color","pink");
  relayout();
  rerender();
  await wait();
  elem.successors().remove();
  elem.style('background-color','red');
  relayout();
  rerender();

};

// Expand the current element(cytoscape singleton collection)
// with the given grammar and dule number index
var expand = async (elem, grammar) => {
  await wait();
  console.log(`[Expanding ${elem.data("symbol")}-(${elem.data("level")})]`);
  //if (typeof elem === 'undefined' || elem.data('terminal')){
  //  console.log("throwing BadElementError");
  //  throw new Error(`BadElementError(${elem.data('symbol')}-${elem.data('level')})`);
  //}


  for (let ruleno = 0; ruleno < grammar[elem.data('symbol')].length; ruleno++) {
    try { //expand a pattern
      let rule = grammar[elem.data('symbol')][ruleno];
      console.log(`Using rule ${elem.data('symbol')}->${rule}`);
      for (const symbol of rule){
        if (symbol >= 'a' && symbol <= 'z') {
          await addTerminal(elem, symbol);
          await emit(symbol);
        } else {
          let child_elem = await addName(elem, symbol);
          //recursive call
          await expand(child_elem, grammar);
        }
      };
      return;
    } catch (e) { //handle the pattern not matching
      await clearChildren(elem);

      //await wait();
      console.log(`Redo ${elem.data("symbol")}-(${elem.data("level")})`);
      continue;
    }
    console.log("throwing NoMatchingRuleException");
    throw new Error('NoMatchingRuleException');
  }
  if(curr_pos!=string.length){
    console.log(`Failure: ${elem.data("symbol")}-(${elem.data("level")})`);
    throw new Error("Failure");
  }
  console.log(`Success: ${elem.data("symbol")}-(${elem.data("level")})`);
  return true;

};
//addName(root, "S");
//addTerminal(root, "a");
const run = async (s_string) => {
  string = s_string;
  cy.nodes().remove();
  cy.add({ data: { id: "root", symbol: "S", terminal: false, level: 0 } });
  relayout();
  rerender();
  await expand(root, grammar, 0).then(e=>console.log("Total Success"),e=>console.log("Total Failure"));
};

window.onload = function(){
    document.getElementById("run").onclick = () => {
      document.getElementById("run").disabled = true;
      run(document.getElementById("input_text").value).then(()=>document.getElementById("run").disabled = false);
    };
};
