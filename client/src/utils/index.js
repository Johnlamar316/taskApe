export const createActionType = (type, entity = "App") => ({
  START: `@@[${entity}] ${type}`,
  SUCCESS: `@@[${entity}] ${type}_SUCCESS`,
  ERROR: `@@[${entity}] ${type}_ERROR`,
  END: `@@[${entity}] ${type}_END`,
});

export const createActionString = (type, entity = "App") =>  `[${entity}] ${type}`;

