const getToken = () => {
  const accessToken = localStorage.getItem('ACCESS_TOKEN')
  const refreshToken = localStorage.getItem('REFRESH_TOKEN')
  const tokenExpires = localStorage.getItem('TOKEN_EXPIRES')
  return {
    accessToken,
    refreshToken,
    tokenExpires,
  }
}

const setToken = ({ accessToken, refreshToken, tokenExpires }) => {
  localStorage.setItem('ACCESS_TOKEN', accessToken)
  localStorage.setItem('REFRESH_TOKEN', refreshToken)
  localStorage.setItem('TOKEN_EXPIRES', tokenExpires)
}

const removeToken = () => {
  localStorage.removeItem('ACCESS_TOKEN')
  localStorage.removeItem('REFRESH_TOKEN')
  localStorage.removeItem('TOKEN_EXPIRES')
}

export { getToken, removeToken, setToken }
