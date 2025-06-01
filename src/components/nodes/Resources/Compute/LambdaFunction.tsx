import { AWS } from '@blendmesh/icons';
import ResourceNode from '../BaseResource';
import { useReactFlow } from '@xyflow/react';

const LambdaFunction = (props) => {
  const { getEdges } = useReactFlow();
  const nodeId = props.id;

  // Calcule conexões de entrada e saída
  const edges = getEdges();
  const hasInput = edges.some(e => e.target === nodeId);
  const hasOutput = edges.some(e => e.source === nodeId);

  return (
    <ResourceNode
      {...props}
      icon={AWS.LambdaFunction}
      label={props.data?.label}
      data={{
        ...props.data,
        Properties: {
          ...(props.data?.Properties || {})
        }
      }}

      noInputIconVisible={props.data?.noInputIconVisible}
      noOutputIconVisible={props.data?.noOutputIconVisible}
      commentIconVisible={props.data?.Properties?.showCommentIcon}
      iconVisibility={props.iconVisibility}
      comment={props.data?.Properties?.comment}
    />)
};

export default LambdaFunction;