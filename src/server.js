import log from '@/log'
import config from '@/../app-config'
import firebase from 'firebase'

firebase.initializeApp(config.firebase)
const linksDb = firebase.database().ref().child('links')

const createLink = id => `${document.location.origin}/file/${id}`

const share = (peerId, id, type = 'file') => {
  return new Promise((resolve, reject) => {
    const link = { peerId, id, type }
    linksDb.child(id).set(link)
    log(`[storage] the link is stored`, link)
    const url = createLink(id)
    resolve(url)
  })
}

const find = id => {
  return new Promise((resolve, reject) => {
    linksDb.child(id).on('value', snapshot => {
      const link = snapshot.val()
      if (link) resolve(link)
      else reject(new Error(`${id} not found in db`))
    })
  })
}

const server = { share, find }

export default server
