//import './util/polyfills';
//import './util/moveTo';
//import configuration from './configuration/index';

//import layout from './layout';
//import styles from './styles';
import dataManipulation from './dataManipulation';
import createChart from './chart';

export default function barChartRace(
    data,
    element = 'body',
    settings = {
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
        duration: 250,
    }
) {
    //layout(element);
    //styles();

    settings.height = settings.margin.top + settings.n_bars*settings.bar_height + settings.margin.bottom;
    dataManipulation(data, settings);
    console.log(data);
    const chart = createChart(data, element, settings);

    return chart;
}
