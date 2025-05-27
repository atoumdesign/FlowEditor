import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const MySQLInstance = (props) => (
  <ResourceNode 
    {...props} 
    icon={AWS.MySQLInstance} 
    label={props.data?.label} 
    />
);

export default MySQLInstance;