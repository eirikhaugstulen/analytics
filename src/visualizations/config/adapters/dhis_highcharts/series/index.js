import getCumulativeData from './../getCumulativeData'
import getPie from './pie'
import getGauge from './gauge'
import getType from '../type'
import {
    getFullIdAxisMap,
    getAxisIdsMap,
    hasCustomAxes,
} from '../customAxes'
import { generateColors } from '../../../../util/colors/gradientColorGenerator'
import {
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
    isDualAxisType,
    isYearOverYear,
    VIS_TYPE_LINE,
} from '../../../../../modules/visTypes'
import { getAxisStringFromId } from '../../../../util/axisId'

const DEFAULT_ANIMATION_DURATION = 200

const HIGHCHARTS_TYPE_COLUMN = 'column'
const HIGHCHARTS_TYPE_BAR = 'bar'
const HIGHCHARTS_TYPE_PERCENT = 'percent'
const HIGHCHARTS_TYPE_NORMAL = 'normal'

const INCREASED_Z_INDEX = 1

const epiCurveTypes = [HIGHCHARTS_TYPE_COLUMN, HIGHCHARTS_TYPE_BAR]

function getAnimation(option, fallback) {
    return typeof option === 'number' ? option : fallback
}

function getColor(colors, index) {
    return colors[index] || getColor(colors, index - colors.length)
}

function getIdColorMap(series, layout, extraOptions) {
    const filteredSeries = layout.series.filter(layoutSeriesItem => series.some(seriesItem => seriesItem.id === layoutSeriesItem.dimensionItem))
    if (isDualAxisType(layout.type) && hasCustomAxes(filteredSeries)) {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        const theme = extraOptions.multiAxisTheme

        const colorsByAxis = Object.keys(axisIdsMap).reduce((map, axis) => {
            const numberOfIds = axisIdsMap[axis].length
            map[axis] = generateColors(
                theme[axis].startColor,
                theme[axis].endColor,
                numberOfIds,
                true
            )
            return map
        }, {})

        return Object.keys(colorsByAxis).reduce((map, axis) => {
            const colors = colorsByAxis[axis]
            const ids = axisIdsMap[axis]

            ids.forEach((id, index) => {
                map[id] = colors[index]
            })

            return map
        }, {})
    } else {
        const colors = extraOptions.colors

        return series.reduce((map, s, index) => {
            map[s.id] = getColor(colors, index)
            return map
        }, {})
    }
}

function getDefault(series, layout, isStacked, extraOptions) {
    const fullIdAxisMap = getFullIdAxisMap(layout.series, series)
    const idColorMap = getIdColorMap(series, layout, extraOptions)

    series.forEach((seriesObj, index) => {
        // show values
        if (layout.showValues || layout.showData) {
            seriesObj.dataLabels = {
                enabled: true,
            }
        }

        // stacked
        if (isStacked) {
            // DHIS2-1060: stacked charts can optionally be shown as 100% stacked charts
            seriesObj.stacking =
                layout.percentStackedValues === true
                    ? HIGHCHARTS_TYPE_PERCENT
                    : HIGHCHARTS_TYPE_NORMAL
        }
        
        const matchedObject = layout.series?.find(item => item.dimensionItem === seriesObj.id)
        
        if (matchedObject) { // Checks if the item has custom options
            if (matchedObject.type) {
                seriesObj.type = getType(matchedObject.type).type

                if (matchedObject.type === VIS_TYPE_LINE) {
                    seriesObj.zIndex = INCREASED_Z_INDEX // Custom options, item type Line
                }
            } else if (layout.type === VIS_TYPE_LINE) {
                seriesObj.zIndex = INCREASED_Z_INDEX // Custom options, no item type, visType Line
            }
        } else if (layout.type === VIS_TYPE_LINE) {
            seriesObj.zIndex = INCREASED_Z_INDEX // No custom options, visType Line
        }

        // DHIS2-2101
        // show bar/column chart as EPI curve (basically remove spacing between bars/columns)
        if (layout.noSpaceBetweenColumns && epiCurveTypes.includes(getType(layout.type).type)) {
            seriesObj.pointPadding = 0
            seriesObj.groupPadding = 0
        }

        // color
        seriesObj.color = isYearOverYear(layout.type)
            ? extraOptions.colors[index]
            : idColorMap[seriesObj.id]

        // axis number
        seriesObj.yAxis = isDualAxisType(layout.type)
            ? getAxisStringFromId(fullIdAxisMap[seriesObj.id])
            : getAxisStringFromId(0)

        // custom names for "year over year" series
        if (extraOptions.yearlySeries) {
            seriesObj.name = extraOptions.yearlySeries[index]
        }
    })

    // DHIS2-701: use cumulative values
    if (layout.cumulativeValues === true) {
        series = getCumulativeData(series)
    }

    return series
}

export default function(series, store, layout, isStacked, extraOptions) {
    switch (layout.type) {
        case VIS_TYPE_PIE:
            series = getPie(
                series,
                store,
                layout,
                isStacked,
                extraOptions.colors
            )
            break
        case VIS_TYPE_GAUGE:
            series = getGauge(series, layout, extraOptions.legendSets[0])
            break
        default:
            series = getDefault(series, layout, isStacked, extraOptions)
    }

    series.forEach(seriesObj => {
        // animation
        seriesObj.animation = {
            duration: getAnimation(
                extraOptions.animation,
                DEFAULT_ANIMATION_DURATION
            ),
        }
    })

    return series
}
