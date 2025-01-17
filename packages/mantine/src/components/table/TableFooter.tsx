import {Group, DefaultProps} from '@mantine/core';
import {FunctionComponent, ReactNode} from 'react';

interface TableFooterProps extends DefaultProps {
    children?: ReactNode;
}
export const TableFooter: FunctionComponent<TableFooterProps> = ({children, ...others}) => (
    <Group position="apart" px="md" py="sm" {...others}>
        {children}
    </Group>
);
