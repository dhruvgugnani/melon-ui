import re

with open('apps/web/src/data/components.ts', 'r') as f:
    data = f.read()

# We accidentally added it multiple times maybe? Let's check how many times precision-slider is in the file
import re
count = len(re.findall(r'id:\s*"precision-slider"', data))
print(f"Found precision-slider {count} times")

if count > 1:
    # Remove the first occurrence (we likely added it multiple times)
    match = re.search(r'{\s*id:\s*"precision-slider".*?},', data, re.DOTALL)
    if match:
        new_data = data[:match.start()] + data[match.end():]
        with open('apps/web/src/data/components.ts', 'w') as f:
            f.write(new_data)
        print("Removed duplicate")
