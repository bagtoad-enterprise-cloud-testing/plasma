import { mount, ReactWrapper } from 'enzyme';
import { Store, Provider } from 'react-redux';
import { clearState } from '../../../utils/ReduxUtils';
import { IReactVaporState } from '../../../ReactVapor';
import { TestUtils } from '../../../utils/TestUtils';
import { ICalendarProps, Calendar, MONTH_PICKER_ID, YEAR_PICKER_ID } from '../Calendar';
import { CalendarConnected } from '../CalendarConnected';
import { changeOptionsCycle } from '../../optionsCycle/OptionsCycleActions';
import { OptionsCycleConnected } from '../../optionsCycle/OptionsCycleConnected';
import { DateUtils } from '../../../utils/DateUtils';
import {
  addDatePicker,
  selectDate,
  changeDatePickerUpperLimit,
  changeDatePickerLowerLimit
} from '../../datePicker/DatePickerActions';
import { addOptionPicker, changeOptionPicker } from '../../optionPicker/OptionPickerActions';
import * as _ from 'underscore';
import * as moment from 'moment';
/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

describe('Calendar', () => {
  const CALENDAR_ID: string = 'calendar';
  const PICKER_ID: string = 'some-picker';

  describe('<CalendarConnected />', () => {
    let wrapper: ReactWrapper<any, any>;
    let calendar: ReactWrapper<ICalendarProps, any>;
    let store: Store<IReactVaporState>;

    beforeEach(() => {
      store = TestUtils.buildStore();

      wrapper = mount(
        <Provider store={store}>
          <CalendarConnected id={CALENDAR_ID} />
        </Provider>,
        { attachTo: document.getElementById('App') }
      );
      calendar = wrapper.find(Calendar).first();
    });

    afterEach(() => {
      store.dispatch(clearState());
      wrapper.unmount();
      wrapper.detach();
    });

    it('should get an id as a prop', () => {
      let idProp = calendar.props().id;

      expect(idProp).toBeDefined();
      expect(idProp).toBe(CALENDAR_ID);
    });

    it('should get if it has a redux state as a prop', () => {
      let withReduxStateProp = calendar.props().withReduxState;

      expect(withReduxStateProp).toBeDefined();
      expect(withReduxStateProp).toBe(true);
    });

    it('should get the selected month as a prop', () => {
      let selectedMonthProp: number = calendar.props().selectedMonth;
      let expectedSelectedMonth: number = 3;

      expect(selectedMonthProp).toBeDefined();
      expect(selectedMonthProp).toBe(DateUtils.currentMonth);

      store.dispatch(changeOptionsCycle(CALENDAR_ID + MONTH_PICKER_ID, expectedSelectedMonth));
      selectedMonthProp = calendar.props().selectedMonth;

      expect(selectedMonthProp).toBe(expectedSelectedMonth);
    });

    it('should get the selected year as a prop', () => {
      let selectedYearProp: number = calendar.props().selectedYear;
      let expectedSelectedYear: number = 3;

      expect(selectedYearProp).toBeDefined();
      expect(selectedYearProp).toBe(10);

      store.dispatch(changeOptionsCycle(CALENDAR_ID + YEAR_PICKER_ID, expectedSelectedYear));
      selectedYearProp = calendar.props().selectedYear;

      expect(selectedYearProp).toBe(expectedSelectedYear);
    });

    it('should get the calendar selections as a prop', () => {
      let calendarSelectionProp = calendar.props().calendarSelection;

      expect(calendarSelectionProp).toBeDefined();
      expect(calendarSelectionProp).toEqual([]);

      store.dispatch(addDatePicker('any', false, 'any', CALENDAR_ID));

      calendarSelectionProp = calendar.props().calendarSelection;

      expect(calendarSelectionProp).toBeDefined();
      expect(calendarSelectionProp.length).toBe(1);
    });

    it('should get what to do on click as a prop', () => {
      let onClickProp = calendar.props().onClick;

      expect(onClickProp).toBeDefined();
    });

    it('should display two <OptionsCycleConnected /> (one for the month picker and the other for the year picker)', () => {
      expect(calendar.find(OptionsCycleConnected).length).toBe(2);
    });

    it('should set the selected value of the picker to an empty string when calling onClick', () => {
      let pickerSelected: string = 'soemthing-selected';

      store.dispatch(addDatePicker(PICKER_ID, false, 'any', CALENDAR_ID));
      store.dispatch(selectDate(PICKER_ID, pickerSelected));

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).selected).toBe(pickerSelected);

      calendar.props().onClick(PICKER_ID, false, new Date());

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).selected).toBe('');
    });

    it('should unselected any option from the option picker when calling onClick', () => {
      let pickerSelected: () => string = () => 'something-selected';

      store.dispatch(addOptionPicker(PICKER_ID));
      store.dispatch(changeOptionPicker(PICKER_ID, pickerSelected));

      expect(_.findWhere(store.getState().optionPickers, { id: PICKER_ID }).selectedValue()).toBe(pickerSelected());

      calendar.props().onClick(PICKER_ID, false, new Date());

      expect(_.findWhere(store.getState().optionPickers, { id: PICKER_ID }).selectedValue()).toBe('');
    });

    it('should change the upper limit if the onClick was called on an upper limit', () => {
      let currentUpperLimit: Date = moment(new Date()).add(10, 'day').toDate();
      let newLimit: Date = moment(new Date()).add(5, 'day').toDate();

      store.dispatch(addDatePicker(PICKER_ID, true, 'any', CALENDAR_ID));
      store.dispatch(changeDatePickerUpperLimit(PICKER_ID, currentUpperLimit));

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).upperLimit).toBe(currentUpperLimit);

      calendar.props().onClick(PICKER_ID, true, newLimit);

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).upperLimit).toBe(newLimit);
    });

    it('should change the lower limit if the onClick was called on a lower limit', () => {
      let currentLowerLimit: Date = moment(new Date()).add(10, 'day').toDate();
      let newLimit: Date = moment(new Date()).add(5, 'day').toDate();

      store.dispatch(addDatePicker(PICKER_ID, true, 'any', CALENDAR_ID));
      store.dispatch(changeDatePickerLowerLimit(PICKER_ID, currentLowerLimit));

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).lowerLimit).toBe(currentLowerLimit);

      calendar.props().onClick(PICKER_ID, false, newLimit);

      expect(_.findWhere(store.getState().datePickers, { id: PICKER_ID }).lowerLimit).toBe(newLimit);
    });
  });
});
