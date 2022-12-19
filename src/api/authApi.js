import axiosClient from "./axiosClient"

const authApi = {
  signup: params => {axiosClient.post('user/registration', {params})},
  login: params => axiosClient.post('auth/authenticate', params),
  //verifyToken: () => axiosClient.post('auth/verify-token')
}

export default authApi
