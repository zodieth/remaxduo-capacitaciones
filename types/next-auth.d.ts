import "next-auth";

declare module "next-auth" {
  /**
   * Extiende los tipos de sesión para incluir los campos personalizados como `user.id`.
   */
  interface Session {
    user?: {
      id?: string;
      role?: string;
      email?: string;
      name?: string;
    };
  }
}

type Propiedad = {
  id: string;
  title: string;
  slug: string;
  location: object;
  totalRooms: number;
  bathrooms: number;
  price: number;
  priceExposure: boolean;
  currency: {
    value: string;
  };
  expensesPrice: number;
  expensesCurrency: object;
  displayAddress: string;
  internalId: string;
  dimensionLand: number;
  dimensionTotalBuilt: number;
  dimensionCovered: number;
  associate: {
    id: string;
    emails: [
      {
        value: string;
      },
    ];
    name: string;
  };
  listBroker: [];
  type: object;
  operation: object;
  listingStatus: object;
  photos: [
    {
      value: string;
    },
  ];
  addressInfo: string;
  billingFrequency: boolean;
};
