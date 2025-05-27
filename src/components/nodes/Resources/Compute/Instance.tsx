import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const Instance = (props) => (
  <ResourceNode 
    {...props} 
    icon={AWS.Instance} 
    label={props.data?.label} 
    />
);

export default Instance;