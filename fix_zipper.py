with open('apps/web/src/components/community/demos/TactileZipperCard.tsx', 'r') as f:
    content = f.read()

# Remove zipperTop variable
content = content.replace('const zipperTop = useTransform(springZipY, [-0.5, 0.5], ["0%", "100%"]);\n', '')

# Remove style={{ top: zipperTop }} from motion.div
content = content.replace('style={{ top: zipperTop }}', '')

with open('apps/web/src/components/community/demos/TactileZipperCard.tsx', 'w') as f:
    f.write(content)
