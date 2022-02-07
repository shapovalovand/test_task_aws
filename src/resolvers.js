import fsAvatarUploader from './uploaders.js';

const Mutation = {
    uploadAvatar: async (_, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;

        const uri = await fsAvatarUploader.upload(createReadStream(), {
            filename,
            mimetype,
        });

        return {
            filename,
            mimetype,
            encoding,
            uri,
        };
    },
};

export default Mutation;