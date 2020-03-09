export default function ticker(svg, settings, keyframes) {
    const formatDate = d3.utcFormat('%Y');
    const now = svg.append("text")
        .style("font", `bold ${settings.bar_size}px var(--sans-serif)`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", settings.width - 6)
        .attr("y", settings.margin.top + settings.bar_size * (settings.n_bars - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]));

    return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)));
    };
}
