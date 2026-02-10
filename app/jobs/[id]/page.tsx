"use client";

import { useEffect, useState } from "react";
import { getJobStatus } from "@/utils/api";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { tasksToGraph } from "@/utils/graphMapper";
import TaskNode from "@/components/TaskNode";



const nodeTypes = { task: TaskNode };

export default function JobPage({ params }: any) {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await getJobStatus(params.id);

      if (res.data.status === "completed") {
        setTasks(res.data.tasks);
        clearInterval(poll);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, []);

  const { nodes, edges } = tasksToGraph(tasks);

  return (
    <div className="h-screen">
      <ReactFlow
        nodes={nodes.map(n => ({ ...n, type: "task" }))}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
