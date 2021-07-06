export default {
  initalState: {
    speedAverage: null,
    speedMaximum: null,
    mainEngineCompany: null,
    mainEngineModel: null,
    mainEngineLoad: null,
    mainEnginePower: null,
    mainEngineUnit: null,
    mainEngineAmount: null,
    mainEngineOutput: null,
    mainEngineConsumptionLoad: null,
    mainEngineConsumptionRate: null,
    subEngineCompany: null,
    subEngineModel: null,
    subEnginePower: null,
    subEngineUnit: null,
    subEngineAmount: null,
    subEngineOutput: null,
    subEngineConsumptionLoad: null,
    subEngineConsumption: null,
  },
  ferryInitialState: {
    voyageMainEngineFuel: null,
    voyageSubEngineFuel: null,
  },
  parseBodyForm: (form) => {
    return {
      mainEngineCompany: form.mainEngineCompany,
      mainEngineModel: form.mainEngineModel,
      mainEngineLoad: form.mainEngineLoad,
      mainEnginePower: form.mainEnginePower,
      mainEngineUnit: form.mainEngineUnit,
      mainEngineAmount: form.mainEngineAmount,
      subEngineCompany: form.subEngineCompany,
      subEngineModel: form.subEngineModel,
      subEnginePower: form.subEnginePower,
      subEngineUnit: form.subEngineUnit,
      subEngineAmount: form.subEngineAmount,
      subEngineLoad: form.subEngineConsumptionLoad,
      subEngineFuel: form.subEngineConsumption,
    };
  },
  parseFerryBodyForm: (form) => {
    return {
      voyageMainEngineFuel: form.voyageMainEngineFuel,
      voyageSubEngineFuel: form.voyageSubEngineFuel,
    };
  },
};
