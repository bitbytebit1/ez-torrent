import _ from 'lodash'

import Dummy from './lib/providers/dummy'
import Eztv from './lib/providers/eztv'
import Iptorrents from './lib/providers/iptorrents'
import Kickasstorrents from './lib/providers/kickasstorrents'
import Leet from './lib/providers/Leet'
import Limetorrents from './lib/providers/limetorrents'
import Rarbg from './lib/providers/rarbg'
import ThePirateBay from './lib/providers/thepiratebay'
import Torrent9 from './lib/providers/torrent9'
import TorrentLeech from './lib/providers/torrentleech'
import TorrentProject from './lib/providers/torrentproject'
import Yggtorrent from './lib/providers/yggtorrent'
import Yts from './lib/providers/yts'

import { silentRejection, uniqueName } from './lib/utils/helpers'

class ProviderManager2 {
  constructor () {
    this.providers = [
      // new Leet(),
      // new Dummy(),
      // new Eztv(),
      // new Iptorrents(),
      // new Kickasstorrents(),
      // new Limetorrents(),
      // new Rarbg(),
      new ThePirateBay(),
      // new Torrent9(),
      // new TorrentLeech(),
      // new TorrentProject(),
      // new Yggtorrent(),
      // new Yts(),
    ]

    this.providers = this.providers.filter(p => !p.requireAuthentification)

    this.providers.forEach(p => p.enableProvider())
  }

  _getActiveProviders (...providerNames) {
    const activeProviders = _.filter(this.providers, 'isActive')
    if (providerNames.length > 0) {
      return activeProviders.filter(p =>
        providerNames.map(m => uniqueName(m)).includes(uniqueName(p.name)),
      )
    }
    return activeProviders
  }

  getTop100 () {
    const selectedProviders = this._getActiveProviders('ThePirateBay')
    if (selectedProviders.length === 0) {
      return Promise.resolve([])
    }
    const top100Promises = selectedProviders.map(p => p.getTop100())
    return Promise.all(top100Promises)
  }

  search (query, category, limit) {
    const selectedProviders = this._getActiveProviders()

    const searchPromises = selectedProviders
      .map(p => p.search(query || '', category, limit))
      .map(p => (selectedProviders.length > 1 ? silentRejection(p) : p))

    return Promise.all(searchPromises)
      .then(results =>
        _(results)
          .flatten()
          .compact()
          .orderBy(
            [({ seeds }) => (Number.isNaN(seeds) ? 0 : seeds), 'title'],
            ['desc', 'desc'],
          )
          .value(),
      )
      .then(results => (limit ? results.slice(0, limit) : results))
  }
}

export const providerManager2 = new ProviderManager2()
