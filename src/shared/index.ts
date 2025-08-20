export interface Card {
  id: string;
  title?: string;
  extraData?: string[];
  createdAt: string;
  updatedAt: string;
}

export type Activity = {
  name?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  cards?: Card[];
}

export type CardInput = {
  title?: string;
};


export type Message =
  | {
      type: "activity";
      activity: Activity;
    }
  | {
      type: "name";
      name: string;
    }
  | {
      type: "dates";
      startDate: string;
      endDate?: string;
      startTime?: string;
    }
  | {
      type: "card-create";
      card: Card;
    }
  | {
      type: "card-update";
      card: Card;
    }
  | {
      type: "card-delete";
      cardId: string;
    }
  | {
      type: "card-reorder";
      cardId: string;
      newIndex: number;
    }
  | {
      type: "card-extra-data-add";
      cardId: string;
      extraDataItem: string;
    }
  | {
      type: "card-extra-data-update";
      cardId: string;
      extraDataIndex: number;
      updatedItem: string;
    }
  | {
      type: "card-extra-data-delete";
      cardId: string;
      extraDataIndex: number;
    };
