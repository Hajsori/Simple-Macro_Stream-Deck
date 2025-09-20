import {getWebSocket} from "./plugin";

export type KeySettings = {
    port?: number;
}

export const messages = {
    toggle: {
        icons: JSON.stringify({
            action: "toggle",
            target: "icons"
        }),
        microphone: JSON.stringify({
            action: "toggle",
            target: "microphone"
        }),
        recording: JSON.stringify({
            action: "toggle",
            target: "recording"
        }),
        voiceChat: JSON.stringify({
            action: "toggle",
            target: "voiceChat"
        })
    },
    setScreen: {
        adjustVolumes: JSON.stringify({
            action: "setScreen",
            target: "adjustVolumes"
        }),
        groupManagement: JSON.stringify({
            action: "setScreen",
            target: "groupManagement"
        }),
        settings: JSON.stringify({
            action: "setScreen",
            target: "settings"
        }),
        voiceChat: JSON.stringify({
            action: "setScreen",
            target: "voiceChat"
        })
    },
    activate: {
        pushToTalk: JSON.stringify({
            action: "activate",
            target: "pushToTalk"
        }),
        whisper: JSON.stringify({
            action: "activate",
            target: "whisper"
        })
    },
    deactivate: {
        pushToTalk: JSON.stringify({
            action: "deactivate",
            target: "pushToTalk"
        }),
        whisper: JSON.stringify({
            action: "deactivate",
            target: "whisper"
        })
    }
}

let keys = new Map<number, Set<string>>();
let sendOrdered = false;
export function getKeyData(port: number, key: string) {
    const set = keys.get(port) ?? new Set<string>();
    set.add(key);
    if (!keys.has(port)) {
        keys.set(port, set);
    }

    if (!sendOrdered) {
        sendOrdered = true;

        setTimeout(() => {
            for (const [p, ks] of keys.entries()) {
                const sockets = getWebSocket(p);
                if (!sockets) continue;
                const payload = JSON.stringify({ action: "getData", targets: Array.from(ks) });
                for (const ws of sockets) {
                    ws.send(payload);
                }
            }

            sendOrdered = false;
        }, 10);
    }
}
