

class FlowDef {
  constructor({
    name, taskDefs
  }) {
    this.name = name;
    this.taskDefs = taskDefs;

  }
}

class StartTaskDef {
  type = "start";
  executionCondition = () => true;
  process = () => {};
  constructor({
    id
  }) {
    this.id = id;
    this.fromIds = [];
  }
  isSkip() {
    return !this.executionCondition();
  }
}
class ManualTaskDef {
  type = "manual";
  executionCondition = () => true;
  process = () => {};
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
  isSkip() {
    return !this.executionCondition();
  }
}

class EndTaskDef {
  type = "end";
  executionCondition = () => true;
  process = () => {};
  constructor({
    id, fromIds
  }) {
    this.id = id;
    this.fromIds = fromIds;
  }
  isSkip() {
    return !this.executionCondition();
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
    return this.value == "pending";
  }
  isStarting() {
    return this.value == "starting";
  }
  isWaiting() {
    return this.value == "waiting";
  }
  isProcessStarting() {
    return this.value == "processstarting";
  }
  isProcessing() {
    return this.value == "processing";
  }
  isSkipped() {
    return this.value == "skipped";
  }
  isError() {
    return this.value == "error";
  }
  isCompleted() {
    return this.value == "completed";
  }

  isCompletedOrSkipped() {
    return this.isCompleted() || this.isSkipped();
  }
}

class TaskState {
  /** @type {TaskStateType} */
  value = TaskStateType.PENDING;

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
    this.value = this.#getCurrentState();
    return this;
  }
  
  #getCurrentState() {
    for(let i = TaskStateType.ALL.length - 1; i >= 0; i--) {
      const stateType = TaskStateType.ALL[i];
      if(this.events[stateType.value] != null) {
        return stateType;
      }
    }
    throw new Error("State not found");
  }


  isPending() {
    return this.value.isPending();
  }
  isStarting() {
    return this.value.isStarting();
  }
  isSkipped() {
    return this.value.isSkipped();
  }
  isProcessing() {
    return this.value.isProcessing();
  }
  isProcessStarting() {
    return this.value.isProcessStarting(); 
  }
  isCompleted() {
    return this.value.isCompleted();
  }

  isCompletedOrSkipped() {
    return this.isCompleted() || this.isSkipped();
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
  taskDefId;

  /**
   * @type {TaskStore}
   */
  taskStore;

  /**
   * 
   * @param {{taskDef:TaskDef, taskState:TaskState}} param0 
   */
  constructor({
    flowId,
    taskDef,
    taskState,
    taskStore,
  }) {
    this.flowId = flowId;
    this.id = `${flowId}_${taskDef.id}`;
    this.taskDef = taskDef;
    this.taskDefId = taskDef.id;
    this.taskState = taskState;
    this.state = taskState;
    this.taskStore = taskStore;
  }

  setState(stateType) {
    this.taskState.setState(stateType, new Date());
  }

  /**
   * @returns {Task[]}
   */
  get fromTasks() {
    return this.taskDef.fromIds.map(id => this.taskStore.findByTaskDefId(id)).filter(v => v != null);
  }

  /**
   * @param {ContextAndPlayLoad} cp 
   */
  run(cp) {
    this.cp = cp;
    setTimeout(() => this.runloop(), 1000);
  }

  /**
   * 
   * @param {Task[]} fromTasks 
   */
  setFromTasks(fromTasks) {
    this.fromTasks = fromTasks;
  }

  isCompletedOrSkipped() {
    return this.state.isCompletedOrSkipped();
  }

  runloop() {
    var nextState = this.runprocess();
    if(nextState) {
      this.setState(nextState)
    }
    setTimeout(() => this.runloop(), 1000);
  }

  /**
   * 
   * @returns {TaskStateType | null} 次の状態を返す
   */
  runprocess() {
    var cp = this.cp;
    if(this.state.isSkipped() || this.state.isCompleted()) {
      //console.log("Task is already completed or skipped.");
      return null;
    }

    if(this.state.isPending()) {
      // すべての前のタスクが完了またはスキップされているかを確認
      var isAllFinished = this.fromTasks.length == 0 || this.fromTasks.every(task => task.taskState.isCompletedOrSkipped());
      if(isAllFinished) {
        return TaskStateType.STARTING;
        // this.state.setState(TaskStateType.STARTING, new Date());
        // return;
      }
    }

    if(this.state.isStarting()) {
      if(this.taskDef.isSkip(cp)) {
        return TaskStateType.SKIPPED;
      } else {
        return TaskStateType.PROCESS_STARTING;
      }
    }

    if(this.state.isProcessStarting()) {
      if(this.taskDef.type == "start" || this.taskDef.type == "end") {
        this.taskDef.process(cp);
        return TaskStateType.COMPLETED;
      }
      
    }    
  }

  forceComplete() {
    this.setState(TaskStateType.COMPLETED);
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state.value.value,
      taskDef: {
        id: this.taskDef.id,
        type: this.taskDef.type,
        name: this.taskDef.name,
        fromIds: this.taskDef.fromIds,
      },
      stateEvents: this.state.events,
    };
  }
}

class TaskStore {
  map = {};
  /**
   * 
   * @param {Task} task 
   */
  add(task) {
    this.map[task.taskDefId] = task;
  }

  findByTaskDefId(taskDefId) {
    return this.map[taskDefId];
  }

  all() {
    return Object.values(this.map);
  }
}


class Flow {
  /** @type {string} */
  id;
  /** @type {ContextAndPlayLoad} */
  cp;

  taskStore = new TaskStore();
  
  constructor({
    id,
    flowDef
  }) {
    this.id = id;
    this.flowDef = flowDef;    
  }

  get tasks() {
    return this.taskStore.all();
  }

  init() {
    this.flowDef.taskDefs.forEach(taskDef => {
      const taskState = new TaskState().setState(TaskStateType.PENDING, new Date());
      const task = new Task({flowId:this.id, taskDef, taskState, taskStore:this.taskStore});
      this.taskStore.add(task);
    });
    return this;
  }

  run(cp) {
    console.log("Flow started with payload:", this.payload);
    console.log("Flow context:", this.context);
    console.log("Flow definition:", this.flowDef);
    this.taskStore.all().forEach(task => task.run(cp));
  }
}
// Flow definition
var flow;
function main() {
  const flowDef = new FlowDef({
    id: "fd_mo",
    name: "一日の流れ",
    taskDefs: [
      new StartTaskDef({id: "001"}),
      new ManualTaskDef({id: "002", name:"起床", fromIds: ["001"]}),
      new EndTaskDef({id: "003", fromIds: ["002"]}),
    ]
  })
  
  
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

setInterval(() => {
  document.getElementById("code").innerHTML = JSON.stringify(flow.tasks.map(task => task.toJSON()), null, 2);
}, 1000);