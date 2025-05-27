import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const MariaDBInstance = (props) => (
  <ResourceNode 
    {...props} 
    icon={AWS.MariaDBInstance} 
    label={props.data?.label} 
    />
);

export default MariaDBInstance;