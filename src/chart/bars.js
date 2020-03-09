import x from './x';
import y from './y';
import color from './color';

export default function bars(svg, settings, data) {
    const xScale = x(settings);
    const yScale = y(settings);
    const colorScale = color(data);

  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");
console.log(data.prev);
  return ([date, data], transition) => bar = bar
    .data(data.slice(0, settings.n_bars), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", colorScale)
        .attr("height", yScale.bandwidth())
        .attr("x", xScale(0))
        .attr("y", d => yScale((data.prev.get(d) || d).rank))
        .attr("width", d => xScale((data.prev.get(d) || d).value) - xScale(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", d => yScale((next.get(d) || d).rank))
        .attr("width", d => xScale((next.get(d) || d).value) - xScale(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => yScale(d.rank))
      .attr("width", d => xScale(d.value) - xScale(0)));
}
