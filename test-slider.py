import subprocess
import os

# We need to test the component before completing
os.system('npm run lint --workspace=melonui-web')
