import isArray from 'd2-utilizr/lib/isArray'

export default function(filters, metaData) {
    let title

    if (isArray(filters) && filters.length) {
        title = ''

        filters.forEach((dimension, index, array) => {
            const filterItems = metaData.dimensions[dimension.dimension]

            if (isArray(filterItems)) {
                const l = filterItems.length

                for (let i = 0; i < l; i++) {
                    const id = filterItems[i]

                    // if the value is present in items take the name to show from there
                    if (metaData.items[id]) {
                        title +=
                            metaData.items[id].name + (i < l - 1 ? ', ' : '')
                    }
                    // otherwise use the values directly
                    // this is a temporary fix to avoid app crashing when using filters with data items in EV
                    else {
                        title +=
                            metaData.items[dimension.dimension].name +
                            ': ' +
                            filterItems.join(', ')

                        break
                    }
                }

                title += index < array.length - 1 ? ' - ' : ''
            }
        })
    }

    return title || null
}
