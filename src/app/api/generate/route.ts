import { NextResponse } from 'next/server';

interface Requirements {
  needsMemory: boolean;
  needsAPI: boolean;
  needsML: boolean;
  needsNLP: boolean;
  needsStreaming: boolean;
  needsSecurity: boolean;
  needsMonitoring: boolean;
  needsScaling: boolean;
  needsDataProcessing: boolean;
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
    needsSecurity: lowerPrompt.includes('security') || lowerPrompt.includes('auth'),
    needsMonitoring: lowerPrompt.includes('monitor') || lowerPrompt.includes('observability'),
    needsScaling: lowerPrompt.includes('scale') || lowerPrompt.includes('distributed'),
    needsDataProcessing: lowerPrompt.includes('data') || lowerPrompt.includes('processing'),
  };
}

function generateDiagram(requirements: Requirements): string {
  let diagram = `
graph TB
    User((User)) --> |Input| API[API Gateway]
    API --> Agent[Agent Core]

    subgraph "Agent System"
        Agent --> Orchestrator[Orchestrator]
        Orchestrator --> ActionExecutor[Action Executor]
        Orchestrator --> Planning[Planning Engine]
        Planning --> Reflection[Reflection Module]
    end
  `;

  if (requirements.needsSecurity) {
    diagram += `
    subgraph "Security Layer"
        Auth[Authentication]
        AuthZ[Authorization]
        Audit[Audit Log]
        Auth --> AuthZ
        AuthZ --> Audit
    end
    API --> Auth
    `;
  }

  if (requirements.needsMemory) {
    diagram += `
    subgraph "Memory Subsystem"
        MemoryManager[Memory Manager]
        STM[Short-Term Memory]
        LTM[Long-Term Memory]
        VectorStore[Vector Store]
        MemoryManager --> STM
        MemoryManager --> LTM
        MemoryManager --> VectorStore
    end
    Agent <--> MemoryManager
    `;
  }

  if (requirements.needsML) {
    diagram += `
    subgraph "ML Pipeline"
        MLProcessor[ML Processor]
        ModelRegistry[Model Registry]
        Training[Training Pipeline]
        MLProcessor --> ModelRegistry
        ModelRegistry --> Training
    end
    Agent <--> MLProcessor
    `;
  }

  if (requirements.needsDataProcessing) {
    diagram += `
    subgraph "Data Processing"
        DataIngestion[Data Ingestion]
        ETL[ETL Pipeline]
        DataStore[Data Lake]
        DataIngestion --> ETL
        ETL --> DataStore
    end
    Agent <--> DataIngestion
    `;
  }

  if (requirements.needsMonitoring) {
    diagram += `
    subgraph "Observability"
        Metrics[Metrics Collector]
        Traces[Distributed Tracing]
        Logs[Log Aggregator]
        Dashboard[Monitoring Dashboard]
        Metrics --> Dashboard
        Traces --> Dashboard
        Logs --> Dashboard
    end
    Agent -.-> Metrics
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
        'FastAPI for API endpoints',
        'Celery for task queue management'
      ]
    }
  ];

  if (requirements.needsSecurity) {
    tools.push({
      component: 'Security Layer',
      suggestions: [
        'Auth0 for authentication',
        'OPA (Open Policy Agent) for authorization',
        'AWS CloudTrail for audit logging',
        'Vault for secrets management'
      ]
    });
  }

  if (requirements.needsMemory) {
    tools.push({
      component: 'Memory Subsystem',
      suggestions: [
        'Redis for short-term memory',
        'PostgreSQL for long-term storage',
        'Pinecone for vector embeddings',
        'Milvus for vector similarity search'
      ]
    });
  }

  if (requirements.needsML) {
    tools.push({
      component: 'ML Pipeline',
      suggestions: [
        'PyTorch or TensorFlow for ML models',
        'MLflow for model registry',
        'Kubeflow for ML pipelines',
        'Ray for distributed training'
      ]
    });
  }

  if (requirements.needsDataProcessing) {
    tools.push({
      component: 'Data Processing',
      suggestions: [
        'Apache Kafka for data streaming',
        'Apache Spark for ETL',
        'Delta Lake for data lake',
        'dbt for data transformation'
      ]
    });
  }

  if (requirements.needsMonitoring) {
    tools.push({
      component: 'Observability',
      suggestions: [
        'Prometheus for metrics',
        'Jaeger for distributed tracing',
        'ELK Stack for log aggregation',
        'Grafana for dashboards'
      ]
    });
  }

  return tools;
}
