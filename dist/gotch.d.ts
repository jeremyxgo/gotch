declare var _default: Gotch;
export default _default;
declare class Gotch {
    /**
     * @typedef {object} GotchConfig
     * @property {string} [baseURL]
     * @property {string} [requestType]
     * @property {string} [responseType]
     * @property {string} [tag]
     * @property {number} [timeout]
     * @property {string} [credentials]
     * @property {(string|Function)} [authorization]
     * @property {function} [withOnUploadProgress]
     * @property {function} [withOnDownloadProgress]
     */
    /**
     * @typedef {object} GotchRequestOptions
     * @property {string} [method]
     * @property {(object|Headers)} [headers]
     * @property {(string|FormData)} [body]
     */
    /**
     * @param {GotchConfig} [config]
     */
    constructor(config?: {
        baseURL?: string;
        requestType?: string;
        responseType?: string;
        tag?: string;
        timeout?: number;
        credentials?: string;
        authorization?: string|Function;
        withOnUploadProgress?: Function;
        withOnDownloadProgress?: Function;
    });
    /**
     * @param {GotchConfig} [config]
     */
    create(config?: {
        baseURL?: string;
        requestType?: string;
        responseType?: string;
        tag?: string;
        timeout?: number;
        credentials?: string;
        authorization?: string|Function;
        withOnUploadProgress?: Function;
        withOnDownloadProgress?: Function;
    }): Gotch;
    /**
     * @param {string} baseURL
     */
    withBaseURL(baseURL: string): Gotch;
    /**
     * @param {string} requestType
     */
    withRequestType(requestType: string): Gotch;
    /**
     * @param {string} responseType
     */
    withResponseType(responseType: string): Gotch;
    /**
     * @param {string} tag
     */
    withTag(tag: string): Gotch;
    /**
     * @param {number} timeout
     */
    withTimeout(timeout: number): Gotch;
    /**
     * @param {string} credentials
     */
    withCredentials(credentials: string): Gotch;
    /**
     * @param {(string|function)} authorization
     */
    withAuthorization(authorization: string|Function): Gotch;
    /**
     * @param {function} handleEvent
     */
    withOnUploadProgress(handleEvent: Function): Gotch;
    /**
     * @param {function} handleEvent
     */
    withOnDownloadProgress(handleEvent: Function): Gotch;
    /**
     * @param {string} url
     * @param {GotchRequestOptions} [options]
     */
    request(url: string, options?: {
        method?: string;
        headers?: any;
        body?: string | FormData;
    }): Promise<any>;
    /**
     * @param {string} url
     */
    get(url: string): Promise<any>;
    /**
     * @param {string} url
     * @param {object} [params]
     */
    post(url: string, params?: any): Promise<any>;
    /**
     * @param {string} url
     * @param {object} [params]
     */
    put(url: string, params?: any): Promise<any>;
    /**
     * @param {string} url
     * @param {object} [params]
     */
    patch(url: string, params?: any): Promise<any>;
    /**
     * @param {string} url
     */
    delete(url: string): Promise<any>;
    /**
     * @param {string} tag
     */
    cancel(tag: string): void;
}
