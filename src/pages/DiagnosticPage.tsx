import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DiagnosticPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: any[] = [];

    // Test 1: Check project ID and anon key
    testResults.push({
      name: 'Configuration Check',
      status: projectId && publicAnonKey ? 'success' : 'error',
      message: projectId && publicAnonKey 
        ? `Project ID: ${projectId}`
        : 'Missing project ID or anon key',
      details: publicAnonKey ? `Anon Key: ${publicAnonKey.substring(0, 20)}...` : ''
    });
    setTests([...testResults]);

    // Test 2: Health check
    try {
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/health`;
      console.log('🏥 Testing health check:', healthUrl);
      
      const healthResponse = await fetch(healthUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const healthData = await healthResponse.json();
      
      testResults.push({
        name: 'Edge Function Health Check',
        status: healthResponse.ok ? 'success' : 'error',
        message: healthResponse.ok 
          ? `Edge Function is accessible (Status: ${healthResponse.status})`
          : `Health check failed (Status: ${healthResponse.status})`,
        details: JSON.stringify(healthData, null, 2),
        url: healthUrl
      });
    } catch (error: any) {
      testResults.push({
        name: 'Edge Function Health Check',
        status: 'error',
        message: 'Cannot reach Edge Function',
        details: error.message,
        url: `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/health`
      });
    }
    setTests([...testResults]);

    // Test 3: Products API
    try {
      const productsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/api/products`;
      console.log('📦 Testing products API:', productsUrl);
      
      const productsResponse = await fetch(productsUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const productsData = await productsResponse.json();
      
      testResults.push({
        name: 'Products API',
        status: productsResponse.ok ? 'success' : 'error',
        message: productsResponse.ok 
          ? `Products API working (Found ${productsData.data?.length || 0} products)`
          : `Products API failed (Status: ${productsResponse.status})`,
        details: JSON.stringify(productsData, null, 2),
        url: productsUrl
      });
    } catch (error: any) {
      testResults.push({
        name: 'Products API',
        status: 'error',
        message: 'Cannot reach Products API',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 4: Init Data API
    try {
      const initUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/api/init-data`;
      console.log('🔄 Testing init-data API:', initUrl);
      
      const initResponse = await fetch(initUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          products: [],
          users: [],
          orders: []
        })
      });
      
      const initData = await initResponse.json();
      
      testResults.push({
        name: 'Init Data API',
        status: initResponse.ok ? 'success' : 'error',
        message: initResponse.ok 
          ? `Init Data API working`
          : `Init Data API failed (Status: ${initResponse.status})`,
        details: JSON.stringify(initData, null, 2),
        url: initUrl
      });
    } catch (error: any) {
      testResults.push({
        name: 'Init Data API',
        status: 'error',
        message: 'Cannot reach Init Data API',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 5: Database Table Check
    try {
      const kvTestUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/api/products`;
      console.log('💾 Testing KV store:', kvTestUrl);
      
      const kvResponse = await fetch(kvTestUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      testResults.push({
        name: 'KV Store / Database Table',
        status: kvResponse.ok ? 'success' : 'error',
        message: kvResponse.ok 
          ? 'Database table kv_store_3adf4243 exists and is accessible'
          : 'Database table may not exist or has incorrect permissions',
        details: kvResponse.ok ? 'Table is working correctly' : 'Run the SQL setup script'
      });
    } catch (error: any) {
      testResults.push({
        name: 'KV Store / Database Table',
        status: 'error',
        message: 'Cannot test database table',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 6: Environment Variables
    testResults.push({
      name: 'Environment Variables Check',
      status: 'info',
      message: 'Check if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set',
      details: 'Go to: https://supabase.com/dashboard/project/' + projectId + '/settings/functions',
      url: 'https://supabase.com/dashboard/project/' + projectId + '/settings/functions'
    });
    setTests([...testResults]);

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-600" />;
    if (status === 'info') return <AlertCircle className="h-5 w-5 text-blue-600" />;
    return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'bg-green-100 border-green-300';
    if (status === 'error') return 'bg-red-100 border-red-300';
    if (status === 'info') return 'bg-blue-100 border-blue-300';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">🔍 AURAZ Diagnostic Tool</h1>
          <p className="text-gray-600">Testing Supabase connection and setup</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Tests</CardTitle>
            <CardDescription>
              Running comprehensive tests on your Supabase setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(test.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{test.name}</h3>
                        <Badge
                          className={
                            test.status === 'success'
                              ? 'bg-green-600'
                              : test.status === 'error'
                              ? 'bg-red-600'
                              : 'bg-blue-600'
                          }
                        >
                          {test.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{test.message}</p>
                      {test.url && (
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>URL:</strong> {test.url}
                        </p>
                      )}
                      {test.details && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-700 font-medium mb-1">
                            Show Details
                          </summary>
                          <pre className="bg-white p-2 rounded border overflow-auto max-h-40">
                            {test.details}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isRunning && (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600 mt-2">Running tests...</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="bg-[#591220] hover:bg-[#591220]/90"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests Again'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Quick Fixes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-3">
            <div className="bg-red-100 border-2 border-red-400 rounded p-3 mb-3">
              <strong className="text-red-900">🚨 COMMON ERROR: "no field updated_at"</strong>
              <p className="mt-1 text-red-800">Your database table has the wrong schema!</p>
              <ul className="list-disc ml-5 mt-1 text-red-800">
                <li><strong>Fix:</strong> See FIX-DATABASE.md in your project</li>
                <li>Re-run the SQL to recreate the table correctly</li>
                <li>Takes 1 minute to fix!</li>
              </ul>
            </div>
            <div>
              <strong>If Health Check fails:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Edge Function may not be deployed</li>
                <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">supabase functions deploy server</code></li>
              </ul>
            </div>
            <div>
              <strong>If Products API fails:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Database table may not exist</li>
                <li>Run the SQL script from README.md in your Supabase SQL editor</li>
              </ul>
            </div>
            <div>
              <strong>If KV Store fails:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Environment variables may be missing</li>
                <li>Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Edge Function settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
