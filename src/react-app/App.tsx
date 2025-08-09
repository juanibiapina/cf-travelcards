import { ClerkProvider } from '@clerk/clerk-react'
import { Outlet, useParams } from "react-router";
import { useActivityRoom } from './hooks/useActivityRoom';
import { ActivityRoomProvider } from './hooks/ActivityRoomContext';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

function ActivityWrapper() {
  const params = useParams<{ activityId: string }>();
  const activityId = params.activityId;

  // Only use the room hook if we have an activityId (i.e., we're in an activity route)
  const roomData = useActivityRoom(activityId || '');

  // If we don't have an activityId, render without the provider
  if (!activityId) {
    return <Outlet />;
  }

  // Provide the room data to child components
  return (
    <ActivityRoomProvider value={roomData}>
      <Outlet />
    </ActivityRoomProvider>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <main>
        <ActivityWrapper />
      </main>
    </ClerkProvider>
  );
}

export default App;
