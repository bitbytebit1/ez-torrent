import TorrentProvider from '../TorrentProvider.js'

export default class Eztv extends TorrentProvider {
  constructor () {
    super({
      name: 'Eztv',
      baseUrl: 'https://eztv-official.com',
      searchUrl: '/search/{query}',
      categories: {
        All: '',
      },
      defaultCategory: 'All',
      resultsPerPageCount: 50,
      itemsSelector: 'tr.forum_header_border',
      itemSelectors: {
        title: 'a.epinfo@text',
        link: 'a.download_1@href',
        magnet: 'a.magnet@href',
        time: 'td.forum_thread_post:nth-child(5)@text',
        seeds: 'td.forum_thread_post_end | int',
        size: 'td.forum_thread_post:nth-child(4)@text',
        desc: 'a.epinfo@href',
      },
      paginateSelector: 'a:contains( next page)@href',
      torrentDetailsSelector: '.section_thread_post@html',
    })
  }
}
