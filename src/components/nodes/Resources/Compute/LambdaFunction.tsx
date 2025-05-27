import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';

const LambdaFunction = (props) => (
  <ResourceNode
   {...props} 
   icon={AWS.LambdaFunction} 
   label={props.data?.label} 
  />
);

export default LambdaFunction;