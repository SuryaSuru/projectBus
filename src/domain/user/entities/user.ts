// Express API request populate the User Model
export class UserModel {
  constructor(
    public userName: string = "",
    public email: string = "",
    public info: string = "",
    public password: string = "",
    public firstName: string = "",
    public lastName: string = "",
    public phone: string = "",
    public address: string = "",
    public disabled: boolean = false,
    public isVerified: boolean = false
  ) { }
}

// User Entity provided by User Repository is converted to Express API Response
export class UserEntity {
  constructor(
    public id: string | undefined = undefined, // Set a default value for id
    public userId: string,
    public userName: string,
    public email: string,
    public info: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public address: string,
    public isVerified: boolean = false,
    public disabled: boolean = false
  ) { }
}

export class UserMapper {
  static toEntity(
    userData: any,
    includeId: boolean = true,
    existingUser?: UserEntity
  ): UserEntity {
    if (existingUser != null) {
      // If existingUser is provided, merge the data from userData with the existingUser
      return {
        ...existingUser,
        userName: userData.userName !== undefined ? userData.userName : existingUser.userName,
        email: userData.email !== undefined ? userData.email : existingUser.email,
        info: userData.info !== undefined ? userData.info : existingUser.info,
        password: userData.password !== undefined ? userData.password : existingUser.password,
        firstName: userData.firstName !== undefined ? userData.firstName : existingUser.firstName,
        lastName: userData.lastName !== undefined ? userData.lastName : existingUser.lastName,
        phone: userData.phone !== undefined ? userData.phone : existingUser.phone,
        address: userData.address !== undefined ? userData.address : existingUser.address,
        disabled: userData.disabled !== undefined ? userData.disabled : existingUser.disabled,
        isVerified: userData.isVerified !== undefined ? userData.isVerified : existingUser.isVerified
      };
    } else {
      // If existingUser is not provided, create a new UserEntity using userData
      const userEntity: UserEntity = {
        id: includeId ? (userData._id ? userData._id.toString() : undefined) : userData._id.toString(),
        userId: userData.userId,
        userName: userData.userName,
        email: userData.email,
        info: userData.info,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        disabled: userData.disabled,
        isVerified: userData.isVerified
      };
      return userEntity;
    }
  }

  static toModel(user: UserEntity): any {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      info: user.info,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      disabled: user.disabled,
      isVerified: user.isVerified
    };
  }
}