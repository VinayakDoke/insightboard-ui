import { Node, Edge } from "reactflow";

export function tasksToGraph(tasks: any[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  tasks.forEach((task, i) => {
    nodes.push({
      id: task.task_id,
      position: { x: i * 220, y: 100 },
      data: task
    });

    task.dependencies.forEach((dep: string) => {
      edges.push({
        id: `${dep}-${task.task_id}`,
        source: dep,
        target: task.task_id
      });
    });
  });

  return { nodes, edges };
}
