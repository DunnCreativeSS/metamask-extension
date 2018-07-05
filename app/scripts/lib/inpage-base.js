cleanContextForImports()
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const MetamaskInpageProvider = require('./inpage-provider.js')
restoreContextAfterImports()

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

// setup background connection
var metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

// compose the inpage provider
window.ETHEREUM_PROVIDER = new MetamaskInpageProvider(metamaskStream)
log.debug('MetaMask - exposed Ethereum provider API')

// make sure we aren't affected by overlapping namespaces
var __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.')
  }
}