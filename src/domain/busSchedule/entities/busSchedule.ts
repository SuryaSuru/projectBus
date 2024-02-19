export class BusScheduleModel {
  constructor(
    public routeId: string = "",
    public busId: string = "",
    public departureTime: Date = new Date(),
    public boardingPoints: string[] = [],
    public droppingPoints: string[] = [],
    public arrivalTime: Date | undefined = undefined,
    public journeyDate: Date | undefined = undefined,
    public scheduleStatus: string = ""
  ) {}
}

export class BusScheduleEntity {
  constructor(
    public id: string | undefined = undefined,
    public routeId: string,
    public busId: string,
    public departureTime: Date,
    public boardingPoints: string[],
    public droppingPoints: string[],
    public arrivalTime: Date | undefined,
    public journeyDate: Date | undefined,
    public scheduleStatus: string
  ) {}
}

export class BusScheduleMapper {
  static toEntity(busScheduleData: any, includeId: boolean = true, existingBusSchedule?: BusScheduleEntity): BusScheduleEntity {
    if (existingBusSchedule != null) {
      return {
        ...existingBusSchedule,
        routeId: busScheduleData.routeId !== undefined ? busScheduleData.routeId : existingBusSchedule.routeId,
        busId: busScheduleData.busId !== undefined ? busScheduleData.busId : existingBusSchedule.busId,
        departureTime: busScheduleData.departureTime !== undefined ? busScheduleData.departureTime : existingBusSchedule.departureTime,
        boardingPoints: busScheduleData.boardingPoints !== undefined ? busScheduleData.boardingPoints : existingBusSchedule.boardingPoints,
        droppingPoints: busScheduleData.droppingPoints !== undefined ? busScheduleData.droppingPoints : existingBusSchedule.droppingPoints,
        arrivalTime: busScheduleData.arrivalTime !== undefined ? busScheduleData.arrivalTime : existingBusSchedule.arrivalTime,
        journeyDate: busScheduleData.journeyDate !== undefined ? busScheduleData.journeyDate : existingBusSchedule.journeyDate,
        scheduleStatus: busScheduleData.scheduleStatus !== undefined ? busScheduleData.scheduleStatus : existingBusSchedule.scheduleStatus
      };
    } else {
      const busScheduleEntity: BusScheduleEntity = {
        id: includeId ? (busScheduleData._id ? busScheduleData._id.toString() : undefined) : busScheduleData._id.toString(),
        routeId: busScheduleData.routeId,
        busId: busScheduleData.busId,
        departureTime: busScheduleData.departureTime,
        boardingPoints: busScheduleData.boardingPoints,
        droppingPoints: busScheduleData.droppingPoints,
        arrivalTime: busScheduleData.arrivalTime,
        journeyDate: busScheduleData.journeyDate,
        scheduleStatus: busScheduleData.scheduleStatus
      };
      return busScheduleEntity;
    }
  }

  static toModel(busSchedule: BusScheduleEntity): any {
    return {
      id: busSchedule.id,
      routeId: busSchedule.routeId,
      busId: busSchedule.busId,
      departureTime: busSchedule.departureTime,
      boardingPoints: busSchedule.boardingPoints,
      droppingPoints: busSchedule.droppingPoints,
      arrivalTime: busSchedule.arrivalTime,
      journeyDate: busSchedule.journeyDate,
      scheduleStatus: busSchedule.scheduleStatus
    };
  }
}
