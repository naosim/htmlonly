

class FlowDef {
  constructor({
    name, taskDefs
  }) {

  }
}

class StartTaskDef {
  constructor({
    id
  }) {
    this.id = id;
  }
}
class ManualTaskDef {
  constructor({
    id, name, from
  }) {
    this.id = id;
    this.name = name;
    this.from = from;
  }
}
class EndTaskDef {
  constructor({
    id, from
  }) {
    this.id = id;
    this.from = from;
  }
}

class TaskState {
  value;
  constructor(value) {
    this.value = value;
  }
  static PENDING = new TaskState("pending"); // 前のタスクが終わるのを待っている
  static STARTING = new TaskState("starting"); // 前のタスクが完了し、自身のタスクの開始を待っている(一瞬)
  static WAITING = new TaskState("waiting"); // 待ちタスクの場合に、条件が揃うのを待っている
  static PROCESS_STARTING = new TaskState("processstarting"); // 処理タスクの場合に、処理が開始されるのを待っている(一瞬)
  static PROCESSING = new TaskState("processing"); // 処理タスクの場合に、処理中
  static COMPLETED = new TaskState("completed"); // 完了済み
  static SKIPPED = new TaskState("skipped"); // スキップ済み
  static ERROR = new TaskState("error"); // エラー発生
  isPending() {
    return task.value == "pending";
  }
  isSkipped() {
    return task.value == "skipped";
  }
  isCompleted() {
    return task.value == "completed";
  }
}

class Task {
  state = TaskState.PENDING;
  constructor({
    context,
    payload,
    taskDef
  }) {
    this.taskDef = taskDef;
  }

  run() {
    setTimeout(this.runloop, 1000);
  }

  runloop() {
    var cp = {context: this.context, payload: this.payload};
    if(this.state.isSkipped() || this.state.isCompleted()) {
      console.log("Task is already completed or skipped.");
      return;
    }

    if(this.state.isPending()) {
      if(this.taskDef.isSkip(cp)) {
        this.state = TaskState.SKIPPED;
        return;
      }
      if(this.taskDef.type == "waittask") {
        this.state = TaskState.WAITING;
        return;
      }

      if(this.taskDef.type == "processtask") {
        this.state = TaskState.PROCESS_STARTING;
        return;
      }
    }

    if(this.state.isWaiting()) {

    }

    

    if(this.state.)



    setTimeout(this.runloop, 1000);
  }
}


class Flow {
  constructor({
    payload, context, flowDef
  }) {
    this.payload = payload;
    this.context = context;
    this.flowDef = flowDef;

    this.taskMap = {};
    this.flowDef.taskDefs.forEach(taskDef => {
      this.taskMap[taskDef.id] = new taskDef({taskDef});
    });
  }

  run() {


    console.log("Flow started with payload:", this.payload);
    console.log("Flow context:", this.context);
    console.log("Flow definition:", this.flowDef);
  }
}
// Flow definition

function main() {
  const flowDef = new FlowDef({
    id: "fd_mo",
    name: "一日の流れ",
    taskDefs: [
      new StartTaskDef({id: "001"}),
      new ManualTaskDef({id: "002", name:"起床", from: "001"}),
      new EndTaskDef({id: "003", from: "002"}),
    ]
  })
  
  
  new Flow({
    payload: {data: "test"},
    context: {user: "hoge"},
    flowDef,
  }).run();
}
main();

