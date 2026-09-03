import json
import subprocess
result = subprocess.run(["docker", "inspect", "supabase-db"], capture_output=True, text=True)
data = json.loads(result.stdout)
for net in data[0]["NetworkSettings"]["Networks"].values():
    print(net["IPAddress"])
