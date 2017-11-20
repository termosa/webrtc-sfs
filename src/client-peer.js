import log from '@/log'
import config from '@/../app-config'
import Peer from 'peerjs'

export const createPeer = remotePeerId => {
  const listeners = {}
  const on = (event, callback) => {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(callback)
  }
  const emit = (event, data) => {
    if (!listeners[event]) return
    listeners[event].forEach(callback => callback(data))
  }

  return new Promise((resolve, reject) => {
    const peer = new Peer({ key: config.peerjs.key })

    peer.on('open', id => {
      log(`peer initialized with id: ${id}`)

      const connection = peer.connect(remotePeerId)

      connection.on('data', data => emit('data', data))

      connection.on('open', () => {
        log(`connected to remote peer ${remotePeerId}`)
        resolve({ id, peer, connection, on })
      })

      connection.on('error', error => {
        log.error('connection problem', error)
        reject(error)
      })
    })

    peer.on('error', error => {
      log.error('peer problem', error)
      reject(error)
    })
  })
}
