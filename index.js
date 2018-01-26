//jshint esversion:6
import cy from './graph.js';
import {newId, solve, emit} from './utils.js';
import _ from 'lodash';
import grammar from 'grammar.js'

let curr_root = cy.filter('[level = 0]')[0];

let string = "aaaa";
let curr_pos = 0;
