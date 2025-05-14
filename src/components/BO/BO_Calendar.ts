export class BO_Calendar {
    descriptor = {
        tooltip: {},
        visualMap: {
            min: 0,
            max: 10,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 0,
            inRange: {
                color: ['lightgreen', 'darkgreen'],
                symbolSize: [30, 100]
            }
        },
        calendar: [{
            dayLabel: {
                nameMap: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
                firstDay: 1,
            },
            monthLabel: {
                nameMap: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                firstDay: 1,
            },
            top: 50,
            left: 50,
            right: 30,
            cellSize: ['auto', 20],
            range: '2023',
            itemStyle: {
                borderWidth: 0.5
            },
            //yearLabel: { show: true }
        },
            {
                dayLabel: {
                    nameMap: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
                    firstDay: 1,
                },
                monthLabel: {
                    nameMap: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                    firstDay: 1,
                },
                top: 250,
                left: 50,
                right: 30,
                cellSize: ['auto', 20],
                range: '2024',
                itemStyle: {
                    borderWidth: 0.5
                },
                yearLabel: {show: true}
            }],
        series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: []
        }, {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 1,
            data: []
        }]
    }
}