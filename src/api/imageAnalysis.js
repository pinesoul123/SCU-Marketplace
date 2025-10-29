const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Converts file to base64 for API calls
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; 
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

//Analyzes image using OpenAI
async function analyzeWithOpenAI(imageFile) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const base64Image = await fileToBase64(imageFile);
    
    // Times out after 60 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and provide objective product information for a marketplace listing. 
                Return a JSON object with the following structure:
                {
                  "title": "Descriptive product title (max 60 characters)",
                  "price": "Estimated price in USD (number only, no currency symbol)",
                  "description": "Factual product description (2-3 sentences)",
                  "category": "One of: Furniture, Appliances, Books, Clothes, Other",
                  "condition": "One of: New, Used - Very Good, Used - Moderate",
                }
                
                Guidelines:
                - Be objective and factual, not promotional
                - Describe what you see: brand, model, color, size, visible features
                - Note any visible wear, damage, or condition issues
                - Avoid subjective language like "perfect for", "great for", "excellent"
                - Focus on observable facts about the item's appearance and condition
                - Estimate market price based on similar items`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Fallback analysis if OpenAI fails
async function analyzeWithFallback(imageFile) {
  const fileName = imageFile.name.toLowerCase();
  const fileSize = imageFile.size;
  
  let category = 'Other';
  if (fileName.includes('book') || fileName.includes('textbook')) {
    category = 'Books';
  } else if (fileName.includes('chair') || fileName.includes('table') || fileName.includes('desk')) {
    category = 'Furniture';
  } else if (fileName.includes('shirt') || fileName.includes('dress') || fileName.includes('pant') || fileName.includes('clothes')) {
    category = 'Clothes';
  } else if (fileName.includes('laptop') || fileName.includes('phone') || fileName.includes('electronic') || fileName.includes('appliance')) {
    category = 'Appliances';
  }

  return {
    title: fileName.split('.')[0].replace(/[-_]/g, ' '),
    price: 25.00, 
    description: `This item could not be found. Please fill in all fields.`,
    category: category,
    condition: 'Used - Very Good'
  };
}

// Main function
export async function analyzeImage(imageFile) {
  if (!imageFile) {
    throw new Error('No image file provided');
  }

  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (imageFile.size > 10 * 1024 * 1024) {
    throw new Error('Image file too large (max 10MB)');
  }

  // Try OpenAI
  try {
    console.log('Analyzing image with OpenAI...');
    const openaiResult = await analyzeWithOpenAI(imageFile);
    console.log('OpenAI result:', openaiResult);
    return {
      ...openaiResult,
      method: 'openai'
    };
  } catch (error) {
    console.warn('OpenAI analysis failed:', error.message);
    
  }

  // Fallback 
  console.log('Using fallback analysis...');
  return {
    ...await analyzeWithFallback(imageFile),
    method: 'fallback'
  };
}


