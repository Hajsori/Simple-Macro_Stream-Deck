import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { WebSocket } from "ws";
import { CreateGroupSettings, messages } from "../keySettings";

@action({ UUID: "xyz.hajsori.simplemacro.streamdeck.create-group" })
export class CreateGroupAction extends SingletonAction<CreateGroupSettings> {
    constructor(private readonly getWebSocket: (port: number | undefined) => WebSocket[]) {
        super();
    }

    override async onKeyDown(event: KeyDownEvent<CreateGroupSettings>): Promise<void> {
        streamDeck.logger.info("CreateGroupAction");
        const settings = await event.action.getSettings<CreateGroupSettings>();
        const sockets = this.getWebSocket(settings.port);
        // @ts-ignore
        streamDeck.logger.info(typeof settings.port !== "number" , settings.port < 0 , settings.port > 65535 , !sockets.length , !settings.groupName);
        if (typeof settings.port !== "number" || settings.port < 0 || settings.port > 65535 || !sockets.length || !settings.groupName) {
            streamDeck.logger.error("CreateGroupAction: Invalid settings");
            await event.action.showAlert();
            return;
        }

        for (const ws of sockets) {
            ws.send(messages.activate.createGroup.replace("$group", settings.groupName).replace("$password", settings.groupPassword).replace("$type", settings.groupType ?? "OPEN"));
        }
    }
}
