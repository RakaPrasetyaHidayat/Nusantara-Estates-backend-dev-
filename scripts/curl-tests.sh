#!/usr/bin/env bash
# Simple curl test script for deployed API. Replace BASE with your deployed URL.
BASE="https://nusantara-estates-backend-j1y6um9ag.vercel.app"

echo "Login (admin)"
curl -s -X POST "$BASE/api/login" -H "Content-Type: application/json" -d '{"username":"NEadmin","password":"BARA211"}' | jq

echo "Get properties"
curl -s "$BASE/api/properties" | jq

# Example: login then use token for admin list
TOKEN=$(curl -s -X POST "$BASE/api/login" -H "Content-Type: application/json" -d '{"username":"NEadmin","password":"BARA211"}' | jq -r .token)
echo "Token: $TOKEN"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/properties" | jq
