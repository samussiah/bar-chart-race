export default function y(settings) {
    return d3.scaleBand()
        .domain(d3.range(settings.n_bars + 1))
        .rangeRound([settings.margin.top, settings.margin.top + settings.bar_size * (settings.n_bars + 1 + 0.1)])
        .padding(0.1);
}
