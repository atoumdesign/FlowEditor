import { memo } from 'react';
import BaseGroup from './BaseGroup';
import { AWS } from '@blendmesh/icons';

const Account = ({ data, selected }) => {
  return (
    <BaseGroup
      data={data}
      selected={selected}
      borderColor="#CD2264"
      Icon={AWS.Account}
      label="Private Subnet"
    />
  );
};

export default memo(Account);