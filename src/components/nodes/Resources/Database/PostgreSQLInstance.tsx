import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const PostgreSQLInstance = (props) => (
  <ResourceNode 
    {...props} 
    icon={AWS.PostgreSQLInstance} 
    label={props.data?.label} 
    />
);

export default PostgreSQLInstance;