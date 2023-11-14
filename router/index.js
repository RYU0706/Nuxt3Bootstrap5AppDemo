import Vue from 'vue';
import Router from 'vue-router';
import OthelloBoard from '@/components/OthelloBoard';
import GameOver from '@/components/GameOver';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OthelloBoard',
      component: OthelloBoard
    },
    {
      path: '/game-over',
      name: 'GameOver',
      component: GameOver,
      props: true 
    }
  ]
});
