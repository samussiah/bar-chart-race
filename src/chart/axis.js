import x from './x';
import y from './y';

export default function axis(svg, settings) {
    const xScale = x(settings);
    const yScale = y(settings);
    const g = svg.append("g")
        .attr("transform", `translate(0,${settings.margin.top})`);

    const axis = d3.axisTop(xScale)
        .ticks(settings.width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-settings.bar_size * (settings.n_bars + yScale.padding()));

    return (_, transition) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
        g.select(".domain").remove();
    };
}
