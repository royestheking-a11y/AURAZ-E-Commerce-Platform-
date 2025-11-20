import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function MongoTestPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setStatus(data);
    } catch (error: any) {
      setStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const migrateData = async () => {
    setMigrating(true);
    setStatus(null);
    try {
      // Import default data
      const { products, heroSlides } = await import('../lib/mockData');
      const { vouchers, promoCards, sampleReviews } = await import('../lib/comprehensiveData');
      const { sampleUsers, sampleOrders } = await import('../lib/initializeData');

      // Convert heroSlides to CarouselSlides format
      const defaultCarouselSlides = heroSlides.map((slide) => ({
        id: slide.id.toString(),
        image: slide.image,
        title: slide.title,
        description: slide.subtitle,
        buttonText: slide.cta,
        buttonLink: slide.link,
      }));

      // Prepare default data
      const defaultData = {
        users: sampleUsers,
        products: products,
        orders: sampleOrders,
        carousel: defaultCarouselSlides,
        vouchers: vouchers,
        promoCards: promoCards,
        paymentVerifications: [],
        refunds: [],
        notifications: [],
        reviews: sampleReviews,
        conversations: [],
        deliverySettings: {
          dhakaCharge: 60,
          outsideDhakaCharge: 110,
          freeShippingThreshold: 5000
        },
      };

      // Try init-data endpoint first (clears and initializes)
      let response = await fetch('/api/init-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultData),
      });

      if (!response.ok) {
        // Fallback to migrate endpoint
        response = await fetch('/api/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultData),
        });
      }

      const data = await response.json();
      setStatus(data);
      
      if (data.success) {
        // Test connection again to see the new collections
        setTimeout(() => testConnection(), 2000);
      }
    } catch (error: any) {
      setStatus({ success: false, error: error.message });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>MongoDB Connection & Migration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Test MongoDB Connection'}
            </Button>
            <Button onClick={migrateData} disabled={migrating} variant="outline">
              {migrating ? 'Migrating...' : 'Migrate localStorage to MongoDB'}
            </Button>
          </div>

          {status && (
            <div className={`p-4 rounded-lg ${status.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold mb-2 ${status.success ? 'text-green-800' : 'text-red-800'}`}>
                {status.success ? '✅ Success' : '❌ Error'}
              </h3>
              <pre className="text-sm overflow-auto bg-white p-3 rounded border">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Click "Test MongoDB Connection" to verify MongoDB is accessible</li>
              <li>If connection fails, check your MongoDB connection string in environment variables</li>
              <li>Click "Migrate localStorage to MongoDB" to transfer all existing data</li>
              <li>After migration, test connection again to see the new collections</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

