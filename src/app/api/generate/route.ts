import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure timeout for the API route (Vercel hobby plan limit)
export const maxDuration = 60; // 60 seconds maximum for hobby plan
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI System Architect. Create concise, efficient multi-agent systems.

Output Format:
1. Mermaid diagram
2. Tools per component
3. Brief execution plan

Requirements:
- Orchestrator Agent
- Memory (short/long-term)
- Monitoring
- Security
- Tool integration`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Analyze these requirements and generate a complete multi-agent system architecture: ${prompt}

Please structure your response as follows:
1. First, output a Mermaid diagram between \`\`\`mermaid tags
2. Then list "Tools:" followed by component:tool1,tool2,tool3 format
3. Finally, provide a brief execution plan

The Mermaid diagram should show:
- Orchestrator Agent with planning capabilities
- Memory systems (short-term, long-term)
- Tool integration
- Agent communication paths
- Monitoring and security components`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'text' },
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');

    // Extract the Mermaid diagram
    const diagramMatch = response.match(/\`\`\`mermaid([\s\S]*?)\`\`\`/);
    const diagram = diagramMatch ? diagramMatch[1].trim() : '';

    // Extract tools section
    const toolsMatch = response.match(/Tools:([\s\S]*?)(?=Execution Plan:|$)/s);
    const toolsText = toolsMatch ? toolsMatch[1].trim() : '';

    // Parse tools into structured format
    const tools = toolsText
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [component, ...suggestions] = line.split(':').map(s => s.trim());
        return {
          component,
          suggestions: suggestions.join(':').split(',').map(s => s.trim()),
        };
      });

    // Extract execution plan
    const planMatch = response.match(/Execution Plan:([\s\S]*?)$/s);
    const executionPlan = planMatch ? planMatch[1].trim() : '';

    return NextResponse.json({ 
      diagram, 
      tools,
      executionPlan 
    });
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'Failed to generate architecture';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
