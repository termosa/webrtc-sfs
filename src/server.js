import log from '@/log'
import config from '@/../app-config'

const { serverKey } = config.localStorage

const loadLinks = () => {
  const links = localStorage.getItem(serverKey)
  return links ? JSON.parse(links) : []
}
const storeLinks = links => localStorage.setItem(serverKey, JSON.stringify(links))

const matchLink = (link, filter) => {
  return !Object.keys(filter).find(prop => {
    return filter[prop] !== link[prop]
  })
}

const storage = {
  add: link => {
    const links = loadLinks()
    storeLinks(links.concat(link))
    log('[storage] the link is stored', link)
    return true
  },
  remove (filter) {
    const links = loadLinks()
    const linkToRemove = links.find(link => matchLink(link, filter))
    if (linkToRemove) {
      log('[storage] the link is removed', linkToRemove)
      return true
    } else {
      log('[storage] no link to remove', filter)
      return false
    }
  },
  find (filter = {}) {
    return loadLinks().filter(link => matchLink(link, filter))
  }
}

const generateTimeout = () => Math.random() * 1500 + 500
const createLink = id => `${document.location.origin}/file/${id}`

const share = (peerId, id, type = 'file') => {
  return new Promise((resolve, reject) => {
    const link = createLink(id)
    storage.add({ peerId, id, type })
    setTimeout(() => resolve(link), generateTimeout())
  })
}

const find = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const link = storage.find({ id })
      if (link) resolve(link)
      else reject(new Error('not found'))
    }, generateTimeout())
  })
}

const server = { share, find }

export default server
