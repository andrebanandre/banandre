import { parseString } from "xml2js";
import { get, request } from "https";

// Configuration
const sitemapUrl = "https://www.banandre.com/sitemap.xml";
const host = "www.banandre.com";
const key = "26ecf4563d764768a1293f4edac8c4a2";
const keyLocation = "https://www.banandre.com/26ecf4563d764768a1293f4edac8c4a2.txt";

// Calculate date: use provided date, or default to 7 days ago if no argument provided
const dateArg = process.argv[2];
let modifiedSinceDate: Date;

if (!dateArg) {
  // Default to 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  modifiedSinceDate = sevenDaysAgo;
  console.log(
    `No date provided, using default: ${modifiedSinceDate.toISOString().split("T")[0]} (7 days ago)`
  );
} else {
  modifiedSinceDate = new Date(dateArg);
  if (isNaN(modifiedSinceDate.getTime())) {
    console.error("Invalid date provided. Please use format YYYY-MM-DD");
    process.exit(1);
  }
}

interface IndexNowResponse {
  statusCode: number;
  statusMessage: string;
  data: string;
}

interface UrlEntry {
  loc: string[];
  lastmod?: string[];
}

interface SitemapUrl {
  loc: string[];
  lastmod?: string[];
}

interface Urlset {
  url: SitemapUrl[];
}

interface SitemapEntry {
  loc: string[];
}

interface SitemapIndex {
  sitemap: SitemapEntry[];
}

interface ParsedSitemap {
  urlset?: Urlset;
  sitemapindex?: SitemapIndex;
}

function fetchSitemap(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

function parseSitemap(xmlData: string): Promise<ParsedSitemap> {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as ParsedSitemap);
      }
    });
  });
}

function isSitemapIndex(sitemap: ParsedSitemap): boolean {
  return sitemap.sitemapindex !== undefined;
}

async function fetchAllUrlsFromSitemapIndex(sitemapIndex: ParsedSitemap): Promise<UrlEntry[]> {
  const allUrls: UrlEntry[] = [];
  if (!sitemapIndex.sitemapindex) {
    return allUrls;
  }

  const sitemaps = sitemapIndex.sitemapindex.sitemap;

  for (const sitemapEntry of sitemaps) {
    const sitemapUrl = sitemapEntry.loc[0];
    console.log(`Fetching sitemap: ${sitemapUrl}`);
    try {
      const xmlData = await fetchSitemap(sitemapUrl);
      const sitemap = await parseSitemap(xmlData);
      if (sitemap.urlset && sitemap.urlset.url) {
        allUrls.push(...sitemap.urlset.url);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error fetching sitemap ${sitemapUrl}:`, errorMessage);
    }
  }

  return allUrls;
}

function filterUrlsByDate(urls: UrlEntry[], date: Date): string[] {
  if (!urls || urls.length === 0) {
    console.log("No URLs found");
    return [];
  }

  return urls
    .filter((url) => {
      if (!url.lastmod || !url.lastmod[0]) {
        return false;
      }
      return new Date(url.lastmod[0]) > date;
    })
    .map((url) => url.loc[0]);
}

function postToIndexNow(urlList: string[]): Promise<IndexNowResponse> {
  const data = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  });

  const options = {
    hostname: "api.indexnow.org",
    port: 443,
    path: "/IndexNow",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(data, "utf8"),
    },
  };

  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode!,
          statusMessage: res.statusMessage!,
          data: responseData,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main(): Promise<void> {
  try {
    console.log("Fetching sitemap from:", sitemapUrl);
    const xmlData = await fetchSitemap(sitemapUrl);
    console.log("Parsing sitemap...");
    const sitemap: ParsedSitemap = await parseSitemap(xmlData);

    let allUrls: UrlEntry[] = [];

    if (isSitemapIndex(sitemap)) {
      console.log("Sitemap index detected, fetching individual sitemaps...");
      allUrls = await fetchAllUrlsFromSitemapIndex(sitemap);
    } else if (sitemap.urlset && sitemap.urlset.url) {
      allUrls = sitemap.urlset.url;
    }

    const filteredUrls = filterUrlsByDate(allUrls, modifiedSinceDate);

    console.log(
      `Found ${filteredUrls.length} URLs modified since ${modifiedSinceDate.toISOString().split("T")[0]}`
    );
    console.log("URLs:", filteredUrls);

    if (filteredUrls.length > 0) {
      console.log("Submitting to IndexNow API...");
      const response = await postToIndexNow(filteredUrls);
      console.log("IndexNow API Response:");
      console.log("Status:", response.statusCode, response.statusMessage);
      console.log("Data:", response.data);
    } else {
      console.log("No URLs modified since the specified date.");
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("An error occurred:", errorMessage);
  }
}

main();
