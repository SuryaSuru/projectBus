// Express API request populate the User Model
export class TravelModel {
  constructor(
    public travelName: string = "",
    public disabled: boolean = false
  ) { }
}

export class TravelEntity {
  constructor(
    public id: string | undefined = undefined,
    public travelName: string,
    public disabled: boolean
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
        travelName: travelData.travelName !== undefined ? travelData.travelName : existingTravel.travelName,
        disabled: travelData.disabled !== undefined ? travelData.disabled : existingTravel.disabled
      };
    } else {
      const travelEntity: TravelEntity = {
        id: includeId ? (travelData._id ? travelData._id.toString() : undefined) : travelData._id.toString(),
        travelName: travelData.travelName,
        disabled: travelData.disabled
      };
      return travelEntity;
    }
  }

  static toModel(travel: TravelEntity): any {
    return {
      id: travel.id,
      travelName: travel.travelName,
      disabled: travel.disabled
    };
  }
}
