import {TabContent, TabPaneConnected, TabSelectors, TabsHeader} from '@coveord/plasma-react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import {useSelector} from 'react-redux';

import {GuidelinesTab} from './GuidelinesTab';
import {PageHeader, PageHeaderProps} from './PageHeader';
import {PlasmaLoading} from './PlasmaLoading';
import {Tile, TileProps} from './Tile';

const Sandbox = dynamic(
    import('./Sandbox').then((mod) => mod.Sandbox),
    {ssr: false, loading: () => <PlasmaLoading />}
);
const PropsDoc = dynamic(
    import('./PropsDoc').then((mod) => mod.PropsDoc),
    {ssr: false, loading: () => <PlasmaLoading />}
);

interface PlaygroundProps {
    title: string;
    code: string;
    layout?: 'horizontal' | 'vertical';
}

export interface PageLayoutProps extends PageHeaderProps, PlaygroundProps {
    id: string;
    examples?: Record<string, PlaygroundProps>;
    relatedComponents?: TileProps[];
}

export const PageLayout: React.FunctionComponent<PageLayoutProps> = ({
    id,
    title,
    description,
    thumbnail,
    section,
    code,
    layout = 'horizontal',
    examples,
    componentSourcePath,
    relatedComponents,
}) => {
    const isShowingCode = useSelector((state) =>
        TabSelectors.getIsTabSelected(state, {groupId: 'page', id: 'implementation'})
    );
    return (
        <div id={id} className="plasma-page-layout">
            <PageHeader
                componentSourcePath={componentSourcePath}
                section={section}
                thumbnail={thumbnail}
                title={title}
                description={description}
            />
            <TabsHeader
                tabs={[
                    {groupId: 'page', id: 'implementation', title: 'Implementation'},
                    {groupId: 'page', id: 'guide', title: 'Guidelines'},
                ]}
            />
            <TabContent>
                <TabPaneConnected id="implementation" groupId="page">
                    {isShowingCode && (
                        <Content
                            id={id}
                            code={code}
                            examples={examples}
                            relatedComponents={relatedComponents}
                            layout={layout}
                        />
                    )}
                </TabPaneConnected>
                <div className="mod-header-padding">
                    <GuidelinesTab id={id} />
                </div>
            </TabContent>
        </div>
    );
};
const Content: React.FunctionComponent<Pick<
    PageLayoutProps,
    'code' | 'examples' | 'id' | 'relatedComponents' | 'layout'
>> = ({code, examples, id, relatedComponents, layout}) => (
    <>
        <div className="plasma-page-layout__main-code plasma-page-layout__section">
            <Sandbox id="main-code" horizontal={layout === 'horizontal'}>
                {code}
            </Sandbox>
        </div>
        <div className="plasma-page-layout__section">
            <h4 className="h2 mb1">Props</h4>
            <PropsDoc componentName={id} />
        </div>
        {examples && (
            <div className="plasma-page-layout__section">
                <h4 className="h2 mb5">Examples</h4>
                {Object.entries(examples).map(
                    ([exampleId, {code: exampleCode, title, layout: exampleLayout = 'horizontal'}]) => (
                        <Sandbox
                            key={exampleId}
                            id={exampleId}
                            title={title}
                            horizontal={exampleLayout === 'horizontal'}
                        >
                            {exampleCode}
                        </Sandbox>
                    )
                )}
            </div>
        )}
        {relatedComponents && relatedComponents.length > 0 && (
            <div className="plasma-page-layout__section">
                <h4 className="h2 mb5">Related Components</h4>
                {relatedComponents.map((tileProps) => (
                    <Tile key={tileProps.title} {...tileProps} />
                ))}
            </div>
        )}
    </>
);