import re
import json

with open('apps/web/src/data/components.ts', 'r') as f:
    content = f.read()

# Replace inline top hook string literal logic
content = content.replace(r'style={{ top: useTransform(springZipY, [-0.5, 0.5], ["0%", "100%"]) }}', '')

# Replace handleDrag typings to exact typings
content = content.replace(r'const handleDrag = (e: any, info: any) => {', r'const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {')
content = content.replace(r'onDrag={handleDrag}', r'onDrag={handleDrag as unknown as (e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => void}')

with open('apps/web/src/data/components.ts', 'w') as f:
    f.write(content)
