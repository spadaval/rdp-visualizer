//jshint esversion:6
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import _ from 'lodash';
cytoscape.use( dagre );

var cy = window.cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: [
    {
      selector: 'node',
      style: {
        'content': 'data(symbol)',
        'text-opacity': 0.5,
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': _.memoize((ele) => {
          if(ele.data('terminal')) {
            return 'blue';
          }
          else {
            return 'red';
          }
        }),
      }
    },

    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'width': 4,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea'
      }
    }
  ],

  elements: {
    nodes: [
      { data: { id: 'S-1', symbol: 'S' , terminal: false, level: 0 } },
      { data: { id: 'a-1', symbol: 'a' , terminal: true, level : 1 } },
    ],
    edges: [
      {data: {id:"sa",source:'S-1',target:'a-1'} },
    ]
  },
});

cy.layout({name:"dagre"}).run();

export default cy;
