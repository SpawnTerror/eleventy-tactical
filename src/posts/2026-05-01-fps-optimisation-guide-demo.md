---
title: "FPS optimisation guide with benchmark tables"
date: 2026-05-01
permalink: "/fps-optimisation-guide-demo/"
layout: layouts/post.njk
tags: ["Tutorials"]
description: "Demo tutorial showcasing cover banners, benchmark tables, callouts, and code blocks in Eleventy Tactical."
cover: /images/demo/cover-tutorials.png
coverAlt: "Tactical FPS optimisation guide demo cover"
---

This demo tutorial shows how **Eleventy Tactical** renders height-capped cover banners, callout boxes, tables, and syntax-highlighted config snippets.

## Recommended baseline settings

::: tip
Always benchmark before and after changing graphics settings so you can measure real 1% low improvements.
:::

| Setting | Value | Impact |
| --- | --- | --- |
| Multisampling | 2x MSAA | High visibility clarity |
| Global Shadow Quality | Low | +15–20% average FPS |
| Dynamic Shadows | All | Essential for indoor enemy shadows |
| Launch Options | `+exec autoexec.cfg` | Clean startup |

## Sample console commands

```ini
fps_max "0"
cl_hud_telemetry_frametime_show "2"
cl_hud_telemetry_ping_show "2"
```
