import mongoose from "mongoose";

export class OwnerModel {
  constructor(
    public ownerName: string = "",
    public email: string = "",
    public password: string = "",
    public firstName: string = "",
    public lastName: string = "",
    public phone: string = "",
    public pancardNumber: string = "",
    public photo: string = "",
    public address: string = "",
    public isVerified: boolean = false,
    public disabled: boolean = false
  ) {}
}

export class OwnerEntity {
  constructor(
    public id: string | undefined = undefined,
    public ownerId: string,
    public ownerName: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public pancardNumber: string,
    public photo: string,
    public address: string,
    public isVerified: boolean,
    public disabled: boolean
  ) {}
}

export class OwnerMapper {
  static toEntity(ownerData: any, includeId: boolean = true, existingOwner?: OwnerEntity): OwnerEntity {
    if (existingOwner != null) {
      return {
        ...existingOwner,
        ownerName: ownerData.ownerName !== undefined ? ownerData.ownerName : existingOwner.ownerName,
        email: ownerData.email !== undefined ? ownerData.email : existingOwner.email,
        password: ownerData.password !== undefined ? ownerData.password : existingOwner.password,
        firstName: ownerData.firstName !== undefined ? ownerData.firstName : existingOwner.firstName,
        lastName: ownerData.lastName !== undefined ? ownerData.lastName : existingOwner.lastName,
        phone: ownerData.phone !== undefined ? ownerData.phone : existingOwner.phone,
        pancardNumber: ownerData.pancardNumber !== undefined ? ownerData.pancardNumber : existingOwner.pancardNumber,
        photo: ownerData.photo !== undefined ? ownerData.photo : existingOwner.photo,
        address: ownerData.address !== undefined ? ownerData.address : existingOwner.address,
        isVerified: ownerData.isVerified !== undefined ? ownerData.isVerified : existingOwner.isVerified,
        disabled: ownerData.disabled !== undefined ? ownerData.disabled : existingOwner.disabled
      };
    } else {
      const ownerEntity: OwnerEntity = {
        id: includeId ? (ownerData._id ? ownerData._id.toString() : undefined) : ownerData._id.toString(),
        ownerId: ownerData.ownerId,
        ownerName: ownerData.ownerName,
        email: ownerData.email,
        password: ownerData.password,
        firstName: ownerData.firstName,
        lastName: ownerData.lastName,
        phone: ownerData.phone,
        pancardNumber: ownerData.pancardNumber,
        photo: ownerData.photo,
        address: ownerData.address,
        isVerified: ownerData.isVerified,
        disabled: ownerData.disabled
      };
      return ownerEntity;
    }
  }

  static toModel(owner: OwnerEntity): any {
    return {
      id: owner.id,
      ownerName: owner.ownerName,
      email: owner.email,
      password: owner.password,
      firstName: owner.firstName,
      lastName: owner.lastName,
      phone: owner.phone,
      pancardNumber: owner.pancardNumber,
      photo: owner.photo,
      address: owner.address,
      isVerified: owner.isVerified,
      disabled: owner.disabled
    };
  }
}
