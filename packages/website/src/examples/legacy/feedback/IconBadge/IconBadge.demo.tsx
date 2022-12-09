import {IconBadge, IconBadgeType} from '@coveord/plasma-react';
import {BellSize24Px} from '@coveord/plasma-react-icons';

export default () => (
    <>
        <IconBadge icon={BellSize24Px} type={IconBadgeType.New} className="mr1" />
        <IconBadge icon={BellSize24Px} type={IconBadgeType.Information} className="mr1" />
        <IconBadge icon={BellSize24Px} type={IconBadgeType.Warning} className="mr1" />
        <IconBadge icon={BellSize24Px} type={IconBadgeType.Major} />
    </>
);