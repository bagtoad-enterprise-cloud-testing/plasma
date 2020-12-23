import {ReactWrapper} from 'enzyme';
import {mountWithStore} from 'enzyme-redux';
import * as React from 'react';
import {act} from 'react-dom/test-utils';
import * as _ from 'underscore';

import {getStoreMock} from '../../../utils/tests/TestUtils';
import {TableHOC} from '../TableHOC';
import {tableWithEmptyState} from '../TableWithEmptyState';

describe('TableWithEmptyState', () => {
    const TableWithEmptyState = tableWithEmptyState(TableHOC);
    const EmptyState: React.FunctionComponent = () => <div>No data!</div>;

    it('renders and unmounts without throwing errors', () => {
        expect(() => {
            const table = mountWithStore(
                <TableWithEmptyState id="🌶" data={[]} renderBody={() => null} emptyState={<EmptyState />} />,
                getStoreMock()
            );
            table.unmount();
        }).not.toThrow();
    });

    it('renders the empty state if the table is empty after waiting 50 ms', () => {
        jasmine.clock().install();
        let table: ReactWrapper;
        act(() => {
            table = mountWithStore(
                <TableWithEmptyState id="🌶" data={[]} renderBody={() => null} emptyState={<EmptyState />} />,
                getStoreMock()
            );
        });

        expect(table.children().children().type()).toBe(TableHOC);

        jasmine.clock().tick(50);
        table.update();

        expect(table.children().children().type()).toBe(EmptyState);

        jasmine.clock().uninstall();
    });

    it('renders the table if the table is empty after waiting 50 ms but still loading', () => {
        jasmine.clock().install();
        let table: ReactWrapper;
        act(() => {
            table = mountWithStore(
                <TableWithEmptyState id="🌶" data={[]} renderBody={() => null} emptyState={<EmptyState />} isLoading />,
                getStoreMock()
            );
        });

        jasmine.clock().tick(50);
        table.update();

        expect(table.children().children().type()).toBe(TableHOC);

        jasmine.clock().uninstall();
    });

    it('renders the table if the table is not empty after waiting 50 ms', () => {
        jasmine.clock().install();
        let table: ReactWrapper;
        act(() => {
            table = mountWithStore(
                <TableWithEmptyState id="🌶" data={['🤓']} renderBody={() => null} emptyState={<EmptyState />} />,
                getStoreMock()
            );
        });

        jasmine.clock().tick(50);
        table.update();

        expect(table.children().children().type()).toBe(TableHOC);

        jasmine.clock().uninstall();
    });
});