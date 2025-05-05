export class FlowDef {
  constructor({
    name, taskDefs
  }) {
    this.name = name;
    this.taskDefs = taskDefs;

  }
}

export class StartTaskDef {
  type = "start";

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
  type = "manual";
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
  type = "end";
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