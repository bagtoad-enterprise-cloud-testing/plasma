import { IActionOptions } from '../actions/Action';
import { IActionBarProps } from '../actions/ActionBar';
import { IBlankSlateProps } from '../blankSlate/BlankSlate';
import { IDropdownSearchProps, IDropdownOption } from '../dropdownSearch/DropdownSearch';
import { IFilterBoxProps } from '../filterBox/FilterBox';
import * as React from 'react';
import * as _ from 'underscore';
import { ITableCompositeState, ITableData } from './TableReducers';
import { DEFAULT_TABLE_DATA, DEFAULT_TABLE_PER_PAGE, TableSortingOrder } from './TableConstants';
import { JSXRenderable } from '../../utils/JSXUtils';
import { INavigationChildrenProps } from '../navigation/Navigation';
import * as classNames from 'classnames';
import { IThunkAction } from '../../utils/ReduxUtils';
import { TableChildActionBar } from './table-children/TableChildActionBar';
import { TableChildHeader } from './table-children/TableChildHeader';
import { TableChildLoadingRow } from './table-children/TableChildLoadingRow';
import { TableChildBlankSlate } from './table-children/TableChildBlankSlate';
import { TableChildNavigation } from './table-children/TableChildNavigation';
import { TableChildLastUpdated } from './table-children/TableChildLastUpdated';
import { TableChildBody, IInheritedFromTableProps } from './table-children/TableChildBody';

export interface IData {
  id: string;
  [attribute: string]: any;
}

export interface ITableRowData {
  [id: string]: IData;
}

export type IAttributeValue = any;
export interface IPredicateAttributes {
  [attributeName: string]: IAttributeValue;
}

export type IAttributeFormatter = (attributeValue: any, attributeName?: string) => JSXRenderable;
export type IAttributeNameOrValueFormatter = (attributeNameOrValue: string) => string;

export interface ITableHeadingAttribute {
  attributeName: string;
  titleFormatter: IAttributeNameOrValueFormatter;
  filterFormatter?: IAttributeNameOrValueFormatter; // use this for filter if you render JSX through the attribute formatter
  sort?: boolean;
  sortByMethod?: IAttributeNameOrValueFormatter;
  attributeFormatter?: IAttributeFormatter;
}

export interface ITablePredicate {
  props: IDropdownSearchProps;
  attributeName: string;
  attributeNameFormatter?: IAttributeNameOrValueFormatter;
}

export interface ITableOwnProps extends React.ClassAttributes<Table>, IInheritedFromTableProps {
  id: string;
  blankSlateDefault: IBlankSlateProps;
  tableContainerClasses?: string[];
  initialTableData?: ITableData;
  actionBar?: true | IActionBarProps;
  blankSlateNoResultsOnAction?: IBlankSlateProps;
  blankSlateOnError?: IBlankSlateProps;
  filter?: true | IFilterBoxProps;
  filterMethod?: (attributeValue: any, props: ITableOwnProps) => boolean;
  predicates?: ITablePredicate[];
  navigation?: true | INavigationChildrenProps;
  lastUpdatedLabel?: string;
  manual?: (
    tableOwnProps: ITableOwnProps,
    shouldResetPage: boolean,
    tableCompositeState: ITableCompositeState,
    previousTableCompositeState: ITableCompositeState,
  ) => IThunkAction;
}

export interface ITableCompositeStateProps {
  readonly tableCompositeState?: ITableCompositeState;
}

export interface ITableDispatchProps {
  onDidMount?: () => void;
  onUnmount?: () => void;
  onModifyData?: (
    shouldResetPage: boolean,
    tableCompositeState: ITableCompositeState,
    previousTableCompositeState?: ITableCompositeState,
  ) => void;
  onPredicateOptionClick?: (predicateId: string, option: IDropdownOption) => void;
  onRowClick?: (actions: IActionOptions[]) => void;
}

export interface ITableProps extends ITableOwnProps, ITableCompositeStateProps, ITableDispatchProps { }

export class Table extends React.Component<ITableProps, {}> {
  private isInitialLoad: boolean;

  static defaultProps = {
    tableCompositeState: {
      sortState: {
        attribute: undefined,
        order: TableSortingOrder.UNSORTED,
      },
      filter: '',
      page: 0,
      perPage: DEFAULT_TABLE_PER_PAGE,
    } as Partial<ITableCompositeState>,
    initialTableData: DEFAULT_TABLE_DATA,
  } as Partial<ITableOwnProps>;

  constructor(props: ITableProps) {
    super(props);

    // Only use the initial load strategy for tables that do not provide initialTableData in their own props
    this.isInitialLoad = props.initialTableData == DEFAULT_TABLE_DATA;
  }

  componentDidMount() {
    if (this.props.onDidMount) {
      this.props.onDidMount();
    }
  }

  componentDidUpdate() {
    if (this.isInitialLoad && !_.isUndefined(this.props.tableCompositeState.data)) {
      this.isInitialLoad = false;
    }
  }

  componentWillReceiveProps(nextProps: ITableProps) {
    const { tableCompositeState } = this.props;

    if (this.hasTableCompositeStateChanged(tableCompositeState, nextProps.tableCompositeState)) {
      // if the change occurs outside the navigation (per page, pagination), reset the pagination to 0
      const shouldResetPage = tableCompositeState.page === nextProps.tableCompositeState.page
        && tableCompositeState.perPage === nextProps.tableCompositeState.perPage;

      this.props.onModifyData(shouldResetPage, nextProps.tableCompositeState, tableCompositeState);
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    const tableClasses = classNames(
      'mod-collapsible-rows',
      'mod-align-header',
      {
        'mod-loading-content': !!(this.props.tableCompositeState && this.props.tableCompositeState.isLoading),
        'loading-component': this.isInitialLoad,
      },
    );

    return (
      <div className={classNames('table-container', this.props.tableContainerClasses)}>
        <TableChildActionBar {...this.props} />
        <table className={tableClasses}>
          <TableChildLoadingRow {...this.props} isInitialLoad={this.isInitialLoad} />
          <TableChildHeader {...this.props} />
          {this.getTableBody()}
        </table>
        <TableChildBlankSlate {...this.props} isInitialLoad={this.isInitialLoad} />
        <TableChildNavigation {...this.props} />
        <TableChildLastUpdated {...this.props} />
      </div>
    );
  }

  private hasTableCompositeStateChanged(currentTableCompositeState: ITableCompositeState, nextTableCompositeState: ITableCompositeState): boolean {
    return !!currentTableCompositeState && (
      currentTableCompositeState.filter !== nextTableCompositeState.filter
      || currentTableCompositeState.perPage !== nextTableCompositeState.perPage
      || currentTableCompositeState.page !== nextTableCompositeState.page
      || currentTableCompositeState.sortState.attribute !== nextTableCompositeState.sortState.attribute
      || currentTableCompositeState.sortState.order !== nextTableCompositeState.sortState.order
      || (_.isEmpty(currentTableCompositeState.predicates) && !_.isEmpty(nextTableCompositeState.predicates))
      || _.some(
        currentTableCompositeState.predicates,
        (attributeValue: any, attributeName: string) => attributeValue !== nextTableCompositeState.predicates[attributeName],
      )
    );
  }

  private getTableBody() {
    const tableData = this.props.tableCompositeState.data || this.props.initialTableData;

    return tableData.displayedIds.map((id: string, yPosition: number): JSX.Element => {
      const rowData: IData = tableData.byId[id];

      return (<TableChildBody
        key={id}
        tableId={this.props.id}
        rowData={rowData}
        yPosition={yPosition}
        isLoading={this.props.tableCompositeState.isLoading}
        getActions={(rowData?: IData) => this.props.getActions(rowData)}
        headingAttributes={this.props.headingAttributes}
        collapsibleFormatter={this.props.collapsibleFormatter}
        onRowClick={(actions: IActionOptions[]) => this.props.onRowClick(actions)}
      />);
    });
  }
}
