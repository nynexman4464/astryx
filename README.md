# Blog cover images through the image optimizer: review evidence

Before and after screenshots of the Astryx docsite, from local production
builds of `main` and of the branch `nynexman4464/perf/docsite-blog-cover-images`,
in Chromium 149.

| File | What it shows |
| --- | --- |
| `blog-index-1440.png`, `blog-index-grid-1440.png` | The blog index at 1440 px, device scale 1: the first screen, and the grid |
| `post-1440.png` | A post page at 1440 px, device scale 1 |
| `landing-blog-1440.png` | The landing page's blog section at 1440 px, device scale 1 |
| `blog-index-390.png`, `post-390.png`, `landing-blog-390.png` | The same three at 390 px, device scale 2 |
| `2x-index-grid-card.png` | One index grid cover (366 CSS px) at device scale 2 |
| `2x-article-cover-photo.png` | One article cover (752 CSS px) at device scale 2 |
| `2x-landing-tablet-card.png` | One landing card on an 834 px viewport (786 CSS px) at device scale 2 |
| `2x-index-one-column-card.png` | One index card on a 700 px viewport (652 CSS px) at device scale 2 |

Each image states the mean difference between its two halves, on a scale of 0 to 255.
