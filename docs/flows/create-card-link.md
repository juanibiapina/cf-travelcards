# Create Card

This flow describes how users can create a new card within an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards or "No cards yet" message

2. **Open Card Creation Modal**
   - User clicks the "Create Card" button (with plus icon)
   - A modal opens titled "Create Card"

3. **Fill Card Information**
   - User fills in:
     - **Title** - Display name for the card

4. **Submit or Cancel**
   - User clicks "Create Card" to submit the form
   - Alternatively, user can click "Cancel" or "X" to close without saving

5. **Card Created and Displayed**
   - Modal closes automatically on successful creation
   - New card appears immediately in the cards list
   - Card displays:
     - Title (if provided)
     - Context menu for edit/delete actions

## Card Features

- **Real-time Sync**: Card creation is synchronized across all connected users via WebSocket
- **Edit/Delete**: Cards can be edited or deleted via context menu (three dots)
- **Responsive Design**: Cards display properly on mobile and desktop

## Limitations

- All fields are optional, which may result in cards with minimal information

## Tests

- [Card Creation E2E Test](../../tests/e2e/card-creation.spec.ts)
- [LinkCard Component Unit Tests](../../src/react-app/components/cards/LinkCard.test.tsx)
- [CardCreationModal Unit Tests](../../src/react-app/components/cards/CardCreationModal.test.tsx)
- [CardsList Component Unit Tests](../../src/react-app/components/cards/CardsList.test.tsx)
