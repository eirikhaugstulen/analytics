import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
    Transfer,
    TransferOption,
    TabBar,
    Tab,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui-core'
import i18n from '@dhis2/d2-i18n'

import ItemSelector from './../ItemSelector/ItemSelector'
import FixedPeriodFilter from './FixedPeriodFilter'
import RelativePeriodFilter from './RelativePeriodFilter'

class PeriodSelector extends Component {
    state = {
        allPeriods: [],
        selectedPeriods: [],
        offeredPeriods: [], // TODO: Legacy, Transfer handles this internally
        isRelative: true,
    }

    constructor(props) {
        super(props)

        this.state.selectedPeriods = this.props.selectedItems
    }

    onIsRelativeClick = isRelative => {
        if (this.state.isRelative !== isRelative) {
            this.setState({ isRelative })
        }
    }

    onSelectPeriods = periodIds => {
        const offeredPeriods = this.state.offeredPeriods.filter(
            period => !periodIds.includes(period.id)
        )
        const newPeriods = this.state.offeredPeriods.filter(period =>
            periodIds.includes(period.id)
        )
        const selectedPeriods = this.state.selectedPeriods.concat(newPeriods)

        this.setState({ selectedPeriods, offeredPeriods })
        this.props.onSelect(selectedPeriods)
    }

    setSelectedPeriodOrder = periodIds => {
        const selectedPeriods = periodIds.map(id =>
            this.state.selectedPeriods.find(period => period.id === id)
        )

        this.setState({ selectedPeriods })
        this.props.onReorder(selectedPeriods)
    }

    onDeselectPeriods = periodIds => {
        const selectedPeriods = this.state.selectedPeriods.filter(
            period => !periodIds.includes(period.id)
        )
        const removedPeriods = this.state.selectedPeriods.filter(period =>
            periodIds.includes(period.id)
        )
        const offeredPeriods = this.state.allPeriods.filter(
            period => !selectedPeriods.map(p => p.id).includes(period.id)
        )

        this.setState({ selectedPeriods, offeredPeriods })
        this.props.onDeselect(removedPeriods)
    }

    initializeOfferedPeriods = (periods, initial = false) => {
        const selectedPeriods = initial
            ? this.props.selectedItems
            : this.state.selectedPeriods
        const offeredPeriods = periods.filter(
            period => !selectedPeriods.map(p => p.id).includes(period.id)
        )

        this.setState({ allPeriods: periods, offeredPeriods })
    }

    renderHeader = () => (
        <>
            <TabBar>
                <Tab
                    selected={this.state.isRelative}
                    onClick={() => this.onIsRelativeClick(true)}
                >
                    {i18n.t('Relative periods')}
                </Tab>
                <Tab
                    selected={!this.state.isRelative}
                    onClick={() => this.onIsRelativeClick(false)}
                >
                    {i18n.t('Fixed periods')}
                </Tab>
            </TabBar>

            <p style={{ margin: 0, height: 10 }} />
            <div>
                <SingleSelectField
                    label={i18n.t('Period type')}
                    onChange={() => {}}
                >
                    <SingleSelectOption value="hello type" label="world type" />
                </SingleSelectField>
                {!this.state.isRelative && (
                    <SingleSelectField
                        label={i18n.t('Year')}
                        onChange={() => {}}
                    >
                        <SingleSelectOption
                            value="hello year"
                            label="world year"
                        />
                    </SingleSelectField>
                )}
            </div>
        </>
    )

    render = () => {
        const filterZone = () => {
            if (!this.state.isRelative) {
                return (
                    <FixedPeriodFilter
                        setOfferedPeriods={this.initializeOfferedPeriods}
                    />
                )
            }

            return (
                <RelativePeriodFilter
                    setOfferedPeriods={this.initializeOfferedPeriods}
                />
            )
        }

        const unselected = {
            items: this.state.offeredPeriods,
            onSelect: this.onSelectPeriods,
            filterText: '',
        }

        const selected = {
            items: this.state.selectedPeriods,
            onDeselect: this.onDeselectPeriods,
            onReorder: this.setSelectedPeriodOrder,
        }

        const testoptions = this.state.allPeriods.map(item => (
            <TransferOption label={item.name} value={item.name} key={item.id} />
        ))

        return (
            <Fragment>
                <div style={{ display: 'flex', marginTop: '18px' }}>
                    <ItemSelector
                        itemClassName="period-selector"
                        unselected={unselected}
                        selected={selected}
                    >
                        {filterZone()}
                    </ItemSelector>
                </div>
                <Transfer
                    onChange={() => console.log('things changed')}
                    selected={this.state.selectedPeriods.map(item => ({
                        label: item.name,
                        value: item.name,
                        key: item.id,
                    }))}
                    leftHeader={this.renderHeader()}
                >
                    {testoptions}
                </Transfer>
            </Fragment>
        )
    }
}

PeriodSelector.propTypes = {
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
}

PeriodSelector.defaultProps = {
    selectedItems: [],
}

export default PeriodSelector
