/* eslint-disable no-unused-vars */

/*
    
    Utilisation partielle d'une classe écrite par Nikolay Radoev (https://gitlab.com/nikolayradoev)
    https://gitlab.com/nikolayradoev/socket-io-exemple/-/blob/master/client/src/app/classes/socket-test-helper.ts
    
*/

type CallbackSignature = (params: unknown) => void;

export class SocketTestHelper {
    callbacks = new Map<string, CallbackSignature[]>();

    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)?.push(callback);
    }

    // Lint disabled for test purposes
    // eslint-disable-next-line no-unused-vars
    emit(event: string, ...params: unknown[]): void {
        return;
    }
    connect(): void {
        return;
    }

    disconnect(): void {
        return;
    }

    // Lint disabled for test purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    peerSideEmit(event: string, params?: any): void {
        const eventCallbacks = this.callbacks.get(event);
        if (eventCallbacks === undefined) {
            return;
        }
        for (const callback of eventCallbacks) {
            callback(params);
        }
    }
}
