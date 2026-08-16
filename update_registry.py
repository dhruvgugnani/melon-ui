import json

# Read registry.json
with open('registry/registry.json', 'r') as f:
    registry = json.load(f)

# Add new component
registry['precision-slider'] = {
    "name": "PrecisionSlider",
    "type": "registry:ui",
    "category": "Forms & Inputs",
    "description": "A highly precise slider with fine-tuning capability when holding shift.",
    "dependencies": ["framer-motion"],
    "devDependencies": [],
    "files": [
        {
            "name": "precision-slider.tsx",
            "path": "components/precision-slider.tsx",
            "type": "registry:ui"
        }
    ]
}

# Write registry.json
with open('registry/registry.json', 'w') as f:
    json.dump(registry, f, indent=2)

print("Added to registry.json")
