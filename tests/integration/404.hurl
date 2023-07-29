# Health Check Test
GET http://localhost:8080/not-route

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404
