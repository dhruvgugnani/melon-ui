with open('apps/web/src/components/community/demos/TactileZipperCard.tsx', 'r') as f:
    content = f.read()

# We need to map `zipY` to follow the dragged y transform, not set top AND drag=y.
# Framer motion will automatically set the `y` style property when drag="y" is used.
# Let's override `y` on the motion.div to just use our constrained `springZipY` but scaled to pixels,
# OR we can just let Framer motion handle the `y` transform naturally and derive `clipPercent` from `y`.

# Right now `handleDrag` sets `zipY`. `zipY` is (-0.5 to 0.5).
# If we keep `drag="y"`, framer motion natively changes the `y` style.
# And `onDrag` also gets called.

# To fix the double transform issue:
# Instead of animating `top`, we rely ONLY on framer motion's `y` transform.
# Since we removed `style={{ top: zipperTop }}` earlier, framer motion is now natively moving the element via `translateY`.
# However, we need to make sure the clip path still updates.
# We can use `onDrag` to update `zipY` just for the clip path calculations!
# The problem is `handleDrag` used `info.point.y - rect.top` which is absolute page coordinates minus container top.
# This calculates a percentage from -0.5 to 0.5.
# Let's ensure the `zipY` calculation is correct.
# Wait, if `drag="y"` is doing `translateY`, the zipper pull is translated by pixels.
# The clip path is derived from `springZipY`, which goes from -0.5 to 0.5.
# This is correct. `zipY` is only used for `springZipY` and `clipPercent`.
# BUT since the pull is absolutely positioned at `inset-0` with `top` not being updated,
# wait! The pull is at `left-1/2` and `top: 0` by default.
# If `drag="y"` is used, the pull is translated by `y` pixels from `top: 0`.
# Is `dragConstraints={containerRef}` enough?
# If `containerRef` is the whole card, `drag="y"` will allow translating the pull from 0 to card height.
# Let's check `zipY` usage.
