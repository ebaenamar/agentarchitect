import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI System Architect specializing in designing multi-agent systems.
Your task is to analyze requirements and generate:
1. A detailed system architecture using Mermaid diagram syntax
2. Specific tool suggestions for each component
3. A high-level execution plan

Follow these guidelines:
- Always include an Orchestrator Agent that coordinates other agents
- Use advanced prompting techniques (CoT, ToT, GoT) in the planning component
- Include memory components (short-term and long-term)
- Add monitoring and observability
- Consider security and scalability
- Break down complex tasks into subgoals

Output Format:
1. Architecture Diagram (in Mermaid syntax)
2. Component-specific tools and frameworks
3. Execution plan with agent interactions`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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
      max_tokens: 2000,
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
    return NextResponse.json(
      { error: 'Failed to generate architecture' },
      { status: 500 }
    );
  }
}
