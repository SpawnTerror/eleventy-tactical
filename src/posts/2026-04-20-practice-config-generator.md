---
title: "Counter-Strike 2 practice config generator"
date: 2026-04-20
permalink: "/practice-config/"
layout: layouts/post.njk
tags: ["Tutorials"]
description: "Interactive client-side Counter-Strike 2 practice.cfg generator included out of the box with Eleventy Tactical."
cover: /images/demo/cover-practice.png
coverAlt: "Tactical practice config generator demo cover"
---

Pick the commands and binds you want below, preview the live output, and download a custom `practice.cfg` straight to your PC — zero backend required.

{% include "practice-generator.njk" %}

## Where to save your file

Drop the downloaded `practice.cfg` inside your `cfg` directory and run `exec practice.cfg` from the in-game developer console.
