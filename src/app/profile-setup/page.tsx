import ProfileCompletion from '@/components/auth/ProfileCompletion';

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <ProfileCompletion />
      </div>
    </div>
  );
} 