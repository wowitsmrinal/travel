$(function() {
    const property = 'hc-key';

    const visited_countries = [ // subtract 4
        'in', // India - Lived 22 years
        'ae', // UAE 08 - 1
        'ch', // Switzerland 08 - 2
        'il', // Israel 12 - 2
        'fr', // France 13 - 4
        'be', // Belgium 13 - 1
        'nl', // Netherlands 13 - 2
        'it', // Italy 13 - 4
        'va', // Vatican City 13 - 2
        'my', // Malaysia 13 - 1
        'us', // USA 14 - Lived 11 years
        'ca', // Canada 15 - 3
        'za', // South Africa 17 - 1
        'na', // Namibia 17 - 1
        'ke', // Kenya 17 - 1
        'tz', // Tanzania 17 - 1
        'tr', // Turkey 17 - 2
        'ma', // Morocco 17 - 1
        'eg', // Egypt 17 - 1
        'mx', // Mexico 17 - 2
        'cu', // Cuba 17 - 1
        'pe', // Peru 18 - 1
        'ar', // Argentina 18 - 1
        'cl', // Chile 18 - 1
        'gb', // United Kingdom 19 - 3
        'hr', // Croatia 19 - 1
        'nz', // New Zealand 19 - 1
        'pt', // Portugal 22 - 1
        'jo', // Jordan 22 - 1
        'hu', // Hungary 22 - 1
        'at', // Austria 22 - 1
        'cz', // Czech Republic 22 - 1
        'jp', // Japan 23 - 1
        'es', // Spain 24 - 1
        'np', // Nepal 24 - 1
        'mc' // Monaco 25 - 1
    ]

    const visited_states_in_india = [
        'in-wb',
        'in-jk',
        'in-hr',
        'in-tn',
        'in-ap',
        'in-ka',
        'in-mh',
        'in-or',
        'in-dl',
        'in-hp',
        'in-rj',
        'in-up',
        'in-ut',
        'in-jh',
        'in-ch',
        'in-br',
        'in-sk',
        'in-kl',
        'in-an',
        'in-2984',
        'in-ga'
    ]

    const visited_states_in_us = [
        'us-pa', // Pennsylvania - 2
        'us-ny', // New York - 8
        'us-dc', // DC - 3
        'us-il', // Illinois - 2
        'us-ma', // Massachusetts - Lived 2 years
        'us-nj', // New Jersey - 2
        'us-nh', // New Hampshire - 2
        'us-ca', // California - Lived 9 years
        'us-wa', // Washington - 5
        'us-nv', // Nevada - 2
        'us-az', // Arizona - 2
        'us-ut', // Utah - 2
        'us-md', // Maryland - 1
        'us-nc', // North Carolina - 1
        'us-ga', // Georgia - 2
        'us-fl', // Florida - 2
        'us-tx', // Texas - 2
        'us-la', // Louisiana - 2
        'us-tn', // Tennessee - 2
        'us-or', // Oregon - 3
        'us-co', // Colorado - 4
        'us-hi', // Hawaii - 3
        'us-ak', // Alaska - 1
        'us-nm', // New Mexico - 2
        'us-wy', // Wyoming - 1
        'us-sc' // South Carolina - 2
    ];

    function getDrilldown(data, visited) {
        $.each(data, function(i) {
            this.value = visited.indexOf(this.properties[property]);
        });
        return data;
    }

    // Fetch data
    var world_data = Highcharts.geojson(Highcharts.maps['custom/world']);

    var us_data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']);

    var india_data = Highcharts.geojson(Highcharts.maps['countries/in/custom/in-all-disputed']);

    console.log(india_data);

    // Set drilldown pointers
    $.each(world_data, function(i) {

        if (this.properties[property] == 'us') {
            this.drilldown = getDrilldown(
                us_data,
                visited_states_in_us);
            this.drilldownLabel = 'United States of America';
        } else if (this.properties[property] == 'in') {
            this.drilldown = getDrilldown(
                india_data,
                visited_states_in_india);
            this.drilldownLabel = 'India';
        }

        this.value = visited_countries.indexOf(this.properties[property]);
    });

    // Instanciate the map
    $('#container').highcharts('Map', {
        chart: {
            spacingBottom: 20,
            events: {
                drilldown: function(e) {
                    if (!e.seriesOptions) {
                        var chart = this;
                        var data = e.point.drilldown;
                        var label = e.point.drilldownLabel;

                        chart.addSeriesAsDrilldown(e.point, {
                            name: label,
                            data: data,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            },
                            tooltip: {
                                headerFormat: '',
                                pointFormat: '{point.name}'
                            }
                        });
                    }
                    chart.setTitle(null, { text: label });
                },
                drillup: function() {
                    this.setTitle(null, { text: 'World' });
                }
            }
        },
        title: {
            text: 'Around the world',
        },

        subtitle: {
            text: 'World',
        },

        mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            dataClasses: [{
                from: -100,
                to: 0,
                color: '#E5F5E0',
                name: 'Pending'
            }, {
                from: 0,
                to: 100,
                color: '#31A354',
                name: 'Visited'
            }]
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: '#EEDD66'
                    }
                }
            }
        },

        series: [{
            name: 'World',
            data: world_data,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.name}'
            }
        }],

        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textShadow: '0 0 3px #000000'
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    });
});
