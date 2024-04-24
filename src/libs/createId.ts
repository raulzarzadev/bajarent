const createId = () =>
  `${(new Date().getTime() - 10000).toFixed(0)}${Math.random()
    .toString(36)
    .substring(7)}`

export default createId
