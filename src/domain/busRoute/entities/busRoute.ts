// BusRouteModel class definition
export class BusRouteModel {
  constructor(
    public sourceLocation: string = "",
    public destinationLocation: string = "",
    public distance: number = 0,
    public estimatedDuration: Date | undefined = undefined,
    public price: number = 0,
    public routeStatus: string = "Active",
    public currentLocation: string = "",
    public disabled: boolean = false
  ) {}
}

// BusRouteEntity class definition
export class BusRouteEntity {
  constructor(
    public id: string | undefined = undefined,
    public sourceLocation: string,
    public destinationLocation: string,
    public distance: number,
    public estimatedDuration: Date | undefined,
    public price: number,
    public routeStatus: string,
    public currentLocation: string,
    public disabled: boolean
  ) {}
}

// BusRouteMapper class definition
export class BusRouteMapper {
  static toEntity(busRouteData: any, includeId: boolean = true, existingBusRoute?: BusRouteEntity): BusRouteEntity {
    if (existingBusRoute != null) {
      return {
        ...existingBusRoute,
        sourceLocation: busRouteData.sourceLocation !== undefined ? busRouteData.sourceLocation : existingBusRoute.sourceLocation,
        destinationLocation: busRouteData.destinationLocation !== undefined ? busRouteData.destinationLocation : existingBusRoute.destinationLocation,
        distance: busRouteData.distance !== undefined ? busRouteData.distance : existingBusRoute.distance,
        estimatedDuration: busRouteData.estimatedDuration !== undefined ? busRouteData.estimatedDuration : existingBusRoute.estimatedDuration,
        price: busRouteData.price !== undefined ? busRouteData.price : existingBusRoute.price,
        routeStatus: busRouteData.routeStatus !== undefined ? busRouteData.routeStatus : existingBusRoute.routeStatus,
        currentLocation: busRouteData.currentLocation !== undefined ? busRouteData.currentLocation : existingBusRoute.currentLocation,
        disabled: busRouteData.disabled !== undefined ? busRouteData.disabled : existingBusRoute.disabled
      };
    } else {
      const busRouteEntity: BusRouteEntity = {
        id: includeId ? (busRouteData._id ? busRouteData._id.toString() : undefined) : busRouteData._id.toString(),
        sourceLocation: busRouteData.sourceLocation,
        destinationLocation: busRouteData.destinationLocation,
        distance: busRouteData.distance,
        estimatedDuration: busRouteData.estimatedDuration,
        price: busRouteData.price,
        routeStatus: busRouteData.routeStatus,
        currentLocation: busRouteData.currentLocation,
        disabled: busRouteData.disabled
      };
      return busRouteEntity;
    }
  }

  static toModel(busRoute: BusRouteEntity): any {
    return {
      id: busRoute.id,
      sourceLocation: busRoute.sourceLocation,
      destinationLocation: busRoute.destinationLocation,
      distance: busRoute.distance,
      estimatedDuration: busRoute.estimatedDuration,
      price: busRoute.price,
      routeStatus: busRoute.routeStatus,
      currentLocation: busRoute.currentLocation,
      disabled: busRoute.disabled
    };
  }
}
