import {Middleware, ExpressErrorMiddlewareInterface, HttpError} from 'routing-controllers'
import {Service} from "typedi";
import {ApiResponseType} from "../shared/ApiResponseType";

@Service()
@Middleware({type: 'after'})
export default class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        if (error instanceof HttpError) {

            if (response.headersSent) {

                return next(error)
            }

            let apiResponse: ApiResponseType<undefined>;

            if (error.name === 'BadRequestError' && (error as any).errors) {

                const validationErrors = (error as any).errors.map((validationError: any) => {
                    const constraints = Object.values(validationError.constraints).map(
                        (constraint: any) => constraint
                    );
                    return {
                        property: validationError.property,
                        constraints: constraints
                    };
                });


                apiResponse = {
                    success: false,
                    message: "Validation Error",
                    data: validationErrors

                };
            } else {
                apiResponse = {
                    success: false,
                    message: error.message,

                };


            }

            response.set('Content-Type', 'application/json')
            response.status(error.httpCode)
            response.json(apiResponse)
        } else {
            next(error)
        }
    }
}