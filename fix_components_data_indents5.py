import re
with open('apps/web/src/data/components.ts', 'r') as f:
    data = f.read()

# There's still a messed up part where the code string got pasted weirdly. Let's start completely over.
