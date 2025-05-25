import { memo } from 'react';
import BaseGroup from './BaseGroup';
import { AWS } from '@blendmesh/icons';

const PublicSubnet = ({ data, selected }) => {
  return (
    <BaseGroup
      data={data}
      selected={selected}
      backgroundColor="#F6F7E6"
      Icon={AWS.PublicSubnet}
      label="Public Subnet"
    />
  );
};

export default memo(PublicSubnet);