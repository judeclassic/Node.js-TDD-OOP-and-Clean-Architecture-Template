import ErrorInterface from "../response/error";

abstract class BaseValidator {
    protected strongChecked = false;

    protected _validateStringInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        if (!entry || entry === '') {
            errors.push({
                field: name,
                message: `${name} can not be empty`,
                possibleSolution: `check if the field ${name} is emtry or data do not pass`,
            })
        }
        return errors
    }

    protected _validateNameInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && entry.length < 3) {
            errors.push({
                field: name,
                message: "message can not be empty",
                possibleSolution: `please increase the ${name} to be more than 3 text`,
            })
        }
        return errors
    }

    protected _validateEmailInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!entry) {
            errors.push({
                field: name,
                message: `email can not be empty`,
                possibleSolution: `please increase the email to be more than 3 text`,
            });
            return errors;
        }
        if (!emailRegex.test(entry)) {
            if (/^@/.test(entry)) {
                errors.push({
                    field: name,
                    message: `${name} email is invalid`,
                    possibleSolution: `check the email the symbol @ might be missing`,
                });
                return errors;
            }
            errors.push({
                field: name,
                message: `${name} email is invalid`,
                possibleSolution: `Please check the email structure`,
            });
        }
        return errors
    }

    protected _validateDateInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && entry.length < 3) {
            errors.push({
                field: name,
                message: `${name} message can not be empty`,
                possibleSolution: `please increase the ${name} to be more than 3 text`,
            })
        }
        return errors
    }

    protected _validateTwoNamesInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (!entry) return;
        if ((!entry.split(' ')[0] || !entry.split(' ')[1])) {
            errors.push({
                field: name,
                message: `${name} can not be less than 3`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            })
        }
        return errors;
    }

    protected _validatePasswordInput = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && entry.length < 6) {
            errors.push({
                field: name,
                message: `password can not be less than 6`,
                possibleSolution: `please increase the password to be more than 6 text`,
            })
        }
        return errors
    }

    protected _validateCountry = (name: string, entry?: string, countries?: string[]) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && !countries) {
            countries = [entry];
        }
        if (!(countries && countries.find((c) => c === entry ))) {
            errors.push({
                field: name,
                message: `${name} cannot be found in the accepted list of countries`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            });
        }

        return errors
    }

    protected _validateCity = (name: string, entry?: string, cities?: string[]) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && !cities) {
            errors.push({
                field: name,
                message: `${name} list of cities returned null`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            });
        }
        if (!(cities && cities.find((c) => c === entry))) {
            errors.push({
                field: name,
                message: `${name} cannot be found in the accepted list of cities`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            });
        }
        
        return errors;
    }

    protected _validateState = (name: string, entry?: string, states?: string[]) => {
        const  errors: ErrorInterface[] = [];

        errors.push(...this._validateStringInput(name, entry));
        if (entry && !states) {
            states = [entry]
        }
        if (states && !(states.find((s) => s === entry))) {
            errors.push({
                field: name,
                message: `${name} cannot be found in the accepted list of countries`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            });
        }

        return errors;
    }

    protected _validateAddress = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];
        errors.push(...this._validateStringInput(name, entry));
        return errors;
    }

    protected _validateListOfEnum = (dataEnumType: any, name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];
        errors.push(...this._validateStringInput(name, entry));

        if (entry) {
            if (!Object.values(dataEnumType).includes(entry)) {
              errors.push({ field: 'type', message: `please enter a valid type ${Object.values(dataEnumType).join(', ')}`});
            }
          }
        return errors;
    }

    protected _validatePhoneNumber = (name: string, entry?: string) => {
        const  errors: ErrorInterface[] = [];
        errors.push(...this._validateStringInput(name, entry));

        if (entry && entry.length > 15 ) {
            errors.push({
                field: name,
                message: `${name} cannot be greater than 14 characters`,
                possibleSolution: 'check if the field '+entry+' is emtry or data do not pass',
            });
        }
        if (entry && entry.length < 11 ) {
            errors.push({
                field: name,
                message: `${name} cannot be less than 8 characters`,
                possibleSolution: 'check if the field '+entry+' is entry or data do not pass',
            });
        }
        return errors;
    }
}

export default BaseValidator;