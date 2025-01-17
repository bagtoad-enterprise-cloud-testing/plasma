import {MultilineBoxMetadata} from '@coveord/plasma-components-props-analyzer';
import MultilineBoxDemo from '@examples/legacy/form/multiline-box/MultilineBox.demo?demo';
import MultilineBoxComplexDemo from '@examples/legacy/form/multiline-box/MultilineBoxComplex.demo?demo';
import MultilineBoxWithContainerDemo from '@examples/legacy/form/multiline-box/MultilineBoxWithContainer.demo?demo';
import MultilineBoxWithDragAndDropDemo from '@examples/legacy/form/multiline-box/MultilineBoxWithDragAndDrop.demo?demo';
import MultilineBoxWithRemoveDemo from '@examples/legacy/form/multiline-box/MultilineBoxWithRemove.demo?demo';

import {PageLayout} from '../../../building-blocs/PageLayout';

const Page = () => (
    <PageLayout
        id="MultilineBox"
        title="Multiline Box"
        description="A multiline box allows users to provide multiple inputs for the same parameter. Each input appears on a different line."
        section="Form"
        demo={<MultilineBoxDemo center />}
        propsMetadata={MultilineBoxMetadata}
        examples={{
            withContainer: <MultilineBoxWithContainerDemo center title="Custom container" />,
            withRemove: <MultilineBoxWithRemoveDemo title="Remove button" />,
            withDragAndDrop: <MultilineBoxWithDragAndDropDemo center title="Drag and drop" />,
            complex: <MultilineBoxComplexDemo center title="Everything combined" />,
        }}
    />
);

export default Page;
