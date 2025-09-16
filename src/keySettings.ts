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