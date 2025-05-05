import { redirect } from 'next/navigation';

export default function AboutPage() {
  redirect('/');  // Redirect to home page
  return null;
} 