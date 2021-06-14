import i18n from '@dhis2/d2-i18n'

export const AO_TYPE_VISUALIZATION = 'visualization'
export const AO_TYPE_MAP = 'map'
export const AO_TYPE_EVENT_CHART = 'eventChart'
export const AO_TYPE_EVENT_REPORT = 'eventReport'

export const AOTypeMap = {
    [AO_TYPE_VISUALIZATION]: {
        apiEndpoint: 'visualizations',
    },
    [AO_TYPE_MAP]: {
        apiEndpoint: 'maps',
    },
    [AO_TYPE_EVENT_CHART]: {
        apiEndpoint: 'eventCharts',
    },
    [AO_TYPE_EVENT_REPORT]: {
        apiEndpoint: 'eventReports',
    },
}

export const getTranslatedString = (type, key) => {
    let texts = {
        modalTitle: i18n.t('Open'),
        loadingText: i18n.t('Loading'),
        errorTitle: i18n.t("Couldn't load items"),
        errorText: i18n.t(
            'There was a problem loading items. Try again or contact your system administrator.'
        ),
        noDataText: i18n.t('No items found. Create a new to get started.'),
        noFilteredDataText: i18n.t(
            "No items found. Try adjusting your search or filter options to find what you're looking for."
        ),
        newButtonLabel: i18n.t('Create new'),
    }

    switch (type) {
        case 'visualization': {
            texts = {
                modalTitle: i18n.t('Open a visualization'),
                loadingText: i18n.t('Loading visualizations'),
                errorTitle: i18n.t("Couldn't load visualizations"),
                errorText: i18n.t(
                    'There was a problem loading visualizations. Try again or contact your system administrator.'
                ),
                noDataText: i18n.t(
                    'No visualizations found. Click New visualization to get started.'
                ),
                noFilteredDataText: i18n.t(
                    "No visualizations found. Try adjusting your search or filter options to find what you're looking for."
                ),
                newButtonLabel: i18n.t('New visualization'),
            }
            break
        }
        case 'map': {
            texts = {
                modalTitle: i18n.t('Open a map'),
                loadingText: i18n.t('Loading maps'),
                errorTitle: i18n.t("Couldn't load maps"),
                errorText: i18n.t(
                    'There was a problem loading maps. Try again or contact your system administrator.'
                ),
                noDataText: i18n.t(
                    'No maps found. Click New map to get started.'
                ),
                noFilteredDataText: i18n.t(
                    "No maps found. Try adjusting your search or filter options to find what you're looking for."
                ),
                newButtonLabel: i18n.t('New map'),
            }
            break
        }
    }

    return texts[key]
}
