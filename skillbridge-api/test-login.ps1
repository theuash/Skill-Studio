$body = @{
  email = "test@example.com"
  password = "Test123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing

$data = $response.Content | ConvertFrom-Json

Write-Host "Login Response:" -ForegroundColor Green
Write-Host ($data | ConvertTo-Json -Depth 10)

if ($data.success) {
  Write-Host "`n✅ Login Successful!" -ForegroundColor Green
  Write-Host "Token: $($data.data.token.Substring(0, 20))..." 
  Write-Host "User Email: $($data.data.user.email)"
} else {
  Write-Host "`n❌ Login Failed: $($data.message)"
}
