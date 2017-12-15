import { ITableProps } from '../Table';
import * as _ from 'underscore';
import { DEFAULT_TABLE_DATA } from '../TableConstants';

export const tablePropsMock: ITableProps = {
  id: 'super-table',
  headingAttributes: [
    {
      attributeName: 'attribute1',
      titleFormatter: _.identity,
    },
    {
      attributeName: 'attribute2',
      titleFormatter: _.identity,
    },
    {
      attributeName: 'attribute3',
      titleFormatter: _.identity,
    },
    {
      attributeName: 'attribute4',
      titleFormatter: _.identity,
    },
  ],
  blankSlateDefault: { title: 'super blankslate' },
  initialTableData: DEFAULT_TABLE_DATA,
};
