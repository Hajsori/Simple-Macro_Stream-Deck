import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import {getKeyData, KeySettings, messages} from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.toggle-microphone" })
export class ToggleMicrophoneAction extends SingletonAction<KeySettings> {
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
                ws.send(messages.toggle.microphone);
            } catch {
                await event.action.showAlert();
            }
        }
    }

    override async onWillAppear(event: WillAppearEvent<KeySettings>): Promise<void> {
        getKeyData((await event.action.getSettings()).port ?? 0, "isMuted");
    }
}
