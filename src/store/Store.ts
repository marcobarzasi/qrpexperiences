import {defineStore} from 'pinia'
import {BO_User} from "../components/BO/BO_User.ts";


export const useStore = defineStore('store', {

    state: () => ({
        user: new BO_User(),
        lang: 'en',
        printMode: false,
        request: () => {
        },
    }),
    actions: {},
    getters: {}
})