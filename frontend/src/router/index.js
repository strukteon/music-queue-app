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
    component: () => import("@/views/CreateRoomPage")
  },
  {
    path: "/room",
    name: "RoomPage",
    component: () => import("@/views/RoomPage")
  },
  {
    path: "/dj-test-screen",
    component: () => import("@/views/RoomDjScreen")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
