import { FlowDef, StartTaskDef, ManualTaskDef, EndTaskDef, TaskType } from "./flowdef.mjs";

// フローを定義する
export const flowDef = new FlowDef({
  id: "fd_mo",
  name: "朝の流れ",
  taskDefs: [
    new StartTaskDef({id: "001"}),
    new ManualTaskDef({id: "002", name:"起床", fromIds: ["001"]}),
    new ManualTaskDef({id: "003", name:"起床2", fromIds: ["001"]}),
    new EndTaskDef({id: "004", fromIds: ["002", "003"]}),
  ]
})