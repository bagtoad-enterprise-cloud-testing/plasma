import {SliderMetadata} from '@coveord/plasma-components-props-analyzer';
import SliderDemo from '@examples/legacy/form/Slider/Slider.demo?demo';
import SliderAppendDemo from '@examples/legacy/form/Slider/SliderAppend.demo?demo';
import SliderAsymetricDemo from '@examples/legacy/form/Slider/SliderAsymetric.demo?demo';
import SliderOnChangeDemo from '@examples/legacy/form/Slider/SliderOnChange.demo?demo';

import {PageLayout} from '../../../building-blocs/PageLayout';

const Page = () => (
    <PageLayout
        id="Slider"
        title="Slider"
        section="Form"
        description="A slider offers a quick and visual way for users to select a value within a given range."
        sourcePath="/packages/react/src/components/slider/Slider.tsx"
        demo={<SliderDemo />}
        propsMetadata={SliderMetadata}
        examples={{
            asymetric: <SliderAsymetricDemo title="Asymetric" />,
            onChange: <SliderOnChangeDemo title="Change handler" />,
            append: <SliderAppendDemo title="Append values" />,
        }}
    />
);

export default Page;
