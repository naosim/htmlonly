``` mermaid
classDiagram
class TaskDef {
  id
  name
  flowDefId
}

class FlowDef {
  id
  adges
}

class AdgeDef {
  from: TaskDef
  to: TaskDef
}

class Task {
  id
  taskDef: TaskDef
}

class Flow

class Adge {
  from
  to
}

TaskDef --> FlowDef
Task --> TaskDef
```