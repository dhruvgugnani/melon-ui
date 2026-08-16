import json

# Read the component code
with open('registry/components/precision-slider.tsx', 'r') as f:
    code = f.read()

import re

# Read components.ts
with open('apps/web/src/data/components.ts', 'r') as f:
    data = f.read()

# Create new component object
new_component = f"""{{
      id: "precision-slider",
      slug: "precision-slider",
      title: "Precision Slider",
      description: "A highly precise slider with fine-tuning capability when holding shift, knurled thumb texture, and floating value indicators.",
      category: "Forms & Inputs",
      tags: ["framer-motion", "interactive", "slider", "range"],
      cliCommand: "npx @melonui-dev/cli add precision-slider",
      codeSnippet: {json.dumps(code)},
      componentPath: "PrecisionSlider",
      props: [
        {{
          name: "min",
          type: "number",
          defaultValue: "0",
          description: "Minimum value of the slider"
        }},
        {{
          name: "max",
          type: "number",
          defaultValue: "100",
          description: "Maximum value of the slider"
        }},
        {{
          name: "step",
          type: "number",
          defaultValue: "1",
          description: "Step value for the slider"
        }},
        {{
          name: "defaultValue",
          type: "number",
          defaultValue: "50",
          description: "Initial value of the slider"
        }},
        {{
          name: "label",
          type: "string",
          defaultValue: '"FREQUENCY"',
          description: "Label for the slider"
        }},
        {{
          name: "unit",
          type: "string",
          defaultValue: '"HZ"',
          description: "Unit label for the slider value"
        }},
        {{
          name: "accentColor",
          type: "string",
          defaultValue: '"#7fff5e"',
          description: "Color of the fill and active elements"
        }}
      ]
    }}"""

# Find the end of componentsData array
match = re.search(r'export const componentsData: ComponentData\[\] = \[\s*', data)
if match:
    insert_pos = match.end()
    new_data = data[:insert_pos] + new_component + ",\n  " + data[insert_pos:]
    with open('apps/web/src/data/components.ts', 'w') as f:
        f.write(new_data)
    print("Added to componentsData")
else:
    print("Could not find componentsData array")
