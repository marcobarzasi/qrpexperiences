import {ref} from "vue";

export enum KnobStatus {
    UNKNOW = "0",
    LOADING = "1",
    SHOW = "2",
    REACHED = "3",
    WAITING = "4",

}

export const responsiveOptions = ref([
    {
        breakpoint: '2000px',
        numVisible: 6,
        numScroll: 6
    },
    {
        breakpoint: '1400px',
        numVisible: 5,
        numScroll: 5
    },
    {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 4
    },
    {
        breakpoint: '990px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '770px',
        numVisible: 2,
        numScroll: 2
    }
]);