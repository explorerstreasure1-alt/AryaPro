import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS preflight isteği (OPTIONS) için yanıt
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Sadece POST isteklerine izin ver
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // FormData'dan dosyayı al
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'Dosya gönderilmedi' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Vercel Blob'a yükle (token'ı parametre olarak geçmeye gerek yok, SDK environment'dan alır)
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // dosya adı çakışmasını önler
    });

    // Başarılı yanıt: yüklenen dosyanın public URL'si
    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
