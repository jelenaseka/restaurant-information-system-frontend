import { HttpErrorResponse } from "@angular/common/http";

export function convertResponseError(err: HttpErrorResponse): string {
    if (err.error.message) {
        return err.error.message;
    } else if (err.message) {
        return err.message;
    } else {
        return err.error;
    }
}