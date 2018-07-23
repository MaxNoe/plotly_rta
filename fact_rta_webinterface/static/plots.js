"use strict;"


const URL = "events";
const off_keys = ["theta_deg_off_1", "theta_deg_off_2", "theta_deg_off_3", "theta_deg_off_5"]
let skymapDiv = document.getElementById('skymap');
let theta2Div = document.getElementById('theta2');

let skymap = {
  data: [
    {x: [], y: [], type: 'histogram2d', nbinsx: 50, nbinsy: 50}
  ],
  layout: {
    xaxis: {constrain: 'domain'},
    yaxis: {scaleanchor: 'x'},
  }
}

let theta2 = {
  data: [
    {
      x: [],
      y: [],
      type: 'histogram',
      opacity: 0.4,
      marker: {color: 'green'},
      histfunc: "sum",
      xbins: {start: 0, end: 0.3, size: 0.015}
    },
    {
      x: [],
      y: [],
      opacity: 0.4,
      marker: {color: 'gray'},
      type: 'histogram',
      histfunc: "sum",
      xbins: {start: 0, end: 0.3, size: 0.015}
    }
  ],
  layout: {
    xaxis: {range: [0, 0.3]},
    barmode: "overlay",
  }
}

function getData() {
  $.getJSON(URL, {}, updatePlots);
}

function updatePlots(data) {
  let new_ra = [];
  let new_dec = [];

  let new_theta2_on = [];
  let new_theta2_off = [];
  let new_off_weights = [];
  let new_on_weights = [];

  data.forEach((data) => {
    new_ra.push(data['ra_prediction'] * 15);
    new_dec.push(data['dec_prediction']);

    new_theta2_on.push(Math.pow(data['theta_deg'], 2.0)); 
    new_on_weights.push(1.0); 
    off_keys.forEach((key) => {
      new_theta2_off.push(Math.pow(data[key], 2.0)); 
      new_off_weights.push(0.2);
    })
  }) 


  Plotly.extendTraces(theta2Div, {
    x: [new_theta2_on, new_theta2_off], y: [new_on_weights, new_off_weights]
  }, [0, 1]);
  Plotly.relayout(theta2Div, theta2.layout);

  Plotly.extendTraces(
    skymapDiv, {x: [new_ra], y: [new_dec]}, [0]
  );

  Plotly.relayout(skymapDiv, skymap.layout);
  console.log("Got Data");
}

function setupPlots() {
  Plotly.newPlot(theta2Div, theta2.data);
  Plotly.newPlot(skymapDiv, skymap.data);
}

setupPlots();
getData();

setInterval(getData, 1000);
