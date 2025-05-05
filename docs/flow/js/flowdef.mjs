
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
  static PROCESS = new TaskType("process");
  static MILESTONE = new TaskType("milestone");
  static FLOW_TASK = new TaskType("flowtask");
}

class TaskDef {
  id;
  /** @type {TaskType} */
  type;
  name;
  /** @type {string[]} */
  fromIds;
  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  /** @type {(cp:ContextAndPlayLoad)=>void} */
  process = (cp) => {};
  isSkip() {
    return !this.executionCondition();
  }
  /**
   * 
   * @param {{id:string, type:TaskType, name:string, fromIds:string[], executionCondition:(cp:ContextAndPlayLoad)=>boolean, process:(cp:ContextAndPlayLoad)=>void}} param0 
   */
  constructor({
    id, type, name, fromIds, executionCondition, process
  }) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.fromIds = fromIds;
    this.executionCondition = executionCondition;
    this.process = process;
  }

  static start({id}) {
    return new TaskDef({
      id,
      type: TaskType.START,
      name: TaskType.START.value,
      fromIds: [],
      executionCondition: (cp) => true,
      process: (cp) => {}
    });
  }

  static manual({id, name, fromIds, executionCondition}) {
    return new TaskDef({
      id,
      type: TaskType.MANUAL,
      name,
      fromIds,
      executionCondition: executionCondition || ((cp) => true),
      process: (cp) => {}
    });
  }

  static end({id, fromIds}) {
    return new TaskDef({
      id,
      type: TaskType.END,
      name: TaskType.END.value,
      fromIds,
      executionCondition: (cp) => true,
      process: (cp) => {}
    });
  }
  static wait({id, name, fromIds, executionCondition, process}) {
    return new TaskDef({
      id,
      type: TaskType.WAIT,
      name,
      fromIds,
      executionCondition: executionCondition || ((cp) => true),
      process
    });
  }

  static process({id, name, fromIds, executionCondition, process}) {
    return new TaskDef({
      id,
      type: TaskType.PROCESS,
      name,
      fromIds,
      executionCondition: executionCondition || ((cp) => true),
      process
    });
  }

  static milestone({id, name, fromIds}) {
    return new TaskDef({
      id,
      type: TaskType.MILESTONE,
      name,
      fromIds,
      executionCondition: (cp) => true,
      process: (cp) => {}
    });
  }

  /**
   * 
   * @param {{flow:FlowDef, fromIds:[]}} param0 
   * @returns 
   */
  static flowTask({flow, fromIds}) {
    return new TaskDef({
      id: flow.id,
      type: TaskType.FLOW_TASK,
      name: flow.name,
      fromIds,
      executionCondition: (cp) => true,
      process: (cp) => {}
    });
  }
}

export class FlowDef {
  id;
  name;
  constructor({
    id, name, taskDefs
  }) {
    this.id = id;
    this.name = name;
    this.taskDefs = taskDefs;
  }

  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  isSkip(cp) {
    return !this.executionCondition(cp);
  }
}

/**
 * @implements {TaskDef}
 */
export class StartTaskDef {
  id;
  type = TaskType.START;
  name = this.type.value;
  /** @type {(cp:ContextAndPlayLoad)=>boolean} */
  executionCondition = (cp) => true;
  /** @type {(cp:ContextAndPlayLoad)=>void} */
  process = (cp) => {};
  constructor({id}) {
    this.id = id;
    this.fromIds = [];
  }
  isSkip(cp) {
    return !this.executionCondition(cp);
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
  name = this.type.value;
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