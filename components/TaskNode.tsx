import { Handle, Position } from "reactflow";

export default function TaskNode({ data }: any) {
  const color =
    data.status === "ERROR"
      ? "bg-red-500"
      : data.status === "BLOCKED"
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div className={`p-3 rounded-lg text-white ${color} w-48`}>
      <Handle type="target" position={Position.Top} />
      <strong>{data.task_id}</strong>
      <p className="text-sm">{data.description}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
