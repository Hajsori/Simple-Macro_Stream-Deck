import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import {KeySettings, messages} from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.whisper" })
export class WhisperAction extends SingletonAction<KeySettings> {
    constructor(private readonly getWebSocket: (port: number | undefined) => WebSocket[]) {
        super();
    }

    override async onKeyDown(event: KeyDownEvent): Promise<void> {
        const settings = await event.action.getSettings<KeySettings>();
        const sockets = this.getWebSocket(settings.port);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length) {
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            try {
                ws.send(messages.activate.whisper);
            } catch {
                await event.action.showAlert();
            }
        }
    }

    override async onKeyUp(event: KeyUpEvent): Promise<void> {
        const settings = await event.action.getSettings<KeySettings>();
        const sockets = this.getWebSocket(settings.port);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length) {
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            try {
                ws.send(messages.deactivate.whisper);
            } catch {
                await event.action.showAlert();
            }
        }
    }
}
