fetch('./category-brands.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text, d3.autoType))
    .then(data => {
        const instance = barChartRace(
            data,
            '#container',
            //{}
        );
        //instance.init(data);
    });
