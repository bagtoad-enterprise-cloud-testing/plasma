import {buildSearchBox, SearchBox, SearchBoxState} from '@coveo/headless';
import {Button, IItemBoxProps, ListBox, Svg} from '@coveord/plasma-react';
import classNames from 'classnames';
import {useRouter} from 'next/router';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import React from 'react';

import {FeatureFlags} from '../FeatureFlags';
import {EngineContext} from './engine/EngineContext';

interface SearchBarProps {
    controller: SearchBox;
}

const SearchBoxRerender: FunctionComponent<SearchBarProps> = (props) => {
    const {controller} = props;
    const [state, setState] = useState<SearchBoxState>(controller.state);
    const [focused, setFocused] = useState(false);
    const [showQuerySuggesttions, setShowQuerySuggesttions] = useState(false);
    const router = useRouter();

    const navigateToResultPage = (query: string) => {
        router.push(`/Search?q=${query}`);
    };

    useEffect(() => {
        setShowQuerySuggesttions(FeatureFlags.get('query-suggestions') as boolean);
    }, []);

    useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

    const ClearButton = () => (
        <button
            disabled={state.value === ''}
            className={classNames('clear-button', {
                'search-not-empty': state.value !== '',
            })}
            onClick={() => controller.clear()}
        >
            <Svg svgName="cross" svgClass="icon" />
        </button>
    );

    const SearchButton = () => (
        <Button
            classes={['search-button']}
            onClick={() => {
                navigateToResultPage(state.value);
            }}
        >
            <Svg svgName="search" className="icon mod-stroke" />
        </Button>
    );

    const SuggestionListBox = () => {
        const results: IItemBoxProps[] = state.suggestions.map((result) => ({
            value: result.rawValue,
            displayValue: result.highlightedValue,
        }));

        return (
            <>
                {focused && (state.suggestions.length > 0 || state.isLoadingSuggestions) && (
                    <ListBox
                        classes={['search-results-container sentence-case']}
                        isLoading={state.isLoadingSuggestions}
                        items={results}
                        onOptionClick={(item) => {
                            controller.selectSuggestion(item.value);
                            navigateToResultPage(item.value);
                        }}
                    />
                )}
            </>
        );
    };

    return (
        <div className="plasmaSearchBar">
            <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
                <input
                    className="search-bar"
                    type="search"
                    placeholder={'Find a component...'}
                    value={state.value}
                    onChange={(event) => controller.updateText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            navigateToResultPage(state.value);
                        } else if (event.key === 'Escape') {
                            controller.clear();
                            (event.target as HTMLInputElement).blur();
                        }
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                <ClearButton />
                <SearchButton />
                {/* 
                    To toggle the feature flag, copy and paste those commands in the dev tool console: *
                        
                        localStorage.setItem('query-suggestions', true) to show the query suggestions *
                        localStorage.setItem('query-suggestions', false) to hide the query suggestions *

                    You need to reload the page for it to take effect.  
                */}
                {showQuerySuggesttions ? <SuggestionListBox /> : null}
            </form>
        </div>
    );
};

const StandaloneSearchBar = () => {
    const engine = useContext(EngineContext);
    const controller = buildSearchBox(engine);
    return <SearchBoxRerender controller={controller} />;
};

export default StandaloneSearchBar;
