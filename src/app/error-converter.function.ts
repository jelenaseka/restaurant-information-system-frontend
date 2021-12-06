import { HttpErrorResponse } from "@angular/common/http";

export function convertResponseError(err: HttpErrorResponse): string {
    if (err.error.message) {
        return err.error.message;
    } else if (err.error.validationErrors) {
        let key = Object.keys(err.error.validationErrors)[0];
        return err.error.validationErrors[key];
    } else if (err.message) {
        return err.message;
    } 
    else {
        return err.error;
    }
}