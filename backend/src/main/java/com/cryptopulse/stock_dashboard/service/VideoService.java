package com.cryptopulse.stock_dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VideoService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private static final Pattern VIDEO_ID_PATTERN = Pattern.compile("\"videoId\":\"([A-Za-z0-9_-]{11})\"");

    // Fallback curated real crypto videos (verified via oEmbed)
    private static final List<String> FALLBACK_IDS = Arrays.asList(
            "bBC-nXj3Ng4", "1YyAzVmP9xQ", "SSo_EIwHSd4", "Gc2en3nHxA4"
    );

    private static final String[] QUERIES = {
            "crypto+news", "bitcoin+latest", "ethereum+update", "crypto+regulation", "defi+news"
    };

    public List<Map<String, String>> getLatestVideos() {
        List<Map<String, String>> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();

        // Try scraping YouTube search (sorted by upload date) for fresh content
        for (String q : QUERIES) {
            if (result.size() >= 12) break;
            try {
                String url = "https://www.youtube.com/results?search_query=" + q + "&sp=CAI%3D";
                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                org.springframework.http.ResponseEntity<String> resp = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);
                String html = resp.getBody();
                if (html == null) continue;
                Matcher m = VIDEO_ID_PATTERN.matcher(html);
                while (m.find() && result.size() < 12) {
                    String id = m.group(1);
                    if (seen.contains(id)) continue;
                    seen.add(id);
                    Map<String, String> v = fetchVideoMeta(id);
                    if (v != null) result.add(v);
                }
            } catch (Exception e) {
                // ignore, try next query / fallback
            }
        }

        // Fallback if scraping yielded nothing
        if (result.isEmpty()) {
            for (String id : FALLBACK_IDS) {
                Map<String, String> v = fetchVideoMeta(id);
                if (v != null) result.add(v);
            }
        }

        return result;
    }

    private Map<String, String> fetchVideoMeta(String id) {
        try {
            String oembed = "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + id + "&format=json";
            String body = restTemplate.getForObject(oembed, String.class);
            JsonNode node = mapper.readTree(body);
            Map<String, String> v = new HashMap<>();
            v.put("id", id);
            v.put("title", node.path("title").asText("Crypto Video"));
            v.put("channel", node.path("author_name").asText("YouTube"));
            v.put("thumbnail", "https://img.youtube.com/vi/" + id + "/hqdefault.jpg");
            return v;
        } catch (Exception e) {
            return null;
        }
    }
}