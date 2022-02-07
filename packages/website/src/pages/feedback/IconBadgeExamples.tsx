import {svg} from '@coveord/plasma-style';
import * as React from 'react';
import {IconBadge, IconBadgeType, Section} from '@coveord/plasma-react';

import VaporComponent from '../../building-blocs/VaporComponent';

// start-print

export const IconBadgeExamples: React.FunctionComponent = () => (
    <VaporComponent id="IconBadge" title="Icon Badge" withSource>
        <Section>
            <Section level={2} title="IconBadge without the navigation style">
                <IconBadge
                    svgName={svg.bellStrokedMedium.name}
                    type={IconBadgeType.New}
                    svgClass="mod-stroke"
                    className="mr1"
                />
                <IconBadge
                    svgName={svg.bellStrokedMedium.name}
                    type={IconBadgeType.Information}
                    svgClass="mod-stroke"
                    className="mr1"
                />
                <IconBadge
                    svgName={svg.bellStrokedMedium.name}
                    type={IconBadgeType.Warning}
                    svgClass="mod-stroke"
                    className="mr1"
                />
                <IconBadge svgName={svg.bellStrokedMedium.name} type={IconBadgeType.Major} svgClass="mod-stroke" />
            </Section>
            <Section level={2} title="IconBadge on the top bar with different status">
                <div className="header" style={{background: 'var(--grape-purple-70)'}}>
                    <div className="header-section mod-icon flex center-align">
                        <IconBadge
                            svgName={svg.bellStrokedMedium.name}
                            type={IconBadgeType.New}
                            className="mod-navigation"
                        />
                    </div>
                    <div className="header-section mod-icon flex center-align">
                        <IconBadge
                            svgName={svg.bellStrokedMedium.name}
                            type={IconBadgeType.Information}
                            className="mod-navigation"
                        />
                    </div>
                    <div className="header-section mod-icon flex center-align">
                        <IconBadge
                            svgName={svg.bellStrokedMedium.name}
                            type={IconBadgeType.Warning}
                            className="mod-navigation"
                        />
                    </div>
                    <div className="header-section mod-icon flex center-align">
                        <IconBadge
                            svgName={svg.bellStrokedMedium.name}
                            type={IconBadgeType.Major}
                            className="mod-navigation"
                        />
                    </div>
                </div>
            </Section>
        </Section>
    </VaporComponent>
);