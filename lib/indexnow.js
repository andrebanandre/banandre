/* eslint-disable @typescript-eslint/no-require-imports */

const { parseString } = require("xml2js");
const { get, request } = require("https");

// Configuration
const sitemapUrl = "https://www.banandre.com/sitemap.xml";
const host = "www.banandre.com";
const key = "ff184407c094a9b811a2bf636d761017";
const keyLocation = "https://www.banandre.com/ff184407c094a9b811a2bf636d761017.txt";

// Alternative configurations for testing
const hostNoWww = "banandre.com";
const keyLocationNoWww = "https://banandre.com/ff184407c094a9b811a2bf636d761017.txt";

// Calculate date: use provided date, or default to 2 days ago if no argument provided
const dateArg = process.argv[2];
let modifiedSinceDate;

if (!dateArg) {
  // Default to 2 days ago (more targeted indexing)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  modifiedSinceDate = twoDaysAgo;
  console.log(
    `No date provided, using default: ${modifiedSinceDate.toISOString().split("T")[0]} (2 days ago)`
  );
} else {
  modifiedSinceDate = new Date(dateArg);
  if (isNaN(modifiedSinceDate.getTime())) {
    console.error("Invalid date provided. Please use format YYYY-MM-DD");
    process.exit(1);
  }
}

function fetchSitemap(url) {
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

function parseSitemap(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function isSitemapIndex(sitemap) {
  return sitemap.sitemapindex !== undefined;
}

async function fetchAllUrlsFromSitemapIndex(sitemapIndex) {
  const allUrls = [];
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
    } catch (error) {
      console.error(`Error fetching sitemap ${sitemapUrl}:`, error.message);
    }
  }

  return allUrls;
}

function shouldIndexUrl(url) {
  // Exclude tag pages (e.g., /tags/ai, /tags/programming)
  if (url.includes("/tags/") && url.split("/").length > 3) {
    return false;
  }

  // Exclude category pages (e.g., /categories/tech, /categories/lifestyle)
  if (url.includes("/categories/") && url.split("/").length > 3) {
    return false;
  }

  // Exclude main tags and categories index pages (they rarely change)
  if (url.endsWith("/tags") || url.endsWith("/categories")) {
    return false;
  }

  return true;
}

function filterUrlsByDate(urls, date) {
  if (!urls || urls.length === 0) {
    console.log("No URLs found");
    return [];
  }

  const filteredUrls = urls
    .filter((url) => {
      if (!url.lastmod || !url.lastmod[0]) {
        return false;
      }
      return new Date(url.lastmod[0]) > date;
    })
    .map((url) => url.loc[0])
    .filter(shouldIndexUrl); // Apply URL filtering

  console.log(
    `Filtered out ${urls.length - filteredUrls.length} unwanted URLs (tags/categories pages)`
  );

  return filteredUrls;
}

function postToIndexNow(urlList, useNoWww = false) {
  const requestHost = useNoWww ? hostNoWww : host;
  const requestKeyLocation = useNoWww ? keyLocationNoWww : keyLocation;

  const data = JSON.stringify({
    host: requestHost,
    key,
    keyLocation: requestKeyLocation,
    urlList,
  });

  console.log("🔍 Debug - Request payload:");
  console.log(JSON.stringify(JSON.parse(data), null, 2));

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
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
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

async function main() {
  try {
    console.log("Fetching sitemap from:", sitemapUrl);
    const xmlData = await fetchSitemap(sitemapUrl);
    console.log("Parsing sitemap...");
    const sitemap = await parseSitemap(xmlData);

    let allUrls = [];

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

    // Show first few URLs as examples, but submit all
    if (filteredUrls.length <= 10) {
      console.log("URLs:", filteredUrls);
    } else {
      console.log(
        "URLs (showing first 10 of",
        filteredUrls.length + "):",
        filteredUrls.slice(0, 10),
        "..."
      );
    }

    if (filteredUrls.length > 0) {
      console.log("🚀 Submitting to IndexNow API...");

      // Submit without www (this is the working configuration)
      console.log("\n📡 Submitting to banandre.com...");
      try {
        const response = await postToIndexNow(filteredUrls, true);
        console.log("✅ IndexNow API Response:");
        console.log("Status:", response.statusCode, response.statusMessage);

        if (response.statusCode === 202 || response.statusCode === 200) {
          console.log(
            "✅ IndexNow completed successfully -",
            filteredUrls.length,
            "URLs submitted"
          );
        } else {
          console.log("Data:", response.data);
        }
      } catch (error) {
        console.error("❌ Error submitting to IndexNow:", error.message);
      }
    } else {
      console.log("ℹ️ No URLs modified since the specified date.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
