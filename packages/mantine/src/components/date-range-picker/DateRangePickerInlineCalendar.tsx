import {Button, Center, Group, Space} from '@mantine/core';
import {DateRangePickerValue, RangeCalendar, RangeCalendarProps} from '@mantine/dates';
import {useForm} from '@mantine/form';

import {DateRangePickerPreset, DateRangePickerPresetSelect} from './DateRangePickerPresetSelect';
import {EditableDateRangePicker, EditableDateRangePickerProps} from './EditableDateRangePicker';

export interface DateRangePickerInlineCalendarProps
    extends Pick<EditableDateRangePickerProps, 'startProps' | 'endProps'> {
    /**
     * Initial selected range
     */
    initialRange: DateRangePickerValue;
    /**
     * Function called when the user applies the new date range
     *
     * @param range the newly selected dates
     */
    onApply: (range: DateRangePickerValue) => void;
    /**
     * Function called when the user click on the cancel button
     */
    onCancel: () => void;
    /**
     * The presets to display
     *
     * @default {}
     * @example
     * {
     *     january: {label: 'January', range: [new Date(2022, 0, 1), new Date(2022, 0, 31)]},
     *     february: {label: 'February', range: [new Date(2022, 1, 1), new Date(2022, 1, 28)]}
     * }
     */
    presets?: Record<string, DateRangePickerPreset>;
    /**
     * Props for RangeCalendar displayed in the popover
     */
    rangeCalendarProps?: Omit<RangeCalendarProps, 'value' | 'onChange'>;
}

export const DateRangePickerInlineCalendar = ({
    initialRange,
    onApply,
    onCancel,
    presets,
    startProps,
    endProps,
    rangeCalendarProps,
}: DateRangePickerInlineCalendarProps) => {
    const form = useForm({
        initialValues: {
            dates: initialRange,
        },
    });
    const calendarInputProps = form.getInputProps('dates');

    const onCalendarApply = () => {
        onApply(form.values.dates);
    };

    return (
        <>
            <Group
                align="center"
                spacing="xs"
                grow
                px="md"
                py="sm"
                sx={(theme) => ({
                    borderBottom: `1px solid ${theme.colors.gray[2]}`,
                })}
            >
                <EditableDateRangePicker {...calendarInputProps} startProps={startProps} endProps={endProps} />
                {presets ? (
                    <>
                        <Space w="sm" />
                        <DateRangePickerPresetSelect presets={presets} {...calendarInputProps} />
                    </>
                ) : null}
            </Group>

            <Center py="sm" px="md">
                <RangeCalendar
                    amountOfMonths={2}
                    styles={{cell: {textAlign: 'center'}}}
                    firstDayOfWeek="sunday"
                    allowSingleDateInRange
                    {...rangeCalendarProps}
                    {...calendarInputProps}
                />
            </Center>

            <Group
                position="right"
                spacing="xs"
                px="md"
                py="sm"
                sx={(theme) => ({
                    borderTop: `1px solid ${theme.colors.gray[2]}`,
                })}
            >
                <Button size="xs" onClick={onCalendarApply}>
                    Apply
                </Button>
                <Button variant="outline" size="xs" onClick={onCancel}>
                    Cancel
                </Button>
            </Group>
        </>
    );
};