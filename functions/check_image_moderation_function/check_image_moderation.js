const fs = require('fs');
const catalyst = require('zcatalyst-sdk-node');
const FOLDERID = 3296000000550192;

module.exports = async (context, _basicIO) => {
    try {
        const catalystApp = catalyst.initialize(context);
        const table = await catalystApp.datastore().table('ImagefileDetails');
        const allRows = await catalystApp.zcql().executeZCQLQuery('select * from ImagefileDetails limit 1,200');
        const folder = catalystApp.filestore().folder(FOLDERID);
        const zia = catalystApp.zia();

        while (allRows.length) {
            await Promise.all(allRows.splice(0, 10).map(async (row) => {
                const fileName = row.ImagefileDetails.imagefileName;
                const fileObject = await folder.downloadFile(row.ImagefileDetails.imagefileID);
                await fs.promises.writeFile(fileName, fileObject);
                const imagePrediction = await zia.moderateImage(fs.createReadStream(fileName), { "mode": "advanced" });
                if (imagePrediction.prediction != 'unsafe_to_use') {
                    return;
                }
                return table.updateRow({
                    imagefileID: row.ImagefileDetails.imagefileID,
                    is_nsfw: false,
                    ROWID: row.ImagefileDetails.ROWID
                });
            }));
        }
    } catch (err) {
        console.log("Error in Image Moderation", err);
    }
    context.close();
};
