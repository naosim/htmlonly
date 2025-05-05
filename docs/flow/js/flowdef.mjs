export class TaskType {
  value;
  constructor(value) {
    this.value = value;
  }
  eq(other) {
    return this.value === other.value;
  }
  static MANUAL = new TaskType("manual");
  static START = new TaskType("start");
  static END = new TaskType("end");
  static WAIT = new TaskType("wait");

}

export class FlowDef {
  constructor({
    name, taskDefs
  }) {
    this.name = name;
    this.taskDefs = taskDefs;

  }
}

export class StartTaskDef {
  type = TaskType.START;
  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  /** @type {(cp:ContextAndPlayLoad)=>void} */
  process = (cp) => {};
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

export class ManualTaskDef {
  type = TaskType.MANUAL;
  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  /** @type {(cp:ContextAndPlayLoad)=>void} */
  process = (cp) => {};
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

export class EndTaskDef {
  type = TaskType.END;
  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  /** @type {(cp:ContextAndPlayLoad)=>void} */
  process = (cp) => {};
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

export class ContextAndPlayLoad {
  context;
  payload;
  constructor({context, payload}) {
    this.context = context;
    this.payload = payload;
  }
}