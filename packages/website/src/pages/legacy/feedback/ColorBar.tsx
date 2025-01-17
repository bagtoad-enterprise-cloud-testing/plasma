import {ColorBarMetadata} from '@coveord/plasma-components-props-analyzer';
import ColorBarDemo from '@examples/legacy/feedback/ColorBar/ColorBar.demo?demo';
import ColorBarOverflowDemo from '@examples/legacy/feedback/ColorBar/ColorBarOverflow.demo?demo';
import ColorBarPartialDemo from '@examples/legacy/feedback/ColorBar/ColorBarPartial.demo?demo';

import {PageLayout} from '../../../building-blocs/PageLayout';

const DemoPage = () => (
    <PageLayout
        id="ColorBar"
        title="Color Bar"
        section="Feedback"
        description="A color bar is used to indicate the ratio between things."
        demo={<ColorBarDemo />}
        sourcePath="/packages/react/src/components/colorBar/ColorBar.tsx"
        propsMetadata={ColorBarMetadata}
        examples={{
            partial: <ColorBarPartialDemo title="Partially filled" />,
            overflow: <ColorBarOverflowDemo title="Overflow" />,
        }}
    />
);

export default DemoPage;
