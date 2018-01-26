//jshint esversion:6
import _ from 'lodash';
export var newId = function(symbol){
  if(typeof symbol == 'undefined')
    symbol = 'S';
  return symbol + '-' + window.btoa(Math.floor(Math.random()*100000).toString());
};
