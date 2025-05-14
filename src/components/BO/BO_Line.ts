export class BO_Line {
    descriptor = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'line'
            }
        ]
    }
}