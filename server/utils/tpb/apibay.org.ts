// https:// github.com/codeit-ninja/apibay/tree/master

class TPB_Api {
  private baseUrl: string
  constructor (baseUrl = 'https://apibay.org') {
    this.baseUrl = baseUrl
  }

  /**
   * Search a torrent
   *
   * @param SearchPayload
   * @returns SearchResults
   */
  public async search (params: SearchPayload) {
    return this.request<SearchResults>('/q.php', params)
  }

  /**
   * Get torrent details
   */
  public async details (id: number) {
    return this.request<TorrentDetails>('/t.php', { id })
  }

  /**
   * Get top 100 torrents
   */
  public async top100 (category: CategoryIds | 'all' | 'recent') {
    return (await this.request<TorrentResults>(`/precompiled/data_top100_${category}.json`))
  }

  /**
   * Get last 100 added torrents
  public async recent () {
    return await this.top100('recent')
  }

  /**
   * Get all torrents uploaded by user
   */
  public async byUser (username: string, page = 0) {
    return this.request<SearchResults>('/q.php', { q: `user:${username}:${page}` })
  }

  /**
   * Create a request
   */
  public async request<T>(path: string, params?: object): Promise<T> {
    const response = await $fetch(this.baseUrl + path + (params ? `?${new URLSearchParams(params as any).toString()}` : ''), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.map(this.formatSearchResult.bind(this))
  }

  public formatSearchResult (result: Torrent) {
    return {
      provider: 'tpb',
      id: result.id,
      title: result.name,
      time: new Date(result.added * 1000).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      seeds: int(result.seeders),
      peers: int(result.leechers),
      size: humanizeSize(result.size),
      magnet: this.formatMagnet(result.info_hash, result.name),
      numFiles: int(result.num_files),
      status: result.status,
      category: result.category,
      imdb: result.imdb,
    }
  }

  formatMagnet (infoHash: string, name: string) {
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
      'udp://tracker.torrent.eu.org:451/announce',
    ]
    const trackersQueryString = `&tr=${trackers.map(encodeURIComponent).join('&tr=')}`
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}${trackersQueryString}`
  }
}

export const tpbApi = new TPB_Api()

function humanizeSize (bytes: number) {
  const thresh = 1000
  if (bytes < thresh) {
    return `${bytes} B`
  }
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (bytes >= thresh)
  return `${bytes.toFixed(1)} ${units[u]}`
}

function int (value: string | number) {
  const intValue = Number.parseInt(value as string)
  return Number.isNaN(intValue) ? value : intValue
}

/**
 * **Audio**
 *
 * 101  music
 * 102  books
 * 103  sound clips
 * 104  flac
 * 199  other
 *
 * **Video**
 *
 * 201  movies
 * 202  movies DVDr
 * 203  music videos
 * 204  movie clips
 * 205  tv shows
 * 206  handheld
 * 207  hd movies
 * 208  hd tv shows
 * 209  3d
 * 299  other
 */
export type CategoryIds
  = 101
    | 102
    | 103
    | 104
    | 199
    | 201
    | 202
    | 203
    | 204
    | 205
    | 206
    | 207
    | 208
    | 209
    | 299
    | 301
    | 302
    | 303
    | 304
    | 305
    | 306
    | 399
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 499
    | 601
    | 602
    | 603
    | 604
    | 605
    | 699

export interface Categories {
  audio: {
    music: 101
    audio_books: 102
    sound_clips: 103
    FLAC: 104
    other: 199
  }
  video: {
    'movies': 201
    'movies_dvdr': 202
    'music_videos': 203
    'movie_clips': 204
    'tv_shows': 205
    'handheld': 206
    'hd_movies': 207
    'hd_tv_shows': 208
    '3d': 209
    'other': 299
  }
  application: {
    windows: 301
    mac: 302
    UNIX: 303
    handheld: 304
    IOS: 305
    android: 306
    other: 399
  }
  games: {
    PC: 401
    mac: 402
    psx: 403
    xbox360: 404
    wii: 405
    handheld: 406
    IOS: 407
    android: 408
    other: 499
  }
  other: {
    ebooks: 601
    comics: 602
    pictures: 603
    covers: 604
    physibles: 605
    other: 699
  }
}

export interface SearchPayload {
  q: string
  cat: CategoryIds
}

export interface Torrent {
  id: number
  name: string
  info_hash: string
  leechers: number
  seeders: number
  num_files: number
  size: number
  username: string
  added: Date
  status: string
  category: CategoryIds
  imdb: string
}

export type SearchResults = Torrent[]
export type TorrentResults = Torrent[]

export interface TorrentDetails {
  id: number
  category: number
  status: string
  name: string
  num_files: number
  size: number
  seeders: number
  leechers: number
  username: string
  added: number
  descr: string
  imdb: string | null
  language: string | null
  textLanguage: string | null
  info_hash: string
}
