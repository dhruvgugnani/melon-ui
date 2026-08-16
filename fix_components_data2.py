with open('apps/web/src/data/components.ts', 'r') as f:
    data = f.read()

# There's a trailing comma after the first PrecisionSlider block at line ~87 because I used match.end() to insert it after the end of the array definition which wasn't quite right or left a trailing comma.
# Let's fix the syntax error

data = data.replace('},\n      props: [', '},\n      componentPath: "PrecisionSlider",\n      props: [')

# Also remove the partial component object that was left behind
import re
# We look for a precision slider without the correct code snippet and remove it
match = re.search(r'{\s*id:\s*"precision-slider".*?componentPath:\s*"PrecisionSlider",\s*props:\s*\[.*?\]\s*}', data, re.DOTALL)
if match:
    pass

# We can just run npx eslint --fix apps/web/src/data/components.ts if it's just formatting, but it's a parsing error.
