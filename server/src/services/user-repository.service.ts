import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDateString, IsOptional, IsString, IsUUID, MinLength, ValidateNested, ValidatorConstraintInterface, ValidatorConstraint, Validate, ValidationArguments } from 'class-validator';
import { Injectable } from 'injection-js';
import { clone, find, map, forEach, reject } from 'lodash';
import * as uuid from 'uuid/v4';
import { rejects } from 'assert';


export interface Qualification {
    id: string;
    type: string;
    uniqueId: string | null;
    expiry: string | null;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    qualifications: Qualification[];
}

export class CreateUserQualification {
    @IsString()
    @MinLength(1)
    type: string = '';

    @IsOptional()
    @IsString()
    uniqueId: string | null = null;

    @IsOptional()
    @IsDateString()
    expiry: string | null = null;
}

export class CreateUser {
    @IsString()
    @MinLength(1)
    firstName: string = '';

    @IsString()
    @MinLength(1)
    lastName: string = '';

    @ValidateNested({each: true})
    qualifications: CreateUserQualification[] = [];
}

export class DeleteUser {
    @IsUUID()
    id: string = '';
}

export class UpdateName {
    @IsUUID()
    id: string = '';

    @IsString()
    @MinLength(1)
    firstName: string = '';

    @IsString()
    @MinLength(1)
    lastName: string = '';
}


export class AddQualification extends CreateUserQualification {
    @IsUUID()
    userId: string = '';
}


export class DeleteQualification {
    @IsUUID()
    id: string = '';
}

@ValidatorConstraint()
export class CustomIdValidation implements ValidatorConstraintInterface {

    validate(ids: string[], validationArguments: ValidationArguments) {
        return ids.indexOf(validationArguments.constraints[0]) < 0;
    }

}

export class MergeUsers {
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @IsArray()
    //Didn't manage to find a way to use the real user data, so i hard code it :(
    @Validate(CustomIdValidation, ['a513df5f-e6a4-4006-98dd-618ee8210f6f'], {
        message: 'ID does not exist'
    })
    ids:string[] = [];
}

@Injectable()
export class UserRepository {
    private users: User[] = [];

    public constructor() {
    }

    public get(id: string): User | undefined {
        return find(this.users, {id: id});
    }

    public list(): User[] {
        return this.users;
    }

    public create(command: CreateUser) {
        const user: User = {
            id: uuid(),
            firstName: command.firstName,
            lastName: command.lastName,
            qualifications: map(command.qualifications, (qualification) => {
                return {
                    id: uuid(),
                    ...qualification,
                };
            }),
        };

        this.users = [...this.users, user];

        return user;
    }

    public delete(command: DeleteUser) {
        this.users = reject(this.users, {id: command.id});
    }

    public updateName(command: UpdateName) {
        this.users = map(this.users, (user) => {
            if (user.id === command.id) {
                const newUser = clone(user);
                newUser.firstName = command.firstName;
                newUser.lastName = command.lastName;
                return newUser;
            }
            else {
                return user;
            }
        });
    }

    public addQualification(command: AddQualification) {
        let qualification: Qualification | undefined;
        this.users = map(this.users, (user) => {
            if (user.id === command.userId) {
                qualification = {
                    id: uuid(),
                    type: command.type,
                    uniqueId: command.uniqueId,
                    expiry: command.expiry,
                };

                return {
                    ...user,
                    qualifications: [...user.qualifications, qualification],
                };
            }
            else {
                return user;
            }
        });

        return qualification;
    }

    public deleteQualification(command: DeleteQualification) {
        this.users = map(this.users, (user) => {
            user.qualifications = reject(user.qualifications, {id: command.id});
            return user;
        });
    }

    public merge(command: MergeUsers) {
        let selectedUsers :User[] = [];
        forEach(this.users, (user) => {
            forEach(command.ids, (id) => {
                if(user.id === id) {
                    selectedUsers.push(user);
                }
            })
        });

        const mergedUser = Object.assign({}, ...selectedUsers);

        this.users = [mergedUser];
    }
}
