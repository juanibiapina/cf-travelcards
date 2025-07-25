import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSession } from '@hono/auth-js/react';
import { FiAlertTriangle } from "react-icons/fi";
import LoadingCard from "../components/LoadingCard";
import Card from "../components/Card";
import ActivityHeader from "../components/ActivityHeader";
import CardCreationModal from "../components/cards/CardCreationModal";
import CardsList from "../components/cards/CardsList";
import { useActivityRoom } from "../hooks/useActivityRoom";
import { LinkCard, PollCard, LinkCardInput, PollCardInput } from "../../shared";

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { activity, loading, updateName, updateDates, createCard, updateCard, deleteCard, isConnected } = useActivityRoom(params.activityId || '');

  const handleCreateCard = (cardData: LinkCardInput | PollCardInput) => {
    if (!isConnected) return;

    const base = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (cardData.type === 'link') {
      const newCard: LinkCard = {
        ...cardData,
        ...base,
      };
      createCard(newCard);
    } else if (cardData.type === 'poll') {
      const newCard: PollCard = {
        ...cardData,
        ...base,
      };
      createCard(newCard);
    }
  };

  const handleUpdateCard = (card: LinkCard) => {
    if (!isConnected) return;
    updateCard(card);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleNameUpdate = (name: string) => {
    if (isConnected) {
      updateName(name);
    }
  };

  const handleDateChange = (startDate: string, endDate?: string, startTime?: string) => {
    if (!isConnected) return;
    updateDates(startDate, endDate, startTime);
  };

  useEffect(() => {
    // Only redirect if authentication is complete and user is not authenticated
    if (status !== "loading" && !session) {
      // Store the current URL as a redirect parameter
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/?redirect=${redirectUrl}`);
      return;
    }
  }, [session, status, navigate, location]);

  // Show loading while authentication status is being determined
  if (status === "loading") {
    return <LoadingCard />;
  }

  // Don't render anything if not authenticated (after loading is complete)
  if (!session) {
    return null;
  }

  if (loading) {
    return <LoadingCard />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FiAlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">We couldn't load your activity. Please try again.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityHeader
        activityName={activity?.name}
        startDate={activity?.startDate}
        endDate={activity?.endDate}
        startTime={activity?.startTime}
        onNameUpdate={handleNameUpdate}
        onDateChange={handleDateChange}
        onCreateCard={() => setIsCreateModalOpen(true)}
        disabled={!isConnected}
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Cards List */}
        <CardsList
          cards={activity?.cards || []}
          userId={session?.user?.id || ''}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
        />

        <CardCreationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleUpdateCard}
          editingCard={undefined}
        />
      </div>
    </div>
  );
};

export default OverviewPage;
