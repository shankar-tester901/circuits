const fs = require('fs');
const resizeImg = require('resize-img');
const catalyst = require('zcatalyst-sdk-node');
const IMAGEFOLDERID = 3296000000550192;
const RESIZEFOLDERID = 3296000000588147;

async function resizeThis(fileName) {
    const temp = fileName.indexOf('.');
    const renamedFile = fileName.substr(0, temp) + '-100x100.jpg';
    const image = await resizeImg(await fs.promises.readFile(fileName), {
        width: 100,
        height: 100
    });
    await fs.promises.writeFile(renamedFile, image);
    return renamedFile;
}

module.exports = async (context, _basicIO) => {
    try {
        const catalystApp = catalyst.initialize(context);
        const filestore = catalystApp.filestore();
        const folder = filestore.folder(IMAGEFOLDERID);
        const resizedFolder = filestore.folder(RESIZEFOLDERID);
        const queryResult = await catalystApp.zcql().executeZCQLQuery('select * from ImagefileDetails where is_nsfw = false limit 1,200');

        while (queryResult.length) {
            await Promise.all(queryResult.splice(0, 10).map(async (data) => {
                const fileName = data.ImagefileDetails.imagefileName;
                const fileObject = await folder.downloadFile(data.ImagefileDetails.imagefileID);
                await fs.promises.writeFile(fileName, fileObject);
                const resizedFile = await resizeThis(fileName);
                return resizedFile ? resizedFolder.uploadFile({
                    code: fs.createReadStream(__dirname + '/' + resizedFile),
                    name: resizedFile
                }) : undefined;
            }));
        }
    } catch (err) {
        console.log("Error in Image Resizer", err);
    }
    context.close();
};
