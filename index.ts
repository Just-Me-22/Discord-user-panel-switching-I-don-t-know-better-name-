/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";
import { GuildMemberStore, SelectedGuildStore, UserStore } from "@webpack/common";

function getMember() {
    const guildId = SelectedGuildStore.getGuildId();
    const userId = UserStore.getCurrentUser()?.id;
    if (guildId == null || userId == null) return null;

    return GuildMemberStore.getMember(guildId, userId) as any;
}

export default definePlugin({
    name: "UserPanelServerProfile",
    description: "Show the current server's avatar, nameplate, avatar decoration, display name style and nickname in your account panel instead of your main profile's",
    authors: [{ name: "heart_menace", id: 281162701303185408n }],

    patches: [
        {
            find: "#{intl::USER_PROFILE_ACCOUNT_POPOUT_BUTTON_A11Y_LABEL}",
            group: true,
            replacement: [
                {
                    match: /(\(0,\i\.\i\)\(\{user:\i,guildId:)void 0\}\)/,
                    replace: "$1$self.getGuildId()})"
                },
                {
                    match: /=(\i)\?\.avatarDecoration(?=,\i=\(0,\i\.\i\)\()/,
                    replace: "=$self.getAvatarDecoration($1)"
                },
                {
                    match: /(\i\.\i\.useName\(\i\)\?\?"")/,
                    replace: "$self.getName($1)"
                },
                {
                    match: /(userName:\i,displayNameStyles:)(\i)(,effectDisplayType:)/,
                    replace: "$1$self.getDisplayNameStyles($2)$3"
                }
            ]
        },
        {
            find: "#{intl::USER_PROFILE_ACCOUNT_POPOUT_BUTTON_A11Y_LABEL}",
            replacement: [
                {
                    match: /(size:\i\.\i\.SIZE_32,src:\i\.getAvatarURL\()void 0,(\d+),!1/,
                    replace: "$1$self.getGuildId(),$2,!0"
                },
                {
                    match: /(\{avatarDecoration:\i,size:\(0,\i\.\i\)\(\i\.\i\.SIZE_32\))\}/,
                    replace: "$1,canAnimate:!0}"
                }
            ]
        },
        {
            find: ".MINI_PREVIEW,[",
            replacement: {
                match: /(\i\.current\.pause\(\)\)\},\[\i,\i)\]/,
                replace: "$1,arguments[0].animatedAsset]"
            }
        }
    ],

    getGuildId() {
        return SelectedGuildStore.getGuildId() ?? undefined;
    },

    getAvatarDecoration(user: any) {
        return getMember()?.avatarDecoration ?? user?.avatarDecoration;
    },

    getDisplayNameStyles(displayNameStyles: any) {
        return getMember()?.displayNameStyles ?? displayNameStyles;
    },

    getName(name: string) {
        return getMember()?.nick ?? name;
    }
});
