import rank from './dataManipulation/rank';

export default function dataManipulation(data, settings) {
    // define set with ordinal variable
    data.names = new Set(data.map(d => d[settings.ordinal_var]));

    // define set with date variable and with ordinal variable
    data.datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a,b));

    // define keyframes (?)
    data.keyframes = [];

    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(data.datevalues)) {
        for (let i = 0; i < settings.n_keyframes; ++i) {
            const t = i / settings.n_keyframes;
            data.keyframes.push([
                new Date(ka * (1 - t) + kb * t),
                rank(
                    data.names,
                    name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t,
                    settings.n_bars
                )
            ]);
        }
    }

    data.keyframes.push([new Date(kb), rank(data.names, name => b.get(name) || 0, settings.n_bars)]);
    console.log(data.keyframes);
    data.nameframes = d3.groups(data.keyframes.flatMap(([, data]) => data), d => d.name);
    console.log(data.nameframes);
    data.prev = new Map(data.nameframes.flatMap(([, data]) => d3.pairs(data, (a,b) => [b,a])));
    console.log(data.prev);
    data.next = new Map(data.nameframes.flatMap(([, data]) => d3.pairs(data)));
}
