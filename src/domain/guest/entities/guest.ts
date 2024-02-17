// Express API request populate the User Model
export class GuestModel {
  constructor(
    public guestName: string = "",
    public contactInfo: string = "",
    public address: string = ""
  ) { }
}

export class GuestEntity {
  constructor(
    public id: string | undefined = undefined,
    public guestName: string,
    public contactInfo: string,
    public address: string
  ) { }
}

export class GuestMapper {
  static toEntity(
    guestData: any,
    includeId: boolean = true,
    existingGuest?: GuestEntity
  ): GuestEntity {
    if (existingGuest != null) {
      return {
        ...existingGuest,
        guestName: guestData.guestName !== undefined ? guestData.guestName : existingGuest.guestName,
        contactInfo: guestData.contactInfo !== undefined ? guestData.contactInfo : existingGuest.contactInfo,
        address: guestData.address !== undefined ? guestData.address : existingGuest.address
      };
    } else {
      const guestEntity: GuestEntity = {
        id: includeId ? (guestData._id ? guestData._id.toString() : undefined) : guestData._id.toString(),
        guestName: guestData.guestName,
        contactInfo: guestData.contactInfo,
        address: guestData.address
      };
      return guestEntity;
    }
  }

  static toModel(guest: GuestEntity): any {
    return {
      id: guest.id,
      guestName: guest.guestName,
      contactInfo: guest.contactInfo,
      address: guest.address
    };
  }
}
