'use client';

import { useState } from 'react';
import PromptForm from './components/PromptForm';
import ArchitectureDiagram from './components/ArchitectureDiagram';

interface Architecture {
  diagram: string;
  tools: Array<{
    component: string;
    suggestions: string[];
  }>;
  executionPlan: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 290000); // 4m50s timeout

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to generate architecture');
      }

      const data = await response.json();
      setArchitecture(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The system is taking longer than expected to generate your architecture. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Agent System Architect
          </h1>
          <p className="text-xl text-gray-600">
            Describe your AI agent requirements and get a customized system architecture
          </p>
        </div>

        <div className="space-y-12">
          <PromptForm onSubmit={handlePromptSubmit} />

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating your architecture...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          )}

          {architecture && !isLoading && (
            <ArchitectureDiagram
              diagram={architecture.diagram}
              tools={architecture.tools}
              executionPlan={architecture.executionPlan}
            />
          )}
        </div>
      </main>
    </div>
  );
}
