const download = (url, filename) => {
  const a = document.createElement('a')

  a.style = 'display: none'
  a.href = url
  a.download = filename

  document.body.appendChild(a)
  a.click()
  console.log(a)
  a.remove()
}

export default download
