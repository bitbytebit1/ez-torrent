import cloudflareScraper from 'cloudflare-scraper'
import cloudscraperFallback from 'cloudscraper'

const cloudscraper = cloudflareScraper || cloudscraperFallback
export default cloudscraper
