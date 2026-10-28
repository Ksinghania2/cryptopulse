package com.cryptopulse.stock_dashboard.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NewsService {

    // Public RSS Feed (Cointelegraph)
    private final String RSS_URL = "https://cointelegraph.com/rss";
    private final RestTemplate restTemplate = new RestTemplate();

    @Cacheable("news")
    public List<Map<String, String>> getCryptoNews() {
        System.out.println("Fetching REAL News from Cointelegraph (Not Cached)...");
        
        List<Map<String, String>> newsList = new ArrayList<>();

        try {
            // 1. Fetch raw XML from the RSS feed
            String rssXml = restTemplate.getForObject(RSS_URL, String.class);

            // 2. Parse XML
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(rssXml)));

            // 3. Extract <item> tags (each item is a news article)
            NodeList items = doc.getElementsByTagName("item");

            // Limit to top 10 articles
            int limit = Math.min(items.getLength(), 10);

            for (int i = 0; i < limit; i++) {
                Element item = (Element) items.item(i);
                
                String title = getTagValue("title", item);
                String link = getTagValue("link", item);
                String pubDate = getTagValue("pubDate", item);
                
                // Clean up the date (remove timezone for cleaner look)
                if (pubDate.length() > 17) pubDate = pubDate.substring(0, 16);

                Map<String, String> news = new HashMap<>();
                news.put("title", title);
                news.put("link", link);
                news.put("date", pubDate);
                news.put("source", "Cointelegraph");

                newsList.add(news);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback if RSS fails
            Map<String, String> error = new HashMap<>();
            error.put("title", "News Feed Unavailable");
            error.put("link", "#");
            error.put("date", "Just now");
            error.put("source", "System");
            newsList.add(error);
        }

        return newsList;
    }

    // Helper to extract text from XML tags
    private String getTagValue(String tag, Element element) {
        try {
            NodeList nodeList = element.getElementsByTagName(tag).item(0).getChildNodes();
            return nodeList.item(0).getNodeValue();
        } catch (Exception e) {
            return "";
        }
    }
}