export default function x(settings) {
    return d3.scaleLinear([0, 1], [settings.margin.left, settings.width - settings.margin.right]);
}
