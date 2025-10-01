export interface IMessageBrokerHandler {
    /**
     * Gửi tin nhắn đi
     * @param message 
     * @param options 
     */
    publish<T = any>(message: T, options?: IPublishOptions): Promise<any>;
}

export interface IPublishOptions {

}