import re

with open('apps/web/src/components/community/componentsRegistry.tsx', 'r') as f:
    data = f.read()

new_export = "  PrecisionSlider: dynamic(() => import('./demos/PrecisionSlider').then(m => m.PrecisionSliderDemo), { ssr: false }),"

match = re.search(r'export const componentsRegistry: Record<string, React.ComponentType<any>> = {\s*', data)
if match:
    insert_pos = match.end()
    new_data = data[:insert_pos] + new_export + "\n" + data[insert_pos:]
    with open('apps/web/src/components/community/componentsRegistry.tsx', 'w') as f:
        f.write(new_data)
    print("Added to componentsRegistry")
else:
    print("Could not find componentsRegistry")
