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
   - User clicks the floating action button (plus icon) in the bottom right
   - A sleek, modern modal opens with a single input field

3. **Fill Card Information**
   - User enters text in the input field:
     - **Placeholder**: "What's on your mind?" for new cards
     - **Placeholder**: "Update card..." for editing existing cards
   - Input automatically receives focus when modal opens

4. **Submit or Cancel**
   - User presses Enter or clicks "Create"/"Update" button to submit
   - User presses Escape, clicks "Cancel", or clicks outside modal to close without saving
   - Create/Update button is disabled when input is empty

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
