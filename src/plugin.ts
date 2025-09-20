import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { WebSocket } from "ws";

import { ToggleMicrophoneAction } from "./actions/toggleMicrophone";
import { ToggleVoicechatAction } from "./actions/toggleVoicechat";
import { ToggleIconsAction } from "./actions/toggleIcons";
import { AdjustVolumesAction } from "./actions/adjustVolumes";
import { GroupManagementAction } from "./actions/groupManagement";
import { ToggleRecordingAction } from "./actions/toggleRecording";
import { PushToTalkAction } from "./actions/pushToTalk";
import { SettingsMenuAction } from "./actions/settingsMenu";
import { VoicechatMenuAction } from "./actions/voicechatMenu";
import { WhisperAction } from "./actions/whisper";
import {KeySettings} from "./keySettings";

const ports = new Map<number, WebSocket[]>();

streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.actions.registerAction(new AdjustVolumesAction(getWebSocket));
streamDeck.actions.registerAction(new GroupManagementAction(getWebSocket));
streamDeck.actions.registerAction(new PushToTalkAction(getWebSocket));
streamDeck.actions.registerAction(new SettingsMenuAction(getWebSocket));
streamDeck.actions.registerAction(new ToggleIconsAction(getWebSocket));
streamDeck.actions.registerAction(new ToggleMicrophoneAction(getWebSocket));
streamDeck.actions.registerAction(new ToggleRecordingAction(getWebSocket));
streamDeck.actions.registerAction(new ToggleVoicechatAction(getWebSocket));
streamDeck.actions.registerAction(new VoicechatMenuAction(getWebSocket));
streamDeck.actions.registerAction(new WhisperAction(getWebSocket));
streamDeck.logger.info("Plugin Loaded");

streamDeck.system.onDidReceiveDeepLink((event) => {
    const port = Number(event.url.queryParameters.get("port"));

    if (port && !isNaN(port)) {
        const ws = new WebSocket(`ws://localhost:${port}`)

        if (ports.has(port)) {
            ports.get(port)?.push(ws);
        } else {
            ws.on("open", () => {
                streamDeck.logger.info(`WebSocket connection established on port ${port}`);
                ports.set(port, [ws]);
            });
        }

        ws.on("open", () => {
            streamDeck.logger.info(`WebSocket connection established on port ${port}`);
            ports.set(port, [ws]);
        });

        ws.on("close", () => {
            ports.delete(port);
        });

        ws.on("message", (message: WebSocket.RawData) => {
streamDeck.logger.info(`Received message: ${message}`);
            const data = JSON.parse(message.toString());
            const actions = streamDeck.actions;

            if (data.isMuted != undefined) {
                actions.forEach(async (action) => {
                    const actionPort = ((await action.getSettings() as KeySettings)).port
                    if (action.manifestId === "xyz.hajsori.simplemacro.streamdeck.toggle-microphone" && (actionPort === port || actionPort == 0) && action.isKey()) {
                        await action.setState(data.isMuted ? 1 : 0);
                    }
                });
            }
            if (data.isDisabled != undefined) {
                actions.forEach(async (action) => {
                    const actionPort = ((await action.getSettings() as KeySettings)).port
                    if (action.manifestId == "xyz.hajsori.simplemacro.streamdeck.toggle-voicechat" && (actionPort === port || actionPort == 0) && action.isKey()) {
                        await action.setState(data.isDisabled ? 1 : 0);
                    }
                });
            }
            if (data.isHidden != undefined) {
                actions.forEach(async (action) => {
                    const actionPort = ((await action.getSettings() as KeySettings)).port
                    if (action.manifestId == "xyz.hajsori.simplemacro.streamdeck.toggle-icons" && (actionPort === port || actionPort == 0) && action.isKey()) {
                        await action.setState(data.isHidden ? 1 : 0);
                    }
                });
            }
            if (data.isRecording != undefined) {
                actions.forEach(async (action) => {
                    const actionPort = ((await action.getSettings() as KeySettings)).port
                    if (action.manifestId == "xyz.hajsori.simplemacro.streamdeck.toggle-recording" && (actionPort === port || actionPort == 0) && action.isKey()) {
                        await action.setState(data.isRecording ? 1 : 0);
                    }
                })
            }
        })
    }
})

streamDeck.connect();


export function getWebSocket(port: number | undefined): WebSocket[] {
    if (port == 0) {
        return Array.from(ports.values()).flat();
    } else if (typeof port === "number") {
        return ports.get(port) || [];
    } else {
        return [];
    }
}
