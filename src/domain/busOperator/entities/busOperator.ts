// Express API request populate the User Model
export class BusOperatorModel {
  constructor(
    public operatorName: string = "",
    public contactInfo: string = "",
    public address: string = "",
    public disabled: boolean = false
  ) { }
}

export class BusOperatorEntity {
  constructor(
    public id: string | undefined = undefined,
    public busOperatorId: string,
    public operatorName: string,
    public contactInfo: string,
    public address: string,
    public disabled: boolean
  ) { }
}

export class BusOperatorMapper {
  static toEntity(
    operatorData: any,
    includeId: boolean = true,
    existingOperator?: BusOperatorEntity
  ): BusOperatorEntity {
    if (existingOperator != null) {
      return {
        ...existingOperator,
        operatorName: operatorData.operatorName !== undefined ? operatorData.operatorName : existingOperator.operatorName,
        contactInfo: operatorData.contactInfo !== undefined ? operatorData.contactInfo : existingOperator.contactInfo,
        address: operatorData.address !== undefined ? operatorData.address : existingOperator.address,
        disabled: operatorData.disabled !== undefined ? operatorData.disabled : existingOperator.disabled
      };
    } else {
      const operatorEntity: BusOperatorEntity = {
        id: includeId ? (operatorData._id ? operatorData._id.toString() : undefined) : operatorData._id.toString(),
        busOperatorId: operatorData.busOperatorId,
        operatorName: operatorData.operatorName,
        contactInfo: operatorData.contactInfo,
        address: operatorData.address,
        disabled: operatorData.disabled
      };
      return operatorEntity;
    }
  }

  static toModel(operator: BusOperatorEntity): any {
    return {
      id: operator.id,
      operatorName: operator.operatorName,
      contactInfo: operator.contactInfo,
      address: operator.address,
      disabled: operator.disabled
    };
  }
}
