
import { BaseNode } from '../components/BaseNode';
import { nodeConfigs } from './nodeConfigs';

export const TransformNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={{
                ...data,
                config: nodeConfigs.transform
            }}
        />
    );
};
