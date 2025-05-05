import { FlowDef, StartTaskDef, ManualTaskDef, EndTaskDef, TaskType } from "./flowdef.mjs";
import { Flow } from "./flow.mjs";

// Flow definition
var flow;
function main() {
  // フローを定義する
  const flowDef = new FlowDef({
    id: "fd_mo",
    name: "一日の流れ",
    taskDefs: [
      new StartTaskDef({id: "001"}),
      new ManualTaskDef({id: "002", name:"起床", fromIds: ["001"]}),
      new EndTaskDef({id: "003", fromIds: ["002"]}),
    ]
  })
  
  // フローを開始する
  flow = new Flow({
    id: "flow_001",
    payload: {data: "test"},
    context: {user: "hoge"},
    flowDef
  });
  flow.init().run();
}

/**
 * 
 * @param {Task} task 
 * @param {any} div 
 */
function taskToDiv(task, div) {
  if(div.id != task.id) {// 最初
    div.id = task.id;

    const title = document.createElement("div");
    title.className = "title";
    div.appendChild(title);

    if(task.taskDef.type.eq(TaskType.MANUAL)) {
      const manualButton = document.createElement("button");
      manualButton.innerText = "完了にする";
      manualButton.onclick = () => task.forceComplete();
      div.appendChild(manualButton);
    }
  }

  div.querySelector(".title").innerText = task.id;
  div.setAttribute("data-task-hash", hash(JSON.stringify(task.toJSON())));
  if (task.state.isCompleted()) {
    div.style.backgroundColor = "green";
  } else {
    div.style.backgroundColor = "blue";
  }
}

var mermaidText = '';
function initFlowView() {
  updateFlowView();
}

/**
 * 
 * @param {Flow} flow 
 */
function createMermaidText(flow) {
  var mermaidText = 'graph TD;\n';
  flow.tasks.forEach(task => {
    mermaidText += `${task.taskDefId}["${task.taskDefId}"]:::${task.state.value.value}\n`;
  });
  flow.tasks.forEach(task => {
    task.taskDef.fromIds.forEach(fromId => {
      mermaidText += fromId + ' --> ' + task.taskDefId + '\n';
    });
  });
  return mermaidText;
}

function updateFlowView() {
  var currentMermaidText = createMermaidText(flow);
  if(mermaidText != currentMermaidText) {
    mermaidText = currentMermaidText;
    document.getElementById("mermaid").innerHTML = mermaidText;
  }
}




main();
setInterval(updateFlowView, 1000);

function hash(str) {
  var hash = 0,
    i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
console.log(hash("hoge"));

/*String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
*/

const mermaid = window.mermaid || {};
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', });
initFlowView();
console.log(mermaidText);

/*
mermaid.initialize({ startOnLoad: false });

  // Example of using the render function
  const drawDiagram = async function () {
    element = document.querySelector('#graphDiv');
    const graphDefinition = 'graph TB\na-->b';
    const { svg } = await mermaid.render('graphDiv', graphDefinition);
    element.innerHTML = svg;
  };

  await drawDiagram();
  */
