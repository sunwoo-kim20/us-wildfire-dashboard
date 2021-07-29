// scatter map

d3.csv('../data/bigfire.csv', function(err, rows){
    function filter_and_unpack(rows, key, year) {
      return rows.filter(row => row['FIRE_YEAR'] == year).map(row => row[key])
      }

    var frames = []
    var slider_steps = []

    var n = 4;
    var num = 2011;
    for (var i = 0; i <= n; i++) {
      var logsize = filter_and_unpack(rows, 'LOG_FIRE_SIZE', num)
      var cause = filter_and_unpack(rows, 'STAT_CAUSE_DESCR', num)
      var lon = filter_and_unpack(rows, 'LONGITUDE', num)
      var lat = filter_and_unpack(rows, 'LATITUDE', num)
      var size = filter_and_unpack(rows, 'FIRE_SIZE', num)
      frames[i] = {data: [{logsize: logsize, size: size, lon: lon, lat: lat, texts: cause}], name: num}
      // console.log(frames[0].data[0].size)
      slider_steps.push ({
          label: num.toString(),
          method: "animate",
          args: [[num], {
              mode: "immediate",
              transition: {duration: 300},
              frame: {duration: 300}
            }
          ]
        })
      num = num + 1
    }

      var data = [{
          type: 'scattergeo',
          mode: 'markers',
          text: frames[0].data[0].size,
          meta: frames[0].data[0].texts,
          lon: frames[0].data[0].lon,
          lat: frames[0].data[0].lat,
          hovertemplate: `<b>Fire Size: %{text} acres </b><br>` +
          `<b>%{meta}</b>`+
          `<extra></extra>`,
          marker: {
            color: frames[0].data[0].logsize,
            colorscale: 'YlOrRd',
            cmin: 2,
            cmax: 14,
            reversescale: true,
            opacity: 1,
            size: 4,
            colorbar:{
              thickness: 10,
              titleside: 'right',
              outlinecolor: 'rgba(68,68,68,0)',
              ticks: 'outside',
              ticklen: 3,
              shoticksuffix: 'last',
              title: ' Fire Size (log2 acres) ',
              dtick: 2
            }
          },
          name: 'Fire'
      }];

      var layout = {
        geo:{
          scope: 'usa',
          showland: true,
          landcolor: 'rgb(212,212,212)',
          subunitcolor: 'rgb(255,255,255)',
          countrycolor: 'rgb(255,255,255)',
          showlakes: true,
          lakecolor: 'rgb(255,255,255)',
          showsubunits: true,
          showcountries: true,
          resolution: 50,
          projection: {type: 'albers usa'}
        },
        title: 'US Fire Size from 2011 to 2015',
        width: 1000,
        height: 750,
        zoom: 20,
        updatemenus: [{
          x: 0.1,
          y: 0,
          yanchor: "top",
          xanchor: "right",
          showactive: false,
          direction: "left",
          type: "buttons",
          pad: {"t": 87, "r": 10},
          buttons: [{
            method: "animate",
            args: [null, {
              fromcurrent: true,
              transition: {
                duration: 200,
              },
              frame: {
                duration: 500
              }
            }],
            label: "Play"
          }, {
            method: "animate",
            args: [
              [null],
              {
                mode: "immediate",
                transition: {
                  duration: 0
                },
                frame: {
                  duration: 0
                }
              }
            ],
            label: "Pause"
          }]
        }],
        sliders: [{
          active: 0,
          steps: slider_steps,
          x: 0.1,
          len: 0.9,
          xanchor: "left",
          y: 0,
          yanchor: "top",
          pad: {t: 50, b: 10},
          currentvalue: {
            visible: true,
            prefix: "Year:",
            xanchor: "right",
            font: {
              size: 20,
              color: "#666"
            }
          },
          transition: {
            duration: 300,
            easing: "cubic-in-out"
          }
        }]
      };

      Plotly.newPlot('chart4', data, layout).then(function() {
      Plotly.addFrames('chart4', frames);
    });
  })
