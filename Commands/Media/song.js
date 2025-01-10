module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");
        
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) return m.reply("No songs found!");

        const urlYt = videos[0].url;
        let data = await fetchJson(`https://api.dreaded.site/api/ytdl2/audio?url=${urlYt}`);

        if (!data || !data.result || !data.result.downloadUrl) {
            return m.reply("Failed to fetch audio from the API.");
        }

        const { title: name, downloadUrl: audio } = data.result;
        await m.reply(`_Downloading ${name}_`);
        await client.sendMessage(
            m.chat,
            {
                audio: { url: audio },
                mimetype: "audio/mpeg",
                fileName: `${name}.mp3`,
            },
            { quoted: m }
        );
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};