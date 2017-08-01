import { IReduxAction } from '../../utils/ReduxUtils';
import { IDropdownOption } from './DropdownSearch';
import { DropdownSearchActions, IOptionsDropdownSearchPayload } from './DropdownSearchActions';
import * as _ from 'underscore';
import * as s from 'underscore.string';
import { keyCode } from '../../utils/InputUtils';
import { FixedQueue } from '../../utils/FixedQueue';
import { multiSelectDropdownSearchReducer } from './MultiSelectDropdownSearch/MultiSelectDropdownSearchReducer';
import { UUID } from '../../utils/UUID';

export interface IDropdownSearchState {
  id: string;
  isOpened?: boolean;
  filterText?: string;
  options?: IDropdownOption[];
  displayedOptions?: IDropdownOption[];
  selectedOptions?: FixedQueue<IDropdownOption>;
  selectedOption?: IDropdownOption;
  activeOption?: IDropdownOption;
  setFocusOnDropdownButton?: boolean;
}

export const defaultSelectedOption: IDropdownOption = {
  value: UUID.generate(),
  displayValue: 'Select an option',
};

export const dropdownSearchInitialState: IDropdownSearchState = {
  id: undefined,
  isOpened: false,
};
export const dropdownsSearchInitialState: IDropdownSearchState[] = [];

export const getNextIndexPosition = (array: any[], item: any, key: number): number => {
  let index: number = array.indexOf(item);

  if (index === -1) {
    return 0;
  } else if (item) {
    if (key === keyCode.upArrow) {
      index -= 1;
    } else if (key === keyCode.downArrow) {
      index += 1;
    }
  }
  if (index >= array.length - 1) {
    return array.length - 1;
  }

  return index;
};

export const removeSelectedOption = (state: IDropdownSearchState, displayValue: string): FixedQueue<IDropdownOption> => {
  return new FixedQueue<IDropdownOption>(_.filter(state.selectedOptions.getQueue(),
    (selectedOption: IDropdownOption) => selectedOption.displayValue !== displayValue,
  ));
};

export const addUniqueSelectedOption = (state: IDropdownSearchState, displayValue: string): FixedQueue<IDropdownOption> =>
  removeSelectedOption(state, displayValue).push({ value: UUID.generate(), displayValue: displayValue });

export const getDisplayedOptions = (state: IDropdownSearchState) => {
  return _.filter(state.options,
    (option: IDropdownOption) => _.findWhere(state.selectedOptions.getQueue(),
      { displayValue: option.displayValue }) === undefined);
};

export const getFilteredOptions = (state: IDropdownSearchState, filterText?: string) => {
  const currentFilterText: string = filterText || state.filterText;
  return _.filter(getDisplayedOptions(state),
    (option: IDropdownOption) => {
      const value = option.displayValue || option.value;
      return _.isEmpty(currentFilterText) || s.contains(value.toLowerCase(), (currentFilterText).toLowerCase());
    });
};

export const dropdownSearchReducer = (state: IDropdownSearchState = dropdownSearchInitialState,
  action: IReduxAction<IOptionsDropdownSearchPayload>): IDropdownSearchState => {

  switch (action.type) {
    case DropdownSearchActions.toggle:
      return {
        ...state,
        isOpened: !state.isOpened,
        filterText: '',
        activeOption: undefined,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.open:
      return {
        ...state,
        isOpened: true,
        filterText: '',
        activeOption: undefined,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.close:
      return {
        ...state,
        isOpened: false,
        filterText: '',
        activeOption: undefined,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.update:
      return {
        ...state,
        id: action.payload.id,
        options: action.payload.optionsDropdown,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.filter:
      return {
        ...state,
        id: action.payload.id,
        filterText: action.payload.filterText,
        activeOption: getFilteredOptions(state, action.payload.filterText)[0] || state.activeOption,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.select:
      return {
        ...state,
        id: action.payload.id,
        selectedOptions: state.selectedOptions.push(action.payload.addedSelectedOption),
        isOpened: false,
        activeOption: undefined,
        setFocusOnDropdownButton: false,
      };
    case DropdownSearchActions.add:
      return {
        ...state,
        id: action.payload.id,
        options: action.payload.optionsDropdown,
        selectedOptions: new FixedQueue<IDropdownOption>([defaultSelectedOption], 1),
        filterText: '',
        isOpened: false,
      };
    case DropdownSearchActions.active:
      const isFirstSelectedOption = action.payload.keyCode === keyCode.upArrow && state.activeOption === state.options[0];
      const optionsFiltered = getFilteredOptions(state);
      if (_.contains([keyCode.upArrow, keyCode.downArrow], action.payload.keyCode)) {
        return {
          ...state,
          isOpened: !isFirstSelectedOption,
          activeOption: !isFirstSelectedOption ?
            optionsFiltered[getNextIndexPosition(optionsFiltered, state.activeOption, action.payload.keyCode)] : undefined,
          setFocusOnDropdownButton: isFirstSelectedOption,
        };
      } else if (_.contains([keyCode.enter, keyCode.tab], action.payload.keyCode) && state.activeOption) {
        return {
          ...state,
          id: action.payload.id,
          isOpened: false,
          selectedOptions: state.selectedOptions.push(state.activeOption),
          activeOption: undefined,
          filterText: '',
          setFocusOnDropdownButton: true,
        };
      } else if (action.payload.keyCode === keyCode.escape) {
        return {
          ...state,
          isOpened: false,
        };
      } else if (action.payload.keyCode === -1) {
        return {
          ...state,
          id: action.payload.id,
          activeOption: undefined,
          setFocusOnDropdownButton: false,
        };
      }
    default:
      return state;
  }
};

export const dropdownsSearchReducer = (state: IDropdownSearchState[] = dropdownsSearchInitialState,
  action: IReduxAction<IOptionsDropdownSearchPayload>): IDropdownSearchState[] => {
  switch (action.type) {
    case DropdownSearchActions.update:
    case DropdownSearchActions.filter:
    case DropdownSearchActions.active:
    case DropdownSearchActions.toggle:
    case DropdownSearchActions.open:
    case DropdownSearchActions.close:
    case DropdownSearchActions.select:
      return state.map((dropdownSearch: IDropdownSearchState) => {
        return dropdownSearch.id === action.payload.id
          ? dropdownSearchReducer(dropdownSearch, action)
          : dropdownSearch;
      });
    case DropdownSearchActions.add:
      return [
        ...state,
        dropdownSearchReducer(undefined, action),
      ];
    case DropdownSearchActions.addMultiSelect:
      return [
        ...state,
        multiSelectDropdownSearchReducer(undefined, action),
      ];
    case DropdownSearchActions.removeAllSelectedOptions:
    case DropdownSearchActions.multiSelect:
    case DropdownSearchActions.addCustomSelectedOption:
    case DropdownSearchActions.onKeyDownMultiselect:
    case DropdownSearchActions.removeSelectedOption:
      return state.map((dropdownSearch: IDropdownSearchState) => {
        return dropdownSearch.id === action.payload.id
          ? multiSelectDropdownSearchReducer(dropdownSearch, action)
          : dropdownSearch;
      });
    case DropdownSearchActions.remove:
      return _.reject(state, (dropdown: IDropdownSearchState) => {
        return action.payload.id === dropdown.id;
      });
    default:
      return state;
  }
};
