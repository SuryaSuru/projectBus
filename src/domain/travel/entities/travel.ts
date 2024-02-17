// Express API request populate the User Model
export class TravelModel {
  constructor(
    public travelName: string = ""
  ) { }
}

export class TravelEntity {
  constructor(
    public id: string | undefined = undefined,
    public travelName: string
  ) { }
}

export class TravelMapper {
  static toEntity(
    travelData: any,
    includeId: boolean = true,
    existingTravel?: TravelEntity
  ): TravelEntity {
    if (existingTravel != null) {
      return {
        ...existingTravel,
        travelName: travelData.travelName !== undefined ? travelData.travelName : existingTravel.travelName
      };
    } else {
      const travelEntity: TravelEntity = {
        id: includeId ? (travelData._id ? travelData._id.toString() : undefined) : travelData._id.toString(),
        travelName: travelData.travelName
      };
      return travelEntity;
    }
  }

  static toModel(travel: TravelEntity): any {
    return {
      id: travel.id,
      travelName: travel.travelName
    };
  }
}
