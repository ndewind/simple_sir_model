
let i0 = 0.001;
let ifr = 0.2;
let transRate = 0.1;
let recovDay = 20;
let ndays = 365;
let inter = 10;
let sirdt = calculate_SIRD(i0, ifr, transRate, recovDay, ndays, inter)

var trace1 = {
  x: sirdt[4],
  y: sirdt[0],
  type: 'lines',
  name: 'Susceptible'
};

var trace2 = {
  x: sirdt[4],
  y: sirdt[1],
  type: 'scatter',
  name: 'Infectious'
};

var trace3 = {
  x: sirdt[4],
  y: sirdt[2],
  type: 'scatter',
  name: 'Recovered'
};

var trace4 = {
  x: sirdt[4],
  y: sirdt[3],
  type: 'scatter',
  name: 'Dead'
};

var data = [trace1, trace2, trace3, trace4];

var layout = {
  //width: '50%',
  //height: '50%',
  //max-width: 35em,
  title: 'SIRD Model',
  xaxis: {
    title: 'Time (days)'
  },
  yaxis: {
    title: 'Proportion of Pop.'
  }
};


var config = {
	responsive: true
	};

Plotly.newPlot('myDiv', data, layout, config);

/*
$(document).ready(function(){
  $(window).resize(function(){
	Plotly.newPlot('myDiv', data, layout);
	console.log('resize detected')
  });
});
*/


function calculate_SIRD(i0, ifr, transRate, recovDay, ndays, inter) {
  let t = [0] // time
  let i = [i0] // infected
  let s = [1 - i0] // suseptible
  let r = [0] // dead + recovered
  let r2 = [r[0]-r[0]*ifr];  // recovered
  let d = [r[0]*ifr]; // dead
  let trans = transRate / inter
  let recov = 1 / recovDay / inter // recovery + death rate. daily rate of moving from infected to removed
  let iters = ndays * inter // number of iterations
  

  let Sp
  let Ip
  let Rp
  let kt
  for (kt = 0; kt < iters; kt++) {
    //console.log(kt)
    Sp = -trans * s[kt] * i[kt];
    Ip = trans * s[kt] * i[kt] - recov * i[kt];
    Rp = recov * i[kt];

    s.push(s[kt] + Sp);
    i.push(i[kt] + Ip);
    r.push(r[kt] + Rp);
    
	d.push(r[kt+1] * ifr);
    r2.push(r[kt+1] - r[kt+1] * ifr)
	
    t.push(t[kt] + 1 / inter)
  }

  //let d = 100
  let output = [s, i, r2, d, t]
  return output
}
