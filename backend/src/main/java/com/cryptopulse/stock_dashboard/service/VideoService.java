package com.cryptopulse.stock_dashboard.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class VideoService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Reputable crypto YouTube channels (verified RSS feeds)
    private static final java.util.LinkedHashMap<String, String> CHANNELS = new java.util.LinkedHashMap<>();
    static {
        CHANNELS.put("Coin Bureau", "UCqK_GSMbpiV8spgD3ZGloSw");
        CHANNELS.put("Bankless", "UCAl9Ld79qaZxp9JzEOwd3aA");
        CHANNELS.put("Whiteboard Crypto", "UCsYYksPHiGqXHPoHI-fm5sg");
        CHANNELS.put("Altcoin Daily", "UCbLhGKVY-bJPcawebgtNfbw");
    }

    private static final java.util.regex.Pattern ENTRY = java.util.regex.Pattern.compile("<entry>(.*?)</entry>", java.util.regex.Pattern.DOTALL);
    private static final java.util.regex.Pattern VID = java.util.regex.Pattern.compile("<yt:videoId>([^<]+)</yt:videoId>");
    private static final java.util.regex.Pattern TITLE = java.util.regex.Pattern.compile("<title>([^<]+)</title>");
    private static final java.util.regex.Pattern PUB = java.util.regex.Pattern.compile("<published>([^<]+)</published>");

    public List<Map<String, String>> getLatestVideos() {
        List<Map<String, String>> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();

        for (Map.Entry<String, String> ch : CHANNELS.entrySet()) {
            String channelName = ch.getKey();
            try {
                String xml = restTemplate.getForObject("https://www.youtube.com/feeds/videos.xml?channel_id=" + ch.getValue(), String.class);
                if (xml == null) continue;
                java.util.regex.Matcher em = ENTRY.matcher(xml);
                while (em.find() && result.size() < 24) {
                    String entry = em.group(1);
                    String videoId = extract(VID, entry);
                    if (videoId == null || seen.contains(videoId)) continue;
                    seen.add(videoId);
                    String title = extract(TITLE, entry);
                    String published = extract(PUB, entry);
                    Map<String, String> v = new HashMap<>();
                    v.put("id", videoId);
                    v.put("title", title != null ? title : "Crypto Video");
                    v.put("channel", channelName);
                    v.put("published", published != null ? published : "");
                    v.put("thumbnail", "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg");
                    result.add(v);
                }
            } catch (Exception e) {
                // skip channel on failure
            }
        }

        result.sort((a, b) -> b.getOrDefault("published", "").compareTo(a.getOrDefault("published", "")));
        return result;
    }

    private String extract(java.util.regex.Pattern p, String text) {
        java.util.regex.Matcher m = p.matcher(text);
        if (m.find()) return m.group(1).trim();
        return null;
    }
}