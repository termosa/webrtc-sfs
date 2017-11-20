import log from '@/log'
import config from '@/../app-config'
import Peer from 'peerjs'

export const createPeer = () => {
  let connections = []

  const listeners = {}
  const on = (event, callback) => {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(callback)
  }
  const emit = (event, connection, data) => {
    if (!listeners[event]) return
    listeners[event].forEach(callback => callback(connection, data))
  }

  const addConnection = connection => {
    log(`new peer connected: ${connection.id}`)

    connections.push(connection)

    connection.on('data', data => emit('data', connection, data))

    connection.on('close', () => {
      log(`connection ${connection.id} leave us`)
      connections = connections.filter(conn => conn !== connection)
    })
  }

  return new Promise((resolve, reject) => {
    const peer = new Peer({ key: config.peerjs.key })

    peer.on('open', id => {
      log(`peer initialized with id: ${id}`)
      resolve({ id, peer, on, connections })
    })

    peer.on('connection', addConnection)

    peer.on('error', error => {
      log.error('peer problem', error)
      reject(error)
    })
  })
}
