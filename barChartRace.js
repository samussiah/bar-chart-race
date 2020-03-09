(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.barChartRace = factory());
}(this, (function () { 'use strict';

    function rank(names, value, n) {
        var data = Array.from(names, function (name) {
            return { name: name, value: value(name) };
        });
        data.sort(function (a, b) {
            return d3.descending(a.value, b.value);
        });
        for (var i = 0; i < data.length; ++i) {
            data[i].rank = Math.min(n, i);
        }return data;
    }

    var slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    function dataManipulation(data, settings) {
        // define set with ordinal variable
        data.names = new Set(data.map(function (d) {
            return d[settings.ordinal_var];
        }));

        // define set with date variable and with ordinal variable
        data.datevalues = Array.from(d3.rollup(data, function (_ref) {
            var _ref2 = slicedToArray(_ref, 1),
                d = _ref2[0];

            return d.value;
        }, function (d) {
            return +d.date;
        }, function (d) {
            return d.name;
        })).map(function (_ref3) {
            var _ref4 = slicedToArray(_ref3, 2),
                date = _ref4[0],
                data = _ref4[1];

            return [new Date(date), data];
        }).sort(function (_ref5, _ref6) {
            var _ref8 = slicedToArray(_ref5, 1),
                a = _ref8[0];

            var _ref7 = slicedToArray(_ref6, 1),
                b = _ref7[0];

            return d3.ascending(a, b);
        });

        // define keyframes (?)
        data.keyframes = [];

        var ka = void 0,
            a = void 0,
            kb = void 0,
            b = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = d3.pairs(data.datevalues)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref9 = _step.value;

                var _ref16 = slicedToArray(_ref9, 2),
                    _ref16$ = slicedToArray(_ref16[0], 2),
                    ka = _ref16$[0],
                    a = _ref16$[1],
                    _ref16$2 = slicedToArray(_ref16[1], 2),
                    kb = _ref16$2[0],
                    b = _ref16$2[1];

                var _loop = function _loop(i) {
                    var t = i / settings.n_keyframes;
                    data.keyframes.push([new Date(ka * (1 - t) + kb * t), rank(data.names, function (name) {
                        return (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t;
                    }, settings.n_bars)]);
                };

                for (var i = 0; i < settings.n_keyframes; ++i) {
                    _loop(i);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        data.keyframes.push([new Date(kb), rank(data.names, function (name) {
            return b.get(name) || 0;
        }, settings.n_bars)]);
        console.log(data.keyframes);
        data.nameframes = d3.groups(data.keyframes.flatMap(function (_ref10) {
            var _ref11 = slicedToArray(_ref10, 2),
                data = _ref11[1];

            return data;
        }), function (d) {
            return d.name;
        });
        console.log(data.nameframes);
        data.prev = new Map(data.nameframes.flatMap(function (_ref12) {
            var _ref13 = slicedToArray(_ref12, 2),
                data = _ref13[1];

            return d3.pairs(data, function (a, b) {
                return [b, a];
            });
        }));
        console.log(data.prev);
        data.next = new Map(data.nameframes.flatMap(function (_ref14) {
            var _ref15 = slicedToArray(_ref14, 2),
                data = _ref15[1];

            return d3.pairs(data);
        }));
    }

    function x$1(settings) {
        return d3.scaleLinear([0, 1], [settings.margin.left, settings.width - settings.margin.right]);
    }

    function y$1(settings) {
        return d3.scaleBand().domain(d3.range(settings.n_bars + 1)).rangeRound([settings.margin.top, settings.margin.top + settings.bar_size * (settings.n_bars + 1 + 0.1)]).padding(0.1);
    }

    function color(data) {
        var scale = d3.scaleOrdinal(d3.schemeTableau10);

        if (data.some(function (d) {
            return d.category !== undefined;
        })) {
            var categoryByName = new Map(data.map(function (d) {
                return [d.name, d.category];
            }));
            scale.domain(Array.from(categoryByName.values()));

            return function (d) {
                return scale(categoryByName.get(d.name));
            };
        }

        return function (d) {
            return scale(d.name);
        };
    }

    function bars(svg, settings, data) {
      var xScale = x$1(settings);
      var yScale = y$1(settings);
      var colorScale = color(data);

      var bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect");
      console.log(data.prev);
      return function (_ref, transition) {
        var _ref2 = slicedToArray(_ref, 2),
            date = _ref2[0],
            data = _ref2[1];

        return bar = bar.data(data.slice(0, settings.n_bars), function (d) {
          return d.name;
        }).join(function (enter) {
          return enter.append("rect").attr("fill", colorScale).attr("height", yScale.bandwidth()).attr("x", xScale(0)).attr("y", function (d) {
            return yScale((data.prev.get(d) || d).rank);
          }).attr("width", function (d) {
            return xScale((data.prev.get(d) || d).value) - xScale(0);
          });
        }, function (update) {
          return update;
        }, function (exit) {
          return exit.transition(transition).remove().attr("y", function (d) {
            return yScale((next.get(d) || d).rank);
          }).attr("width", function (d) {
            return xScale((next.get(d) || d).value) - xScale(0);
          });
        }).call(function (bar) {
          return bar.transition(transition).attr("y", function (d) {
            return yScale(d.rank);
          }).attr("width", function (d) {
            return xScale(d.value) - xScale(0);
          });
        });
      };
    }

    function axis(svg, settings) {
        var xScale = x$1(settings);
        var yScale = y$1(settings);
        var g = svg.append("g").attr("transform", 'translate(0,' + settings.margin.top + ')');

        var axis = d3.axisTop(xScale).ticks(settings.width / 160).tickSizeOuter(0).tickSizeInner(-settings.bar_size * (settings.n_bars + yScale.padding()));

        return function (_, transition) {
            g.transition(transition).call(axis);
            g.select(".tick:first-of-type text").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
            g.select(".domain").remove();
        };
    }

    function labels(svg) {
      var label = svg.append("g").style("font", "bold 12px var(--sans-serif)").style("font-variant-numeric", "tabular-nums").attr("text-anchor", "end").selectAll("text");

      return function (_ref, transition) {
        var _ref2 = slicedToArray(_ref, 2),
            date = _ref2[0],
            data = _ref2[1];

        return label = label.data(data.slice(0, n), function (d) {
          return d.name;
        }).join(function (enter) {
          return enter.append("text").attr("transform", function (d) {
            return "translate(" + x((prev.get(d) || d).value) + "," + y((prev.get(d) || d).rank) + ")";
          }).attr("y", y.bandwidth() / 2).attr("x", -6).attr("dy", "-0.25em").text(function (d) {
            return d.name;
          }).call(function (text) {
            return text.append("tspan").attr("fill-opacity", 0.7).attr("font-weight", "normal").attr("x", -6).attr("dy", "1.15em");
          });
        }, function (update) {
          return update;
        }, function (exit) {
          return exit.transition(transition).remove().attr("transform", function (d) {
            return "translate(" + x((next.get(d) || d).value) + "," + y((next.get(d) || d).rank) + ")";
          }).call(function (g) {
            return g.select("tspan").tween("text", function (d) {
              return textTween(d.value, (next.get(d) || d).value);
            });
          });
        }).call(function (bar) {
          return bar.transition(transition).attr("transform", function (d) {
            return "translate(" + x(d.value) + "," + y(d.rank) + ")";
          }).call(function (g) {
            return g.select("tspan").tween("text", function (d) {
              return textTween((prev.get(d) || d).value, d.value);
            });
          });
        });
      };
    }

    function ticker(svg, settings, keyframes) {
        var formatDate = d3.utcFormat('%Y');
        var now = svg.append("text").style("font", "bold " + settings.bar_size + "px var(--sans-serif)").style("font-variant-numeric", "tabular-nums").attr("text-anchor", "end").attr("x", settings.width - 6).attr("y", settings.margin.top + settings.bar_size * (settings.n_bars - 0.45)).attr("dy", "0.32em").text(formatDate(keyframes[0][0]));

        return function (_ref, transition) {
            var _ref2 = slicedToArray(_ref, 1),
                date = _ref2[0];

            transition.end().then(function () {
                return now.text(formatDate(date));
            });
        };
    }

    //import y from './chart/y';

    function chart(data, element, settings) {
        var svg = d3.create("svg").attr("viewBox", [0, 0, settings.width, settings.height]);

        var updateBars = bars(svg, settings, data);
        var updateAxis = axis(svg, settings);
        var updateLabels = labels(svg);
        var updateTicker = ticker(svg, settings, data.keyframes);

        //yield svg.node();
        var xScale = x$1(settings);
        //const yScale = y(settings);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = data.keyframes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var keyframe = _step.value;

                var transition = svg.transition().duration(settings.duration).ease(d3.easeLinear);

                // Extract the top bar’s value.
                xScale.domain([0, keyframe[1][0].value]);

                updateAxis(keyframe, transition);
                updateBars(keyframe, transition);
                updateLabels(keyframe, transition);
                updateTicker(keyframe, transition);

                invalidation.then(function () {
                    return svg.interrupt();
                });
                //await transition.end();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return {
            svg: svg,
            updateBars: updateBars,
            updateAxis: updateAxis,
            updateLabels: updateLabels,
            updateTicker: updateTicker
        };
    }

    //import './util/polyfills';

    function barChartRace(data) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
        var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
            ordinal_var: 'name',
            linear_var: 'value',
            time_var: 'date',
            color_var: 'category',
            n_bars: 12,
            n_keyframes: 10,
            chart_direction: 'horizontal',
            width: 1000,
            margin: {
                top: 16,
                right: 6,
                bottom: 6,
                left: 0
            },
            bar_height: 50,
            duration: 250
        };

        //layout(element);
        //styles();

        settings.height = settings.margin.top + settings.n_bars * settings.bar_height + settings.margin.bottom;
        dataManipulation(data, settings);
        console.log(data);
        var chart$1 = chart(data, element, settings);

        return chart$1;
    }

    return barChartRace;

})));
