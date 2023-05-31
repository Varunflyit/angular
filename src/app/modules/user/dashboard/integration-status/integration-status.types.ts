export interface IIntegrationStatusDataDistribution {
  '7_days': number;
  '14_days': number;
  '30_days': number;
}

export interface IntegrationStatusResponse {
  id: string;
  active_status: string;
  status: string;
  integration: {
    id: string;
    name: string;
    logo: string;
  };
  orders: {
    synced: IIntegrationStatusDataDistribution;
    order_value: IIntegrationStatusDataDistribution;
    percent_order_value: IIntegrationStatusDataDistribution;
    errors: number;
  };
  trackings: {
    synced: IIntegrationStatusDataDistribution;
    errors: number;
  };
  products: {
    synced: IIntegrationStatusDataDistribution;
    errors: number;
  };
}
