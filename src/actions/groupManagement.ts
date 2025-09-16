import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import {messages} from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.group-management" })
export class GroupManagementAction extends SingletonAction<GroupManagementSettings> {
    constructor(private readonly getWebSocket: (port: number | undefined) => WebSocket[]) {
        super();
    }

    override async onKeyDown(event: KeyDownEvent<GroupManagementSettings>): Promise<void> {
        const settings = await event.action.getSettings<GroupManagementSettings>();
        const sockets = this.getWebSocket(settings.port);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length) {
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            ws.send(messages.setScreen.groupManagement);
        }
    }
}

type GroupManagementSettings = {
    port?: number;
};
