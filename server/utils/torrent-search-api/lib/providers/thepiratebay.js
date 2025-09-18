// const util = require('util');
// const request = util.promisify(require('request'));
// const TorrentProvider = require('../TorrentProvider');
// const { humanizeSize } = require('../utils/helpers');
// const { int } = require('../utils/filters');
import util from 'util'
import requestModule from 'request'
import TorrentProvider from '../TorrentProvider.js'
import { humanizeSize } from '../utils/helpers.js'
import { int } from '../utils/filters.js'

const request = util.promisify(requestModule)

export default class ThePirateBay extends TorrentProvider {
  constructor() {
    super({
      name: 'ThePirateBay',
      baseUrl: 'https://apibay.org',
      searchUrl: '/q.php?q={query}&cat={cat}',
      categories: {
        All: '',
        Audio: '100',
        Video: '200',
        Applications: '300',
        Games: '400',
        Porn: '500',
        Other: '600',
        Top100: 'url:/top/all'
      },
      defaultCategory: 'All',
      resultsPerPageCount: 100
    });
  }

  formatMagnet(infoHash, name) {
    const trackers = [
      'udp://tracker.coppersurfer.tk:6969/announce',
      'udp://9.rarbg.to:2920/announce',
      'udp://tracker.opentrackr.org:1337',
      'udp://tracker.internetwarriors.net:1337/announce',
      'udp://tracker.leechers-paradise.org:6969/announce',
      'udp://tracker.pirateparty.gr:6969/announce',
      'udp://tracker.cyberia.is:6969/announce',
      'http://p4p.arenabg.com:1337/announce',
      'udp://47.ip-51-68-199.eu:6969/announce',
      'udp://9.rarbg.me:2780/announce',
      'udp://9.rarbg.to:2710/announce',
      'udp://9.rarbg.to:2730/announce',
      'udp://open.stealth.si:80/announce',
      'udp://opentracker.i2p.rocks:6969/announce',
      'udp://tracker.dler.org:6969/announce',
      'udp://tracker.openbittorrent.com:6969/announce',
      'udp://tracker.tiny-vps.com:6969/announce',
      'udp://tracker.torrent.eu.org:451/announce'
    ];
    const trackersQueryString = `&tr=${trackers.map(encodeURIComponent).join('&tr=')}`;
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}${trackersQueryString}`;
  }

  async search(query, category) {
    const url = this.getUrl(category, query);
    if (url === null) {
      return [];
    }
    const response = await request({ url, json: true });

    console.log('body', response);
    
    return response.body.map(this.formatSearchResult.bind(this));
  }

  formatSearchResult(result) {
    return {
      provider: this.name,
      id: result.id,
      title: result.name,
      time: new Date((int(result.added) * 1000)).toUTCString(),
      seeds: int(result.seeders),
      peers: int(result.leechers),
      size: humanizeSize(result.size),
      magnet: this.formatMagnet(result.info_hash, result.name),
      numFiles: int(result.num_files),
      status: result.status,
      category: result.category,
      imdb: result.imdb
    };
  }


  async getTop100() {
    const response = await request({ url: 'https://apibay.org/precompiled/data_top100_all.json', json: true });
    return response.body.map(this.formatSearchResult.bind(this));
  }


  async getTorrentDetails(torrent) {
    if(torrent && torrent.id) {
      const url = `${this.baseUrl}/t.php?id=${torrent.id}`;
      const response = await request({ url, json: true });
      return response.body;
    }
    throw new Error('Missing torrent id');
  }

  downloadTorrent() {
    throw new Error('Not implemented');
  }
}

