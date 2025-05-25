import { memo } from 'react';
import BaseGroup from './BaseGroup';
import { AWS } from '@blendmesh/icons';

const VPC = ({ data, selected }) => {
  return (
    <BaseGroup
      data={data}
      selected={selected}
      borderColor="#8C4FFF"
      Icon={AWS.VPCGroup}
      label="Private Subnet"
    />
  );
};

export default memo(VPC);