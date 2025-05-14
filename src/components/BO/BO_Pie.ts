export class BO_Pie {
    descriptor = {

        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            //data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['40%', '85%'],
                center: ['50%', '50%'],
                bottom: '50px',
                label: {
                    show: false,
                    fontSize: 14,
                    position: 'center'
                },
                data: [],
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
            },
        ],
    }
}