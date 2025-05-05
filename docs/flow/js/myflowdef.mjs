import { FlowDef, TaskDef } from "./flowdef.mjs";

// フローを定義する
export const flowDef = new FlowDef({
  id: "fd_mo",
  name: "朝の流れ",
  taskDefs: [
    TaskDef.start({id:"001"}),
    TaskDef.manual({id: "002", name: "起床", fromIds: ["001"]}),
    // TaskDef.manual({id: "003", name: "コーヒー豆挽き開始", fromIds: ["001"]}),
    TaskDef.wait({id: "004", name: "コーヒー豆挽き完了待ち", fromIds: ["001"], 
      isCompletedForWait: (cp) => cp.payload.coffeeBeanGrindComplete
    }),
    TaskDef.end({id: "999", fromIds: ["002", "004"]}),
  ]
})