import requests

res = requests.post("http://localhost:5050/api/forecast", json={
    "ticker": "AAPL",
    "start": "2022-01-01",
    "end": "2023-12-31"
})

print("Status:", res.status_code)
try:
    print("JSON Response:", res.json())
except Exception:
    print("Raw Response:", res.text)
