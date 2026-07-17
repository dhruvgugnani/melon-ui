import re
with open('apps/web/src/components/community/demos/TactileZipperCard.tsx', 'r') as f:
    content = f.read()

# Since the pull was originally absolute positioned and animated via `top`, and we just removed `top`,
# it will start at top: 0 and drag="y" will change `translateY` from 0 to card height.
# This actually works perfectly with dragConstraints=containerRef.
# But wait, `handleDrag` uses `dragYLocal = info.point.y - rect.top` and `newY = (dragYLocal / rect.height) - 0.5`.
# The clip path calculation expects `springZipY` to go from -0.5 to 0.5, mapping to 0% to 100%.
# Let's adjust handleDrag to make sure newY correctly maps 0..cardHeight to -0.5..0.5.
# `dragYLocal / rect.height` goes from 0 to 1.
# `newY = ... - 0.5` goes from -0.5 to 0.5. This is correct!

# Let's clean up the comment
content = content.replace('/* Custom drag via pointer events or Framer Motion without `y` transform interference */', '')

with open('apps/web/src/components/community/demos/TactileZipperCard.tsx', 'w') as f:
    f.write(content)
