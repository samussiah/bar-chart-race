export default function color(data) {
    const scale = d3.scaleOrdinal(d3.schemeTableau10);

    if (data.some(d => d.category !== undefined)) {
        const categoryByName = new Map(data.map(d => [d.name, d.category]))
        scale.domain(Array.from(categoryByName.values()));

        return d => scale(categoryByName.get(d.name));
    }

    return d => scale(d.name);
}
