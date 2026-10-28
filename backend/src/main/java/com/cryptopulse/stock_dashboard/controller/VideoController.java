package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.service.VideoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    public List<Map<String, String>> getVideos() {
        return videoService.getLatestVideos();
    }
}