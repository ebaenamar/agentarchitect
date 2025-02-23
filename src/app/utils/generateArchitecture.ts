export async function generateArchitecture(prompt: string) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate architecture');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating architecture:', error);
    throw error;
  }
}
