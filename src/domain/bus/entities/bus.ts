export class BusModel {
  constructor(
    public operatorId: string = "",
    public ownerId: string = "",
    public busNumber: string = "",
    public type: string = "",
    public capacity: number = 0,
    public features: string[] = [],
    public description: string = "",
    public seatsAvailable: number = 0,
    public bookedSeats: string[] = [],
    public soldSeats: string[] = [],
    public image: string = "",
    public fare: number = 0,
    public registrationDate: Date = new Date(),
    public busestatus: string = "",
    public disabled: boolean = false
  ) {}
}

export class BusEntity {
  constructor(
    public id: string | undefined = undefined,
    public operatorId: string,
    public ownerId: string,
    public busNumber: string,
    public type: string,
    public capacity: number,
    public features: string[],
    public description: string,
    public seatsAvailable: number,
    public bookedSeats: string[],
    public soldSeats: string[],
    public image: string,
    public fare: number,
    public registrationDate: Date,
    public busestatus: string,
    public disabled: boolean = false
  ) {}
}

export class BusMapper {
  static toEntity(busData: any, includeId: boolean = true, existingBus?: BusEntity): BusEntity {
    if (existingBus != null) {
      return {
        ...existingBus,
        operatorId: busData.operatorId !== undefined ? busData.operatorId : existingBus.operatorId,
        ownerId: busData.ownerId !== undefined ? busData.ownerId : existingBus.ownerId,
        busNumber: busData.busNumber !== undefined ? busData.busNumber : existingBus.busNumber,
        type: busData.type !== undefined ? busData.type : existingBus.type,
        capacity: busData.capacity !== undefined ? busData.capacity : existingBus.capacity,
        features: busData.features !== undefined ? busData.features : existingBus.features,
        description: busData.description !== undefined ? busData.description : existingBus.description,
        seatsAvailable: busData.seatsAvailable !== undefined ? busData.seatsAvailable : existingBus.seatsAvailable,
        bookedSeats: busData.bookedSeats !== undefined ? busData.bookedSeats : existingBus.bookedSeats,
        soldSeats: busData.soldSeats !== undefined ? busData.soldSeats : existingBus.soldSeats,
        image: busData.image !== undefined ? busData.image : existingBus.image,
        fare: busData.fare !== undefined ? busData.fare : existingBus.fare,
        registrationDate: busData.registrationDate !== undefined ? busData.registrationDate : existingBus.registrationDate,
        busestatus: busData.busestatus !== undefined ? busData.busestatus : existingBus.busestatus,
        disabled: busData.disabled !== undefined ? busData.disabled : existingBus.disabled
      };
    } else {
      const busEntity: BusEntity = {
        id: includeId ? (busData._id ? busData._id.toString() : undefined) : busData._id.toString(),
        operatorId: busData.operatorId,
        ownerId: busData.ownerId,
        busNumber: busData.busNumber,
        type: busData.type,
        capacity: busData.capacity,
        features: busData.features,
        description: busData.description,
        seatsAvailable: busData.seatsAvailable,
        bookedSeats: busData.bookedSeats,
        soldSeats: busData.soldSeats,
        image: busData.image,
        fare: busData.fare,
        registrationDate: busData.registrationDate,
        busestatus: busData.busestatus,
        disabled: busData.disabled
      };
      return busEntity;
    }
  }

  static toModel(bus: BusEntity): any {
    return {
      id: bus.id,
      operatorId: bus.operatorId,
      ownerId: bus.ownerId,
      busNumber: bus.busNumber,
      type: bus.type,
      capacity: bus.capacity,
      features: bus.features,
      description: bus.description,
      seatsAvailable: bus.seatsAvailable,
      bookedSeats: bus.bookedSeats,
      soldSeats: bus.soldSeats,
      image: bus.image,
      fare: bus.fare,
      registrationDate: bus.registrationDate,
      busestatus: bus.busestatus,
      disabled: bus.disabled
    };
  }
}
