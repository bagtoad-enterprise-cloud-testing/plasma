import * as React from 'react';
import {LastUpdated} from '@coveord/plasma-react';

import VaporComponent from '../../../../demo-building-blocs/VaporComponent';

// start-print

export const LastUpdatedExamples: React.FunctionComponent = () => (
    <VaporComponent id="LastUpdated" title="Last Updated" withSource>
        <div className="mt2" style={{width: 400}}>
            <div className="form-group">
                <label className="form-control-label">Last update</label>
                <LastUpdated id="LastUpdatedExampleComponent" />
            </div>
            <div className="form-group">
                <label className="form-control-label">Last update with custom time</label>
                <LastUpdated
                    id="LastUpdatedExampleComponentWithTime"
                    time={new Date(+new Date() - Math.floor(Math.random() * 10000000000))}
                />
            </div>
            <div className="form-group">
                <label className="form-control-label">Last update with label changed</label>
                <LastUpdated id="LastUpdatedExampleComponentWithLabel" label="Dernière modification à" />
            </div>
        </div>
    </VaporComponent>
);