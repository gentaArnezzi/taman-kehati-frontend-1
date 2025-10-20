// app/api/public/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    // Simulate chatbot response - in a real implementation, this would connect to an AI service
    const response = await simulateChatbotResponse(message);

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat message' 
    }, { status: 500 });
  }
}

async function simulateChatbotResponse(message: string): Promise<string> {
  // This is a placeholder implementation
  // In a real application, this would connect to an AI service like OpenAI
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('flora') || lowerMessage.includes('tumbuhan')) {
    return "Indonesia memiliki lebih dari 30.000 spesies flora, dengan sekitar 40% merupakan endemik. Beberapa contoh spesies langka termasuk Rafflesia arnoldii (bunga terbesar di dunia) dan Anggrek hitam Papua. Apakah Anda ingin informasi tentang spesies tertentu?";
  } else if (lowerMessage.includes('fauna') || lowerMessage.includes('hewan')) {
    return "Indonesia adalah rumah bagi lebih dari 500 spesies mammals dan 1.600 spesies burung. Beberapa spesies endemik terkenal termasuk Orangutan, Harimau Sumatra, Badak bercula satu Jawa, dan Komodo. Apakah Anda ingin informasi tentang spesies tertentu?";
  } else if (lowerMessage.includes('konservasi') || lowerMessage.includes('taman')) {
    return "Indonesia memiliki lebih dari 150 taman nasional dan kawasan konservasi yang melindungi keanekaragaman hayati. Taman-taman ini berperan penting dalam konservasi spesies langka dan ekosistem unik. Apakah Anda ingin informasi tentang taman tertentu?";
  } else if (lowerMessage.includes('selamat') && lowerMessage.includes('datang')) {
    return "Terima kasih! Saya adalah asisten virtual Taman Kehati, siap membantu Anda menjelajahi keanekaragaman hayati Indonesia. Anda dapat bertanya tentang spesies flora dan fauna, taman konservasi, atau program konservasi.";
  } else {
    return "Terima kasih atas pertanyaan Anda tentang keanekaragaman hayati Indonesia. Saya dapat memberikan informasi tentang spesies flora dan fauna endemik, taman konservasi, program konservasi, dan upaya perlindungan keanekaragaman hayati Indonesia. Silakan ajukan pertanyaan spesifik Anda.";
  }
}