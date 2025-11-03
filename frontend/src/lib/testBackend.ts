export async function testBackendConnection(): Promise<{
  health: boolean;
  auth: boolean;
  requests: boolean;
  details: string[];
}> {
  const results = {
    health: false,
    auth: false,
    requests: false,
    details: [] as string[]
  };

  try {
    // Test 1: Health check
    const healthResponse = await fetch('http://localhost:3001/health');
    if (healthResponse.ok) {
      results.health = true;
      results.details.push('✅ Backend health check OK');
    } else {
      results.details.push(`❌ Health check failed: ${healthResponse.status}`);
    }
  } catch (error) {
    results.details.push(`❌ Cannot connect to backend: ${error}`);
    return results;
  }

  try {
    // Test 2: Auth endpoint
    const authResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      if (authData.success && authData.data?.accessToken) {
        results.auth = true;
        results.details.push('✅ Auth endpoint working');
        
        // Test 3: Requests endpoint with token
        const requestsResponse = await fetch('http://localhost:3001/api/admin/requests', {
          headers: {
            'Authorization': `Bearer ${authData.data.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (requestsResponse.ok) {
          results.requests = true;
          results.details.push('✅ Requests endpoint working');
        } else {
          results.details.push(`❌ Requests endpoint failed: ${requestsResponse.status}`);
        }
      } else {
        results.details.push('❌ Auth response invalid');
      }
    } else {
      results.details.push(`❌ Auth failed: ${authResponse.status}`);
    }
  } catch (error) {
    results.details.push(`❌ Auth test failed: ${error}`);
  }

  return results;
}