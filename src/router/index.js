import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import("@/views/LandingPage")
  },
  {
    path: "/join",
    name: "JoinRoom",
    component: () => import("@/views/JoinRoom")
  },
  {
    path: "/create-room",
    component: () => import("@/views/RoomDjScreen")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
