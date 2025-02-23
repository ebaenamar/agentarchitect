import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

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
      });
      mermaid.render('architecture-diagram', diagram).then((result) => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = result.svg;
        }
      });
    }
  }, [diagram]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div ref={diagramRef} className="bg-white p-8 rounded-lg shadow-lg" />
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Suggested Tools & Technologies</h2>
        <div className="space-y-4">
          {tools.map((tool, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-medium text-lg text-gray-800">{tool.component}</h3>
              <ul className="mt-2 space-y-1">
                {tool.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-gray-600">• {suggestion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
