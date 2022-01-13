import classNames from 'classnames';
import * as React from 'react';
import * as _ from 'underscore';

import {IContentProps} from '../../Entry';
import {WithServerSideProcessingProps} from '../../hoc/withServerSideProcessing/withServerSideProcessing';
import {ActionBarConnected} from '../actions/ActionBar';
import {TableLoading} from '../loading/components/TableLoading';
import {PER_PAGE_NUMBERS} from '../navigation/perPage/NavigationPerPage';

/**
 * @deprecated Use WithServerSideProcessingProps directly instead
 */
export type IMaybeServerConfig = WithServerSideProcessingProps;

export interface ITableHOCOwnProps {
    id: string;
    isLoading?: boolean;
    hasActionButtons?: boolean;
    data: any[];
    renderBody: (data: any[]) => React.ReactNode;
    actions?: React.ReactNode[];
    actionBarPrefixContent?: IContentProps;
    tableHeader?: React.ReactNode;
    onUpdate?: () => void;
    containerClassName?: string;
    tbodyClassName?: string;
    showBorderTop?: boolean;
    showBorderBottom?: boolean;
    loading?: {
        isCard?: boolean;
        numberOfColumns?: number;
        defaultLoadingRow?: number;
        numberOfSubRow?: number;
    };
}

export interface ITableHOCProps extends ITableHOCOwnProps {}

export const TableHOC: React.FunctionComponent<ITableHOCProps & React.HTMLAttributes<HTMLTableElement>> = ({
    hasActionButtons = false,
    actions = [],
    actionBarPrefixContent,
    showBorderTop = false,
    showBorderBottom = true,
    id,
    children,
    className,
    tableHeader,
    tbodyClassName,
    renderBody,
    data,
    containerClassName,
    isLoading = false,
    loading = {
        isCard: false,
        numberOfColumns: 5,
        defaultLoadingRow: PER_PAGE_NUMBERS[1],
        numberOfSubRow: 3,
    },
}) => {
    const hasActionBar = () => hasActionButtons || actions.length || actionBarPrefixContent;

    const renderActionBar = () => {
        if (hasActionBar()) {
            return (
                <ActionBarConnected
                    id={id}
                    removeDefaultContainerClasses
                    extraContainerClasses={classNames(
                        'coveo-table-actions-container',
                        'mod-cancel-header-padding',
                        'mod-align-header',
                        {
                            'mod-border-top': showBorderTop,
                            'mod-border-bottom': showBorderBottom,
                        }
                    ).split(' ')}
                    disabled={isLoading}
                    prefixContent={actionBarPrefixContent}
                >
                    {actions}
                </ActionBarConnected>
            );
        }
        return null;
    };

    const table = (
        <table className={classNames(className)} style={{marginTop: hasActionBar() ? '-1px' : 0}}>
            {tableHeader}
            <tbody key={`table-body-${id}`} className={classNames({hidden: isLoading}, tbodyClassName)}>
                {renderBody(data || [])}
            </tbody>
            {isLoading && (
                <TableLoading.Body
                    key={`table-loading-${id}`}
                    isCard={loading?.isCard}
                    numberOfRow={_.size(data) || loading?.defaultLoadingRow}
                    numberOfColumns={loading?.numberOfColumns}
                    numberOfSubRow={loading?.numberOfSubRow}
                />
            )}
        </table>
    );

    return (
        <div className={classNames('table-container', containerClassName)}>
            {renderActionBar()}
            {table}
            {children}
        </div>
    );
};