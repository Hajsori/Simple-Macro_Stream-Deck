import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import { CreateGroupSettings, messages } from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.join-or-create-group" })
export class JoinOrCreateGroupAction extends SingletonAction<CreateGroupSettings> {
    constructor(private readonly getWebSocket: (port: number | undefined) => WebSocket[]) {
        super();
    }

    override async onKeyDown(event: KeyDownEvent<CreateGroupSettings>): Promise<void> {
        streamDeck.logger.info("JoinOrCreateGroupAction");
        const settings = await event.action.getSettings<CreateGroupSettings>();
        const sockets = this.getWebSocket(settings.port);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length || !settings.groupName) {
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            ws.send(messages.activate.joinOrCreateGroup.replace("$group", settings.groupName).replace("$password", settings.groupPassword).replace("$type", settings.groupType));
        }
    }
}
