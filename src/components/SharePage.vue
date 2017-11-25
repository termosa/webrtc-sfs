<template>
  <div class="share-page" @drop.prevent="onDrop" @dragover.prevent :class="{ failed, loading }">
    <div class="content">
      <div class="placeholder" v-if="!files.length">
        <p>
          drop files here,<br>or
          <label>
            choose them
            <input type="file" name="files" multiple @change="onSelectFile">
          </label>
        </p>
      </div>
      <div class="list" v-if="files.length">
        <ul>
          <li v-for="file in files" @click="copyLink(file)" tabindex="0">
            {{ file.name }}
            ({{ file.size | size }})
          </li>
        </ul>
        <p class="tip">click the file name to copy the link</p>
      </div>
    </div>
  </div>
</template>

<script>
import { createPeer } from '@/host-peer'
import log from '@/log'
import copy from '@/copy'
import qinu from 'qinu'

const generateId = () => qinu({ length: 32 })

const createLink = (peerId, fileId) => {
  const origin = location.hash
    ? location.href.slice(0, 0 - location.hash.length)
    : location.href
  return `${origin}#/file/${peerId}/${fileId}`
}

export default {
  name: 'SharePage',
  data: () => ({
    peer: null,
    failed: false,
    loading: true,
    files: window.files || (window.files = []) // to keep files while Vue is updating
  }),
  methods: {
    onDrop ({ dataTransfer: { files } }) {
      for (let i = files.length; i--;) {
        this.addFile(files[i])
      }
    },
    onSelectFile ({ target: { files } }) {
      for (let i = files.length; i--;) {
        this.addFile(files[i])
      }
    },
    addFile (file) {
      const newFile = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }
      this.files.push(newFile)

      if (this.peer) this.shareFile(newFile)
    },
    shareFile (file) {
      file.link = createLink(this.peer.id, file.id)
      log(`link for ${file.name}: ${file.link}`)
    },
    sendFile (connection, file) {
      const name = file.name
      const type = file.type
      const blob = new Blob([file.file], { type })
      connection.send({
        method: 'sendFile',
        file: { blob, name, type }
      })
    },
    copyLink (file) {
      if (file.link) {
        log(`copying link for ${file.name}: ${file.link}`)
        copy(file.link)
      } else {
        log.error(`link is not ready for ${file.name}`)
      }
    },
    receiveData (connection, data) {
      switch (data.method) {
        case 'requestFile':
          log(`requested ${data.fileId} file`)
          const file = this.files.find(file => file.id === data.fileId)
          if (file) {
            log(`sending file ${file.id} (${file.name})`)
            this.sendFile(connection, file)
          } else {
            log.error(`not exists file is requested ${data.fileId}`)
            connection.send({
              method: 'error',
              error: 'no matching file found',
              fileId: data.fileId
            })
          }
          break
        default:
          log.error(`unknown event ${data.method} is received`, data)
      }
    }
  },
  filters: {
    size (size) {
      return Math.round(size / 1024 / 1024 * 100) / 100 + 'Mb'
    }
  },
  mounted () {
    log('creating new peer')
    createPeer().then(
      peer => {
        this.loading = false
        this.peer = peer
        this.peer.on('data', this.receiveData.bind(this))
        this.files.forEach(file => this.shareFile(file))
      },
      error => {
        this.failed = true
        log.error(error)
      }
    )
  }
}
</script>

<style scoped>
  .share-page {
    display: flex;
    flex-direction: column;
  }

  .share-page.loading {
    background-color: #eaeaea;
  }

  .share-page.loading:before {
    content: 'loading...';
    display: block;
    margin-top: 1em;
  }

  .share-page.failed {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffe4e4;
    color: #ec9494;
    font-size: 3em;
  }
  .share-page.failed * {
    display: none;
  }
  .share-page.failed:after {
    content: 'peer connection has failed';
  }

  .content {
    flex: 1;
    margin: 1em;
    border: 5px dashed #aeb9c2;
    border-radius: 2em;
    padding: 2em;
  }

  .placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    color: #aeb9c2;
  }

  .placeholder label {
    text-decoration: underline;
    cursor: pointer;
  }

  .placeholder label:hover {
    text-decoration: none;
  }

  .placeholder input {
    display: none;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    cursor: grab;
    margin: .5em;
  }

  li:active {
    cursor: grabbing;
  }

  .share-page.loading li,
  .share-page.loading li:active {
    cursor: text;
    outline: none;
  }

  .tip {
    color: #888;
    margin-top: 1em;
  }
</style>
