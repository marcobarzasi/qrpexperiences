import {createRouter, createWebHistory} from 'vue-router'
import Wizard from "./components/activity/wizard/Wizard.vue";
import Activity from "./components/activity/Activity.vue";
import MyActivity from "./components/profile/Activity.vue";
import Home from "./components/home/Home.vue";
import Login from "./components/login/Login.vue";
import Users from "./components/users/Users.vue";
import Privacy from "./components/Privacy.vue";
import Termini from "./components/Termini.vue";
import Settings from "./components/profile/Settings.vue";
import Bookmark from "./components/profile/Bookmark.vue";
import MyPage from "./components/profile/MyPage.vue";
import GuideLine from "./components/GuideLine.vue";
import Rules from "./components/Rules.vue";
import ListActivity from "./components/ListActivity.vue";
import Awards from "./components/profile/Awards.vue";
import Statistics from "./components/profile/Statistics.vue";
import Translation from "./locales/Translation.vue";
import Print from "./components/activity/Print.vue";
import MailForms from "./components/manager/MailForms.vue";
import ResetPassword from "./components/login/ResetPassword.vue";


const routes = [
    {name: 'home', path: '/home', component: Home},
    {name: 'profile', path: '/profile', component: Home, meta: {requiresAuth: true}},
    {name: 'myStat', path: '/profile', component: Home, meta: {requiresAuth: true}},
    {name: 'myActivity', path: '/myActivity', component: MyActivity, meta: {requiresAuth: true}},
    {name: 'myAwards', path: '/myAwards', component: Awards, meta: {requiresAuth: true}},
    {name: 'myStatistics', path: '/myStatistics', component: Statistics, meta: {requiresAuth: true}},
    {name: 'myBookmark', path: '/myBookmark', component: Bookmark, meta: {requiresAuth: true}},
    {name: 'myPage', path: '/myPage/:id?', component: MyPage, props: true},
    {name:'logout', path: '/profile', component: Home},
    {name: 'login', path: '/login/:msg?', component: Login, props: true},
    {name: 'edit', path: '/edit/:uid?', component: Wizard, props: true, meta: {requiresAuth: true}},
    {name: 'activity', path: '/activity/:uid?', component: Activity, props: true},
    {name: 'print', path: '/print/:uid?', component: Print, props: true},
    {name: 'users', path: '/users', component: Users, meta: {requiresAuth: true}},
    {name: 'privacy', path: '/privacy', component: Privacy},
    {name: 'termini', path: '/terms', component: Termini},
    {name: 'settings', path: '/settings', component: Settings, meta: {requiresAuth: true}},
    {name: 'rules', path: '/rules/', component: Rules},
    {name: 'guideline', path: '/guideline/', component: GuideLine},
    {name: 'list', path: '/list/:q', component: ListActivity, props: true},
    {name: 'translations', path: '/translations/', component: Translation},
    {name: 'emails', path: '/emails/', component: MailForms},
    {path: '/resetPassword/:code', component: ResetPassword, props: true},
    {path: '/', component: Home},


]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return {top: 0}
    }
})

router.beforeEach((to, _, next) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile && (to.path === '/' || to.path === '/home')) {
        next({path: '/mobile/home'});
    } else if (isMobile && (to.path.startsWith('/activity'))) {
        next({path: '/mobile' + to.path});
    } else if (isMobile && (to.path.startsWith('/edit'))) {
        next({path: '/mobile' + to.path});
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
        const isAuthenticated = !!localStorage.getItem('authToken');

        if (!isAuthenticated) {
            next({path: '/login'});
        } else {
            next();
        }
    } else {
        next();
    }
});