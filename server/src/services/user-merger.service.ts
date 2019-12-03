import { Injectable } from 'injection-js';
import { clone, forEach, find, map } from 'lodash';
import { User } from './user-repository.service';
import * as uuid from 'uuid/v4';


@Injectable()
export class UserMerger {
    public merge(users: User[]): User {
         if(!users.length) {
            throw new Error("Error: empty users array");
        }
        
       if(users.length === 1) {
            return users[0];
        }
       
 let storedQualifications = new Array();
        const modifiedUsers = map(users, (user) => {
            const newUser = clone(user);
            if(newUser.firstName.length === 1 || newUser.firstName.indexOf('.') > 0) {
                delete newUser.firstName;
            }
            if(newUser.lastName.length === 1 || newUser.lastName.indexOf('.') > 0) {
                delete newUser.lastName;
            }

            newUser.id = uuid();

            forEach(newUser.qualifications, (qualification) => {
                const newQualification = qualification;
                newQualification.id = uuid();

                const isDublicated = find( storedQualifications, (storedQualification) => storedQualification.type === newQualification.type && storedQualification.expiry === newQualification.expiry && storedQualification.uniqueId === newQualification.uniqueId )

                if((newQualification.uniqueId !== null) && !isDublicated || !storedQualifications.length) {
                    const newQualificationDate = Date.parse(newQualification.expiry || '');
                    const isDateMergeDublication = find(storedQualifications, (qulification) => Date.parse(qulification.expiry) < newQualificationDate && qulification.type === newQualification.type && qulification.uniqueId === newQualification.uniqueId);

                    isDateMergeDublication ? storedQualifications = [newQualification] : storedQualifications.push(newQualification);
                }
            });

            return newUser;
        }).reverse();

         const mergedUser: User = Object.assign({}, ...modifiedUsers, {qualifications: storedQualifications});

        return mergedUser;
    }
}
