import urllib.request
import json

url = 'https://pxovcwdltctnziaeombj.supabase.co/rest/v1/catalog?select=id,name,img'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4b3Zjd2RsdGN0bnppYWVvbWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU0OTcsImV4cCI6MjA5NzAwMTQ5N30.fyQtl7i93CNeG0A0o51gyCiSk88Yxq9s59HAxUe66L8',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4b3Zjd2RsdGN0bnppYWVvbWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU0OTcsImV4cCI6MjA5NzAwMTQ5N30.fyQtl7i93CNeG0A0o51gyCiSk88Yxq9s59HAxUe66L8'
}
req = urllib.request.Request(url, headers=headers)
try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    print("Fetched", len(data), "items")
    for item in data[-5:]: # last 5 items
        img = item.get('img', '')
        print(f"ID: {item.get('id')}, Name: {item.get('name')}, Img Length: {len(img) if img else 0}")
except Exception as e:
    print("Error:", e)
