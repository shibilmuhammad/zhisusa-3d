import urllib.request
import zipfile
import json
import io

url = "https://prod.spline.design/jlu-LrL7kOx-S9uS/scene.splinecode"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = response.read()

try:
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        print("Zip contents:", z.namelist())
        if 'scene.json' in z.namelist():
            scene_data = json.loads(z.read('scene.json'))
            # find all name fields recursively
            names = set()
            def find_names(obj):
                if isinstance(obj, dict):
                    if 'name' in obj and isinstance(obj['name'], str):
                        names.add(obj['name'])
                    for k, v in obj.items():
                        find_names(v)
                elif isinstance(obj, list):
                    for item in obj:
                        find_names(item)
            find_names(scene_data)
            print("Extracted Names:")
            for name in sorted(names):
                print(f"- {name}")
except Exception as e:
    print("Not a zip file or error:", e)
