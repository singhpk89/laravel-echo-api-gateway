import {EventFormatter} from 'laravel-echo/src/util';
import {Channel as BaseChannel} from 'laravel-echo/src/channel/channel';
import {PresenceChannel} from "laravel-echo/src/channel";
import {Websocket} from "./Websocket";

/**
 * This class represents a Pusher channel.
 */
export class Channel extends BaseChannel implements PresenceChannel {
    /**
     * The Pusher client instance.
     */
    socket: Websocket;

    /**
     * The name of the channel.
     */
    name: string;

    /**
     * Channel options.
     */
    options: object;

    /**
     * The event formatter.
     */
    eventFormatter: EventFormatter;

    private listeners: { [index: string]: Function } = {};

    /**
     * Create a new class instance.
     */
    constructor(socket: Websocket, name: string, options: object) {
        super();

        this.name = name;
        this.socket = socket;
        this.options = options;
        this.eventFormatter = new EventFormatter(this.options["namespace"]);

        this.subscribe();
    }

    /**
     * Subscribe to a Pusher channel.
     */
    subscribe(): any {
        this.socket.subscribe(this)
    }

    /**
     * Unsubscribe from a Pusher channel.
     */
    unsubscribe(): void {
        this.socket.unsubscribe(this);
    }

    /**
     * Listen for an event on the channel instance.
     */
    listen(event: string, callback: Function): Channel {
        this.on(this.eventFormatter.format(event), callback);

        return this;
    }

    /**
     * Stop listening for an event on the channel instance.
     */
    stopListening(event: string, callback?: Function): Channel {
        if (this.listeners[event] && (!callback || this.listeners[event] === callback)) {
            delete this.listeners[event]
        }

        return this;
    }

    /**
     * Register a callback to be called anytime a subscription succeeds.
     */
    subscribed(callback: Function): Channel {
        this.on('subscription_succeeded', () => {
            callback();
        });

        return this;
    }

    /**
     * Register a callback to be called anytime a subscription error occurs.
     */
    error(callback: Function): Channel {
        this.on('error', (status) => {
            callback(status);
        });

        return this;
    }

    /**
     * Bind a channel to an event.
     */
    on(event: string, callback: Function): Channel {
        this.listeners[event] = callback

        return this;
    }

    handleEvent(event: string, data: object): void {
        if (this.listeners[event]) {
            this.listeners[event](event, data)
        }
    }

    whisper(event: string, data: object): Channel {
        this.socket.send({
            event,
            data,
        })

        return this;
    }

    here(callback: Function): Channel {
        // TODO: implement

        return this
    }

    /**
     * Listen for someone joining the channel.
     */
    joining(callback: Function): Channel {
        // TODO: implement

        return this
    }

    /**
     * Listen for someone leaving the channel.
     */
    leaving(callback: Function): Channel {
        // TODO: implement

        return this
    }
}
