import { FlowDef, StartTaskDef, ManualTaskDef, EndTaskDef } from "./flowdef.mjs";
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
main();
console.log(flow);


flow.tasks.forEach(task => {
  var div = document.createElement("div");
  div.id = task.id;
  div.innerText = task.id;
  div.setAttribute("data-task-hash", "");
  document.getElementById("app").appendChild(div);
});

setInterval(() => {
  flow.tasks.forEach(task => {
    var div = document.getElementById(task.id);
    var divHash = div.getAttribute("data-task-hash");
    // var correntHash = hash(task.toJSON());
    // console.log(task.id, divHash, correntHash);
    if(divHash == hash(JSON.stringify(task.toJSON()))) {
      return;
    }
    if (task.state.isCompleted()) {
      div.style.backgroundColor = "green";
    } else {
      div.style.backgroundColor = "blue";
    }
  });

  document.getElementById("code").innerHTML = JSON.stringify(flow.tasks.map(task => task.toJSON()), null, 2);
}, 1000);

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