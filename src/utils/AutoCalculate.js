import { adjustPrecision as parseNumberPrecision } from 'utils/esManager';

export const calcTaFerryInfo = (taInfo) => {
  let copyFerry = { ...taInfo.ferry };

  let {
    ferryShipId,
    shipId,
    flightFairway,
    flightDistance,
    flightCount,
    flightNote,
    sailingTime,
    waitingTime,
    totalTime,
    engineName,
    mainEnginePower,
    subEnginePower,
    mainSailingSpend,
    mainSailingOil,
    mainWaitingSpend,
    mainWaitingOil,
    mainSailingVoyageSpend,
    mainWaitingVoyageSpend,
    subSpend,
    subVoyageSpend,
    subOil,
    totalMainSpend,
    totalMainVoyageSpend,
    totalSpend,
    totalVoyageSpend,
  } = copyFerry;

  mainSailingVoyageSpend = parseNumberPrecision(
    mainSailingSpend * sailingTime * mainEnginePower,
    4
  );
  mainWaitingVoyageSpend = parseNumberPrecision(
    mainWaitingSpend * waitingTime * mainEnginePower,
    4
  );
  totalMainSpend = parseNumberPrecision(mainSailingSpend + mainWaitingSpend, 4);
  totalMainVoyageSpend = parseNumberPrecision(
    mainSailingVoyageSpend + mainWaitingVoyageSpend,
    4
  );
  totalTime = parseNumberPrecision(sailingTime + waitingTime, 4);
  totalSpend = parseNumberPrecision(totalMainSpend + subSpend, 4);
  totalVoyageSpend = parseNumberPrecision(
    totalMainVoyageSpend + subVoyageSpend,
    4
  );

  const newFerry = {
    ferryShipId,
    shipId,
    flightFairway,
    flightDistance,
    flightCount,
    flightNote,
    sailingTime,
    waitingTime,
    engineName,
    totalTime,
    mainEnginePower,
    subEnginePower,
    mainSailingSpend,
    mainSailingOil,
    mainWaitingSpend,
    mainWaitingOil,
    mainSailingVoyageSpend,
    mainWaitingVoyageSpend,
    subSpend,
    subVoyageSpend,
    subOil,
    totalMainSpend,
    totalMainVoyageSpend,
    totalSpend,
    totalVoyageSpend,
  };

  const newTaInfo = {
    ...taInfo,
    ferry: { ...newFerry },
  };

  return newTaInfo;
};
