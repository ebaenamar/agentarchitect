import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import ExportOptions from './ExportOptions';

interface ArchitectureDiagramProps {
  diagram: string;
  tools: Array<{
    component: string;
    suggestions: Array<string>;
  }>;
}

export default function ArchitectureDiagram({ diagram, tools }: ArchitectureDiagramProps) {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
        flowchart: {
          curve: 'basis',
          padding: 20,
        },
      });
      mermaid.render('architecture-diagram', diagram).then((result) => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = result.svg;
          // Add zoom and pan behavior to SVG
          const svg = diagramRef.current.querySelector('svg');
          if (svg) {
            svg.style.cursor = 'grab';
            let isPanning = false;
            let startPoint = { x: 0, y: 0 };
            let currentTranslate = { x: 0, y: 0 };

            svg.addEventListener('mousedown', (e) => {
              isPanning = true;
              svg.style.cursor = 'grabbing';
              startPoint = { x: e.clientX - currentTranslate.x, y: e.clientY - currentTranslate.y };
            });

            window.addEventListener('mousemove', (e) => {
              if (!isPanning) return;
              e.preventDefault();
              const x = e.clientX - startPoint.x;
              const y = e.clientY - startPoint.y;
              currentTranslate = { x, y };
              svg.style.transform = `translate(${x}px, ${y}px)`;
            });

            window.addEventListener('mouseup', () => {
              isPanning = false;
              svg.style.cursor = 'grab';
            });
          }
        }
      });
    }
  }, [diagram]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800">System Architecture</h2>
          <p className="text-sm text-gray-600">Click and drag to pan the diagram</p>
        </div>
        <div ref={diagramRef} className="p-8 mermaid overflow-hidden" />
        <ExportOptions diagram={diagram} tools={tools} />
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800">Suggested Tools & Technologies</h2>
          <p className="text-sm text-gray-600">Recommended implementations for each component</p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <h3 className="font-medium text-lg text-gray-800 mb-3">{tool.component}</h3>
                <ul className="space-y-2">
                  {tool.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
