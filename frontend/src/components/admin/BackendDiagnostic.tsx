'use client';

import React, { useState } from 'react';
import { testBackendConnection } from '@/lib/testBackend';
import { Button } from '@/components/ui';

export function BackendDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    try {
      const testResults = await testBackendConnection();
      setResults(testResults);
    } catch (error: any) {
      setResults({ error: error.toString() });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Diagnóstico del Backend</h3>
      
      <Button onClick={runTest} loading={testing} className="mb-4">
        {testing ? 'Probando...' : 'Probar Conexión'}
      </Button>

      {results && (
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Estado:</strong>
            <ul className="mt-2 space-y-1">
              <li>Health: {results.health ? '✅' : '❌'}</li>
              <li>Auth: {results.auth ? '✅' : '❌'}</li>
              <li>Requests: {results.requests ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div className="text-sm">
            <strong>Detalles:</strong>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {results.details?.map((detail: string, index: number) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}