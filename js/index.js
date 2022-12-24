$(function() {
    const property = 'hc-key';

    const visited_countries = [ // subtract 4
        'in', // India
        'ae', // UAE
        'ch', // Switzerland
        'il', // Israel
        'fr', // France
        'be', // Belgium
        'nl', // Netherlands
        'it', // Italy
        'va', // Vatican City
        'my', // Malaysia
        'us', // US
        'ca', // Canada
        'za', // South Africa
        'na', // Namibia
        'ke', // Kenya
        'tz', // Tanzania
        'tr', // Turkey
        'ma', // Morocco
        'eg', // Egypt
        'mx', // Mexico
        'cu', // Cuba
        'pe', // Peru
        'ar', // Argentina
        'cl', // Chile
        'gb', // United Kingdom
        'hr', // Croatia
        'nz', // New Zealand
        'pt', // Portugal
        'jo', // Jordan
        'hu', // Hungary
        'at', // Austria
        'cz' // Czech Republic
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
        'in-2984'
    ]

    const visited_states_in_us = [
        'us-pa', // Pennsylvania
        'us-ny', // New York
        'us-dc', // DC
        'us-il', // Illinois 
        'us-ma', // Massachusetts
        'us-nj', // New Jersey
        'us-nh', // New Hampshire
        'us-ca', // California
        'us-wa', // Washington
        'us-nv', // Nevada
        'us-az', // Arizona
        'us-ut', // Utah
        'us-md', // Maryland
        'us-nc', // North Carolina
        'us-ga', // Georgia
        'us-fl', // Florida
        'us-tx', // Texas
        'us-la', // Louisiana
        'us-tn', // Tennessee
        'us-or', // Oregon
        'us-co', // Colorado
        'us-hi', // Hawaii
        'us-ak', // Alaska  
        'us-nm', // New Mexico
        'us-wy' // Wyoming
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
