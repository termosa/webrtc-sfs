<template>
  <div class="file-page" :class="{ failed, loading }">
    <div class="content">
      <p v-if="loading">loading...</p>
      <div v-if="!loading">
        <input v-if="!failed" type="button" @click="downloadFile" value="download file" />
        <p v-if="failed">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import log from '@/log'
import download from '@/download'
import { createPeer } from '@/client-peer'

export default {
  name: 'FilePage',
  data: () => ({
    peer: null,
    loading: true,
    failed: false,
    error: null
  }),
  computed: {
    peerId () {
      return this.$route.params.peer
    },
    fileId () {
      return this.$route.params.file
    }
  },
  methods: {
    downloadFile () {
      log(`request file ${this.fileId}`)
      this.send({ method: 'requestFile', fileId: this.fileId })
    },
    send (data) {
      this.peer.connection.send(data)
    },
    receiveData (data) {
      switch (data.method) {
        case 'sendFile':
          log(`remote server send a file ${data.file.name}`, data)
          const blob = new Blob([data.file.blob], { type: data.file.type })
          const url = URL.createObjectURL(blob)
          download(url, data.file.name)
          URL.revokeObjectURL(url)
          break
        case 'error':
          log.error('remote server send an error', data)
          break
        default:
          log.error(`unknown event ${data.method} is received`, data)
      }
    }
  },
  mounted () {
    createPeer(this.peerId)
      .then(peer => {
        this.peer = peer
        this.peer.on('data', this.receiveData.bind(this))
      })
      .then(() => { this.loading = false })
  }
}
</script>

<style scoped>
  .file-page {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-page.loading {
    background-color: #eaeaea;
  }

  .file-page.failed {
    background-color: #ffe4e4;
    color: #ec9494;
  }
</style>
