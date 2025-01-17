import {IconCard} from '@coveord/plasma-react';

const Demo = () => (
    <IconCard
        title="Card title"
        icon={<img src="https://placeholder.pics/svg/72x72/DEDEDE/FFFFFF-FFFFFF" />}
        description="Card description"
        onClick={() => alert('You clicked the card')}
    />
);
export default Demo;
