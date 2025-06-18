// src/app/_actions/user-actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const BookmarkSchema = z.object({
  storyId: z.string(),
});

// Server action để bookmark truyện
export async function bookmarkStory(formData: FormData) {
  const validatedFields = BookmarkSchema.safeParse({
    storyId: formData.get('storyId'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid storyId' };
  }

  const { storyId } = validatedFields.data;
  
  // Kiểm tra đăng nhập
  const token = cookies().get('auth_token')?.value;
  
  if (!token) {
    redirect('/login?returnUrl=' + encodeURIComponent(`/story/${storyId}`));
  }
  
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ storyId }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      return { error: data.message };
    }
    
    return { success: true };
  } catch (error) {
    return { error: 'Failed to bookmark story' };
  }
}