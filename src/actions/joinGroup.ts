import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import {GroupSettings, messages} from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.join-group" })
export class JoinGroupAction extends SingletonAction<GroupSettings> {
    constructor(private readonly getWebSocket: (port: number | undefined) => WebSocket[]) {
        super();
    }

    override async onKeyDown(event: KeyDownEvent<GroupSettings>): Promise<void> {
        const settings = await event.action.getSettings<GroupSettings>();
        const sockets = this.getWebSocket(settings.port);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length || !settings.groupName) {
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            ws.send(messages.activate.joinGroup.replace("$group", settings.groupName).replace("$password", settings.groupPassword));
        }
    }
}
