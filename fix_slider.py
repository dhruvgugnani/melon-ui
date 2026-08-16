with open('registry/components/precision-slider.tsx', 'r') as f:
    data = f.read()

# I used 'import * as React from "react";' earlier, but let's check if the file still has that
if 'import React' in data:
    data = data.replace('import React', 'import * as React')

with open('registry/components/precision-slider.tsx', 'w') as f:
    f.write(data)
