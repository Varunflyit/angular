export interface SyncLog {
    syncId: string;
    installationId: string;
    integrationId: string;
    niceDate: string;
    sourceName: string;
    sourceIcon: string;
    neatSourceURL: string;
    sourceId: string;
    destinationId: string;
    shortMessage: string;
    result: {
        badgeColor: string;
        message: string;
    };
    actionRequired: true;
    showSuggestSync: false;
    showResync: true;
    isCustom: false;
    detailView: {
        payload: string;
        response: string;
        detail1: string;
    };
}

export interface OrderFilterObject {
    search: string;
    created_date: string;
    integration_ids: string | number;
    status: string;
    lifecycle: string;
    action_required: string | boolean;
}
