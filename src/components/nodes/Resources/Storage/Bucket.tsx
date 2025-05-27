import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const Bucket = (props) => (
  <ResourceNode 
    {...props} 
    icon={AWS.Bucket} 
    label={props.data?.label} 
    />
);

export default Bucket;