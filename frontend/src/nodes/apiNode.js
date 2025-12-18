
import { BaseNode } from '../components/BaseNode';
import { nodeConfigs } from './nodeConfigs';

export const APINode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={{
                ...data,
                config: nodeConfigs.api
            }}
        />
    );
};
