import { BaseNode } from "../components/BaseNode"
import { nodeConfigs } from "./nodeConfigs"


export const OutputNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={{
        ...data,
        config: nodeConfigs.customOutput
      }}
    />
  )
}