import bars from './chart/bars';
import axis from './chart/axis';
import labels from './chart/labels';
import ticker from './chart/ticker';

import x from './chart/x';
//import y from './chart/y';

export default function chart(data, element, settings) {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, settings.width, settings.height]);

    const updateBars = bars(svg, settings, data);
    const updateAxis = axis(svg, settings);
    const updateLabels = labels(svg, settings);
    const updateTicker = ticker(svg, settings, data.keyframes);

    //yield svg.node();
    const xScale = x(settings);
    //const yScale = y(settings);

    for (const keyframe of data.keyframes) {
        const transition = svg.transition()
            .duration(settings.duration)
            .ease(d3.easeLinear);

        // Extract the top bar’s value.
        xScale.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition, );
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);

        invalidation.then(() => svg.interrupt());
        //await transition.end();
    }

    return {
        svg,
        updateBars,
        updateAxis,
        updateLabels,
        updateTicker
    };
}
