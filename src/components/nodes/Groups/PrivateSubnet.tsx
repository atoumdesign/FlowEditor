import { memo } from 'react';
import BaseGroup from './BaseGroup';
import { AWS } from '@blendmesh/icons';

const PrivateSubnet = ({ data, selected }) => {
  return (
    <BaseGroup
      data={data}
      selected={selected}
      backgroundColor="#E6F6F7"
      Icon={AWS.PrivateSubnet}
      label="Private Subnet"
    />
  );
};

export default memo(PrivateSubnet);