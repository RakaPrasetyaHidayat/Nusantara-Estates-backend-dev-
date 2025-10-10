Authentication APIs
1. POST /api/login
Purpose: User/Admin login Body Format:

{
  "username": "string",
  "password": "string"
}
Public APIs
2. GET /api/properties
Purpose: Get properties list with filtering Query Parameters:

tipe (optional): Property type filter
lokasi (optional): Location search string
page (optional): Page number (default: 1)
limit (optional): Items per page (default: 10)
3. GET /api/properties/[id]
Purpose: Get specific property details Query Parameters:

id: Property ID (required)
Admin APIs (Require Authorization Header)
4. GET /api/admin/properties
Purpose: Admin get properties list Headers:

Authorization: Bearer <admin_jwt_token>
Query Parameters:

page (optional): Page number (default: 1)
limit (optional): Items per page (default: 20)
5. POST /api/admin/properties
Purpose: Create new property Headers:

Authorization: Bearer <admin_jwt_token>
Body Format:

{
  "title": "string (required)",
  "price": "number (required)",
  "price_formatted": "string (optional)",
  "location": "string (required)",
  "address": "string (optional)",
  "bedrooms": "number (optional, default: 0)",
  "bathrooms": "number (optional, default: 0)",
  "land_area": "number (optional, default: 0)",
  "building_area": "number (optional, default: 0)",
  "property_type": "string (optional, default: 'house')",
  "status": "string (optional, default: 'Dijual')",
  "featured": "boolean (optional, default: false)",
  "image_url": "string (optional)",
  "images": "array (optional, default: [])",
  "description": "string (optional)"
}
6. GET /api/admin/properties/[id]
Purpose: Get specific property details (admin) Headers:

Authorization: Bearer <admin_jwt_token>
Query Parameters:

id: Property ID (required)
7. PUT /api/admin/properties/[id]
Purpose: Update property Headers:

Authorization: Bearer <admin_jwt_token>
Body Format (all fields optional):

{
  "title": "string",
  "description": "string",
  "price": "number",
  "price_formatted": "string",
  "location": "string",
  "address": "string",
  "bedrooms": "number",
  "bathrooms": "number",
  "land_area": "number",
  "building_area": "number",
  "property_type": "string",
  "status": "string",
  "featured": "boolean",
  "image_url": "string",
  "images": "array"
}
8. DELETE /api/admin/properties/[id]
Purpose: Delete property Headers:

Authorization: Bearer <admin_jwt_token>
Query Parameters:

id: Property ID (required)
Testing Notes