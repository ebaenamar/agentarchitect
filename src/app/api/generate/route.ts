import { NextResponse } from 'next/server';

interface Requirements {
  needsMemory: boolean;
  needsAPI: boolean;
  needsML: boolean;
  needsNLP: boolean;
  needsStreaming: boolean;
}

interface ToolSuggestion {
  component: string;
  suggestions: string[];
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const architecture = generateSampleArchitecture(prompt);
    return NextResponse.json(architecture);
  } catch {
    return NextResponse.json({ error: 'Failed to generate architecture' }, { status: 500 });
  }
}

function generateSampleArchitecture(prompt: string) {
  const requirements = analyzePrompt(prompt);
  
  return {
    diagram: generateDiagram(requirements),
    tools: generateToolSuggestions(requirements)
  };
}

function analyzePrompt(prompt: string): Requirements {
  const lowerPrompt = prompt.toLowerCase();
  return {
    needsMemory: lowerPrompt.includes('memory') || lowerPrompt.includes('storage'),
    needsAPI: lowerPrompt.includes('api') || lowerPrompt.includes('endpoint'),
    needsML: lowerPrompt.includes('ml') || lowerPrompt.includes('machine learning'),
    needsNLP: lowerPrompt.includes('nlp') || lowerPrompt.includes('language'),
    needsStreaming: lowerPrompt.includes('stream') || lowerPrompt.includes('real-time'),
  };
}

function generateDiagram(requirements: Requirements): string {
  let diagram = `
graph TB
    User((User)) --> |Input| Agent

    subgraph "Agent Core"
        Agent[Agent]
        ActionExecutor[Action Executor]
        Agent --> ActionExecutor
    end
  `;

  if (requirements.needsMemory) {
    diagram += `
    subgraph "Memory Subsystem"
        MemoryManager[Memory Manager]
        STM[Short-Term Memory]
        LTM[Long-Term Memory]
        MemoryManager --> STM
        MemoryManager --> LTM
    end
    Agent <--> MemoryManager
    `;
  }

  if (requirements.needsML) {
    diagram += `
    subgraph "ML Pipeline"
        MLProcessor[ML Processor]
        ModelRegistry[Model Registry]
        MLProcessor --> ModelRegistry
    end
    Agent <--> MLProcessor
    `;
  }

  diagram += `
    ActionExecutor --> |Output| User
  `;

  return diagram;
}

function generateToolSuggestions(requirements: Requirements): ToolSuggestion[] {
  const tools: ToolSuggestion[] = [
    {
      component: 'Agent Core',
      suggestions: [
        'LangChain for agent orchestration',
        'OpenAI GPT-4 for decision making',
        'FastAPI for API endpoints'
      ]
    }
  ];

  if (requirements.needsMemory) {
    tools.push({
      component: 'Memory Subsystem',
      suggestions: [
        'Redis for short-term memory',
        'PostgreSQL for long-term storage',
        'Vector embeddings with Pinecone'
      ]
    });
  }

  if (requirements.needsML) {
    tools.push({
      component: 'ML Pipeline',
      suggestions: [
        'PyTorch or TensorFlow for ML models',
        'MLflow for model registry',
        'Ray for distributed training'
      ]
    });
  }

  return tools;
}
