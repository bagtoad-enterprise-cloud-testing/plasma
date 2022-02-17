import {IItemBoxProps, ITooltipProps, ListBox, ListBoxConnected, UUID} from '@coveord/plasma-react';
import * as React from 'react';

import PlasmaComponent from '../../building-blocs/PlasmaComponent';

// start-print

export class ListBoxExamples extends React.Component {
    render() {
        const triggerAlertFunction = (item: IItemBoxProps) => {
            alert(`The item value triggered is ${item.value}`);
        };

        const tooltip: ITooltipProps = {
            title: 'title test',
            placement: 'bottom',
            container: 'body',
        };
        const defaultItems: IItemBoxProps[] = [
            {value: 'test'},
            {value: 'test1'},
            {value: 'test2 disabled', disabled: true},
            {value: 'test3', tooltip: tooltip},
            {value: 'test4'},
            {value: 'test5'},
            {value: 'test6'},
            {value: 'test7'},
        ];

        const clickableItems: IItemBoxProps[] = defaultItems.concat([
            {
                value: 'test8',
                onOptionClick: triggerAlertFunction,
            },
        ]);

        return (
            <PlasmaComponent id="ListBox" title="List Box" withSource>
                <div className="mt2 mod-width-50">
                    <div className="form-group">
                        <label className="form-control-label">Default List Box</label>
                        <div className="form-control">
                            <ListBox items={defaultItems} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">Loading List Box</label>
                        <div className="form-control">
                            <ListBox items={defaultItems} isLoading />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">List Box with no items</label>
                        <div className="form-control">
                            <ListBox items={[]} noResultItem={{value: 'no items'}} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">List Box with an trigger on click items</label>
                        <div className="form-control">
                            <ListBox items={defaultItems} selected={['test1']} onOptionClick={triggerAlertFunction} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">List Box with an onClick event on the last element</label>
                        <div className="form-control">
                            <ListBox items={clickableItems} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">List Box Connected (single)</label>
                        <div className="form-control">
                            <ListBoxConnected id={UUID.generate()} items={defaultItems} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label">List Box Connected (multi)</label>
                        <div className="form-control">
                            <ListBoxConnected id={UUID.generate()} items={defaultItems} multi />
                        </div>
                    </div>
                </div>
            </PlasmaComponent>
        );
    }
}
export default ListBoxExamples;