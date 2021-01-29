import { request } from '@/plugins/request'

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 通过 username 获取个人信息
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `api/profiles/${username}`
  })
}

// follow User
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

// unfollow User
export const unFollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}