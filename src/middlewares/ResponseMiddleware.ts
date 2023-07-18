import { Interceptor, ExpressErrorMiddlewareInterface, HttpError, InterceptorInterface, Action } from 'routing-controllers'
import {Service} from "typedi";

@Service()
@Interceptor()
export default class ResponseMiddleware implements InterceptorInterface {
    intercept(_: Action, res: any): any {
        if (res) {
            return ({ data: res })
        }
        return res
    }
}