

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
  /**
   * 
   * @param {{id:string, name:string, fromIds:string[]}} param0 
   */
  constructor({
    id, name, fromIds
  }) {
    this.id = id;
    this.name = name;
    this.fromIds = fromIds;
  }
}
class EndTaskDef {
  constructor({
    id, fromIds
  }) {
    this.id = id;
    this.fromIds = fromIds;
  }
}

class TaskStateType {
  value;
  constructor(value) {
    this.value = value;
  }
  static PENDING = new TaskStateType("pending"); // 前のタスクが終わるのを待っている
  static STARTING = new TaskStateType("starting"); // 前のタスクが完了し、自身のタスクの開始を待っている(一瞬)
  static WAITING = new TaskStateType("waiting"); // 待ちタスクの場合に、条件が揃うのを待っている
  static PROCESS_STARTING = new TaskStateType("processstarting"); // 処理タスクの場合に、処理が開始されるのを待っている(一瞬)
  static PROCESSING = new TaskStateType("processing"); // 処理タスクの場合に、処理中
  static COMPLETED = new TaskStateType("completed"); // 完了済み
  static SKIPPED = new TaskStateType("skipped"); // スキップ済み
  static ERROR = new TaskStateType("error"); // エラー発生
  static ALL = [
    TaskStateType.PENDING,
    TaskStateType.STARTING,
    TaskStateType.WAITING,
    TaskStateType.PROCESS_STARTING,
    TaskStateType.PROCESSING,
    TaskStateType.SKIPPED,
    TaskStateType.ERROR,
    TaskStateType.COMPLETED,
  ];
  isPending() {
    return task.value == "pending";
  }
  isStarting() {
    return task.value == "starting";
  }
  isSkipped() {
    return task.value == "skipped";
  }
  isCompleted() {
    return task.value == "completed";
  }

  isCompletedOrSkipped() {
    return this.isCompleted() || this.isSkipped();
  }
}

class TaskState {
  events = TaskStateType.ALL.reduce((memo, v) => {
    memo[v.value] = null;
    return memo;
  }, {});
  /**
   * 
   * @param {TaskStateType} stateType 
   * @param {Date} datetime 
   */
  setState(stateType, datetime) {
    this.events[stateType.value] = datetime;
    return this;
  }
  
  getCurrentState() {
    for(const stateType of TaskStateType.ALL) {
      if(this.events[stateType.value] != null) {
        return stateType;
      }
    }
    throw new Error("State not found");
  }
}

//----------------
class ContextAndPlayLoad {
  context;
  payload;
  constructor({context, payload}) {
    this.context = context;
    this.payload = payload;
  }
}
class Task {
  /** @type {ContextAndPlayLoad} */
  cp

  /**
   * 
   * @param {{taskDef:TaskDef, taskState:TaskState}} param0 
   */
  constructor({
    taskDef,
    taskState,
  }) {
    this.taskDef = taskDef;
    this.taskState = taskState;
  }

  /**
   * 
   * @param {TaskStateType} stateType 
   * @param {Date} datetime 
   */
  setState(stateType, datetime) {
    this.taskState.setState(stateType, datetime);
  }

  /**
   * @param {ContextAndPlayLoad} cp 
   */
  run(cp) {
    this.cp = cp;
    setTimeout(this.runloop, 1000);
  }

  /**
   * 
   * @param {Task[]} fromTasks 
   */
  setFromTasks(fromTasks) {
    this.fromTasks = fromTasks;
  }

  /**
   * 
   * @param {TaskStateType} state 
   */
  setState(state) {
    this.state = state;
  }

  isCompletedOrSkipped() {
    return this.state.isCompletedOrSkipped();
  }

  runloop() {
    var cp = this.cp;
    if(this.state.isSkipped() || this.state.isCompleted()) {
      console.log("Task is already completed or skipped.");
      return;
    }

    if(this.state.isPending()) {
    }

    if(this.state.isStarting()) {
      if(this.taskDef.isSkip(cp)) {
        this.state = TaskStateType.SKIPPED;
        return;
      }
      if(this.taskDef.type == "waittask") {
        this.state = TaskStateType.WAITING;
        return;
      }

      if(this.taskDef.type == "processtask") {
        this.state = TaskStateType.PROCESS_STARTING;
        return;
      }
    }

    if(this.state.isWaiting()) {

    }


    setTimeout(this.runloop, 1000);
  }
}


class Flow {
  /** @type {string} */
  id;
  /** @type {ContextAndPlayLoad} */
  cp;
  constructor({
    id,
    flowDef
  }) {
    this.id = id;
    this.flowDef = flowDef;    
  }

  init() {
    this.taskMap = {};
    this.flowDef.taskDefs.forEach(taskDef => {
      const taskState = new TaskState().setState(TaskStateType.PENDING, new Date());
      this.taskMap[`${this.id}_${taskDef.id}`] = new Task({taskDef, taskState});
    });
    return this;
  }

  run(cp) {
    console.log("Flow started with payload:", this.payload);
    console.log("Flow context:", this.context);
    console.log("Flow definition:", this.flowDef);

    this.taskMap.values().forEach(task => {task.run(cp)});
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
    flowDef
  }).init().run();
}
main();

