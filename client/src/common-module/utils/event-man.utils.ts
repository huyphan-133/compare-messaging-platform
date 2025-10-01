import { Logger } from "@nestjs/common";
import { limit } from "./promise.utils";
import { BehaviorSubject, debounceTime, delay } from "rxjs";

export class EventManUtils {
    private static readonly log: Logger = new Logger(EventManUtils.name);

    private static __handlers: Record<string, ((sender: string, event: any) => Promise<any>)[]> = {};
    private static __asyncEvents: any[] = [];
    private static __asyncEventsSb: BehaviorSubject<any>;

    static subscribeEvent(senders: string[], callback: (sender: string, event: any) => Promise<any>): any {
        senders.forEach((sender: string) => {
            if (!EventManUtils.__handlers[sender]) {
                EventManUtils.__handlers[sender] = [];
            }
            EventManUtils.__handlers[sender].push(callback);
        })
    }

    static async pushEventSync(sender: string, event: any): Promise<any> {
        this.log.log(`new sync event '${sender}'...`)

        if (!EventManUtils.__handlers[sender]) {
            EventManUtils.__handlers[sender] = [];
        }

        await limit(EventManUtils.__handlers[sender], async (handler: (sender: string, event: any) => Promise<any>) => {
            await handler(sender, event);
        }, 10);
    }

    static async pushEventAsync(sender: string, event: any): Promise<any> {
        this.log.log(`new async event '${sender}'...`);

        EventManUtils.__asyncEvents.push({ sender: sender, event: event });

        if (!EventManUtils.__asyncEventsSb) {
            this.__asyncEventsSb = new BehaviorSubject(0);
            this.__asyncEventsSb.pipe(debounceTime(1000)).subscribe(({
                next: async () => {
                    let __events: any[] = EventManUtils.__asyncEvents.splice(0, EventManUtils.__asyncEvents.length);
                    this.log.log(`[${this.__asyncEventsSb.getValue()}] process async event (${__events.length})...`);
                    await limit(__events, async (event: any) => {
                        await EventManUtils.pushEventSync(event.sender, event.event);
                    }, 10);
                }
            }));
        } else {
            this.__asyncEventsSb.next(this.__asyncEventsSb.getValue() + 1);
        }
    }
}